"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";

type FormData = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data);

    // Fake API
    setTimeout(() => {
      document.cookie = "token=12345; path=/";
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--background)]">
      <div className="bg-[var(--sidebar-bg)] p-8 rounded shadow w-96 border border-[var(--border-color)]">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name (Signup only) */}
          {!isLogin && (
            <div>
              <div className="flex items-center border rounded px-2">
                <User size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 outline-none bg-transparent"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <div className="flex items-center border rounded px-2">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 outline-none bg-transparent"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center border rounded px-2">
              <Lock size={18} className="text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 outline-none bg-transparent"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white p-2 rounded"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-[var(--primary)] font-medium"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
