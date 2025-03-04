"use client";

import { ClipLoader } from "react-spinners";

export interface SpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
  className?: string;
}

export function Spinner({
  size = 40,
  color = "#0070f3", // Default color - can use your theme's primary color
  loading = true,
  className = "",
}: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
        aria-label="Loading Spinner"
        data-testid="spinner"
      />
    </div>
  );
}