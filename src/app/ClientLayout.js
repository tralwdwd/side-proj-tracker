"use client";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./apiclient";

export default function ClientLayout({ children }) {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter();

  useLayoutEffect(() => {
    async function popUlate() {
      setIsLoggedIn(await auth.isLoggedIn())
      setUser(await auth.currentUser())
      console.log(await auth.currentUser())
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
          {isLoggedIn ? `${user.username} - ${user.email}` : ""}
        </h2>
        {isLoggedIn ? (
          <a
            className="text-blue-500 hover:text-blue-300 hover:cursor-pointer"
            onClick={async() => {
              await auth.logout()
              setUser({});
              setIsLoggedIn(false)
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
