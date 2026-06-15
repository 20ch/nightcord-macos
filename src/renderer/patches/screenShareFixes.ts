/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@equicord/types/utils";
import { currentSettings } from "renderer/components/ScreenSharePicker";
import { State } from "renderer/settings";
import { isLinux, isMac } from "renderer/utils";

const logger = new Logger("EquibopStreamFixes");

const virtualMacAudioNames = ["blackhole", "loopback", "soundflower", "vb-cable", "vb audio", "vbcable", "screen audio", "system audio"];

async function getMacAudioDeviceId(preferredDeviceId?: string) {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === "audioinput");
        const preferredDevice = audioInputs.find(device => device.deviceId === preferredDeviceId);
        if (preferredDevice) return preferredDevice.deviceId;

        return audioInputs.find(device => {
            const label = device.label.toLowerCase();
            return virtualMacAudioNames.some(name => label.includes(name));
        })?.deviceId ?? null;
    } catch (error) {
        logger.error("Failed to enumerate macOS audio devices.", error);
        return null;
    }
}

async function addAudioTrack(stream: MediaStream, deviceId: string) {
    const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: {
                exact: deviceId
            },
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
            channelCount: 2,
            sampleRate: 48000,
            sampleSize: 16
        }
    });

    stream.getAudioTracks().forEach(track => {
        stream.removeTrack(track);
        track.stop();
    });
    stream.addTrack(audio.getAudioTracks()[0]);
}

if (isLinux || isMac) {
    const original = navigator.mediaDevices.getDisplayMedia;

    async function getVirtmic() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevice = devices.find(({ label }) => label === "vencord-screen-share");
            return audioDevice?.deviceId;
        } catch (error) {
            return null;
        }
    }

    navigator.mediaDevices.getDisplayMedia = async function (opts) {
        const stream = await original.call(this, opts);

        if (isMac && currentSettings?.audio) {
            const id = await getMacAudioDeviceId(currentSettings.macAudioDeviceId);
            if (id) {
                await addAudioTrack(stream, id).catch(e => logger.error("Failed to add macOS audio track.", e));
            }
        }

        if (isLinux) {
            const id = await getVirtmic();
            const frameRate = Number(State.store.screenshareQuality?.frameRate ?? 30);
            const height = Number(State.store.screenshareQuality?.resolution ?? 720);
            const width = Math.round(height * (16 / 9));
            const track = stream.getVideoTracks()[0];

            track.contentHint = String(currentSettings?.contentHint);

            const constraints = {
                ...track.getConstraints(),
                frameRate: { min: frameRate, ideal: frameRate },
                width: { min: 640, ideal: width, max: width },
                height: { min: 480, ideal: height, max: height },
                advanced: [{ width: width, height: height }],
                resizeMode: "none"
            };

            track
                .applyConstraints(constraints)
                .then(() => {
                    logger.info("Applied constraints successfully. New constraints: ", track.getConstraints());
                })
                .catch(e => logger.error("Failed to apply constraints.", e));

            if (id) {
                await addAudioTrack(stream, id);
            }
        }

        return stream;
    };
}
