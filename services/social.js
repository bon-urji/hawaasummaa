import { databases, ID, Query } from "@/lib/appwrite";

const DATABASE_ID = "698b65e90037e4f375e5";
const LIKES = "likes";
const COMMENTS = "comments";


// ❤️ LIKE (with prevent duplicate)
export const addLike = async (postId, userId) => {

    const existing = await databases.listDocuments(
        DATABASE_ID,
        LIKES_ID,
        [
            Query.equal("postId", postId),
            Query.equal("userId", userId)
        ]
    );

    if (existing.documents.length > 0) {
        return { success: false, message: "Already liked" };
    }

    await databases.createDocument(
        DATABASE_ID,
        LIKES_ID,
        ID.unique(),
        {
            postId,
            userId
        }
    );

    return { success: true };
};


// 💬 ADD COMMENT
export const addComment = async (postId, userId, text) => {

    await databases.createDocument(
        DATABASE_ID,
        COMMENTS_ID,
        ID.unique(),
        {
            postId,
            userId,
            text,
            createdAt: new Date().toISOString()
        }
    );

    return { success: true };
};


// ❤️ GET LIKES
export const getLikes = async (postId) => {

    return await databases.listDocuments(
        DATABASE_ID,
        LIKES_ID,
        [
            Query.equal("postId", postId)
        ]
    );
};


// 💬 GET COMMENTS
export const getComments = async (postId) => {

    return await databases.listDocuments(
        DATABASE_ID,
        COMMENTS_ID,
        [
            Query.equal("postId", postId)
        ]
    );
};