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
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const role = searchParams.get('role');
    const avatar = searchParams.get('avatar')
    const emailVerified = searchParams.get('emailVerified');

    if(!accessToken || !refreshToken || !userId || !email || !username || !role)
        throw new Error('Google OAuth Failed!');        

    await createSession({
        user: {
            id: userId,
            email: email,
            username: username,
            firstName: firstName || '', 
            lastName: lastName || '', 
            role: role as "USER" | "ADMIN",
            avatar: avatar || '',
            emailVerified: emailVerified === 'true',
        },
        accessToken,
        refreshToken,
    });

    redirect('/');
}