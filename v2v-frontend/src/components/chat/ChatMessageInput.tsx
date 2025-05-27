import { useWindowResize } from "@/hooks/useWindowResize";
import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessageInput = {
  placeholder: string;
  height: number;
  onSend?: (message: string) => void;
};

export const ChatMessageInput = ({
  placeholder,
  height,
  onSend,
}: ChatMessageInput) => {
  const [message, setMessage] = useState("");
  const [inputTextWidth, setInputTextWidth] = useState(0);
  const [inputWidth, setInputWidth] = useState(0);
  const hiddenInputRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowSize = useWindowResize();
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback(() => {
    if (onSend && message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  }, [onSend, message]);

  // Typing indicator effect
  useEffect(() => {
    if (!message) return;
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timeout);
  }, [message]);

  // Measure message text width for "caret" indicator
  useEffect(() => {
    if (hiddenInputRef.current) {
      setInputTextWidth(hiddenInputRef.current.clientWidth);
    }
  }, [message, windowSize.width]);

  // Measure input width
  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.clientWidth);
    }
  }, [windowSize.width]);

  // Always visible caret styles
  const caretColor = "gray-400";
  const caretShadow = "shadow-gray";
  const caretCursor = !isTyping ? "cursor-animation" : "";

  // Caret position calculation
  const caretTranslate =
    message.length > 0
      ? Math.min(inputTextWidth, inputWidth - 20) - 4
      : 0;

  // Send button state
  const canSend = message.trim().length > 0 && !!onSend;
  const sendBtnOpacity = canSend ? "opacity-100" : "opacity-25";
  const sendBtnPointer = canSend ? "pointer-events-auto" : "pointer-events-none";

  return (
    <div
      className="flex flex-col gap-2 border-t border-t-gray-500 font-bold text-base"
      style={{ height }}
    >
      <div className="flex flex-row pt-3 gap-2 items-center relative">
        <div
          className={`w-2 h-4 bg-${caretColor} ${caretShadow} absolute left-2 ${caretCursor}`}
          style={{
            transform: `translateX(${caretTranslate}px)`,
          }}
        />
        <input
          ref={inputRef}
          className={`
            w-full bg-transparent opacity-100 text-gray-300 rounded-sm outline-none border border-transparent
            text-base sm:text-lg md:text-xl
            p-2 pr-6
          `}
          style={{
            paddingLeft: message.length > 0 ? "12px" : "24px",
            caretShape: "block",
          }}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <span
          ref={hiddenInputRef}
          className="absolute top-0 left-0 pl-3 text-amber-500 pointer-events-none opacity-0 text-base sm:text-lg md:text-xl"
        >
          {message.replaceAll(" ", "\u00a0")}
        </span>
        <button
          disabled={!canSend}
          onClick={handleSend}
          className={`
            uppercase text-gray-300 hover:bg-gray-800 rounded-md font-bold
            text-base sm:text-lg md:text-xl
            px-3 py-2
            ${sendBtnOpacity} ${sendBtnPointer}
            transition
          `}
        >
          Send
        </button>
      </div>
    </div>
  );
};