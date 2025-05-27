import { Button } from "@/components/button/Button";
import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ConnectionState } from "livekit-client";
import { ReactNode } from "react";
import Image from "next/image";
import hiLogo from '../../assets/highiq_logo.png';

type PlaygroundHeaderProps = {
  logo?: ReactNode;
  title?: ReactNode;
  height: number;
  connectionState: ConnectionState;
  onConnectClicked: () => void;
};

export const PlaygroundHeader = ({
  logo,
  title,
  height,
  onConnectClicked,
  connectionState,
}: PlaygroundHeaderProps) => {
  return (
    <div
      className="relative flex items-center w-full px-2 sm:px-4 pt-4 shrink-0"
      style={{ height: `${height}px` }}
    >
      {/* Logo (left) */}
      <div className="flex items-center flex-shrink-0 z-10">
        <a href="https://highiq.ai/" className="flex items-center">
          {logo ?? <HiLogo />}
        </a>
      </div>

      {/* Title (center, perfectly centered both vertically and horizontally) */}
      <div
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          text-white font-semibold whitespace-nowrap text-center pointer-events-none z-0
          text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
          w-full
        `}
        style={{ padding: 0 }}
      >
        {title}
      </div>

      {/* Button (right, does not affect title centering) */}
      <div className="flex flex-shrink-0 z-10 ml-auto">
        <Button
          disabled={connectionState === ConnectionState.Connecting}
          onClick={onConnectClicked}
          className={
            connectionState === ConnectionState.Connected
              ? "flex flex-row text-gray-950 text-xs xs:text-sm sm:text-base justify-center border border-transparent bg-red-500 px-3 py-1.5 rounded-md transition ease-out duration-250 hover:bg-transparent hover:shadow-red hover:border-red-500 hover:text-red-500 active:scale-[0.98]"
              : "flex flex-row text-gray-950 text-xs xs:text-sm sm:text-base justify-center border border-transparent bg-green-500 px-3 py-1.5 rounded-md transition ease-out duration-250 hover:bg-transparent hover:shadow-green hover:border-green-500 hover:text-green-500 active:scale-[0.98]"
          }
        >
          {connectionState === ConnectionState.Connecting
            ? <LoadingSVG />
            : connectionState === ConnectionState.Connected
              ? "Disconnect"
              : "Connect"}
        </Button>
      </div>
    </div>
  );
};

// Larger logo
const HiLogo = () => (
  <div className="flex items-center">
    <Image
      src={hiLogo}
      alt="Logo"
      width={100}
      height={100}
      className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
      priority
    />
  </div>
);