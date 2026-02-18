import React from 'react';

interface EyeIconProps {
  className?: string;
  size?: number;
}

export const EyeIcon: React.FC<EyeIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 12S5 4 12 4s11 8 11 8-5 8-11 8S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse-slow"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="currentColor"
        className="animate-blink"
      />
    </svg>
  );
};
