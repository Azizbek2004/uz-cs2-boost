using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Core.Attributes.Registration;
using CounterStrikeSharp.API.Modules.Entities;

namespace UZLoadoutPlugin;

/// <summary>
/// UZ CS2 Boost — Loadout Plugin for CounterStrikeSharp.
/// Fetches a player's saved skin loadout from the Convex HTTP API
/// and applies paint index, seed, and wear values to their weapons.
/// </summary>
public class UZLoadoutPlugin : BasePlugin
{
    public override string ModuleName => "UZLoadoutPlugin";
    public override string ModuleAuthor => "UZ CS2 Boost";
    public override string ModuleVersion => "1.0.0";

    private readonly HttpClient _httpClient = new();
    private readonly Dictionary<int, List<LoadoutEntry>> _playerLoadouts = new();
    private PluginConfig _config = new();

    /// <summary>
    /// Called when the plugin is loaded. Reads the configuration file.
    /// </summary>
    public override void Load(bool hotReload)
    {
        Console.WriteLine("[UZLoadout] Plugin loaded.");

        // Load config from plugin directory
        var configPath = Path.Combine(ModuleDirectory, "config.json");
        if (File.Exists(configPath))
        {
            var json = File.ReadAllText(configPath);
            _config = JsonSerializer.Deserialize<PluginConfig>(json) ?? new PluginConfig();
            Console.WriteLine($"[UZLoadout] Config loaded. Endpoint: {_config.ConvexEndpointUrl}");
        }
        else
        {
            Console.WriteLine("[UZLoadout] WARNING: config.json not found, using defaults.");
        }

        _httpClient.Timeout = TimeSpan.FromMilliseconds(_config.RequestTimeoutMs);

        // Register event listeners
        RegisterEventHandler<EventPlayerConnectFull>(OnPlayerConnectFull);
        RegisterEventHandler<EventPlayerDisconnect>(OnPlayerDisconnect);
        RegisterEventHandler<EventItemEquip>(OnItemEquip);

        Console.WriteLine("[UZLoadout] Event handlers registered.");
    }

    /// <summary>
    /// Called when a player has fully connected and been authorized by Steam.
    /// Fetches their loadout from the Convex API.
    /// </summary>
    private HookResult OnPlayerConnectFull(EventPlayerConnectFull @event, GameEventInfo info)
    {
        var player = @event.Userid;
        if (player == null || !player.IsValid || player.IsBot)
            return HookResult.Continue;

        var steamId = player.SteamID.ToString();
        var playerSlot = player.Slot;

        Console.WriteLine($"[UZLoadout] Player connected: {player.PlayerName} (SteamID: {steamId})");

        // Fetch loadout asynchronously
        Task.Run(async () =>
        {
            try
            {
                var loadout = await FetchLoadoutAsync(steamId);
                if (loadout != null && loadout.Count > 0)
                {
                    _playerLoadouts[playerSlot] = loadout;
                    Console.WriteLine($"[UZLoadout] Loaded {loadout.Count} skins for {player.PlayerName}");
                }
                else
                {
                    Console.WriteLine($"[UZLoadout] No custom loadout for {player.PlayerName}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UZLoadout] ERROR fetching loadout for {player.PlayerName}: {ex.Message}");
            }
        });

        return HookResult.Continue;
    }

    /// <summary>
    /// Called when a player disconnects. Cleans up their loadout data.
    /// </summary>
    private HookResult OnPlayerDisconnect(EventPlayerDisconnect @event, GameEventInfo info)
    {
        var player = @event.Userid;
        if (player == null) return HookResult.Continue;

        var playerSlot = player.Slot;
        if (_playerLoadouts.Remove(playerSlot))
        {
            Console.WriteLine($"[UZLoadout] Cleaned up loadout for slot {playerSlot}");
        }

        return HookResult.Continue;
    }

    /// <summary>
    /// Called when a player equips an item (weapon pickup/switch).
    /// Applies the custom skin if the player has one saved for this weapon.
    /// </summary>
    private HookResult OnItemEquip(EventItemEquip @event, GameEventInfo info)
    {
        var player = @event.Userid;
        if (player == null || !player.IsValid || player.IsBot)
            return HookResult.Continue;

        var playerSlot = player.Slot;
        if (!_playerLoadouts.TryGetValue(playerSlot, out var loadout))
            return HookResult.Continue;

        var weaponName = @event.Item;
        if (string.IsNullOrEmpty(weaponName))
            return HookResult.Continue;

        // Normalize weapon name: "ak47" -> "weapon_ak47"
        var weaponId = weaponName.StartsWith("weapon_") ? weaponName : $"weapon_{weaponName}";

        var entry = loadout.Find(e => e.WeaponId == weaponId);
        if (entry == null)
            return HookResult.Continue;

        // Apply the skin to the active weapon
        try
        {
            var activeWeapon = player.PlayerPawn?.Value?.WeaponServices?.ActiveWeapon?.Value;
            if (activeWeapon != null)
            {
                // Set paint kit, seed, and wear
                activeWeapon.FallbackPaintKit = entry.PaintIndex;
                activeWeapon.FallbackSeed = entry.Seed;
                activeWeapon.FallbackWear = entry.Wear;
                activeWeapon.FallbackStatTrak = entry.StatTrak ? 1 : -1;

                // Force the item ID high to enable fallback values
                activeWeapon.ItemIDHigh = -1;

                // Notify the client of the change
                Utilities.SetStateChanged(activeWeapon, "CBaseEntity", "m_nSubclassID");

                Console.WriteLine($"[UZLoadout] Applied {weaponId} skin (paint={entry.PaintIndex}, seed={entry.Seed}, wear={entry.Wear:F4}) to {player.PlayerName}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[UZLoadout] ERROR applying skin: {ex.Message}");
        }

        return HookResult.Continue;
    }

    /// <summary>
    /// Fetches the player's loadout from the Convex HTTP API.
    /// </summary>
    /// <param name="steamId64">The player's 64-bit Steam ID.</param>
    /// <returns>A list of loadout entries, or null on failure.</returns>
    private async Task<List<LoadoutEntry>?> FetchLoadoutAsync(string steamId64)
    {
        var url = $"{_config.ConvexEndpointUrl}?steamId={steamId64}";
        Console.WriteLine($"[UZLoadout] Fetching loadout from: {url}");

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<LoadoutResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        });

        return result?.Loadout;
    }

    /// <summary>
    /// Called when the plugin is unloaded. Cleans up resources.
    /// </summary>
    public override void Unload(bool hotReload)
    {
        _playerLoadouts.Clear();
        _httpClient.Dispose();
        Console.WriteLine("[UZLoadout] Plugin unloaded.");
    }
}

// ── Data models ───────────────────────────────────────────────────────────

/// <summary>
/// Represents the JSON response from the Convex loadout API.
/// </summary>
public class LoadoutResponse
{
    public List<LoadoutEntry>? Loadout { get; set; }
}

/// <summary>
/// Represents a single skin entry in a player's loadout.
/// </summary>
public class LoadoutEntry
{
    public string WeaponId { get; set; } = "";
    public int PaintIndex { get; set; }
    public int Seed { get; set; }
    public float Wear { get; set; }
    public bool StatTrak { get; set; }
    public string? NameTag { get; set; }
}

/// <summary>
/// Plugin configuration loaded from config.json.
/// </summary>
public class PluginConfig
{
    public string ConvexEndpointUrl { get; set; } = "https://giddy-egret-408.eu-west-1.convex.site/api/loadout";
    public int RequestTimeoutMs { get; set; } = 3000;
}
