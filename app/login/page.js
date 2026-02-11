'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await LoginUser(email, password);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="general">
      <h2 style={{ color: 'wheat', fontSize: '30px', fontWeight: '600' }}>
        Login
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '265px',
          color: 'white',
          padding: '5px',
          alignItems: 'center',
          margin: '0 auto'
        }}
      >
        <label>Email:</label>
        <input
          style={{ border: '2px solid green' }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
        />

        <label>Password:</label>
        <input
          style={{ border: '2px solid green' }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            color: 'white',
            padding: '5px 10px',
            fontSize: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: 'yellow',
            display: 'inline-block',
            border: '2px solid red',
            borderRadius: '5px',
            margin: '20px auto 0 auto'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ fontSize: '16px', color: '#fff', marginTop: '15px' }}>
        Do not have an account?{" "}
        <a 
          href="/Register" className="Register-link"
        >
          Register
        </a>
      </p>
    </div>
  );
}