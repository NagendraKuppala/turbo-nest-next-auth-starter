"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: "USER" | "ADMIN";
    avatar: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  try {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresAt.getTime())
      .sign(encodedKey);

    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
    return true;
  } catch (error) {
    console.error("Error creating session:", error);
    return false;
  }
}

export async function getSession() {
  try {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (error) {
    console.error("Failed to verify the session:", error);
    return null;
  }
}

export async function updateSession(userData: Partial<User>): Promise<void> {
  try {
    // Get the current session
    const session = await getSession();
    
    if (!session?.user) {
      throw new Error("No active session found");
    }
    // Update the user data in the session
    const updatedUser = {
      ...session.user,
      ...userData
    };
    // Save the updated session
    await createSession({
      ...session,
      user: updatedUser
    });
  } catch (error) {
    console.error("Failed to update session user data:", error);
    throw error;
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;

    const { payload } = await jwtVerify<Session>(cookie, encodedKey);

    if (!payload) throw new Error("Session payload not found!");

    const newPayload: Session = {
      user: { ...payload.user },
      accessToken,
      refreshToken,
    };

    return await createSession(newPayload);
  } catch (error) {
    console.error("Error updating tokens:", error);
    return false;
  }
}
