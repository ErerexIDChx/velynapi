import axios from "axios";
import * as cheerio from "cheerio";
import {  CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Query parameter is required",
        });
    }

    try {
        const books = await searchBooks(query);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: books,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function searchBooks(query) {
    const url = `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const books = [];

        $(".tableList tr").each((index, element) => {
            const title = $(element).find("a.bookTitle span").text().trim();
            const link = $(element).find("a.bookTitle").attr("href");
            const rating = $(element).find("span.minirating").text().trim();

            books.push({
                title,
                link: `https://www.goodreads.com${link}`,
                rating,
            });
        });

        return books;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}
