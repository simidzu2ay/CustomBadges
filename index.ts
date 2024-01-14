/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addBadge, BadgePosition, ProfileBadge } from "@api/Badges";
import definePlugin from "@utils/types";

const fetchBadges = async (): Promise<Record<string, { name: string, image: string; }[]>> => {

    // const result = await fetch("https://textbin.net/raw/q9hpnnh0gg");
    // return await result.json();
    return {
        "279266228151779329": [{
            name: "Husk",
            image: "https://cdn.discordapp.com/emojis/1192196285697097821.webp"
        }]
    };
};

const applyBadges = (badges: Awaited<ReturnType<typeof fetchBadges>>) => {
    for (const [userId, bdgs] of Object.entries(badges)) {
        for (const badge of bdgs) {
            const badgeInfo: ProfileBadge =
            {
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

export default definePlugin({
    name: "CustomBadges",
    description: "Allow to see custom badges",
    dependencies: ["BadgeAPI"],
    authors: [
        {
            id: 279266228151779329n,
            name: "simidzu2ay"
        }
    ],
    async start() {
        fetchBadges().then(badges => {
            return applyBadges(badges);
        });

    }
});
