'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'

export default function CreatePostForm() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const session = await getSession();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${session?.accessToken}`,
                },
            })

            if (response.ok) {
                router.push('/posts')
            }
        } catch (error) {
            console.error('Failed to create post:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="block mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Create Post
            </button>
        </form>
    )
}