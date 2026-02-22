/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academy from "../academy.js";
import type * as auth from "../auth.js";
import type * as faceit from "../faceit.js";
import type * as http from "../http.js";
import type * as leaderboards from "../leaderboards.js";
import type * as loadout from "../loadout.js";
import type * as pingResults from "../pingResults.js";
import type * as scrims from "../scrims.js";
import type * as sprayScores from "../sprayScores.js";
import type * as stats from "../stats.js";
import type * as stripe from "../stripe.js";
import type * as tournaments from "../tournaments.js";
import type * as training from "../training.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academy: typeof academy;
  auth: typeof auth;
  faceit: typeof faceit;
  http: typeof http;
  leaderboards: typeof leaderboards;
  loadout: typeof loadout;
  pingResults: typeof pingResults;
  scrims: typeof scrims;
  sprayScores: typeof sprayScores;
  stats: typeof stats;
  stripe: typeof stripe;
  tournaments: typeof tournaments;
  training: typeof training;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
