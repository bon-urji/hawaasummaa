'use client';
import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "@/services/auth";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkUser = async () => {
      const result = await getCurrentUser();
      if (result.success) {
        setUser(result.user); // user object from Appwrite
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();  // Deletes Appwrite session
    setUser(null);       // Remove user from state
  };

  return (
    <div className="general">
      {loading ? (
        <div>
<h1>Baga nagaan gara hawaasummaatti dhuftan</h1>
        <p>Checking authentication...</p>
        </div>
      ) : user ? (
        // User is logged in → show welcome + logout
        <div>
          <h2>Welcome, {user.name || "User"}!</h2>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
      
        <div className="general">
          <h2>Not Logged In</h2>
          <p>Please log in to continue</p>
          <div className="general">
            <Link href="/login">Login</Link>
            <Link href="/Register">Register</Link>
          </div>
        </div>
      )}
    </div>
  );
}