"use client";
import { signIn, getProviders, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { FaGoogle, FaGithub, FaSlack } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const providerIcons: Record<string, JSX.Element> = {
    Google: <FaGoogle />,
    GitHub: <FaGithub />,
    Slack: <FaSlack />,
};

export default function Login() {
    const [providers, setProviders] = useState<any>(null);
    const { data: session } = useSession();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            const send2fa = async () => {
                await axios.post('/api/user/2fa', { email: session?.user?.email }, {
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then((res) => {
                        console.log(res);
                        setQrCode(res.data.qrCode);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            send2fa();
        }
    }
        , [session]);

    // Fetch the authentication providers
    useEffect(() => {
        (async () => {
            const res: any = await getProviders();
            setProviders(res);
        })();
    }, []);

    const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // @ts-ignore
        const otp = event.target[0].value;

        try {
            const res = await axios.post('/api/user/2fa/verify-otp', {
                email: session?.user?.email,
                token: otp,
            });

            if (res.data.success) {
                router.push('/');
            } else {
                alert('Invalid OTP');
            }
        } catch (err) {
            console.error('Error verifying OTP', err);
            alert('An error occurred. Please try again.');
        }
    };



    return (
        <div className='flex flex-col w-full items-center'>
            {session?.user ?
                (qrCode && <div className='flex flex-col mt-10'>
                    <Image
                        src={qrCode}
                        width={150}
                        height={150}
                        className='rounded-full'
                        alt='QR Code for 2FA'
                    />
                    <form onSubmit={handleVerifyOtp}>
                        <input type="text" placeholder="Enter OTP" required />
                        <button type="submit">Verify OTP</button>
                    </form>
                </div>) :
                (<>
                    <Typography variant="h1" className='head_text text-center'>
                        Login
                    </Typography>
                    {providers && (
                        <div className='flex flex-col mt-10'>
                            {Object.values(providers).map((provider: any) =>
                            (
                                <button
                                    type='button'
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                    className='black-btn border-2 border-black rounded-md p-2 w-40 text-center mb-2'
                                >
                                    <div className="flex justify-center items-center">
                                        {provider.name}
                                        &nbsp;
                                        &nbsp;
                                        {providerIcons[provider.name]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </>)
            }
        </div>
    );
}
