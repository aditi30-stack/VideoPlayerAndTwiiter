import Input from '@mui/joy/Input';
import { Label } from '../components/Label';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




export const Login = () =>{
    const [FormDataState, setFormDataState] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();
    const [error, setError] = useState("")
    


    const handleLogin = async(e) =>{
        e.preventDefault()

        try {
            
        const response = await axios.post("http://localhost:3000/api/v1/user/login", 
            FormDataState,
        
            {withCredentials: true}
        )
        
        if(response.data.data) {
            navigate("/")

        }
        }catch(e) {
            console.log(e)
            console.log("e is", e.response.data.message
            )
            e.response.data.message
            setError(e.response.data.message)
        }


    }

    const AddFormData = (e) =>{
        console.log(FormDataState)
        setFormDataState({...FormDataState,
            [e.target.name]: e.target.value
        })

    }

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);


    return (
        <div className="w-1/2 h-full mx-auto my-52 p-20">
            <form onSubmit={handleLogin}>
                <div className='mb-1.5'>
                <Label text={"Email*"}></Label>
                </div>
                <Input value={FormDataState.email} onChange={AddFormData} placeholder="Enter your email" name='email' variant="solid" />
                
                <div className='mt-3'>
                <Label text={"Password*"}></Label>
                <Input value={FormDataState.password} onChange={AddFormData} placeholder="Enter your Password" name='password' variant="solid" />

                </div>
                
                <div className='mt-4 w-full'>
                <Button type='Submit' className='w-full' variant="contained">Sign in with Email</Button>
                
                <div className='p-2'>
                Don't have an account?
                     <span className='underline ml-2'>
                     <Link to={"/Signup"}>Signup</Link>
                    </span>
                </div>

                </div>
                

            </form>
            
            {error && <span className='bg-red-500 font-bold'>{error}</span>}
            
            
        </div>
        

            
       
    )
}