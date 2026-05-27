'use client';
import { useState } from "react";
import { getCurrentUser } from "@/services/auth";
import { createPost } from "@/services/database";
import { uploadImage } from "@/services/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreatePostPage() {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Only images allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Max 5MB allowed");
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError("Please write something");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Get current user
            const userResult = await getCurrentUser();
            if (!userResult.success) {
                setError("Please login first");
                router.push("/login");
                return;
            }

            const user = userResult.user;

            // Upload image if selected
            let imageUrl = "";
            let imageId = "";

            if (imageFile) {
                const uploadResult = await uploadImage(imageFile, user.$id);
                if (uploadResult.success) {
                    imageUrl = uploadResult.imageUrl;
                    imageId = uploadResult.fileId;
                    console.log("✅ Image uploaded:", imageUrl);
                } else {
                    setError("Image upload failed: " + uploadResult.error);
                    setLoading(false);
                    return;
                }
            }

            // Create post
            const postResult = await createPost(
                user.$id,
                user.email,
                user.name || user.email.split('@')[0],
                content,
                imageUrl,
                imageId
            );

            if (postResult.success) {
                router.push("/posts");
            } else {
                setError("Failed to create post: " + postResult.error);
            }

        } catch (err) {
            setError("Error: " + err.message);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                    <label className="block mb-2 font-medium">Add Image (Optional)</label>
                    {imagePreview ? (
                        <div className="relative inline-block">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="border p-2 rounded"
                        />
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="block mb-2 font-medium">Your Story</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border rounded p-2 h-32"
                        placeholder="Write something amazing..."
                        required
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
                >
                    {loading ? "Posting..." : "Publish Post"}
                </button>
            </form>
        </div>
    );
}