import { Textarea } from "@mui/joy";
import { Button } from "@mui/material";
import { useState } from "react";
import { axioInstance } from "../interceptors";

export const CreatePlaylist = ({onChange, onSuccess}) =>{

    const [Form, setForm] = useState({
        title: "",
        description: ""
    });

    
    const handleChange = (e) => {
        console.log(Form)
        const { name, value } = e.target;
        setForm({
            ...Form,
            [name]: value
        });
    };

    const trueValue = Form.name === "" || Form.description === "";

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try {
        const response = axioInstance.post("/playlist", Form)
        console.log("form is", response)
        onSuccess()
        
        }catch(e) {
            console.log(e)
        }

    }

    return (
        <>
                                
        <div className="fixed inset-0 bg-gray-800 opacity-50 z-10"></div>

       
        <div className="fixed inset-0 flex items-center justify-center z-20">
            
            <div className="p-8 w-[50vw] mx-auto border bg-gray-800 rounded-lg shadow-xl shadow-gray-800">
                <form onSubmit={handleSubmit}>
                <Textarea
                    className="mb-4"
                    name="name"
                    placeholder="Choose a name..."
                    variant="solid"
                    value={Form.name}
                    onChange={handleChange}
                />
                
                <Textarea
                    className="mb-4"
                    name="description"
                    placeholder="Choose a description..."
                    variant="solid"
                    value={Form.description}
                    onChange={handleChange}
                    sx={{ marginRight: "20px" }}
                    
                />
                
                <Button
                    
                    className={trueValue ? "opacity-0 cursor-not-allowed" : ""}
                    variant="contained"
                    type="submit"
                    
                >
                    Create
                </Button>

                <Button onClick={()=>{
                    onChange(false)
                }} variant="contained"
                type="submit"
                   
                >
                    Cancel
                </Button>
                </form>
            </div>
        </div>
    </>
    )

}