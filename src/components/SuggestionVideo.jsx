import { Stack, Box } from "@mui/material";

import { ChannelCard, Loader, VideoCard } from "./";

const SuggestionVideo = ({videos}) => {
  if (!videos?.length) return <Loader />;

  return (
    <Stack
      direction={"row"}
      flexWrap="wrap"
      justifyContent="start"
      alignItems="start"
      gap={2}
    >
      {videos.map((item, idx) => (
        <Box key={idx}>
          {item.id.videoId && <VideoCard video={item} isSuggestions: true />}
        </Box>
      ))}
    </Stack>
  );
};

export default SuggestionVideo;
