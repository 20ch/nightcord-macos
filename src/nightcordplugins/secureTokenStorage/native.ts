/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { safeStorage } from "electron";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

const TOKEN_FILE = "nightcord-secure-token.dat";

function getTokenFilePath(): string {
    const { app } = require("electron");
    return join(app.getPath("userData"), TOKEN_FILE);
}

export async function storeSecureToken(_: any, token: string): Promise<{ success: boolean; error?: string; }> {
    try {
        if (!safeStorage.isEncryptionAvailable()) {
            return { success: false, error: "Encryption not available" };
        }

        const encrypted = safeStorage.encryptString(token);
        const filePath = getTokenFilePath();
        writeFileSync(filePath, encrypted);
        
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e?.message ?? String(e) };
    }
}

// le récup
export async function getSecureToken(_: any): Promise<{ success: boolean; token?: string; error?: string; }> {
    try {
        if (!safeStorage.isEncryptionAvailable()) {
            return { success: false, error: "Encryption not available" };
        }

        const filePath = getTokenFilePath();
        if (!existsSync(filePath)) {
            return { success: false, error: "No token stored" };
        }

        const encrypted = readFileSync(filePath);
        const decrypted = safeStorage.decryptString(encrypted);
        
        return { success: true, token: decrypted };
    } catch (e: any) {
        return { success: false, error: e?.message ?? String(e) };
    }
}

export async function deleteSecureToken(_: any): Promise<{ success: boolean; error?: string; }> {
    try {
        const filePath = getTokenFilePath();
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e?.message ?? String(e) };
    }
}

// verif
export async function hasSecureToken(_: any): Promise<boolean> {
    try {
        const filePath = getTokenFilePath();
        return existsSync(filePath);
    } catch {
        return false;
    }
}
