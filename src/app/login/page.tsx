"use client"

import { login } from "@/lib/controllers/user-controller";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const loginHandler = async () => {
        let success = false
        try {
            await login({ email, password });
            success = true
            setErrMsg("");
        } catch (e) {
            setErrMsg(JSON.stringify(e))
            // setErrMsg("User not found or invalid credential.");
        }
        if (success) {
            redirect("/app")
        }
    }
    return <>
        <div className="flex items-center justify-center w-screen h-screen m-0">
            <div className="px-auto flex flex-col items-center justify-center">
                <div className="text-lg m-2">Login</div>
                <div >
                    <input className="text-black p-5 m-2 rounded-lg" type="email" value={email} placeholder={"E-mail"} onChange={e => setEmail(e.target.value)}></input>
                </div>
                <div >
                    <input className="text-black p-5 m-2 rounded-lg" type="password" value={password} placeholder={"Password"} onChange={e => setPassword(e.target.value)}></input>
                </div>
                <div>
                    <button className="bg-slate-100 hover:bg-slate-200 rounded-lg text-black p-5" onClick={loginHandler}>Login</button>
                </div>
                <div className="text-red min-h-10">
                    {errMsg}
                </div>
            </div>
        </div>
    </>
}