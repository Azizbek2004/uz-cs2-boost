# UZ CS2 Boost — End-to-End Integration Test Plan

## Prerequisites
- [ ] Web application deployed to Vercel
- [ ] Convex backend deployed with `skins`, `trainingRooms` tables
- [ ] Kamatera VPS bootstrapped with `setup-server.sh`
- [ ] CS2 Dedicated Server running with CounterStrikeSharp
- [ ] `UZLoadoutPlugin.dll` deployed to the plugin directory
- [ ] `config.json` configured with the correct Convex endpoint URL
- [ ] User has a linked Steam account (steamId set on their Convex user record)

---

## Test 1: Save a Loadout in the Web UI

1. Log in to the web application
2. Navigate to `/skins`
3. Browse the skin catalog and select a skin (e.g., AK-47 Fire Serpent)
4. Adjust the float value slider and pattern seed
5. Click **"Save to Loadout"**
6. **Expected:** Green checkmark appears, skin shows in the sidebar loadout summary
7. Repeat for 2-3 more weapons (e.g., AWP, M4A1-S, Deagle)

## Test 2: Verify the HTTP Endpoint

1. Open a browser or use `curl`:
   ```bash
   curl "https://giddy-egret-408.eu-west-1.convex.site/api/loadout?steamId=YOUR_STEAM_ID_64"
   ```
2. **Expected:** JSON response with your saved loadout:
   ```json
   {
     "loadout": [
       { "weaponId": "weapon_ak47", "paintIndex": 180, "seed": 42, "wear": 0.05 },
       { "weaponId": "weapon_awp", "paintIndex": 344, "seed": 100, "wear": 0.01 }
     ]
   }
   ```
3. Test with an invalid Steam ID:
   ```bash
   curl "https://giddy-egret-408.eu-west-1.convex.site/api/loadout?steamId=INVALID"
   ```
4. **Expected:** `{ "loadout": [] }`

## Test 3: Boot a Training Room

1. Navigate to `/training` on the web application
2. Click on a training map card — the **ServerProvisionModal** should open
3. Select a map (e.g., `de_mirage`) and config (e.g., `training.cfg`)
4. Click **"Deploy with Saved Skins"**
5. **Expected:** Modal transitions to "Server Booting..." state with pulsing animation
6. After a few seconds, the room should be created in the Convex `trainingRooms` table with status `"active"`

## Test 4: Connect to the Server

1. Open CS2
2. Open the console and type: `connect 194.37.80.182:27020`
   (use the port returned by the provisioning action)
3. **Expected:** You connect to the server and load into the selected map

## Test 5: Verify Skins Are Applied In-Game

1. After spawning, buy the weapons you saved skins for (AK-47, AWP, etc.)
2. **Expected:** The weapons display the custom paint kit, pattern seed, and wear value
3. Check the server console/logs for:
   ```
   [UZLoadout] Applied weapon_ak47 skin (paint=180, seed=42, wear=0.0500) to YourName
   ```

## Test 6: Update the Loadout

1. Without disconnecting from the server, go back to the web UI
2. Change the AK-47 skin to a different one (e.g., Vulcan instead of Fire Serpent)
3. Save the loadout

## Test 7: Reconnect and Verify New Skins

1. Disconnect from the CS2 server (`disconnect` in console)
2. Reconnect: `connect 194.37.80.182:27020`
3. Buy the AK-47 again
4. **Expected:** The new skin (Vulcan) is applied instead of the old one (Fire Serpent)

## Test 8: Edge Cases

- [ ] Connect without a linked Steam account → skins should default to vanilla
- [ ] Connect with an empty loadout → no errors, default skins
- [ ] Disconnect and verify memory cleanup in server logs (`[UZLoadout] Cleaned up loadout for slot X`)
- [ ] Test with slow/no internet on the game server → graceful timeout, no crash

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Plugin not loading | Check `journalctl -u cs2-server` for errors. Verify DLL is in the correct directory. |
| Skins not applying | Check that `ItemIDHigh` is being set to `-1`. Verify paint index values match CS2 item definitions. |
| HTTP 500 from Convex | Check `JWKS` and `JWT_PRIVATE_KEY` env vars are set. Run `npx convex deploy`. |
| Empty loadout returned | Verify the user's `steamId` field matches their actual Steam ID 64. |
