"use client";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme";
import { useLayoutEffect, useState } from "react";
import { instance } from "./auth";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }) {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter();

  useLayoutEffect(() => {
    function popUlate() {
      instance.accountDetails().then((d) => {
        setUser(d);
        setIsLoggedIn(true)
      }).catch(() => {
        setIsLoggedIn(false)
      });
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
          {isLoggedIn ? `${user.name} - ${user.email}` : ""}
        </h2>
        {isLoggedIn ? (
          <a
            className="text-blue-500 hover:text-blue-300 hover:cursor-pointer"
            onClick={() => {
              instance.logout();
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