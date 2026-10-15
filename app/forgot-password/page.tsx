"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Password reset link sent! Check your email.");
    }
  };

  const goToLogin = () => {
    router.push("/login"); // This brings the user back to the login where your Navbar lives
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-primary">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-primary text-white py-2 rounded shadow hover:shadow-lg transition"
        >
          Send Reset Link
        </button>

        {message && (
          <div className="mt-4 text-center">
            <p className="text-sm text-primary mb-2">{message}</p>
            <button
              onClick={goToLogin}
              className="text-sm text-white bg-primary px-4 py-2 rounded shadow hover:shadow-lg transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
