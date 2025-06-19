"use client";
import { useEffect, useState } from "react";
import { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppwriteException, ID } from "appwrite";
import { auth } from "../apiclient";


export default function Login() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("")
    

    useEffect(()=>{
        async function getSession() {
            let r = await auth.isLoggedIn() 
                    if(r) {
                        setIsLoggedIn(true)
                        window.location.replace("/")
                        console.log(r)
                    }
                    else {
                        setIsLoggedIn(false)
                    }
        }
        getSession()
    }, [])
    if(isLoggedIn) {
        return null;
    }
    return (
        <div className="flex min-h-screen w-full items-center justify-center flex-col">
            <h1 className="text-4xl">Sign Up to save and fetch your projects!</h1>
    <div className="w-2/3 mt-8 items-stretch justify-center justify-items-center">
            <input type="text" autoComplete="off" className="w-full h-10 px-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white " placeholder='Email' value={email} onChange={(n)=> setEmail(n.target.value)}/>
            <input type="text" autoComplete="off" className="w-full h-10 mt-2 px-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white " placeholder='Username' value={username} onChange={(n)=> setUsername(n.target.value)}/>
            <input type="password" autoComplete="new-password" className="w-full h-10 px-2 mt-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white " placeholder='Password' value={password} onChange={(d)=>setPassword(d.target.value)}/>
            <button type='button' className='w-full h-10 mt-2 rounded-md bg-blue-500 text-white font-medium cursor-pointer' onClick={async () =>{
                let c = await auth.signUp(email, username, password)
                let r = await c.json()
                if(r.status !== 200) {
                    setError(r.message)
                } else {
                    redirect("/")
                }
              
            }}>Sign Up</button>
            <h4 className="mt-2">Already have an account? <Link className="text-blue-500 hover:text-blue-300 hover:cursor-pointer" href={"/login"}>Login</Link></h4>
            <h4 className="mt-5 text-red-500">{error}</h4>
        </div>
        </div>
        )
}