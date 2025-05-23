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
    ? "text-gray-700"
    : "text-green-800 text-ts-green uppercase text-xs";
  const messageColorClass = isSelf
    ? "text-gray-300"
    : "text-green-500 drop-shadow-green";
  
  return (
    <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-6"}`}>
      {!hideName && (
        <div className={nameColorClass}>
          {name}
        </div>
      )}
      <div
        className={`pr-4 ${messageColorClass} text-sm whitespace-pre-line`}
      >
        {message}
      </div>
    </div>
  );
};