import Button from '@mui/material/Button';
import { Label } from "./Label"
import Input from '@mui/joy/Input';
import { useState } from 'react';
import { axioInstance } from '../interceptors';

let FormDatas = {}

export const Edit = ({videoUrl, data, id, onSuccess, type}) =>{
    if(type === "Playlist") {
        const {name, description} = data
        FormDatas = {
            name: name,
            description: description
        }
    }

    

    

    else if(type === "MyContent") {
        const {title, description} = data
        FormDatas = {
            title: title,
            description: description
        }

    }

    
    else if(type === "Edit thumbnail") {
        FormDatas = {
            

        }

    }
    

    const [EditFormData, setEditFormData] = useState(FormDatas)
    
    console.log(EditFormData)

    const AddForm = (e) =>{
        const {name, value} = e.target;

        setEditFormData({...EditFormData,
            [name]: value
        }
            
        )

    }

    const SubmitEdittedForm = async(e) =>{
        e.preventDefault()
        console.log(EditFormData)
        try{
        const EdittedForm = await axioInstance.patch(`${videoUrl}${id}`, EditFormData)
        onSuccess(EdittedForm.data.data)
        }catch(e) {
            console.log("Error", e)
        }
        


    }

    return (
        <div className="p-2">
             <div className="w-1/2 p-2">
                    <Label text="Title: "></Label>
                    <Input onChange={AddForm} 
                    name={EditFormData?.name ? "name": "title"}
                    placeholder="Enter your Title..." value={EditFormData?.name || EditFormData?.title} variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                    <Label text="Description: "></Label>
                    <Input onChange={AddForm} name="description" placeholder="Enter your description..." value={EditFormData?.description || EditFormData?.description} variant="solid" />
                </div>

                <div className="w-1/2 p-2">
                   <Button onClick={SubmitEdittedForm} type="Submit" className='w-full' variant="contained">Save Changes</Button>
                </div>

               
            
        </div>
    )
}