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

const virtualMacAudioNames = [
    "blackhole",
    "loopback",
    "soundflower",
    "vb-cable",
    "vb audio",
    "vbcable",
    "screen audio",
    "system audio",
    "background music",
    "existential audio"
];

function isVirtualMacAudioDevice(device: MediaDeviceInfo) {
    const label = device.label.toLowerCase();
    return virtualMacAudioNames.some(name => label.includes(name));
}

async function enumerateAudioInputsWithLabels() {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let audioInputs = devices.filter(device => device.kind === "audioinput");

    if (audioInputs.some(device => !device.label)) {
        const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(error => {
            logger.error("Failed to request microphone access for macOS screen share audio.", error);
            return null;
        });

        permissionStream?.getTracks().forEach(track => track.stop());

        devices = await navigator.mediaDevices.enumerateDevices();
        audioInputs = devices.filter(device => device.kind === "audioinput");
    }

    return audioInputs;
}

async function getMacAudioDeviceId(preferredDeviceId?: string) {
    try {
        const audioInputs = await enumerateAudioInputsWithLabels();
        const preferredDevice = audioInputs.find(device => device.deviceId === preferredDeviceId);
        if (preferredDevice) return preferredDevice.deviceId;

        return audioInputs.find(isVirtualMacAudioDevice)?.deviceId ?? null;
    } catch (error) {
        logger.error("Failed to enumerate macOS audio devices.", error);
        return null;
    }
}

async function addAudioTrack(stream: MediaStream, deviceId: string) {
    const constraints: MediaTrackConstraints = {
        deviceId: {
            exact: deviceId
        },
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
        channelCount: {
            ideal: 2
        },
        sampleRate: {
            ideal: 48000
        },
        sampleSize: {
            ideal: 16
        }
    };

    const audio = await navigator.mediaDevices.getUserMedia({ audio: constraints });
    const [audioTrack] = audio.getAudioTracks();

    if (!audioTrack) {
        audio.getTracks().forEach(track => track.stop());
        throw new Error("Selected macOS audio device did not return an audio track.");
    }

    stream.getAudioTracks().forEach(track => {
        stream.removeTrack(track);
        track.stop();
    });
    stream.addTrack(audioTrack);
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
            } else {
                logger.warn("No virtual macOS audio input found for screen share audio.");
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
