'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { addLike, addComment, getLikes, getComments } from "@/services/social";
import { getCurrentUser } from '@/services/auth';

import {
    createPost,
    getAllPosts,
    deletePost
} from '@/services/database';

import { uploadImage } from '@/services/storage';

export default function PostsPage() {

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const [newPost, setNewPost] = useState('');
    const [image, setImage] = useState(null);

    const [comments, setComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [likes, setLikes] = useState({});

    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState('');

    // LOAD PAGE
    useEffect(() => {
        init();
    }, []);

    // INIT
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

        } catch (error) {

            setError(error.message);
        }

        setLoading(false);
    };

    // LOAD POSTS
    const loadPosts = async () => {

        const result = await getAllPosts();

        if (result.success) {

            setPosts(result.posts);

        } else {

            setError(result.error);
        }
    };

    // CREATE POST
    const handleCreatePost = async (e) => {

        e.preventDefault();

        if (!newPost.trim()) return;

        setPosting(true);
        setError('');

        try {

            let imageUrl = '';
            let imageId = '';

            // upload image
            if (image) {

                const uploadResult = await uploadImage(image);

                if (uploadResult.success) {

                    imageUrl = uploadResult.imageUrl;
                    imageId = uploadResult.fileId;

                } else {

                    setError(uploadResult.error);
                    setPosting(false);

                    return;
                }
            }

            // create post
            const result = await createPost(
                user.$id || user.id,
                user.email,
                user.name,
                newPost,
                imageUrl,
                imageId
            );

            if (result.success) {

                setNewPost('');
                setImage(null);

                await loadPosts();

            } else {

                setError(result.error);
            }

        } catch (error) {

            setError(error.message);
        }

        setPosting(false);
    };

    // DELETE POST
    const handleDeletePost = async (id) => {

        const confirmDelete = confirm(
            "Delete this post?"
        );

        if (!confirmDelete) return;

        const result = await deletePost(id);

        if (result.success) {

            await loadPosts();

        } else {

            setError(result.error);
        }
    };

    // LIKE
    const handleLike = (postId) => {

        setLikes((prev) => ({
            ...prev,
            [postId]: (prev[postId] || 0) + 1
        }));
    };

    // COMMENT
    const handleComment = (postId) => {

        if (!commentText[postId]?.trim()) return;

        setComments((prev) => ({
            ...prev,
            [postId]: [
                ...(prev[postId] || []),
                commentText[postId]
            ]
        }));

        setCommentText((prev) => ({
            ...prev,
            [postId]: ''
        }));
    };

    // LOADING
    if (loading) {

        return (
            <h2 className="text-white p-10">
                Loading...
            </h2>
        );
    }

    // NO USER
    if (!user) {

        return (
            <div className="p-10 text-white">
                Please login first
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed">

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

                        <div className="bg-red-500/20 text-red-100 p-4 rounded-2xl mb-5">
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
                            placeholder="What's on your mind?"
                            className="w-full h-32 bg-white/10 text-white border border-white/20 rounded-2xl p-4 outline-none resize-none"
                        />

                        {/* IMAGE INPUT */}
                        <div className="mt-4">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="text-white"
                            />

                        </div>

                        {/* IMAGE PREVIEW */}
                        {image && (

                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="w-full mt-4 rounded-2xl"
                            />

                        )}

                        <div className="flex justify-between items-center mt-4">

                            <p className="text-sm text-gray-300">
                                {newPost.length}/500
                            </p>

                            <button
                                disabled={posting}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl"
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
                                            {post.userName}
                                        </h3>

                                        <p className="text-sm text-gray-300">
                                            {post.userEmail}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() => handleDeletePost(post.$id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                    >
                                        Delete
                                    </button>

                                </div>

                                {/* CONTENT */}
                                <p className="text-white mt-5 text-lg">
                                    {post.content}
                                </p>

                                {/* IMAGE */}
                                {post.imageUrl && (

                                    <img
                                        src={post.imageUrl}
                                        alt="post"
                                        className="max-w-sm w-full mt-4 rounded-2xl object-cover"
                                    />

                                )}

                                {/* LIKE BUTTON */}
                                <div className="mt-5 flex gap-3">

                                    <button
                                        onClick={() => handleLike(post.$id)}
                                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl"
                                    >
                                        ❤️ {likes[post.$id] || 0} Likes
                                    </button>

                                </div>

                                {/* COMMENT INPUT */}
                                <div className="mt-5">

                                    <input
                                        type="text"
                                        value={commentText[post.$id] || ''}
                                        onChange={(e) =>
                                            setCommentText((prev) => ({
                                                ...prev,
                                                [post.$id]: e.target.value
                                            }))
                                        }
                                        placeholder="Write comment..."
                                        className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 outline-none"
                                    />

                                    <button
                                        onClick={() => handleComment(post.$id)}
                                        className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
                                    >
                                        Add Comment
                                    </button>

                                </div>

                                {/* COMMENTS */}
                                <div className="mt-4 space-y-2">

                                    {(comments[post.$id] || []).map((comment, index) => (

                                        <div
                                            key={index}
                                            className="bg-white/10 text-white p-3 rounded-xl"
                                        >
                                            💬 {comment}
                                        </div>

                                    ))}

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* HOME */}
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2">

                        <Link
                            href="/"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full"
                        >
                            Home
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}