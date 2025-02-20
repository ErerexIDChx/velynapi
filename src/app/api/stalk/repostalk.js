import axios from "axios";
import { CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { username, repo } = req.query;

    if (!username || !repo) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'username' dan 'repo' diperlukan",
        });
    }

    try {
        const repoData = await repostalk(username, repo);
        return res.status(200).json({
            status: true,
            creator: CREATOR,
            data: repoData,
        });
    } catch (error) {
        console.error("Error fetching GitHub repository data:", error);
        return res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function repostalk(username, repo) {
    try {
        const { data } = await axios.get(`https://api.github.com/repos/${username}/${repo}`, {
            timeout: 10000
        });

        return {
            repo_name: data.name,
            full_name: data.full_name,
            description: data.description,
            repo_id: data.id,
            node_id: data.node_id,
            owner: {
                username: data.owner.login,
                profile_url: data.owner.html_url,
                avatar_url: data.owner.avatar_url,
                type: data.owner.type
            },
            private: data.private,
            html_url: data.html_url,
            homepage: data.homepage,
            language: data.language,
            topics: data.topics,
            visibility: data.visibility,
            fork: data.fork,
            forks_count: data.forks_count,
            stargazers_count: data.stargazers_count,
            watchers_count: data.watchers_count,
            open_issues_count: data.open_issues_count,
            license: data.license ? {
                key: data.license.key,
                name: data.license.name,
                url: data.license.url
            } : null,
            created_at: data.created_at,
            updated_at: data.updated_at,
            pushed_at: data.pushed_at,
            default_branch: data.default_branch,
            size: data.size,
            archived: data.archived,
            disabled: data.disabled,
            allow_forking: data.allow_forking,
            is_template: data.is_template,
            has_issues: data.has_issues,
            has_projects: data.has_projects,
            has_downloads: data.has_downloads,
            has_wiki: data.has_wiki,
            has_pages: data.has_pages,
            has_discussions: data.has_discussions
        };
    } catch (error) {
        throw new Error("Repositori tidak ditemukan atau terjadi kesalahan.");
    }
}
