/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { PluginNative } from "@utils/types";
import definePlugin from "@utils/types";

const Native = VencordNative.pluginHelpers.SecureTokenStorage as PluginNative<typeof import("./native")>;

export default definePlugin({
    name: "SecureTokenStorage",
    enabledByDefault: true,
    description: "Secure token storage using Electron safeStorage",
    authors: [{ name: "Nightcord", id: 0n }],
    required: true,
    
    start() {

        (window as any).SecureTokenStorage = {
            store: async (token: string) => {
                const result = await Native.storeSecureToken(token);
                return result.success;
            },
            get: async () => {
                const result = await Native.getSecureToken();
                return result.success ? result.token : null;
            },
            delete: async () => {
                const result = await Native.deleteSecureToken();
                return result.success;
            },
            has: async () => {
                return await Native.hasSecureToken();
            }
        };
    },

    stop() {
        delete (window as any).SecureTokenStorage;
    }
});
