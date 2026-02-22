/**
 * UZ CS2 Boost — Kamatera Server Daemon
 *
 * This Express.js daemon runs on the Kamatera VPS and manages
 * CS2 Dedicated Server instances via HTTP commands from the
 * Convex backend.
 *
 * Run:  node index.js
 * Port: 3001 (internal, not exposed publicly)
 *
 * Environment variables:
 *   DAEMON_SECRET — shared secret for Bearer auth
 *   CS2_DIR       — path to CS2 dedicated server (default: /home/steam/cs2-ds)
 */

const express = require("express");
const { spawn, exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.DAEMON_PORT || 3001;
const DAEMON_SECRET = process.env.DAEMON_SECRET || "CHANGE_THIS_SECRET";
const CS2_DIR = process.env.CS2_DIR || "/home/steam/cs2-ds";
const CS2_BINARY = path.join(CS2_DIR, "game/bin/linuxsteamrt64/cs2");

// Track running server instances by port
const activeInstances = new Map(); // port -> { process, userId, mapName, startedAt }

// ── Authentication middleware ─────────────────────────────────────────────
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "Missing Authorization header" });
    }

    const token = authHeader.substring(7);
    if (token !== DAEMON_SECRET) {
        return res.status(403).json({ success: false, error: "Invalid secret" });
    }

    next();
}

app.use(authenticate);

// ── POST /provision — Start a new CS2 server instance ─────────────────────
app.post("/provision", (req, res) => {
    const { userId, mapName, configName, port, rconPassword } = req.body;

    if (!mapName || !port) {
        return res.status(400).json({ success: false, error: "Missing mapName or port" });
    }

    // Check if port is already in use
    if (activeInstances.has(port)) {
        return res.status(409).json({ success: false, error: `Port ${port} is already in use` });
    }

    const args = [
        "-dedicated",
        "-port", String(port),
        "-console",
        "-usercon",
        "+game_type", "0",
        "+game_mode", "0",
        "+map", mapName || "de_mirage",
    ];

    if (configName) {
        args.push("+exec", configName);
    }

    if (rconPassword) {
        args.push("+rcon_password", rconPassword);
    }

    console.log(`[PROVISION] Starting CS2 server on port ${port} with map ${mapName}`);

    try {
        const proc = spawn(CS2_BINARY, args, {
            cwd: CS2_DIR,
            detached: true,
            stdio: ["ignore", "pipe", "pipe"],
            uid: 1000, // Run as 'steam' user (UID 1000)
        });

        proc.unref();

        // Track the instance
        activeInstances.set(port, {
            process: proc,
            pid: proc.pid,
            userId,
            mapName,
            configName,
            startedAt: Date.now(),
        });

        // Handle process exit
        proc.on("exit", (code, signal) => {
            console.log(`[EXIT] CS2 server on port ${port} exited (code=${code}, signal=${signal})`);
            activeInstances.delete(port);
        });

        proc.on("error", (err) => {
            console.error(`[ERROR] CS2 server on port ${port}:`, err.message);
            activeInstances.delete(port);
        });

        // Log stdout/stderr
        proc.stdout.on("data", (data) => {
            console.log(`[CS2:${port}] ${data.toString().trim()}`);
        });

        proc.stderr.on("data", (data) => {
            console.error(`[CS2:${port}:ERR] ${data.toString().trim()}`);
        });

        console.log(`[PROVISION] CS2 server started on port ${port} (PID: ${proc.pid})`);
        res.json({ success: true, port, pid: proc.pid });
    } catch (error) {
        console.error(`[PROVISION] Failed to start server on port ${port}:`, error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── POST /stop — Stop a running CS2 server instance ───────────────────────
app.post("/stop", (req, res) => {
    const { port } = req.body;

    if (!port) {
        return res.status(400).json({ success: false, error: "Missing port" });
    }

    const instance = activeInstances.get(port);
    if (!instance) {
        return res.status(404).json({ success: false, error: `No server running on port ${port}` });
    }

    console.log(`[STOP] Stopping CS2 server on port ${port} (PID: ${instance.pid})`);

    try {
        // Send SIGTERM for graceful shutdown
        process.kill(instance.pid, "SIGTERM");

        // Force kill after 10 seconds if still running
        setTimeout(() => {
            try {
                process.kill(instance.pid, 0); // Check if still alive
                console.log(`[STOP] Force-killing CS2 server on port ${port}`);
                process.kill(instance.pid, "SIGKILL");
            } catch {
                // Already dead, good
            }
        }, 10000);

        activeInstances.delete(port);
        res.json({ success: true, port });
    } catch (error) {
        activeInstances.delete(port);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ── GET /status — Get status of all running instances ─────────────────────
app.get("/status", (req, res) => {
    const instances = [];
    for (const [port, info] of activeInstances) {
        instances.push({
            port,
            pid: info.pid,
            userId: info.userId,
            mapName: info.mapName,
            configName: info.configName,
            startedAt: info.startedAt,
            uptime: Date.now() - info.startedAt,
        });
    }
    res.json({ success: true, instances, totalActive: instances.length });
});

// ── GET /health — Health check ────────────────────────────────────────────
app.get("/health", (req, res) => {
    // Skip auth for health checks
    res.json({ status: "ok", service: "uz-cs2-boost-daemon", activeServers: activeInstances.size });
});

// ── Start the daemon ──────────────────────────────────────────────────────
app.listen(PORT, "127.0.0.1", () => {
    console.log(`[DAEMON] UZ CS2 Boost Server Daemon running on http://127.0.0.1:${PORT}`);
    console.log(`[DAEMON] CS2 Directory: ${CS2_DIR}`);
    console.log(`[DAEMON] Ready to provision training rooms.`);
});
