"use client";
import { useEffect, useState } from "react";
import { account, client, instance } from "../auth";
import { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import  Link  from "next/link"


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [error, setError] = useState("")

    useEffect(()=>{
        async function getSession() {
            instance.isLoggedIn().then(
                (r) =>{
                    if(r) {
                        setIsLoggedIn(true)
                        window.location.replace("/")
                    }
                    else {
                        setIsLoggedIn(false)
                    }
                }
            )
        }
        getSession()
    }, [])
    if (isLoggedIn) {
        return null;
    }
    return (
        <div className="flex min-h-screen w-full items-center justify-center flex-col">
            <h1 className="text-4xl">Sign In to save and fetch your projects!</h1>
    <div className="w-2/3 max-w-2/3 mt-8 items-stretch justify-center justify-items-center">
            <form>
            <input type="text" className="w-full h-10 px-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white " placeholder='Email' value={username} onChange={(n)=> setUsername(n.target.value)}/>
            <input type="password" className="w-full h-10 px-2 mt-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white " placeholder='Password' value={password} onChange={(d)=>setPassword(d.target.value)}/>
            <button type='button' className='w-full h-10 mt-2 rounded-md bg-blue-500 text-white font-medium cursor-pointer' onClick={async () =>{
                instance.login(username, password).then((u)=>{
                    if(u != null) {
                        setError(u.message)
                    }
                })
              
            }}>Login</button>
            <h4 className="mt-2">No account? <Link className="text-blue-500 hover:text-blue-300 hover:cursor-pointer" href={"/signup"}>Sign Up</Link></h4>
            <h4 className="mt-5 text-red-500">{error}</h4>
            </form>
        </div>
        </div>
        )
}