import axios from "axios";
import {  CREATOR } from "../../../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { username } = req.query;

    if (!username) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'username' diperlukan",
        });
    }

    try {
        const userData = await githubstalk(username);
        return res.status(200).json({
            status: true,
            creator: CREATOR,
            data: userData,
        });
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        return res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function githubstalk(user) {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${user}`, {
            timeout: 10000
        });

        return {
            username: data.login,
            nickname: data.name,
            bio: data.bio,
            id: data.id,
            nodeId: data.node_id,
            profile_pic: data.avatar_url,
            url: data.html_url,
            type: data.type,
            admin: data.site_admin,
            company: data.company,
            blog: data.blog,
            location: data.location,
            email: data.email,
            public_repo: data.public_repos,
            public_gists: data.public_gists,
            followers: data.followers,
            following: data.following,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    } catch (error) {
        throw new Error("User GitHub tidak ditemukan atau terjadi kesalahan.");
    }
}
