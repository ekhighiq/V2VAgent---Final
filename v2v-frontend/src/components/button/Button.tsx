import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  disabled = false,
  ...allProps
}) => {
  return (
    <button
      className={`
        flex flex-row justify-center items-center text-gray-950 border border-transparent
        bg-green-500 rounded-md transition ease-out duration-250
        hover:bg-transparent hover:shadow-green hover:border-green-500 hover:text-green-500 active:scale-[0.98]
        ${disabled ? "pointer-events-none opacity-60" : ""}
        font-bold
        text-base px-3 py-1.5
        sm:text-lg sm:px-4 sm:py-2
        md:text-xl md:px-5 md:py-2.5
        ${className}
      `}
      disabled={disabled}
      {...allProps}
    >
      {children}
    </button>
  );
};