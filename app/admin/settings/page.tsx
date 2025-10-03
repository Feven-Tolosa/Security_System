"use client";

import { useState, useEffect } from "react";

interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  role: string;
  lastLogin: string;
  createdAt: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  loginAlerts: boolean;
  currentPasswordHash: string;
}

interface SystemPreferences {
  theme: "dark" | "light" | "system";
  emailNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
}

// Consistent hash function
const simpleHash = (password: string): string => {
  let hash = 0;
  if (password.length === 0) return hash.toString();
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "system">(
    "profile"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Default password hash for "admin123"
  const DEFAULT_PASSWORD_HASH = simpleHash("admin123");

  const [profile, setProfile] = useState<AdminProfile>({
    id: "admin-001",
    fullName: "Admin User",
    email: "admin@securesystems.com",
    avatar: null,
    role: "Super Administrator",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-15T09:00:00Z",
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    passwordLastChanged: new Date().toISOString(),
    loginAlerts: true,
    currentPasswordHash: DEFAULT_PASSWORD_HASH,
  });

  const [system, setSystem] = useState<SystemPreferences>({
    theme: "dark",
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: "weekly",
  });

  const [profileForm, setProfileForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: security.twoFactorEnabled,
    loginAlerts: security.loginAlerts,
  });

  const [systemForm, setSystemForm] = useState(system);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar
  );
  const [messages, setMessages] = useState<{
    type: string;
    text: string;
  } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedProfile = localStorage.getItem("admin-profile");
        const savedSecurity = localStorage.getItem("admin-security");
        const savedSystem = localStorage.getItem("admin-system");

        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setProfileForm({
            fullName: parsedProfile.fullName,
            email: parsedProfile.email,
          });
        }

        if (savedSecurity) {
          const parsedSecurity = JSON.parse(savedSecurity);
          // Ensure we have a valid password hash
          const securityWithHash = {
            ...parsedSecurity,
            currentPasswordHash:
              parsedSecurity.currentPasswordHash || DEFAULT_PASSWORD_HASH,
          };
          setSecurity(securityWithHash);
          setSecurityForm((prev) => ({
            ...prev,
            twoFactorEnabled: securityWithHash.twoFactorEnabled,
            loginAlerts: securityWithHash.loginAlerts,
          }));
        }

        if (savedSystem) {
          const parsedSystem = JSON.parse(savedSystem);
          setSystem(parsedSystem);
          setSystemForm(parsedSystem);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Update avatar preview when profile changes
  useEffect(() => {
    setAvatarPreview(profile.avatar);
  }, [profile.avatar]);

  // Real-time password strength checker
  useEffect(() => {
    if (!securityForm.newPassword) {
      setPasswordStrength({ score: 0, feedback: "" });
      return;
    }

    const strength = checkPasswordStrength(securityForm.newPassword);
    setPasswordStrength(strength);
  }, [securityForm.newPassword]);

  // Password strength checker function
  const checkPasswordStrength = (
    password: string
  ): { score: number; feedback: string } => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Lowercase letters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Uppercase letters");
    }

    // Numbers check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Numbers");
    }

    // Special characters check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Special characters");
    }

    // Length bonus
    if (password.length >= 12) {
      score += 1;
    }

    const strengthText =
      score >= 5
        ? "Very Strong"
        : score >= 4
        ? "Strong"
        : score >= 3
        ? "Good"
        : score >= 2
        ? "Fair"
        : "Weak";

    return {
      score: Math.min(score, 6) / 6, // Normalize to 0-1
      feedback:
        feedback.length > 0 ? `Missing: ${feedback.join(", ")}` : strengthText,
    };
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSecurityForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Apply security settings immediately for real-time feedback
    if (type === "checkbox") {
      const updatedSecurity = {
        ...security,
        [name]: checked,
      };
      setSecurity(updatedSecurity);
      localStorage.setItem("admin-security", JSON.stringify(updatedSecurity));
    }
  };

  const handleSystemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSystemForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessages({ type: "error", text: "File size must be less than 5MB" });
        setTimeout(() => setMessages(null), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        // Apply avatar immediately
        const updatedProfile = { ...profile, avatar: result };
        setProfile(updatedProfile);
        localStorage.setItem("admin-profile", JSON.stringify(updatedProfile));
        setMessages({ type: "success", text: "Profile photo updated!" });
        setTimeout(() => setMessages(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    const updatedProfile = { ...profile, avatar: null };
    setProfile(updatedProfile);
    localStorage.setItem("admin-profile", JSON.stringify(updatedProfile));
    setMessages({ type: "success", text: "Profile photo removed" });
    setTimeout(() => setMessages(null), 3000);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileForm.email)) {
        setMessages({
          type: "error",
          text: "Please enter a valid email address",
        });
        setTimeout(() => setMessages(null), 3000);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedProfile = {
        ...profile,
        fullName: profileForm.fullName,
        email: profileForm.email,
        avatar: avatarPreview,
        lastLogin: new Date().toISOString(),
      };

      setProfile(updatedProfile);
      localStorage.setItem("admin-profile", JSON.stringify(updatedProfile));

      // Update page title immediately
      document.title = `${profileForm.fullName} - Secure Systems Admin`;

      setMessages({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessages({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessages(null), 3000);
    }
  };

  const saveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Require current password and basic new password checks; server validates correctness
      if (!securityForm.currentPassword) {
        setMessages({
          type: "error",
          text: "Please enter your current password",
        });
        setTimeout(() => setMessages(null), 3000);
        return;
      }

      // If changing password, validate new password
      if (securityForm.newPassword) {
        if (securityForm.newPassword.length < 8) {
          setMessages({
            type: "error",
            text: "Password must be at least 8 characters long!",
          });
          setTimeout(() => setMessages(null), 3000);
          return;
        }

        if (securityForm.newPassword !== securityForm.confirmPassword) {
          setMessages({ type: "error", text: "New passwords do not match!" });
          setTimeout(() => setMessages(null), 3000);
          return;
        }

        if (securityForm.newPassword === securityForm.currentPassword) {
          setMessages({
            type: "error",
            text: "New password must be different from current password",
          });
          setTimeout(() => setMessages(null), 3000);
          return;
        }

        if (passwordStrength.score < 0.5) {
          setMessages({
            type: "error",
            text: "Please choose a stronger password",
          });
          setTimeout(() => setMessages(null), 3000);
          return;
        }
      }

      // If changing password, call API to persist immediately (server validates current password)
      if (securityForm.newPassword) {
        const apiRes = await fetch("/api/admin/password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current: securityForm.currentPassword,
            next: securityForm.newPassword,
          }),
        });
        if (!apiRes.ok) {
          const body = await apiRes.json().catch(() => ({}));
          throw new Error(body?.error || "Failed to change password");
        }
      } else {
        // Simulate non-password security update
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const updatedSecurity = {
        twoFactorEnabled: securityForm.twoFactorEnabled,
        loginAlerts: securityForm.loginAlerts,
        passwordLastChanged: new Date().toISOString(),
        // Maintain a client-side marker only; server is authoritative
        currentPasswordHash: securityForm.newPassword
          ? simpleHash(securityForm.newPassword)
          : security.currentPasswordHash,
      };

      console.log(
        "Updating security with new hash:",
        updatedSecurity.currentPasswordHash
      );

      setSecurity(updatedSecurity);
      localStorage.setItem("admin-security", JSON.stringify(updatedSecurity));

      // Clear password fields only if password was successfully changed
      if (securityForm.newPassword) {
        setSecurityForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        setMessages({
          type: "success",
          text: "Password changed successfully!",
        });

        // Real-time security features
        if (securityForm.twoFactorEnabled && !security.twoFactorEnabled) {
          setTimeout(() => {
            setMessages({
              type: "info",
              text: "Two-factor authentication enabled! You'll need to use an authenticator app for your next login.",
            });
          }, 2000);
        }
      } else {
        setMessages({
          type: "success",
          text: "Security settings updated successfully!",
        });
      }
    } catch (error) {
      setMessages({
        type: "error",
        text: "Failed to update security settings",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessages(null), 3000);
    }
  };

  const saveSystem = (e: React.FormEvent) => {
    e.preventDefault();
    setSystem(systemForm);
    localStorage.setItem("admin-system", JSON.stringify(systemForm));
    // Apply theme immediately to Admin dashboard
    const root = document.documentElement;
    if (systemForm.theme === "light") {
      root.classList.remove("dark");
      // Custom light tint for admin dashboard
      root.style.setProperty("--admin-bg", "#f7fafc");
      root.style.setProperty("--admin-card", "#ffffff");
      root.style.setProperty("--admin-text", "#0f172a");
    } else if (systemForm.theme === "dark") {
      root.classList.add("dark");
      root.style.removeProperty("--admin-bg");
      root.style.removeProperty("--admin-card");
      root.style.removeProperty("--admin-text");
    }
    setMessages({
      type: "success",
      text: "System preferences updated successfully!",
    });
    setTimeout(() => setMessages(null), 3000);
  };

  // Real-time apply when toggling controls (backup/theme) before save
  useEffect(() => {
    // Theme live preview
    const root = document.documentElement;
    if (systemForm.theme === "light") {
      root.classList.remove("dark");
      root.style.setProperty("--admin-bg", "#f7fafc");
      root.style.setProperty("--admin-card", "#ffffff");
      root.style.setProperty("--admin-text", "#0f172a");
    } else if (systemForm.theme === "dark") {
      root.classList.add("dark");
      root.style.removeProperty("--admin-bg");
      root.style.removeProperty("--admin-card");
      root.style.removeProperty("--admin-text");
    }

    // Persist to localStorage for real-time status (only theme + backup)
    try {
      const { theme, autoBackup, backupFrequency } = systemForm;
      localStorage.setItem(
        "admin-system",
        JSON.stringify({ theme, autoBackup, backupFrequency })
      );
    } catch {}
  }, [systemForm.theme, systemForm.autoBackup, systemForm.backupFrequency]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Password strength color indicator
  const getPasswordStrengthColor = (score: number) => {
    return score >= 0.8
      ? "bg-green-500"
      : score >= 0.6
      ? "bg-blue-500"
      : score >= 0.4
      ? "bg-yellow-500"
      : score >= 0.2
      ? "bg-orange-500"
      : "bg-red-500";
  };

  // Reset to default password function (for testing)
  const resetToDefaultPassword = () => {
    const resetSecurity = {
      ...security,
      currentPasswordHash: DEFAULT_PASSWORD_HASH,
      passwordLastChanged: new Date().toISOString(),
    };
    setSecurity(resetSecurity);
    localStorage.setItem("admin-security", JSON.stringify(resetSecurity));
    setMessages({ type: "info", text: "Password reset to default: admin123" });
    setTimeout(() => setMessages(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        Admin Settings
      </h1>

      {/* Status Message */}
      {messages && (
        <div
          className={`mb-6 p-3 rounded-lg text-center font-medium transition-all ${
            messages.type === "success"
              ? "bg-green-900/30 text-green-300 border border-green-500/50"
              : messages.type === "error"
              ? "bg-red-900/30 text-red-300 border border-red-500/50"
              : "bg-blue-900/30 text-blue-300 border border-blue-500/50"
          }`}
        >
          {messages.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 justify-center">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === "profile"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === "security"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === "system"
              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          System
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30 shadow-xl">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Profile Settings
              </h2>
              <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium">
                {profile.role}
              </span>
            </div>

            <form onSubmit={saveProfile} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-400">
                        {profile.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex-grow">
                  <label className="block mb-2 text-gray-300">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full text-gray-300 bg-gray-700 px-4 py-2 rounded-lg border border-gray-600/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or GIF. Max 5MB. Changes apply immediately.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required
                    minLength={2}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <span className="block mb-1">Member Since</span>
                  <span className="text-gray-300">
                    {formatDate(profile.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="block mb-1">Last Login</span>
                  <span className="text-gray-300">
                    {formatDate(profile.lastLogin)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Security Settings
              </h2>
              <button
                onClick={resetToDefaultPassword}
                className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-medium hover:bg-yellow-800/30 transition-colors"
                title="Reset password to default (admin123)"
              >
                Reset Password
              </button>
            </div>

            <form onSubmit={saveSecurity} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-300">
                    Password Management
                  </h3>

                  <div>
                    <label className="block mb-2 text-gray-300">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter current password"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default password:{" "}
                      <code className="bg-gray-700 px-1 rounded">admin123</code>
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter new password (min 8 characters)"
                      minLength={8}
                    />

                    {/* Password Strength Indicator */}
                    {securityForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">
                            Password Strength:
                          </span>
                          <span
                            className={`${
                              passwordStrength.score >= 0.8
                                ? "text-green-400"
                                : passwordStrength.score >= 0.6
                                ? "text-blue-400"
                                : passwordStrength.score >= 0.4
                                ? "text-yellow-400"
                                : passwordStrength.score >= 0.2
                                ? "text-orange-400"
                                : "text-red-400"
                            }`}
                          >
                            {passwordStrength.feedback}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                              passwordStrength.score
                            )}`}
                            style={{
                              width: `${passwordStrength.score * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border transition-colors ${
                        securityForm.newPassword && securityForm.confirmPassword
                          ? securityForm.newPassword ===
                            securityForm.confirmPassword
                            ? "border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            : "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      }`}
                      placeholder="Confirm new password"
                    />
                    {securityForm.newPassword &&
                      securityForm.confirmPassword && (
                        <p
                          className={`text-xs mt-1 ${
                            securityForm.newPassword ===
                            securityForm.confirmPassword
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {securityForm.newPassword ===
                          securityForm.confirmPassword
                            ? "✓ Passwords match"
                            : "✗ Passwords do not match"}
                        </p>
                      )}
                  </div>

                  <div className="text-sm text-gray-400">
                    <span className="block mb-1">Last Changed</span>
                    <span className="text-gray-300">
                      {formatDate(security.passwordLastChanged)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-300">
                    Security Features
                  </h3>

                  <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600/30">
                    <input
                      type="checkbox"
                      name="twoFactorEnabled"
                      checked={securityForm.twoFactorEnabled}
                      onChange={handleSecurityChange}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-400 rounded focus:ring-blue-500 transition-colors"
                    />
                    <div>
                      <label className="text-gray-200 font-medium">
                        Two-Factor Authentication
                      </label>
                      <p className="text-sm text-gray-400 mt-1">
                        {securityForm.twoFactorEnabled
                          ? "🟢 Enabled"
                          : "🔴 Disabled"}{" "}
                        • Add an extra layer of security
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600/30">
                    <input
                      type="checkbox"
                      name="loginAlerts"
                      checked={securityForm.loginAlerts}
                      onChange={handleSecurityChange}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-400 rounded focus:ring-blue-500 transition-colors"
                    />
                    <div>
                      <label className="text-gray-200 font-medium">
                        Login Alerts
                      </label>
                      <p className="text-sm text-gray-400 mt-1">
                        {securityForm.loginAlerts ? "🟢 Active" : "🔴 Inactive"}{" "}
                        • Get notified of new sign-ins
                      </p>
                    </div>
                  </div>

                  {/* Real-time Security Status */}
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <h4 className="text-gray-200 font-medium mb-2">
                      Security Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Password Strength:
                        </span>
                        <span
                          className={
                            securityForm.newPassword
                              ? passwordStrength.score >= 0.8
                                ? "text-green-400"
                                : passwordStrength.score >= 0.6
                                ? "text-blue-400"
                                : passwordStrength.score >= 0.4
                                ? "text-yellow-400"
                                : "text-red-400"
                              : "text-gray-400"
                          }
                        >
                          {securityForm.newPassword
                            ? passwordStrength.feedback
                            : "Not changed"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">2FA Status:</span>
                        <span
                          className={
                            securityForm.twoFactorEnabled
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {securityForm.twoFactorEnabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Login Alerts:</span>
                        <span
                          className={
                            securityForm.loginAlerts
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {securityForm.loginAlerts ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                {isLoading ? "Updating..." : "Update Security Settings"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">
              System Preferences
            </h2>

            <form onSubmit={saveSystem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-300">Theme</label>
                    <select
                      name="theme"
                      value={systemForm.theme}
                      onChange={(e) =>
                        handleSystemChange(
                          e as React.ChangeEvent<HTMLSelectElement>
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600/30">
                    <input
                      type="checkbox"
                      name="autoBackup"
                      checked={systemForm.autoBackup}
                      onChange={handleSystemChange}
                      className="w-4 h-4 text-blue-500 bg-gray-600 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <div>
                      <label className="text-gray-200 font-medium">
                        Automatic Backups
                      </label>
                      <p className="text-sm text-gray-400 mt-1">
                        Automatically backup system data
                      </p>
                    </div>
                  </div>

                  {systemForm.autoBackup && (
                    <div>
                      <label className="block mb-2 text-gray-300">
                        Backup Frequency
                      </label>
                      <select
                        name="backupFrequency"
                        value={systemForm.backupFrequency}
                        onChange={(e) =>
                          handleSystemChange(
                            e as React.ChangeEvent<HTMLSelectElement>
                          )
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/30">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
