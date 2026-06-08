"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, signup } from "@/app/actions/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const action = isLogin ? login : signup;
    const res = await action(formData);
    
    // Server action only returns if there was an error (otherwise it redirects)
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden">
            <Image src="/logo.png" alt="Apprising Logo" width={80} height={80} className="object-contain" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
          Welcome to Apprising Lead Manager
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? "Sign in to access your pipeline" : "Create an account to get started"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/40 sm:rounded-3xl sm:px-10 border border-slate-100">
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1.5">
                <Input name="email" type="email" required className="w-full h-11" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1.5">
                <Input name="password" type="password" required className="w-full h-11" placeholder="••••••••" />
              </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 text-base shadow-md font-semibold" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
