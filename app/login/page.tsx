// "use client";
// import { FormEvent, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/app/providers";
// // Note: Server API handles password validation

// // Redirect this page to home since Navbar handles login modal now
// export default function LoginPage() {
//   const { loginWithCredentials } = useAuth();
//   const router = useRouter();
//   const search = useSearchParams();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       const { role } = await loginWithCredentials(email, password);
//       const redirect = search?.get("redirect");
//       if (redirect && redirect.startsWith("/")) {
//         router.replace(redirect);
//       } else {
//         router.replace(
//           role === "admin" ? "/Admin" : role === "manager" ? "/Manager" : "/"
//         );
//       }
//     } catch (err: any) {
//       setError(err?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Minimal safe UI to avoid duplicate login page usage
//   return null;
// }
"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email);
      const normalized = email.trim().toLowerCase();
      if (normalized.includes("admin")) router.replace("/Admin");
      else if (normalized.includes("manager")) router.replace("/Manager");
      else if (normalized.includes("developer")) router.replace("/Developer");
      else if (normalized.includes("marketing")) router.replace("/Marketing");
      else router.replace("/");
    } catch (err) {
      setError(
        "Only mock emails are allowed: admin@, manager@, developer@, marketing@"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/60 backdrop-blur rounded-xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Login
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter your email 📧
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              // placeholder='admin@example.com'
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-primary text-white font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
