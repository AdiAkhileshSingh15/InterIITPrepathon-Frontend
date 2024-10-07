"use client"
import { Modal, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
export default function Profile({open, setOpen} : {open : boolean, setOpen : React.Dispatch<React.SetStateAction<boolean>>}) {
    const [user, setUser] = useState<any | null>(null);
    const { data: session, status }: any = useSession();
    const [updatePassword, setUpdatePassword] = useState(false); 
    const [password, setPassword] = useState({oldPassword : '', password: '', confirmPassword: ''});
    useEffect(()=>{
        setUser(session?.user);
    },[session])

    const handleOnClick = async() => {
        if(password.password !== password.confirmPassword) {
            return alert("Passwords do not match");
        }
        const userId = session?.user?.id;
        try{
            const res = await axios.put(`/api/user/${userId}/update_password`, {
                oldPassword: password.oldPassword,
                newPassword: password.password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(res.status === 200) {
                alert("Password Updated Successfully");
                setUpdatePassword(false);
            }else{
                alert("Failed to update password");
            }
        }catch(err : any){
            alert(err?.message);
        }
    }
    // Can only update password if user is verified
    return (
        <div>

        {   
        user?.verified2fa && 
            <Modal open={open} onClose={()=>setOpen(false)}>
            <div className="flex flex-col justify-center h-screen">
                <Container className="rounded-lg text-background m-10 border-2 bg-gray-100">
                    <div className="flex justify-end">
                        <AiOutlineClose 
                        className="cursor-pointer text-red-500 mt-3 font-bold"
                        color="font-bold text-xl mt-2" onClick={()=>setOpen(false)} />
                    </div>
                    <div className="py-8 text-center font-satoshi text-3xl font-bold">Profile</div>
                    <div className="text-center items-center mb-10">
                        <div className="flex justify-center">
                            <Image src={user?.image} alt="Profile Image" height={70} width={70} className="rounded-full" />
                        </div>
                        {
                            JSON.stringify(user)
                        }
                        <div>
                            <div className="font-bold text-lg">{user?.name || "Name"}</div>
                            <div className="text-sm text-gray-500">{user?.email || "email"}</div>
                        </div>
                            <div className="flex justify-center">
                                <span className="bg-primary-orange cursor-pointer text-white rounded-md px-2 py-1 mt-4" onClick={()=>setUpdatePassword(!updatePassword)}>{updatePassword ? "Cancel Update" : "Update Pasword"}</span>
                            </div>
                        {updatePassword && (
                        <div className="divide-y divide-gray-200 mx-20">
                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <div className="relative">
                            <input type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Old Password" onChange={(e)=>setPassword({...password, oldPassword : e.target.value})} />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Old Password</label>
                            </div>
                            <div className="relative">
                            <input type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="New Password" onChange={(e)=>setPassword({...password, password : e.target.value})} />
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">New Password</label>
                            </div>
                            <div className="relative">
                            <input type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Confirm New Password" onChange={(e)=>setPassword({...password, confirmPassword : e.target.value})}/>
                            <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Confirm New Password</label>
                            </div>
                            <div className="relative">
                                <button className="bg-blue-500 w-full text-white rounded-md px-2 py-1 mt-4" onClick={handleOnClick}>Update password</button>
                            </div>
                        </div>
                    </div>
                        )}
                    </div>
                </Container>

            </div>
            </Modal>}
        </div>
    )
}