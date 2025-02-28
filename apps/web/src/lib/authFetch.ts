import { refreshToken } from './auth';
import { getSession, deleteSession } from './session';

export interface fetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const authFetch = async (url: string | URL, options: RequestInit = {}) => {
    try {
        const session = await getSession();
        
        // For signout, proceed even without a session
        if (!session && url.toString().includes('/auth/signout')) {
            return await fetch(url, options);
        }

        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${session?.accessToken}`,
        };

        let response = await fetch(url, options);

        if (response.status === 401) {
            if (!session?.refreshToken) {
                await deleteSession(); // Clean up any invalid session
                throw new Error('No refresh token available');
            }

            try {
                const newAccessToken = await refreshToken(session.refreshToken);
                if (!newAccessToken) {
                    await deleteSession();
                    throw new Error('Failed to refresh token');
                }

                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };
                response = await fetch(url, options);
            } catch (error) {
                // If refresh fails, clean up the session
                await deleteSession();
                throw error;
            }
        }
        return response;
    } catch (error) {
        // Always clean up session on critical errors
        await deleteSession();
        throw error;
    }
};