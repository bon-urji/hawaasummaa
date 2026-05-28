'use client';

import { useState, useEffect } from 'react';
import { addLike, addComment, getLikes, getComments } from '@/services/social';
import { getCurrentUser } from '@/services/auth';

export default function PostCard({ post }) {

  const [user, setUser] = useState(null);

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // GET USER
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      if (res.success) setUser(res.user);
    };
    fetchUser();
  }, []);

  // LOAD DATA
  useEffect(() => {
    if (!post?.$id) return;
    loadData();
  }, [post]);

  const loadData = async () => {

    const likesRes = await getLikes(post.$id);
    const commentsRes = await getComments(post.$id);

    if (likesRes?.documents) {
      setLikes(likesRes.documents.length);
    }

    if (commentsRes?.documents) {
      setComments(commentsRes.documents);
    }
  };

  // ❤️ LIKE
  const handleLike = async () => {
    if (!user) return;

    const res = await addLike(post.$id, user.$id);

    if (res?.message === "Already liked") return;

    loadData();
  };

  // 💬 COMMENT
  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    await addComment(post.$id, user.$id, commentText);

    setCommentText('');
    loadData();
  };

  return (
    <div className="rounded-3xl bg-white/5 p-5 text-white">

      <img src={post.imageUrl} className="w-full rounded-2xl" />

      <h2 className="mt-3 font-bold">{post.userName}</h2>

      <p className="text-gray-300">{post.content}</p>

      {/* LIKE */}
      <button
        onClick={handleLike}
        className="mt-4 bg-blue-600 px-4 py-2 rounded-xl"
      >
        ❤️ {likes} Likes
      </button>

      {/* COMMENT */}
      <div className="mt-4">

        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write comment..."
          className="w-full bg-slate-800 p-2 rounded-xl"
        />

        <button
          onClick={handleComment}
          className="mt-2 bg-green-600 px-3 py-2 rounded-xl"
        >
          Comment
        </button>

      </div>

      {/* COMMENTS LIST */}
      <div className="mt-4 space-y-2">

        {comments.map((c) => (
          <div key={c.$id} className="bg-slate-800 p-2 rounded-xl">
            💬 {c.text}
          </div>
        ))}

      </div>

    </div>
  );
}