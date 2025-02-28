import React from 'react'
import { authFetch } from '@/lib/authFetch';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function PostsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await authFetch(`${backendUrl}/auth/posts`);
    const data = await response.json();

    return (
      <div>
        <h1>All Posts</h1>
        <div>
          <h2>Current Session:</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
        <div>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in PostsPage:', error);
    return (
      <div>
        <h1>Seesion Expired</h1>
        <p>Failed to load posts. Please try again later.</p>
      </div>
    );
  }
}

export default PostsPage;