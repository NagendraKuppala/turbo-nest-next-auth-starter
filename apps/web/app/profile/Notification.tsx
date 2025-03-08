import React from "react";

interface NotificationProps {
  error: string | null;
  success: string | null;
}

export function Notification({ error, success }: NotificationProps) {
  if (!error && !success) return null;
  
  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
    </>
  );
}