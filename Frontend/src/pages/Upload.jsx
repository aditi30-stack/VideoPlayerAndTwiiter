import { Input } from "@mui/joy";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axioInstance, setupInterceptors } from "../interceptors";
import { Label } from "../components/Label";
import { Button } from "@mui/material";
import Textarea from '@mui/joy/Textarea';

export const Upload = () =>{
    const [FormDataState, setFormDataState] = useState({
        videoFile: null,
        thumbnail: null,
        title: "",
        description: "",
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [Error, setError] = useState("");

    useEffect(() => {
        setupInterceptors(navigate);
    }, [navigate]);

    
    const AddFormData = (e) =>{
        setFormDataState({
            ...FormDataState,
            [e.target.name]: e.target.value
        });
    };

    
    const HandleFormChange = (e) =>{
        setFormDataState({
            ...FormDataState,
            [e.target.name]: e.target.files[0]  
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("videoFile", FormDataState.videoFile);
        formData.append("thumbnail", FormDataState.thumbnail);
        formData.append("title", FormDataState.title);
        formData.append("description", FormDataState.description);
    
    
        try {
            setLoading(true);
            const videoResponse = await axioInstance.post('/video/upload', formData,
                
               );
                
            
            if(videoResponse.data){
                navigate("/")
            }
            setLoading(false);
            
            
        } catch (e) {
            console.log("Error during upload:", e);
            setError("Error while uploading!")
            setLoading(false);
        }
    };
    
    


    return (
        <div className="flex">
            <div>
                <Sidebar/>
            </div>

        <div className="min-w-[600px] w-1/2 mx-auto my-11 p-20 h-full bg-gray-800">
            
            <h1 className="font-semibold text-2xl p-2">Upload Your Video</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="w-1/2 p-2">
                    <Label text={"Title:"}></Label>
                    <Textarea onChange={AddFormData} name="title" placeholder="Title" variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Description:"}></Label>
                    <Textarea onChange={AddFormData} name="description" placeholder="Description" variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Thumbnail: "}></Label>
                    <Input onChange={HandleFormChange} name="thumbnail" type="file" variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text={"Video File: "}></Label>
                    <Input onChange={HandleFormChange} name="videoFile" type="file" variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Button type='submit' className='w-full' variant="contained">
                        {loading ? "Uploading..." : "Upload"}
                    </Button>
                </div>

                {Error && 
                    <p className="text-lg bg-red-500 w-1/2">
                        {Error}
                    </p>
                }
            </form>
        </div>
        </div>
    );
};
