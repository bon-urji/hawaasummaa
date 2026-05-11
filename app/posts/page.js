'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth';
import { createPost, getAllPosts, deletePost } from '@/services/database';
export default function PostsPage() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState('');

    // LOAD ON START
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);

        try {
            const userResult = await getCurrentUser();

            if (userResult.success) {
                setUser(userResult.user);
                await loadPosts();
            } else {
                setError("Please login first");
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    // LOAD POSTS
    const loadPosts = async () => {
        const result = await getAllPosts();

        if (result.success) {
            setPosts(result.posts);
        } else {
            setError(result.error || "Failed to load posts");
        }
    };

    // CREATE POST
    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!newPost.trim() || !user) return;

        setPosting(true);
        setError('');

        const result = await createPost(
            user.id,   // ✅ FIXED (NO $id)
            user.email,
            user.name,
            newPost
        );

        if (result.success) {
            setNewPost('');
            await loadPosts();
        } else {
            setError(result.error);
        }

        setPosting(false);
    };

    // DELETE POST
    const handleDeletePost = async (id) => {
        if (!confirm("Delete this post?")) return;

        const result = await deletePost(id);

        if (result.success) {
            await loadPosts();
        } else {
            setError(result.error);
        }
    };

    // LOADING UI
    if (loading) return <h2>Loading...</h2>;

    // LOGIN UI
    if (!user) {
        return (
            <div>
                <h2>Please login first</h2>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed">

            {/* DARK OVERLAY */}
            <div className="min-h-screen bg-black/40 backdrop-blur-sm py-10 px-4">

                <div className="max-w-2xl mx-auto">

                    {/* HEADER */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">

                        <h1 className="text-4xl font-bold text-white">
                            Posts
                        </h1>

                        <p className="text-gray-200 mt-2">
                            {user.name} ({user.email})
                        </p>

                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-500/20 text-red-100 p-4 rounded-2xl mb-5 border border-red-300/20">
                            {error}
                        </div>
                    )}

                    {/* CREATE POST */}
                    <form
                        onSubmit={handleCreatePost}
                        className="bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-6 mb-6 border border-white/20"
                    >

                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            maxLength={500}
                            placeholder="What's on your mind?"
                            className="w-full h-32 bg-white/10 text-white placeholder-gray-300 border border-white/20 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                        />

                        <div className="flex justify-between items-center mt-4">

                            <p className="text-sm text-gray-300">
                                {newPost.length}/500
                            </p>

                            <button
                                disabled={posting}
                                className="bg-cyan-500 hover:bg-cyan-600 hover:scale-105 text-white px-6 py-3 rounded-2xl font-semibold transition duration-300 cursor-pointer shadow-lg"
                            >
                                {posting ? "Posting..." : "Post"}
                            </button>

                        </div>

                    </form>

                    {/* POSTS */}
                    <div className="space-y-6">

                        {posts.map((post) => (
                            <div
                                key={post.$id}
                                className="bg-white/10 backdrop-blur-md shadow-2xl rounded-3xl p-6 border border-white/20"
                            >

                                <div className="flex justify-between items-start">

                                    <div>
                                        <h3 className="font-bold text-xl text-white">
                                            {post.userName || post.name}
                                        </h3>

                                        <p className="text-sm text-gray-300">
                                            {post.userEmail || post.email}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleDeletePost(post.$id)}
                                        className="bg-red-500 hover:bg-red-600 hover:scale-105 text-white px-4 py-2 rounded-xl transition duration-300 cursor-pointer shadow-md"
                                    >
                                        Delete
                                    </button>

                                </div>

                                <p className="text-white mt-5 leading-relaxed text-lg">
                                    {post.content}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}