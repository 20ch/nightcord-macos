/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Heading } from "@components/Heading";
import { Slider, useMemo } from "@webpack/common";

interface Props {
    label: string;
    name: string;
    default: number;
    min?: number;
    max?: number;
    step?: number;
    themeSettings: Record<string, string>;
}

export function SettingRangeComponent({ label, name, default: def, min, max, step, themeSettings }: Props) {
    function handleChange(value: number) {
        const corrected = value.toString();

        themeSettings[name] = corrected;
    }

    const minValue = min ?? 0;
    const maxValue = max ?? 10;
    const stepValue = step ?? 1;
    const markers = useMemo(() => {
        const markers: number[] = [];

        // defaults taken from https://github.com/openstyles/stylus/wiki/Writing-UserCSS#default-value
        for (let i = minValue; i <= maxValue; i += stepValue) {
            markers.push(i);
        }

        return markers;
    }, [minValue, maxValue, stepValue]);

    return (
        <section>
            <Heading>{label}</Heading>
            <Slider
                initialValue={parseInt(themeSettings[name], 10)}
                defaultValue={def}
                onValueChange={handleChange}
                minValue={minValue}
                maxValue={maxValue}

                markers={markers}
                stickToMarkers={true}
            />
        </section>
    );
}
