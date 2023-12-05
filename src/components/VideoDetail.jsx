import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  Avatar,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  CardContent,
} from "@mui/material";
import {
  CheckCircle,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
} from "@mui/icons-material";

import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

import { demoProfilePicture, numberCountFormat } from "../utils/const";
import { formatTimeAgo } from "../utils/formatTimeAgo";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videoSelectedChannel, setVideoSelectedChannel] = useState();
  const [videos, setVideos] = useState(null);
  const [loadMore, setLoadMore] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const selectedVideoData = await fetchFromAPI(
        `videos?part=snippet,statistics&id=${id}`
      );
      setVideoDetail(selectedVideoData?.items[0]);

      if (selectedVideoData?.items[0]?.snippet?.channelId) {
        const selectedChannelData = await fetchFromAPI(
          `channels?part=snippet&id=${selectedVideoData?.items[0]?.snippet?.channelId}`
        );
        setVideoSelectedChannel(selectedChannelData?.items[0]);
      }

      const suggestionVideo = await fetchFromAPI(
        `search?relatedToVideoId=${id}&part=snippet&type=video`
      );
      setVideos(suggestionVideo.items);
    };

    fetchData();
  }, [id]);

  if (!videoDetail?.snippet) return <Loader />;

  const {
    snippet: { title, channelId, channelTitle, publishedAt, description },
    statistics: { viewCount, likeCount },
  } = videoDetail;

  const toggleDescription = () => {
    setLoadMore(!loadMore);
  };

  return (
    <Box minHeight="95vh">
      <Stack direction={{ md: "column", lg: "row" }}>
        <Box
          sx={{
            width: "100%",
            // position: "relative",
            px: "30px",
          }}
        >
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            className="react-player"
            controls
          />
          <Typography color="#FFF" variant="h5" fontWeight="bold" pt={2}>
            {title}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              color: "#fff",
            }}
            py={1}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Link to={`/channel/${channelId}`}>
                <Avatar
                  src={
                    videoSelectedChannel?.snippet?.thumbnails?.high?.url ||
                    demoProfilePicture
                  }
                  alt="Channel Logo"
                />
              </Link>
              <Box
                sx={{
                  pl: "5px",
                  pr: "15px",
                }}
              >
                <Link to={`/channel/${channelId}`}>
                  <Typography
                    variant={{
                      sm: "subtitle1",
                      md: "h6",
                    }}
                    color="#fff"
                  >
                    {channelTitle}
                    <CheckCircle
                      sx={{ fontSize: 14, color: "gray", ml: "5px" }}
                    />
                  </Typography>
                </Link>
                {videoSelectedChannel?.statistics?.subscriberCount && (
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: 500, color: "gray" }}
                  >
                    {numberCountFormat.format(
                      videoSelectedChannel?.statistics?.subscriberCount
                    )}{" "}
                    Subscribers
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                color="inherit"
                sx={{ borderRadius: "20px", color: "#000" }}
              >
                Subscribe
              </Button>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ opacity: 0.7, fontSize: { md: "16px", xs: "14px" } }}
            >
              <ThumbUpAltOutlined />
              <Typography variant="body1" sx={{ opacity: 0.7 }}>
                {numberCountFormat.format(likeCount)}
              </Typography>
              <ThumbDownAltOutlined />
            </Stack>
          </Stack>
          <CardContent
            sx={{
              my: 1,
              backgroundColor: "#1E1E1E",
              borderRadius: "8px",
              color: "#fff",
              overflow: "hidden",
            }}
          >
            <Stack direction="row" alignItems="center">
              <Typography
                variant="body2"
                sx={{ color: "white" }}
              >{`${numberCountFormat.format(viewCount)} views`}</Typography>

              <Typography variant="body2" sx={{ color: "white", ml: "10px" }}>
                {formatTimeAgo(publishedAt)}
              </Typography>
            </Stack>
            <Typography variant="body2" marginTop={1}>
              {loadMore ? description : `${description.slice(0, 250)}...`}
              <Button
                variant="text"
                color="inherit"
                onClick={toggleDescription}
              >
                {loadMore ? "Show Less" : "Show More"}
              </Button>
            </Typography>
          </CardContent>
        </Box>

        <Box
          px="30px"
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
