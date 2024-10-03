"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        (async () => {
            const res: any = await getProviders();
            setProviders(res);
        })();
    }, []);

    return (
        <nav className='flex-between w-full mb-16 pt-3'>
            <Link href='/' className='flex gap-2 flex-center'>
                <Image
                    src='/assets/images/logo.png'
                    alt='logo'
                    width={30}
                    height={30}
                    className='object-contain'
                />
                <p className='logo_text'>Flare-Analyzer</p>
            </Link>

            {/* Desktop Navigation */}
            <div className='sm:flex hidden'>
                {session?.user ? (
                    <div className='flex gap-3 md:gap-5'>
                        <button type='button' onClick={() => signOut()} className='outline_btn'>
                            Sign Out
                        </button>

                        <Link href='/profile'>
                            <Image
                                src={session?.user.image || '/assets/images/profile.png'}
                                width={37}
                                height={37}
                                className='rounded-full'
                                alt='profile'
                            />
                        </Link>
                    </div>
                ) : (
                    <>
                        {providers &&
                            Object.values(providers).map((provider: any) => (
                                <button
                                    type='button'
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                    className='black_btn'
                                >
                                    {provider.name}
                                </button>
                            ))}
                    </>
                )}
            </div>

            {/* Mobile Navigation */}
            <div className='sm:hidden flex relative'>
                {session?.user ? (
                    <div className='flex'>
                        <Image
                            src={session?.user.image || '/assets/images/profile.png'}
                            width={37}
                            height={37}
                            className='rounded-full'
                            alt='profile'
                        />

                        <button
                            type='button'
                            onClick={() => signOut()}
                            className='mt-5 w-full black_btn'
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <>
                        {providers &&
                            Object.values(providers).map((provider: any) => (
                                <button
                                    type='button'
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                    className='black_btn'
                                >
                                    Sign in
                                </button>
                            ))}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Nav;