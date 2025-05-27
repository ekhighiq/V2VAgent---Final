type ChatMessageProps = {
  message: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};

export const ChatMessage = ({
  name,
  message,
  isSelf,
  hideName,
}: ChatMessageProps) => {
  const nameColorClass = isSelf
    ? "text-blue-300 font-bold"
    : "text-gray-300 text-ts-gray uppercase text-xs font-bold";
  const messageColorClass = isSelf
    ? "text-blue-300 font-bold"
    : "text-gray-300 drop-shadow-gray font-bold";
  
  return (
    <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-6"}`}>
      {!hideName && (
        <div
          className={`${nameColorClass} text-xs sm:text-sm md:text-base`}
        >
          {name}
        </div>
      )}
      <div
        className={`
          pr-4 whitespace-pre-line
          ${messageColorClass}
          text-base sm:text-lg md:text-xl
          break-words
        `}
      >
        {message}
      </div>
    </div>
  );
};