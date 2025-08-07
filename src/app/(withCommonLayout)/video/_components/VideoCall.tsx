"use client";

import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGetSingleUserQuery } from "@/redux/api/userApi";

const VideoCall = ({ videoCallingId }: { videoCallingId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomID = videoCallingId;
  const zpRef = useRef<any>(null);

  const { data: currUser } = useGetSingleUserQuery({});

  useEffect(() => {
    let mounted = true;

    const startMeeting = async () => {
      if (!containerRef.current || !currUser || !mounted) return;

      try {
        const { ZegoUIKitPrebuilt } = await import(
          "@zegocloud/zego-uikit-prebuilt"
        );

        const appID = 726143223;
        const serverSecret = "89f3c291c029fdcc4bb76ec59df19105";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          currUser.id || "1234",
          currUser.name || "user123",
          720
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: "Sharable link",
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?videoCallingId=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
        });
      } catch (error) {
        console.error("Failed to start meeting:", error);
        toast.error("Failed to initialize video call");
      }
    };

    if (currUser && containerRef.current) {
      startMeeting();
    }

    return () => {
      mounted = false;
      // 🧹 Clean up the Zego instance if exists
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
    };
  }, [currUser, roomID]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default VideoCall;
