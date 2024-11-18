import { Label } from "./Label";
import { Input } from "@mui/joy";
import { Button } from "@mui/material";
import { useState } from "react";
import { axioInstance } from "../interceptors";

export const ChangePhoto = ({ photoUrl, label, onSuccess }) => {
    const [PhotoData, setPhotoData] = useState({
        [label]: null
    });
    const [message, setMessage] = useState("");

    const changePhoto = async () => {
        const formData = new FormData()
        formData.append(label, PhotoData[label])

        try {
            setMessage("")
            const response = await axioInstance.patch(photoUrl, formData);
            setMessage(`${label} updated successfully`);
            onSuccess();
            
        } catch (e) {
            setMessage(`Error updating ${label}!`)
            console.log(e);
        }
    };

    const handleFormData = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setPhotoData((prevData) => ({
                ...prevData,
                [e.target.name]: file 
            }));
        } else {
            setMessage("No file selected!")
            console.log("No file selected");
        }
    };

    return (
        <div className="min-w-screen">
            <div className="w-1/2 p-2 space-y-2">
                <Label text={label}></Label>
                <Input onChange={handleFormData} name={label} type="file" variant="solid" />
                <Button onClick={changePhoto} className="w-full" variant="contained">Save Changes</Button>
            </div>
            <div className="w-1/2 bg-red-500 text-white font-bold">
                {message}
            </div>
        </div>
    );
};
