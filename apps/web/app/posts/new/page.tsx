import CreatePostForm from './createPostForm'

export default async function CreatePostPage() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            <CreatePostForm />
        </div>
    )
}