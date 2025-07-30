"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Video, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AgoraUIKit = dynamic(() => import("agora-react-uikit"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

const VideoCall = ({ videoCallingId }: { videoCallingId: string }) => {
  const [videoCall, setVideoCall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rtcProps = {
    appId:
      process.env.NEXT_PUBLIC_AGORA_APP_ID ||
      "33172e75aeac46e791ca6d98cee9d5eb",
    channel: videoCallingId,
    token:
      "007eJxTYBBd2nr7qPx6jwlh29bY/655uGqZ2dkZP84J94R9SNE+ebdRgcHY2NDcKNXcNDE1MdnELNXc0jA50SzF0iI5NdUyxTQ1SSW1K6MhkJGh97AJMyMDBIL43AwZqYk5JRm6yYlFqQwMABgfJLQ=",
  };

  const callbacks = {
    EndCall: () => {
      setVideoCall(false);
      toast.success("Call ended");
    },
  };

  const handleStartCall = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoCall(true);
    } catch (err) {
      console.error("Media access error:", err);
      setError("Camera or microphone access denied.");
      toast.error("Unable to access media devices.");
    } finally {
      setIsLoading(false);
    }
  };

  if (videoCall) {
    return (
      <div className="w-screen h-screen">
        <AgoraUIKit
          rtcProps={rtcProps}
          callbacks={callbacks}
          styleProps={{
            UIKitContainer: {
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
            },
          }}
        />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <h3 className="text-2xl font-semibold text-center">
          Video Consultation
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Start your appointment with the doctor
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6">
            <Video className="h-10 w-10 text-primary" />
          </div>
        </div>
        {error && (
          <div className="flex items-center bg-red-50 text-red-700 text-sm p-3 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleStartCall}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Video className="h-4 w-4 mr-2" />
              Start Video Call
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCall;
