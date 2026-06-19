/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export const ProfileCollections = {
    renderProfileCollections(props: any) {
        return null;
    }
};

export default definePlugin({
    name: "ProfileCollectionsAPI",
    description: "API to add collections to the user profile panel like discords game collection.",
    authors: [Devs.thororen],
    enabledByDefault: false,
    start() {
        console.log("[Nightcord ProfileCollectionsAPI] Started");
        (Vencord.Api as any).ProfileCollections = ProfileCollections;
    },
    // Patches disabled - regex patterns no longer match Discord's current code structure
    // TODO: Update patterns to match current Discord webpack modules
    /*
    patches: [
        {
            find: ".USER_PROFILE_ACTIVITY",
            replacement: {
                match: /user:(\i),widgets:\w+\),/,
                replace: "Vencord.Api?.ProfileCollections?.renderProfileCollections?.({...arguments[0], original: $&}) ?? $&",
            }
        },
        {
            find: '"UserProfileAccountPopout"',
            replacement: {
                match: /user:\i,widgets:\w+\),/,
                replace: "Vencord.Api?.ProfileCollections?.renderProfileCollections?.({...arguments[0], original: $&}) ?? $&",
            },
        },
        {
            find: ".SIDEBAR,disableToolbar:",
            replacement: {
                match: /user:(\i),widgets:\w+\),/,
                replace: "Vencord.Api?.ProfileCollections?.renderProfileCollections?.({...arguments[0], isSideBar:true, original: $&}) ?? $&"
            }
        }
    ]
    */
});
