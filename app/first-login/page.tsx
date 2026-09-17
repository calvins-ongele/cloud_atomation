"use client";
import React, { useState } from "react";
export default function FirstLoginPage() {
  const [form, setForm] = useState({
    projectId: "",
    emails: "",
    chromium_profile: "",
    endpoint: "",
    timeout: 30000,
    debug: true,
  });

  async function submitForm() {
    try {
      const response = await fetch("/api/automate", {   
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Login Page</h1>
      <section className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form className="space-y-4 p-4">
          <div className="relative mt-6">
            <label
              htmlFor="projectId"
              className="mt-1 block text-sm font-medium text-gray-700"
            >
              Project ID
            </label>
            <input
              type="projectId"
              id="projectId"
              name="projectId"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="block h-10 w-full appearance-none rounded-lg bg-white px-3 sm:text-sm dark:bg-white/5 outline -outline-offset-1 outline-gray-950/15 dark:outline-white/25 focus:outline-gray-950 dark:focus:outline-white data-error:outline-rose-500 dark:data-error:outline-rose-400"
              placeholder="Enter your project ID"
              required={true}
            />
          </div>

          <div className="relative mt-6">
            <label
              htmlFor="email"
              className="mt-1 block text-sm/6 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.emails}
              onChange={(e) => setForm({ ...form, emails: e.target.value })}
              className="block h-10 w-full appearance-none rounded-lg bg-white px-3 sm:text-sm dark:bg-white/5 outline -outline-offset-1 outline-gray-950/15 dark:outline-white/25 focus:outline-gray-950 dark:focus:outline-white data-error:outline-rose-500 dark:data-error:outline-rose-400"
              placeholder="Enter your email"
            />
          </div>

          
          <div className="relative mt-6 mb-4">
            <label
              htmlFor="chromium_profile"
              className="mt-1 block text-sm/6 font-medium text-gray-700"
            >
              Profile Directory
            </label>
            <input
              type="chromium_profile"
              id="chromium_profile"
              name="chromium_profile"
              value={form.chromium_profile}
              onChange={(e) => setForm({ ...form, chromium_profile: e.target.value })}
              className="block h-10 w-full appearance-none rounded-lg bg-white px-3 sm:text-sm dark:bg-white/5 outline -outline-offset-1 outline-gray-950/15 dark:outline-white/25 focus:outline-gray-950 dark:focus:outline-white data-error:outline-rose-500 dark:data-error:outline-rose-400"
              placeholder="Enter your profile directory"
            />
          </div>

            <div className="relative mt-6">
                <button className="btn-primary w-full" type="button" onClick={() => submitForm()}>
                    Login
                </button>
            </div>
       






        </form>
      </section>
    </div>
  );
}
