"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Profile from "./Profile";

const Nav = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    return (
        <>
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


                        <Image
                            src={session?.user.image || '/assets/images/profile.png'}
                            width={37}
                            height={37}
                            className='rounded-full cursor-pointer'
                            alt='profile'
                            onClick={()=>setOpen(!open)}
                        />

                    </div>
                ) : null}
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
                            onClick={()=>setOpen(!open)}
                        />

                        <button
                            type='button'
                            onClick={() => signOut()}
                            className='mt-5 w-full black_btn'
                        >
                            Sign Out
                        </button>
                    </div>
                ) : null}
            </div>
        </nav>
        <Profile open={open} setOpen={setOpen} />
        </>
    );
};

export default Nav;