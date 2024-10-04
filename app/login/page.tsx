"use client";
import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { FaGoogle, FaGithub, FaSlack } from "react-icons/fa";

const providerIcons: Record<string, JSX.Element> = {
    Google: <FaGoogle />,
    GitHub: <FaGithub />,
    Slack: <FaSlack />,
};

export default function Login() {
    const [providers, setProviders] = useState<any>(null);

    // Fetch the authentication providers
    useEffect(() => {
        (async () => {
            const res: any = await getProviders();
            setProviders(res);
        })();
    }, []);

    return (
        <div className='flex flex-col w-full items-center'>
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
                            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                            className='black-btn border-2 border-black rounded-md p-2 w-40 text-center mb-2'
                        >
                            <div className="flex justify-center items-center">
                                {provider.name}
                                &nbsp;
                                &nbsp;
                                {providerIcons[provider.name]}
                            </div>
                        </button>
                    )
                    )}
                </div>
            )}
        </div>
    );
}
