import VideoCall from "./_components/VideoCall";

const VideoCallingPage = ({
  searchParams,
}: {
  searchParams: { videoCallingId: string };
}) => {
  return (
    <div>
      <VideoCall videoCallingId={searchParams?.videoCallingId} />
    </div>
  );
};

export default VideoCallingPage;
