import Input from '@mui/joy/Input';
import { Label } from "../components/Label"
import Sidebar from "../components/Sidebar"
import { Button } from '@mui/material';
import { useState } from 'react';
import { axioInstance } from '../interceptors';
import { useNavigate } from 'react-router-dom';

export const ChangePassword = () =>{
    const [UserPassword, setUserPassword] = useState({
        oldPassword: "",
        newPassword: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const AddPassword = (e) =>{
        setUserPassword({
            ...UserPassword,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordChange = async() =>{
        try{
            setLoading(true)
        const passwordChange = await axioInstance.patch(`user/changePassword`, UserPassword)
        console.log(passwordChange.data)
        await axioInstance.post('/user/logout')
        navigate("/login")
        setLoading(false)

        }catch(e) {
            setLoading(false)
            setError("Error resetting the password! Please try Again.")
            
        }
        

    }

    
    return (
        <div className="flex">
            <div>
                <Sidebar/>
            </div>
            <div className="w-[50vw] mx-auto mt-5 max-w-[50vw]">
                <h1 className="p-2 font-bold text-xl text-center">Change Your Password</h1>
                <div className='mt-3'>
                <Label text={"Password*"}></Label>
                <Input onChange={AddPassword} placeholder="Enter your Password" name='oldPassword' variant="solid" />

                </div>

                <div className='mt-3'>
                <Label text={"New Password*"}></Label>
                <Input onChange={AddPassword} placeholder="Enter your Password" name='newPassword' variant="solid" />

                </div>

                <div className='mt-4'>
                <Button onClick={handlePasswordChange} type='Submit' className='w-full' variant="contained">Change Your Password</Button>
                </div>
            </div>
        </div>
    )
}