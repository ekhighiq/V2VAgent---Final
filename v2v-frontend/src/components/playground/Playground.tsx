"use client";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ChatMessageType } from "@/components/chat/ChatTile";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import { PlaygroundTile } from "@/components/playground/PlaygroundTile";
import { TranscriptionTile } from "@/transcriptions/TranscriptionTile";
import {
  BarVisualizer,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useVoiceAssistant,
  TrackToggle,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

// Responsive hook: returns true if mobile
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export interface PlaygroundMeta {
  name: string;
  value: string;
}

export interface PlaygroundProps {
  logo?: ReactNode;
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
}

const headerHeight = 56;

export default function Playground({
  logo,
  onConnect,
}: PlaygroundProps) {
  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();

  const voiceAssistant = useVoiceAssistant();

  const roomState = useConnectionState();

  // Responsive check
  const isMobile = useIsMobile();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        setTranscripts([
          ...transcripts,
          {
            name: "You",
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [transcripts]
  );

  useDataChannel(onDataReceived);

  const audioTileContent = useMemo(() => {
    const disconnectedContent = (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-400 text-center w-full">
        Connect to get started.
      </div>
    );

    const waitingContent = (
      <div className="flex flex-col items-center gap-2 text-gray-700 text-center w-full">
        <LoadingSVG />
        Waiting for audio track
      </div>
    );

    const visualizerContent = (
      <div
        className={`flex flex-col items-center justify-center w-full h-48 [--lk-va-bar-width:30px] [--lk-va-bar-gap:20px] [--lk-fg:var(--lk-theme-color)]`}
      >
        <BarVisualizer
          state={voiceAssistant.state}
          trackRef={voiceAssistant.audioTrack}
          barCount={5}
          options={{ minHeight: 20 }}
        />
        {/* Mute/unmute button BELOW visualizer */}
        <div className="mt-6 flex justify-center">
          <TrackToggle
            source={Track.Source.Microphone}
            className="
              px-4 py-2 text-base
              sm:px-6 sm:py-3 sm:text-lg
              md:px-8 md:py-4 md:text-xl
              bg-transparent text-gray-300 border-0 rounded-md
              hover:bg-gray-800 transition duration-200
              focus:outline-none
            "
          />
        </div>
      </div>
    );
    // -------------------------------------------------------

    if (roomState === ConnectionState.Disconnected) {
      return disconnectedContent;
    }

    if (!voiceAssistant.audioTrack) {
      return waitingContent;
    }

    return visualizerContent;
  }, [
    voiceAssistant.audioTrack,
    roomState,
    voiceAssistant.state,
  ]);

  const chatTileContent = useMemo(() => {
    if (voiceAssistant.agent) {
      return (
        <TranscriptionTile
          agentAudioTrack={voiceAssistant.audioTrack}
        />
      );
    }
    return <></>;
  }, [voiceAssistant.audioTrack, voiceAssistant.agent]);

  return (
    <>
      <PlaygroundHeader
        title="HighIQ Voice Assistant"
        logo={logo}
        height={headerHeight}
        connectionState={roomState}
        onConnectClicked={() =>
          onConnect(roomState === ConnectionState.Disconnected)
        }
      />

      {/* Increased gap between header and tiles: mt-6 */}
      <div
        className={`flex grow w-full selection:bg-gray-900 mt-6`}
        style={{ height: `calc(100% - ${headerHeight}px - 1.5rem)` }} // 1.5rem = 24px (mt-6)
      >
        {/* Desktop layout: side-by-side */}
        {!isMobile && (
          <>
            <div
              className={`flex-col grow basis-1/4 gap-4 h-full hidden lg:flex`}
            >
              <PlaygroundTile
                title="Audio"
                className="w-full h-full grow"
                childrenClassName="justify-center"
              >
                {audioTileContent}
              </PlaygroundTile>
            </div>

            <PlaygroundTile
              title="Chat"
              className="h-full grow basis-3/4 hidden lg:flex"
              childrenClassName="justify-center"
            >
              {chatTileContent}
            </PlaygroundTile>
          </>
        )}

        {/* Mobile layout: stacked, audio on top (1/4), chat below (3/4) */}
        {isMobile && (
          <div className="flex flex-col w-full h-full">
            <div className="flex-none" style={{ height: "25%" }}>
              <PlaygroundTile
                title="Audio"
                className="w-full h-full"
                childrenClassName="justify-center"
              >
                {audioTileContent}
              </PlaygroundTile>
            </div>
            <div className="flex-1 min-h-0" style={{ height: "75%" }}>
              <PlaygroundTile
                title="Chat"
                className="w-full h-full"
                childrenClassName="justify-center"
              >
                {chatTileContent}
              </PlaygroundTile>
            </div>
          </div>
        )}
      </div>
    </>
  );
}