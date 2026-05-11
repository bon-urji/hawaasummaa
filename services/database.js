// services/databases.js

import {
  databases,
  DATABASE_ID,
  COLLECTION,
  ID,
  Query,
} from "@/lib/appwrite";

//
// 🟢 CREATE POST
//
export async function createPost(userId, email, name, content) {
  try {
    const post = await databases.createDocument(
      DATABASE_ID,
      COLLECTION.posts,
      ID.unique(),
     {
  userid: userId,
  userEmail: email,
  userName: name,
  content,
}
    );

    return {
      success: true,
      post,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

//
// 🟢 GET ALL POSTS
//
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION.posts,
      [Query.orderDesc("$createdAt")]
    );

    return {
      success: true,
      posts: posts.documents,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

//
// 🟢 DELETE POST
//
export async function deletePost(postId) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION.posts,
      postId
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}