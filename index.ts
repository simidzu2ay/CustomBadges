/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addBadge, BadgePosition, ProfileBadge } from "@api/Badges";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const fetchBadges = async (): Promise<Record<string, { name: string, image: string; }[]>> => {
    const result = await fetch("https://raw.githubusercontent.com/simidzu2ay/storage/main/custom-badges.json");
    return await result.json();
};

const applyBadges = (badges: Awaited<ReturnType<typeof fetchBadges>>) => {
    for (const [userId, bdgs] of Object.entries(badges)) {
        for (const badge of bdgs) {
            const badgeInfo: ProfileBadge = {
                image: badge.image,
                description: badge.name,
                position: BadgePosition.END,
                shouldShow(userInfo) {
                    return userInfo.user.id === userId;
                },
            };


            addBadge(badgeInfo);
        }
    }
};


const settings = definePluginSettings({
    update: {
        description: "Does the plugin need to update badges in the background",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: true
    },
    howOften: {
        description: "How often [In seconds]. 0 will be ignored",
        type: OptionType.NUMBER,
        default: 60 * 60,
        restartNeeded: true
    }
});

const update = async () => {
    const badges = await fetchBadges();
    applyBadges(badges);
};

export default definePlugin({
    name: "CustomBadges",
    description: "Allow to see custom badges",
    settings,
    authors: [
        {
            id: 279266228151779329n,
            name: "simidzu2ay"
        }
    ],
    async start() {
        await update();
        if (settings.store.update.valueOf() && settings.store.howOften.valueOf() > 0) {
            setTimeout(async () => {
                await update();
            }, settings.store.howOften.valueOf() * 1000);
        }
    }
});
