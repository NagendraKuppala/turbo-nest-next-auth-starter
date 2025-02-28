import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Try to call backend signout
        try {
            await authFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`, {
                method: "POST",
            });
        } catch (error) {
            console.error("Backend signout failed:", error);
            // Continue with local cleanup even if backend fails
        }

        // Always delete local session
        await deleteSession();
        revalidatePath("/");
        
        return NextResponse.redirect(new URL("/", req.nextUrl));
    } catch (error) {
        console.error("Signout error:", error);
        // Even if something fails, try to redirect user to home
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
}