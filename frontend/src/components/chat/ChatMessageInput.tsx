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
  const [inputHasFocus, setInputHasFocus] = useState(false);

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

  // Dynamic classes
  const caretColor = inputHasFocus ? "green-500" : "gray-800";
  const caretShadow = inputHasFocus ? "shadow-green" : "";
  const caretCursor = !isTyping && inputHasFocus ? "cursor-animation" : "";

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
      className="flex flex-col gap-2 border-t border-t-gray-800"
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
          className="w-full text-xs caret-transparent bg-transparent opacity-25 text-gray-300 p-2 pr-6 rounded-sm focus:opacity-100 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
          style={{
            paddingLeft: message.length > 0 ? "12px" : "24px",
            caretShape: "block",
          }}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setInputHasFocus(true)}
          onBlur={() => setInputHasFocus(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <span
          ref={hiddenInputRef}
          className="absolute top-0 left-0 text-xs pl-3 text-amber-500 pointer-events-none opacity-0"
        >
          {message.replaceAll(" ", "\u00a0")}
        </span>
        <button
          disabled={!canSend}
          onClick={handleSend}
          className={`text-xs uppercase text-green-500 hover:bg-green-950 p-2 rounded-md ${sendBtnOpacity} ${sendBtnPointer}`}
        >
          Send
        </button>
      </div>
    </div>
  );
};