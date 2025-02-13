//BabyBotz MultiDevice
import { API_KEY, CREATOR } from "../../../settings";
import cloudscraper from "cloudscraper";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { query } = req.query;
    
    try {
        const data = await robloxStalk(query);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function fetchData(url, method = "GET", payload = null) {
    try {
        const response = method === "POST"
            ? await cloudscraper.post(url, { json: payload })
            : await cloudscraper.get(url);
        return JSON.parse(response);
    } catch (error) {
        return error.message;
    }
}

async function robloxStalk(userId) {
    const results = {
        userInfo: await fetchData(`https://users.roblox.com/v1/users/${userId}`),
        userGroups: await fetchData(`https://groups.roblox.com/v1/users/${userId}/groups/roles`),
        userBadges: await fetchData(`https://badges.roblox.com/v1/users/${userId}/badges`),
        userGames: await fetchData(`https://games.roblox.com/v2/users/${userId}/games`),
        userAvatar: await fetchData(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=720x720&format=Png&isCircular=false`),
        usernameHistory: await fetchData(`https://users.roblox.com/v1/users/${userId}/username-history`),
        userFriends: await fetchData(`https://friends.roblox.com/v1/users/${userId}/friends`),
        userFriendCount: await fetchData(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
        userFollowers: await fetchData(`https://friends.roblox.com/v1/users/${userId}/followers`),
        userFollowing: await fetchData(`https://friends.roblox.com/v1/users/${userId}/followings`),
        userCreatedAssets: await fetchData(`https://catalog.roblox.com/v1/search/items?CreatorId=${userId}&CreatorType=User`)
    };

    return results;
}

function formatJson(data) {
    return JSON.stringify(data, null, 2);
}