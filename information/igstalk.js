import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";
import cheerio from "cherioo";

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
        const data = await igstalk(query);
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

async function igstalk(user) {
  try {
    const response = await axios.post(
      "https://privatephotoviewer.com/wp-json/instagram-viewer/v1/fetch-profile",
      {
        find: user,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const $ = cheerio.load(response.data.html);

    let profilePicture = $("#profile-insta img").attr("src");
    const nickname = $(".col-md-8 h4").text().trim();
    const username = $(".col-md-8 h5").text().trim();
    const posts = $(".col-md-8 .text-center").eq(0).find("strong").text().trim();
    const followers = $(".col-md-8 .text-center").eq(1).find("strong").text().trim();
    const following = $(".col-md-8 .text-center").eq(2).find("strong").text().trim();
    const bio = $(".col-md-8 p").html().replace(/<br\s*\/?>/g, "\n").trim();

    return {
      status: true,
      creator: "JER OFC",
      data: {
        nickname,
        username,
        bio,
        posts,
        followers,
        following,
        profile: "https://www.instagram.com/" + username.replace("@", ""),
        profileUrl: profilePicture,
      },
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}