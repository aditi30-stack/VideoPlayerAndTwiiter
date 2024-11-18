import { Label } from "../components/Label";
import Input from '@mui/joy/Input';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Signup = () => {
    const [FormDataState, setFormDataState] = useState({
        username: "",
        email: "",
        fullname: "",
        avatar: null,
        coverImage: null,
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [Error, setError] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();

       
        const formData = new FormData();
        formData.append('username', FormDataState.username);
        formData.append('email', FormDataState.email);
        formData.append('fullname', FormDataState.fullname);
        formData.append('password', FormDataState.password);
        formData.append('avatar', FormDataState.avatar); 
        formData.append('coverImage', FormDataState.coverImage); 

        try {
            setLoading(true);
            setError("")
            
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/register", 
                formData, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );
            
            setError("")
            setFormDataState({
                username: "",
                email: "",
                fullname: "",
                avatar: null,
                coverImage: null,
                password: ""
            });
        } catch (e) {
            setError("Error in Registration")
        } finally {
            setLoading(false);
            
            
        }
    };

    const AddFormData = (e) => {
        setFormDataState({
            ...FormDataState,
            [e.target.name]: e.target.value
        });
    };

    const HandleFormChange = (e) => {
        
        setFormDataState({
            ...FormDataState,
            [e.target.name]: e.target.files[0] 
        });
    };

    return (
        <div className="w-1/2 mx-auto my-11 p-20 h-full bg-gray-800">
            <form onSubmit={handleFormSubmit}>
                <div className="w-1/2 p-2">
                    <Label text={"Full Name: "}></Label>
                    <Input onChange={AddFormData} name="fullname" value={FormDataState.fullname} placeholder="Enter your fullname" variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Username: "}></Label>
                    <Input onChange={AddFormData} name="username" value={FormDataState.username} placeholder="Enter your Username..." variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Email: "}></Label>
                    <Input onChange={AddFormData} name="email" value={FormDataState.email} placeholder="Enter your Email..." variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Password: "}></Label>
                    <Input onChange={AddFormData} name="password" value={FormDataState.password} placeholder="Enter your Password..." variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Avatar: "}></Label>
                    <Input onChange={HandleFormChange} name="avatar" type="file" placeholder="Upload your avatar image..." variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Cover Image: "}></Label>
                    <Input onChange={HandleFormChange} name="coverImage" type="file" variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Button type="Submit" className='w-full' variant="contained">
                        {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                </div>

                <div className="w-1/2 p-2">
                    Already have an account?
                    <span className='underline ml-2'>
                        <Link to={"/login"}>Login</Link>
                    </span>
                </div>

                {Error && 
                <p className="text-lg bg-red-500 w-1/2">
                {Error}
                </p>}
            </form>
        </div>
    );
}
