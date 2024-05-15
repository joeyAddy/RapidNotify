import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import React from "react";
import { callId, callSign } from "@/callConfig";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/user";

const CallWidget = () => {
  const [currentUser] = useAtom(currentUserAtom);

  return (
    <ZegoUIKitPrebuiltCall
      appID={callId}
      appSign={callSign}
      userID={currentUser.uid} // userID can be something like a phone number or the user id on your own user system.
      userName={currentUser.fullName}
      callID={currentUser.uid} // callID can be any unique string.
      config={{
        // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
        ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
        onOnlySelfInRoom: () => {
          router.push("/(drawer)/dashboard/");
        },
        onHangUp: () => {
          router.push("/(drawer)/dashboard/");
        },
        turnOnCameraWhenJoining: false,
        turnOnMicrophoneWhenJoining: false,
        useSpeakerWhenJoining: true,
      }}
    />
  );
};

export default CallWidget;
