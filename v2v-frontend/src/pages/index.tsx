import { LiveKitRoom, RoomAudioRenderer, StartAudio} from "@livekit/components-react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useCallback, useEffect } from "react";

import Playground from "@/components/playground/Playground";
import { ConfigProvider, useConfig } from "@/hooks/useConfig";
import { ConnectionMode, ConnectionProvider, useConnection } from "@/hooks/useConnection";
import { useMemo } from "react";

export default function Home() {
  return (
      <ConfigProvider>
        <ConnectionProvider>
          <HomeInner />
        </ConnectionProvider>
      </ConfigProvider>
  );
}

export function HomeInner() {
  const { shouldConnect, wsUrl, token, mode, connect, disconnect } =
    useConnection();
  
  const {config} = useConfig();

  const handleConnect = useCallback(
    async (c: boolean, mode: ConnectionMode) => {
      c ? connect(mode) : disconnect();
    },
    [connect, disconnect]
  );

  useEffect(() => {
    const performAutoConnect = () => {
      if (!shouldConnect) {
        handleConnect(true, "env"); 
      }
    };
    const timer = setTimeout(performAutoConnect, 10);
  }, []);  

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta
          property="og:image"
          content="https://livekit.io/images/og/agents-playground.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black repeating-square-background">
          <LiveKitRoom
            className="flex flex-col h-full w-full"
            serverUrl={wsUrl}
            token={token}
            connect={shouldConnect}
          >
            <Playground
              onConnect={(c) => {
                const m = process.env.NEXT_PUBLIC_LIVEKIT_URL ? "env" : mode;
                handleConnect(c, m);
              }}
            />
            <RoomAudioRenderer />
            <StartAudio label="Click to enable audio playback" />
          </LiveKitRoom>
      </main>
    </>
  );
}