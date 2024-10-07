"use client"

import axios from "axios"
import Link from "next/link"
import { useState } from "react"
export default function PasswordRecovery() {
    
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    async function sendRecoveryCode() {
        // Send recovery code to email
        setLoading(true)
        try{
            const res = await axios.post('/api/user/password_recovery', {email : email});
            setLoading(false)
            if(res.data.status === 200) {
                return alert(res.data)
            }else {
                return alert(res.data)
            }
        }catch(err : any) {
            setLoading(false)
            return alert(err?.message)
        }
    }
    return (
        <div>
            <div className=" flex flex-col justify-center sm:py-12">
                    <div className="relative py-1 sm:max-w-xl sm:mx-auto">
                        <div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                        </div>
                        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

                        <div className="max-w-md mx-auto">
                            <div className="text-center">
                            <h1 className="text-3xl font-bold font-inter">Password Recovery</h1>
                            </div>
                        </div>
                        <div className="mt-2 text-center text-red-500">
                            Enter a valid email that you used to sign up for an account. We will send you a recovery code to reset your password.
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                <input type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" onChange={(e)=>setEmail(e.target.value)} />
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                                </div>
                                <div className="relative">
                                    <button className="bg-primary-orange w-full text-white rounded-md px-2 py-1 mt-4" disabled={loading} onClick={sendRecoveryCode}>Send Recovery Code</button>
                                </div>
                                <div className="mt-2 text-center text-sm">
                                   Return to <Link href={'/login'} className="text-blue-500" >Signin</Link>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
        </div>
    )
}