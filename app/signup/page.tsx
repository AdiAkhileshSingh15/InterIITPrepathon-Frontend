"use client";
import { signIn, getProviders, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
const providerIcons: Record<string, JSX.Element> = {
    Google: <Image src="assets/icons/google-icon.svg" alt="Google Icon" width={25} height={25} />,
    GitHub: <Image src="assets/icons/github-icon.svg" alt="GitHub Icon" width={25} height={25}/>,
    Slack: <Image src="assets/icons/slack-icon.svg" alt="Slack Icon" width={25} height={25} />,
};
export default function Signup() {

    const [providers, setProviders] = useState<any>(null);
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: '', username:'', password: '' });
    useEffect(() => {
        (async () => {
            const res: any = await getProviders();
            setProviders(res);
        })();
    }, []);

    const handleOnClick = async () => {
        try {
            const res = await axios.post('/api/user/new', credentials);
            console.log(res);
            if (res.status === 200) {
                router.push('/login');
                alert("User created successfully redirecting to login page");
            }
        } catch (error : any) {
            alert(error?.message);
        }
    }

    return (
        <div className='flex flex-col w-full items-center'>
            <div className=" flex flex-col justify-center sm:py-12">
                <div className="relative py-1 sm:max-w-xl sm:mx-auto">
                    <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                    </div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

                    <div className="max-w-md mx-auto">
                        <div className="text-center">
                        <h1 className="text-3xl font-bold font-inter">Sign up</h1>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <div className="relative">
                            <input type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" onChange={(e)=>setCredentials({...credentials, email:e.target.value})} />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                            </div>
                            <div className="relative">
                            <input type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Username" onChange={(e)=>setCredentials({...credentials, username:e.target.value})} />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                            </div>
                            <div className="relative">
                            <input type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" onChange={(e)=>setCredentials({...credentials, password:e.target.value})}  />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                            </div>
                            <div className="relative">
                                <button className="bg-primary-orange w-full text-white rounded-md px-2 py-1 mt-4" onClick={handleOnClick}>Submit</button>
                            </div>
                            <div className="text-sm text-center">
                                    Already a User? <Link href="/login" className="text-blue-500">Log in</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-evenly items-center space-x-2 w-80">
                        <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
                        <span className="flex-none uppercase text-md text-gray-900 mt-4 font-semibold">or</span>
                        <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
                    </div>
                        {providers && (
                        <div className='flex w-full flex-col mt-5'>
                            {Object.values(providers).map((provider: any) =>
                            (
                                provider.name !== "Credentials" &&
                                <button
                                    type='button'
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                    className='black-btn border-2 border-black rounded-md p-2 w-full text-center mb-2'
                                >
                                    <div className="flex justify-center items-center">
                                        Continue with {provider.name}
                                        &nbsp;
                                        &nbsp;
                                        {providerIcons[provider.name]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    </div>
                </div>
            </div>
        </div>
    );
}