import { getSession, deleteSession } from '@/lib/session';
import { refreshToken } from '@/lib/auth';
import { ApiError, handleApiResponse } from '@/lib/error';

export async function authFetch(url: string, options: RequestInit = {}) {
    try {
        // Get current session
        const session = await getSession();
        
        if (!session?.accessToken) {
            throw new ApiError("No access token available", 401);
        }
        
        // Try the request with current token
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
        });
        
        // If unauthorized and we have a refresh token, try to refresh
        if (response.status === 401 && session.refreshToken) {
            try {
                // Refresh the token
                const newTokens = await refreshToken(session.refreshToken);
                
                // Retry request with new token
                const retryResponse = await fetch(url, {
                    ...options,
                    headers: {
                        ...(options.headers || {}),
                        Authorization: `Bearer ${newTokens.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                
                // Process the retry response with our helper
                return handleApiResponse(retryResponse);
                
            } catch (error) {
                // If refresh fails, clear session and throw error
                await deleteSession();
                
                if (error instanceof ApiError) {
                    throw error;
                }
                throw new ApiError(
                    "Authentication failed. Please log in again.", 
                    401, 
                    { originalError: error }
                );
            }
        }
        
        // Process the response with our helper for consistent error handling
        return handleApiResponse(response);
        
    } catch (error) {
        // Ensure all errors are ApiError instances
        if (error instanceof ApiError) {
            throw error;
        }
        
        // Wrap unknown errors
        throw new ApiError(
            error instanceof Error ? error.message : "An unexpected error occurred", 
            500
        );
    }
}