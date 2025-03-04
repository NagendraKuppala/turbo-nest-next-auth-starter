import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const username = searchParams.get('username');
    const role = searchParams.get('role');
    const avatar = searchParams.get('avatar')

    if(!accessToken || !refreshToken || !userId || !email || !username || !role) 
        throw new Error('Google OAuth Failed!');

    await createSession({
        user: {
            id: userId,
            email: email,
            username: username,
            role: role as "USER" | "ADMIN",
            avatar: avatar,
        },
        accessToken,
        refreshToken,
    });

    redirect('/');
}