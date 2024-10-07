"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
export default function ResetPassword({searchParams} : {searchParams : {[string : string] : string}}) {
    const token = searchParams['token']
    const router = useRouter();
    const [password, setPassword] = useState({password : '', confirm_password : ''});

    const handleOnClick = async()=>{
        if(password.password !== password.confirm_password) {
            return alert("Passwords do not match");
        }
        try{
            const res = await axios.put('/api/user/password_recovery', {token : token, password : password.password});
            if(res.data.status === 200) {
                setTimeout(()=>router.push('/login'), 1000)
                return alert(res.data + "Redirecting to Login Page")
            }else {
                return alert(res.data)
            }
        }catch(err : any) {
            return alert(err?.message)
        }
    }

    return(
        <div>
            <div className=" flex flex-col justify-center sm:py-12">
                    <div className="relative py-1 sm:max-w-xl sm:mx-auto">
                        <div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                        </div>
                        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

                        <div className="max-w-md mx-auto">
                            <div className="text-center">
                            <h1 className="text-3xl font-bold font-inter">Reset Password</h1>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                <input type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" onChange={(e)=>setPassword({...password, password : e.target.value})} />
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                <div className="relative">
                                <input type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="COnfirm Password" onChange={(e)=>setPassword({...password, confirm_password : e.target.value})}/>
                                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Confirm Password</label>
                                </div>
                                <div className="relative">
                                    <button className="bg-primary-orange w-full text-white rounded-md px-2 py-1 mt-4" onClick={handleOnClick}>Reset password</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
        </div>
    )

}