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
      className={`flex flex-row text-gray-950 text-sm justify-center border border-transparent bg-green-500 px-3 py-1 rounded-md transition ease-out duration-250 hover:bg-transparent hover:shadow-green hover:border-green-500 hover:text-green-500 active:scale-[0.98] ${disabled ? "pointer-events-none" : ""} ${className}`}
      disabled={disabled}
      {...allProps}
    >
      {children}
    </button>
  );
};