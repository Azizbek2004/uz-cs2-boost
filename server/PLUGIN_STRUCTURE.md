# CounterStrikeSharp Plugin Directory Structure

The CS2 Dedicated Server uses MetaMod:Source to load CounterStrikeSharp, which in turn discovers and loads C# plugins from a specific directory tree.

## Full Path on Kamatera (194.37.80.182)

```
/home/steam/cs2-ds/
└── game/
    └── csgo/
        └── addons/
            ├── metamod/                     ← MetaMod:Source runtime
            │   ├── bin/
            │   └── metaplugins.ini
            │
            └── counterstrikesharp/          ← CounterStrikeSharp runtime
                ├── api/                     ← CSS API assemblies
                ├── bin/                     ← CSS core binaries
                ├── dotnet/                  ← .NET runtime
                ├── configs/                 ← Global CSS configs
                │   └── core.json           ← Core CSS settings
                │
                └── plugins/                 ← YOUR PLUGINS GO HERE
                    │
                    └── UZLoadoutPlugin/     ← Our custom plugin folder
                        ├── UZLoadoutPlugin.dll      ← Compiled C# plugin
                        ├── UZLoadoutPlugin.pdb      ← Debug symbols (optional)
                        └── config.json              ← Plugin-specific config
```

## Plugin Config (`config.json`)

```json
{
  "ConvexEndpointUrl": "https://giddy-egret-408.eu-west-1.convex.site/api/loadout",
  "RequestTimeoutMs": 3000
}
```

## How to Deploy a New Plugin Version

```bash
# 1. Build the plugin on your dev machine (or CI)
dotnet build -c Release

# 2. SCP the DLL to the server
scp bin/Release/net8.0/UZLoadoutPlugin.dll \
  root@194.37.80.182:/home/steam/cs2-ds/game/csgo/addons/counterstrikesharp/plugins/UZLoadoutPlugin/

# 3. Restart the CS2 server to load the new plugin
ssh root@194.37.80.182 "systemctl restart cs2-server"

# 4. Verify it loaded (check server console or logs)
ssh root@194.37.80.182 "journalctl -u cs2-server --since '1 min ago' | grep -i loadout"
```

## How CounterStrikeSharp Discovers Plugins

1. On server start, MetaMod loads CSS
2. CSS scans `addons/counterstrikesharp/plugins/*/`  
3. Each subfolder must contain a `.dll` with the same name as the folder
4. CSS loads the DLL and calls `OnLoad()` on the plugin class
5. The plugin registers event listeners (e.g., `OnClientAuthorized`, `OnEntityCreated`)

## Important Notes

- Plugin folder name **must** match the DLL name (without `.dll`)
- Each plugin runs in its own isolated .NET context
- Plugins can read their own `config.json` via `Path.Combine(ModuleDirectory, "config.json")`
- Hot-reloading: use `css_plugins reload UZLoadoutPlugin` in RCON console (no server restart needed)
