// services/auth.js

import { account, ID } from "../lib/appwrite";

// REGISTER
export async function registerUser(email, password, name) {
  try {
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    return {
      success: true,
      userId: user.$id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// LOGIN
export async function loginUser(email, password) {
  try {
    await account.createEmailPasswordSession(email, password);

    const user = await account.get();

    return {
      success: true,
      user: {
        id: user.$id,   // IMPORTANT: always use id
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// LOGOUT
export async function logoutUser() {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// CURRENT USER
export async function getCurrentUser() {
  try {
    const user = await account.get();

    return {
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    return { success: false };
  }
}