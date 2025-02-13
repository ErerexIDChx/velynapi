import axios from "axios";
import cherioo from "cherioo";

// BabyBotz Handler
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
        const data = await youtubeStalk(query);
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

async function youtubeStalk(username) {
    try {
        const { data } = await axios.get(`https://youtube.com/@${username}?si=ECterZh_kG0zdihm`);
        const $ = cheerio.load(data);

        const ytInitialDataScript = $('script').filter((i, el) => {
            return $(el).html().includes('var ytInitialData =');
        }).html();

        const jsonData = ytInitialDataScript.match(/var ytInitialData = (.*?);/);
        if (jsonData && jsonData[1]) {
            const parsedData = JSON.parse(jsonData[1]);

            const videoDataList = [];
            const tabs = parsedData.contents.twoColumnBrowseResultsRenderer.tabs;
            if (tabs && tabs.length > 0) {
                const videosTab = tabs[0].tabRenderer.content.sectionListRenderer.contents;
                videosTab.forEach(item => {
                    if (item.itemSectionRenderer) {
                        item.itemSectionRenderer.contents.forEach(content => {
                            if (content.shelfRenderer && content.shelfRenderer.content && content.shelfRenderer.content.horizontalListRenderer) {
                                const items = content.shelfRenderer.content.horizontalListRenderer.items;
                                items.forEach(video => {
                                    if (video.gridVideoRenderer) {
                                        const videoData = {
                                            videoId: video.gridVideoRenderer.videoId,
                                            title: video.gridVideoRenderer.title.simpleText,
                                            thumbnail: video.gridVideoRenderer.thumbnail.thumbnails[0].url,
                                            publishedTime: video.gridVideoRenderer.publishedTimeText.simpleText,
                                            viewCount: video.gridVideoRenderer.viewCountText.simpleText,
                                            navigationUrl: null,
                                            commonConfigUrl: null,
                                            duration: null
                                        };

                                        if (video.gridVideoRenderer.navigationEndpoint.commandMetadata) {
                                            videoData.navigationUrl = video.gridVideoRenderer.navigationEndpoint.commandMetadata.webCommandMetadata.url;
                                        }

                                        if (video.gridVideoRenderer.navigationEndpoint.watchEndpoint && video.gridVideoRenderer.navigationEndpoint.watchEndpoint.watchEndpointSupportedOnesieConfig) {
                                            videoData.commonConfigUrl = video.gridVideoRenderer.navigationEndpoint.watchEndpoint.watchEndpointSupportedOnesieConfig.html5PlaybackOnesieConfig.commonConfig.url;
                                        }

                                        if (video.gridVideoRenderer.thumbnailOverlays) {
                                            video.gridVideoRenderer.thumbnailOverlays.forEach(overlay => {
                                                if (overlay.thumbnailOverlayTimeStatusRenderer) {
                                                    videoData.duration = overlay.thumbnailOverlayTimeStatusRenderer.text.simpleText;
                                                }
                                            });
                                        }

                                        videoDataList.push(videoData);
                                    }
                                });
                            }
                        });
                    }
                });
            }

            const channelMetadata = {
                username: null,
                subscriberCount: null,
                videoCount: null,
                avatarUrl: null,
                channelUrl: null,
                externalId: null,
                description: null,
                rssUrl: null,
                isFamilySafe: null
            };

            if (parsedData.header && parsedData.header.pageHeaderRenderer) {
                const header = parsedData.header.pageHeaderRenderer;
                channelMetadata.username = header.content.pageHeaderViewModel.metadata.contentMetadataViewModel.metadataRows[0].metadataParts[0].text.content;

                if (header.content.pageHeaderViewModel.image.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources.length > 0) {
                    channelMetadata.avatarUrl = header.content.pageHeaderViewModel.image.decoratedAvatarViewModel.avatar.avatarViewModel.image.sources[0].url;
                }
            }

            if (parsedData.metadata && parsedData.metadata.channelMetadataRenderer) {
                const channelMeta = parsedData.metadata.channelMetadataRenderer;
                channelMetadata.description = channelMeta.description;
                channelMetadata.externalId = channelMeta.externalId;
                channelMetadata.rssUrl = channelMeta.rssUrl;
                channelMetadata.channelUrl = channelMeta.channelUrl;
                channelMetadata.isFamilySafe = channelMeta.isFamilySafe;

                const metadataRows = parsedData.header.pageHeaderRenderer.content.pageHeaderViewModel.metadata.contentMetadataViewModel.metadataRows;
                if (metadataRows.length > 1) {
                    const subscriberRow = metadataRows[1];
                    subscriberRow.metadataParts.forEach(part => {
                        if (part.text && part.text.content) {
                            if (part.text.content.includes("subscribers")) {
                                channelMetadata.subscriberCount = part.text.content;
                            } else if (part.text.content.includes("videos")) {
                                channelMetadata.videoCount = part.text.content;
                            }
                        }
                    });
                }
            }
            return { videoDataList, channelMetadata };
        } else {
            return null; 
        }
    } catch (error) {
       return { error: error.message }; 
    }
}