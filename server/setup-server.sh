#!/bin/bash
# ============================================================================
# UZ CS2 Boost — Kamatera VPS Bootstrap Script
# Server: 4 vCPU, 8GB RAM, 150GB SSD (Ubuntu 22.04/24.04)
#
# Usage: chmod +x setup-server.sh && sudo ./setup-server.sh
# ============================================================================

set -euo pipefail

# ── Colors for output ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info() { echo -e "${CYAN}[i]${NC} $1"; }

# ── Pre-flight checks ─────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  err "This script must be run as root (use sudo)."
fi

info "Starting UZ CS2 Boost server bootstrap..."

# ── Step 1: System update & base packages ──────────────────────────────────
log "Updating system packages..."
apt-get update -y && apt-get upgrade -y

log "Installing base dependencies..."
apt-get install -y \
  curl \
  wget \
  unzip \
  tar \
  lib32gcc-s1 \
  lib32stdc++6 \
  ca-certificates \
  software-properties-common \
  nginx \
  ufw \
  htop \
  tmux

# ── Step 2: Create dedicated steam user ────────────────────────────────────
if id "steam" &>/dev/null; then
  warn "User 'steam' already exists, skipping creation."
else
  log "Creating 'steam' user..."
  useradd -m -s /bin/bash steam
  log "User 'steam' created with home at /home/steam"
fi

# ── Step 3: Install SteamCMD ───────────────────────────────────────────────
STEAMCMD_DIR="/home/steam/steamcmd"
if [[ -f "$STEAMCMD_DIR/steamcmd.sh" ]]; then
  warn "SteamCMD already installed at $STEAMCMD_DIR, skipping."
else
  log "Installing SteamCMD..."
  mkdir -p "$STEAMCMD_DIR"
  cd "$STEAMCMD_DIR"
  wget -q "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz"
  tar -xzf steamcmd_linux.tar.gz
  rm steamcmd_linux.tar.gz
  chown -R steam:steam "$STEAMCMD_DIR"
  log "SteamCMD installed."
fi

# ── Step 4: Download CS2 Dedicated Server ──────────────────────────────────
CS2_DIR="/home/steam/cs2-ds"
log "Downloading/updating CS2 Dedicated Server (this may take 15-30 minutes)..."
sudo -u steam "$STEAMCMD_DIR/steamcmd.sh" \
  +force_install_dir "$CS2_DIR" \
  +login anonymous \
  +app_update 730 validate \
  +quit
log "CS2 Dedicated Server installed at $CS2_DIR"

# ── Step 5: Install MetaMod:Source ─────────────────────────────────────────
METAMOD_URL="https://mms.alliedmods.net/mmsdrop/2.0/mmsource-2.0.0-git1313-linux.tar.gz"
CSGO_DIR="$CS2_DIR/game/csgo"

log "Installing MetaMod:Source..."
cd /tmp
wget -q "$METAMOD_URL" -O metamod.tar.gz
tar -xzf metamod.tar.gz -C "$CSGO_DIR"
rm metamod.tar.gz

# Create the gameinfo.gi patch for MetaMod
# MetaMod requires an entry in gameinfo.gi to load
GAMEINFO_FILE="$CSGO_DIR/gameinfo.gi"
if grep -q "metamod" "$GAMEINFO_FILE" 2>/dev/null; then
  warn "MetaMod entry already in gameinfo.gi, skipping."
else
  log "Patching gameinfo.gi for MetaMod..."
  sed -i '/Game_LowViolence/a\\t\t\tGame\tcsgo/addons/metamod' "$GAMEINFO_FILE"
fi

chown -R steam:steam "$CSGO_DIR/addons"
log "MetaMod:Source installed."

# ── Step 6: Install CounterStrikeSharp ─────────────────────────────────────
CSS_VERSION="v296"
CSS_URL="https://github.com/roflmuffin/CounterStrikeSharp/releases/download/${CSS_VERSION}/counterstrikesharp-with-runtime-build-${CSS_VERSION}-linux.zip"

log "Installing CounterStrikeSharp ${CSS_VERSION}..."
cd /tmp
wget -q "$CSS_URL" -O css.zip
unzip -o css.zip -d "$CSGO_DIR"
rm css.zip

chown -R steam:steam "$CSGO_DIR/addons/counterstrikesharp"
log "CounterStrikeSharp installed."

# ── Step 7: Create server config files ─────────────────────────────────────
CFG_DIR="$CSGO_DIR/cfg"
mkdir -p "$CFG_DIR"

log "Creating server.cfg..."
cat > "$CFG_DIR/server.cfg" << 'EOF'
// UZ CS2 Boost — Default Server Config
hostname "UZ CS2 Boost | Training"
sv_cheats 0
sv_lan 0
sv_pure 0
sv_allowupload 0
sv_allowdownload 1

// Network optimization for Uzbekistan
sv_maxrate 0
sv_minrate 128000
sv_maxcmdrate 128
sv_mincmdrate 64

// FastDL via Cloudflare CDN
// Update this URL to your actual CDN domain
sv_downloadurl "https://cdn.uzcs2boost.com/fastdl/"
sv_allowdownload 1

// Anti-cheat
sv_hibernate_when_empty 1

// Logging
log on
sv_logbans 1
sv_logecho 1
sv_logfile 1

// RCON (set a strong password here)
rcon_password "CHANGE_THIS_TO_A_STRONG_PASSWORD"
EOF

log "Creating training.cfg..."
cat > "$CFG_DIR/training.cfg" << 'EOF'
// Training Room Config
sv_cheats 1
mp_limitteams 0
mp_autoteambalance 0
mp_roundtime 60
mp_roundtime_defuse 60
mp_freezetime 0
mp_warmup_pausetimer 1
mp_buy_anywhere 1
mp_buytime 9999
mp_maxmoney 65535
mp_startmoney 65535
mp_respawn_on_death_ct 1
mp_respawn_on_death_t 1
bot_kick
sv_infinite_ammo 2
ammo_grenade_limit_total 5
sv_showimpacts 1
sv_grenade_trajectory_prac_picanticotrail 1
EOF

log "Creating aim_training.cfg..."
cat > "$CFG_DIR/aim_training.cfg" << 'EOF'
// Aim Training Config
sv_cheats 1
mp_limitteams 0
mp_autoteambalance 0
mp_roundtime 60
mp_freezetime 0
mp_warmup_pausetimer 1
mp_maxmoney 65535
mp_startmoney 65535
mp_buy_anywhere 1
mp_buytime 9999
mp_respawn_on_death_ct 1
mp_respawn_on_death_t 1
sv_infinite_ammo 2
bot_difficulty 3
EOF

log "Creating retake.cfg..."
cat > "$CFG_DIR/retake.cfg" << 'EOF'
// Retake Config
sv_cheats 0
mp_limitteams 0
mp_autoteambalance 0
mp_roundtime 0.75
mp_freezetime 3
mp_buytime 5
mp_maxmoney 16000
mp_startmoney 4000
mp_buy_anywhere 1
mp_death_drop_gun 0
mp_ct_default_primary ""
mp_t_default_primary ""
EOF

chown -R steam:steam "$CFG_DIR"
log "Server configs created."

# ── Step 8: Create systemd service ─────────────────────────────────────────
log "Creating systemd service unit..."
cat > /etc/systemd/system/cs2-server.service << EOF
[Unit]
Description=CS2 Dedicated Server (UZ CS2 Boost)
After=network.target

[Service]
Type=simple
User=steam
Group=steam
WorkingDirectory=$CS2_DIR
ExecStart=$CS2_DIR/game/bin/linuxsteamrt64/cs2 \\
    -dedicated \\
    -port 27015 \\
    -console \\
    -usercon \\
    +game_type 0 \\
    +game_mode 0 \\
    +mapgroup mg_active \\
    +map de_mirage \\
    +exec server.cfg
Restart=on-failure
RestartSec=15
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cs2-server.service
log "systemd service created and enabled (cs2-server.service)."

# ── Step 9: Firewall rules ─────────────────────────────────────────────────
log "Configuring UFW firewall..."
ufw allow ssh
ufw allow 80/tcp        # Nginx HTTP
ufw allow 443/tcp       # Nginx HTTPS (for Cloudflare)
ufw allow 27015/tcp     # CS2 Server (RCON)
ufw allow 27015/udp     # CS2 Server (Game traffic)
ufw allow 27020:27030/tcp  # Additional server instances
ufw allow 27020:27030/udp  # Additional server instances
ufw allow 3001/tcp      # Server daemon (internal only — restrict later)
ufw --force enable
log "Firewall configured."

# ── Step 10: Create FastDL directory ───────────────────────────────────────
FASTDL_DIR="$CSGO_DIR"
log "FastDL will be served from: $FASTDL_DIR"
log "Ensure Nginx config points to this directory."

# ── Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  UZ CS2 Boost server bootstrap complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
info "CS2 Server:    $CS2_DIR"
info "SteamCMD:      $STEAMCMD_DIR"
info "Server Configs: $CFG_DIR"
info "MetaMod:       $CSGO_DIR/addons/metamod"
info "CSS Plugins:   $CSGO_DIR/addons/counterstrikesharp/plugins/"
echo ""
info "To start the server:  sudo systemctl start cs2-server"
info "To check status:      sudo systemctl status cs2-server"
info "To view logs:         journalctl -u cs2-server -f"
echo ""
warn "IMPORTANT: Edit $CFG_DIR/server.cfg and change rcon_password!"
warn "IMPORTANT: Configure Nginx for FastDL (see nginx-fastdl.conf)"
