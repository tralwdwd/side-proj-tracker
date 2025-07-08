"use client";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./apiclient";

export default function ClientLayout({ children }) {
  const [user, setUser] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useLayoutEffect(() => {
    async function popUlate() {
      setLoading(true);
      setIsLoggedIn(await auth.isLoggedIn());
      setUser(await auth.currentUser());
      setLoading(false);
    }
    popUlate();
  }, []);

  return (
    <ThemeProvider>
      <Toaster
        toastOptions={{
          style: {
            background: "var(--modal-background)",
            color: "var(--toast-text)",
          },
        }}
        position="top-center"
      />
      <div className="flex justify-between w-full items-center p-2">
        <h2>
          {loading ? (
            <span className="inline-block h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
          ) : isLoggedIn ? (
            `${user.username} - ${user.email}`
          ) : (
            ""
          )}
        </h2>
        {loading ? (
          <span className="inline-block h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></span>
        ) : isLoggedIn ? (
          <a
            className="text-blue-500 hover:text-blue-300 hover:cursor-pointer"
            onClick={async () => {
              await auth.logout();
              setUser({});
              setIsLoggedIn(false);
            }}
          >
            Logout
          </a>
        ) : (
          <button
            className="text-blue-500 hover:text-blue-300 hover:cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
      {children}
    </ThemeProvider>
  );
}