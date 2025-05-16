import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  dark?: boolean;
}

export default function Button({ children, dark = false, disabled, ...props }: ButtonProps) {
  const base =
    'px-4 py-2 rounded transition font-medium';
  const light =
    'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100 disabled:text-gray-400';
  const darkStyle =
    'bg-gray-800 hover:bg-gray-700 text-white disabled:bg-gray-900 disabled:text-gray-500';
  const cursor = disabled ? 'cursor-not-allowed' : 'cursor-pointer';
  return (
    <button
      className={
        base + ' ' + (dark ? darkStyle : light) + ' ' + cursor
      }
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
