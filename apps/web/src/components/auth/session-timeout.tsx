"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { refreshToken } from "@/lib/auth";
import { getSession } from "@/lib/session";

// Time before showing warning (in ms) - e.g., 5 minutes before expiry
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000;
// Check interval (in ms)
const CHECK_INTERVAL = 60 * 1000;

export function SessionTimeout() {
  const [showDialog, setShowDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const timer: NodeJS.Timeout = setInterval(checkSession, CHECK_INTERVAL);

    async function checkSession() {
      try {
        const session = await getSession();

        // If no session exists or no access token, trigger logout
        if (!session?.accessToken) {
          logout();
          return;
        }

        // Parse JWT to get expiration
        const accessToken = session.accessToken;
        let payload;

        try {
          // Safer JWT parsing
          const [header, content, signature] = accessToken.split('.');
          if (!header || !content || !signature) {
            throw new Error('Invalid token format');
          }
          
          // Base64 decode with error handling
          const decodedContent = Buffer.from(content, 'base64').toString();
          payload = JSON.parse(decodedContent);
          
          if (!payload.exp) {
            throw new Error('Token missing expiration');
          }
        } catch (parseError) {
          console.error('Error parsing JWT:', parseError);
          logout();
          return;
        }

        const expiresAt = payload.exp * 1000; // Convert to ms
        const now = Date.now();
        const timeRemaining = expiresAt - now;

        if (timeRemaining <= 0) {
          logout();
        } else if (timeRemaining <= WARNING_BEFORE_TIMEOUT) {
          setTimeLeft(Math.ceil(timeRemaining / 1000 / 60)); // Convert to minutes
          setShowDialog(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Only logout if it's a session validation error
        if (error instanceof Error && 
            (error.message.includes('session') || 
             error.message.includes('token') || 
             error.message.includes('jwt'))) {
          logout();
        }
      }
    }

    // Initial check
    checkSession();

    return () => {
      clearInterval(timer);
    };
  }, [isAuthenticated, logout]);

  const handleExtendSession = async () => {
    try {
      const session = await getSession();
      if (session?.refreshToken) {
        await refreshToken(session.refreshToken);
        setShowDialog(false);
      }
    } catch (error) {
      console.error("Error extending session:", error);
      logout();
    }
  };

  const handleLogout = () => {
    logout();
    setShowDialog(false);
  };

  if (!showDialog) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your session is about to expire</DialogTitle>
        </DialogHeader>
        <p>
          Your session will expire in {timeLeft}{" "}
          {timeLeft === 1 ? "minute" : "minutes"}. Would you like to extend your
          session?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={handleExtendSession}>Extend Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
