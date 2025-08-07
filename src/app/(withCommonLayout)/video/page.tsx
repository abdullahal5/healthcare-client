export const dynamic = "force-dynamic";

import VideoCall from "./_components/VideoCall";

type VideoCallingPageProps = {
  searchParams: Promise<{
    videoCallingId?: string;
  }>;
};

const VideoCallingPage = async ({ searchParams }: VideoCallingPageProps) => {
  const resolvedSearchParams = await searchParams;
  const videoCallingId = resolvedSearchParams.videoCallingId || "";

  return (
    <div>
      <VideoCall videoCallingId={videoCallingId} />
    </div>
  );
};

export default VideoCallingPage;
