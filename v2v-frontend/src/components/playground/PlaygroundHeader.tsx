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
    <div className="flex gap-4 pt-4 justify-between items-center shrink-0" style={{ height: `${height}px` }}>
      <div className="flex items-center gap-3 basis-2/3">
        <a href="https://highiq.ai/">{logo ?? <HiLogo />}</a>
        <div className="lg:basis-1/2 lg:text-center text-xs lg:text-base lg:font-semibold text-white" style = {{ marginLeft: '350px' }}>
          {title}
        </div>
      </div>
      <div className="flex basis-1/3 justify-end items-center gap-2">
        <Button
          disabled={connectionState === ConnectionState.Connecting}
          onClick={onConnectClicked}
          className={
            connectionState === ConnectionState.Connected
              ? "flex flex-row text-gray-950 text-sm justify-center border border-transparent bg-red-500 px-3 py-1 rounded-md transition ease-out duration-250 hover:bg-transparent hover:shadow-red hover:border-red-500 hover:text-red-500 active:scale-[0.98]"
              : "flex flex-row text-gray-950 text-sm justify-center border border-transparent bg-green-500 px-3 py-1 rounded-md transition ease-out duration-250 hover:bg-transparent hover:shadow-green hover:border-green-500 hover:text-green-500 active:scale-[0.98]"
          }
        >
          {connectionState === ConnectionState.Connecting ? <LoadingSVG /> : connectionState === ConnectionState.Connected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
};

const HiLogo = () => <Image src={hiLogo} alt="Logo" width={120} height={120} />;

