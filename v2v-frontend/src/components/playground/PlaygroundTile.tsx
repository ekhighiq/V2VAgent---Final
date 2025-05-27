import { ReactNode } from "react";

const titleHeight = 32;

type PlaygroundTileProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
  childrenClassName?: string;
  padding?: boolean;
  backgroundColor?: string;
};

export type PlaygroundTab = {
  title: string;
  content: ReactNode;
};

export const PlaygroundTile: React.FC<PlaygroundTileProps> = ({
  children,
  title,
  className,
  childrenClassName,
  padding = true,
  backgroundColor = "transparent",
}) => {
  // Responsive padding: 4 (16px) on mobile, 6 (24px) on sm, 8 (32px) on md+
  const paddingClasses = padding ? "p-4 sm:p-6 md:p-8" : "";

  return (
    <div
      className={`
        flex flex-col border rounded-sm border-gray-500 text-gray-300
        ${backgroundColor !== "transparent" ? `bg-${backgroundColor}` : ""}
        ${className || ""}
      `}
    >
      {title && (
        <div
          className="flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold uppercase py-2 border-b border-b-gray-500 tracking-wider"
          style={{
            height: `${titleHeight}px`,
          }}
        >
          <h2>{title}</h2>
        </div>
      )}
      <div
        className={`
          flex flex-col items-center grow w-full
          ${paddingClasses}
          ${childrenClassName || ""}
        `}
        style={{
          height: `calc(100% - ${title ? titleHeight + "px" : "0px"})`,
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};