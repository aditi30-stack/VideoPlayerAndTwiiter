import { Input } from "@mui/joy"
import { Label } from "../components/Label"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { axioInstance } from "../interceptors"
import Sidebar from "../components/Sidebar"
import { Link } from "react-router-dom"
import {Avatar} from "@mui/material"
import {REACT_APP_USER_AVATAR } from "../../utils"
import { ChangePhoto } from "../components/ChangePhoto"
import { useSelector } from "react-redux"

export const MyAccount = () =>{
    const [loading, setLoading] = useState(true)
    const [Edit, setEdit] = useState(false)
    const [openImageEdit, setOpenImageEdit] = useState(false)
    const selector = useSelector((state)=> state.toggleReducer)

    const [UserData, setUserData] = useState({
        email: "",
        fullname: "",
        username: "",
        avatar: ""
    })

    const fetchUserData = async() =>{
        try{
        setLoading(true)
        const response = await axioInstance.get('/user/getcurrentUser')
        console.log("User data", response.data.data)
        setUserData({...UserData,
            username: response.data.data.username,
            fullname: response.data.data.fullname,
            email: response.data.data.email,
            avatar: response.data.data.avatar
        })
        setLoading(false)

        }catch(e) {
            console.log(e)
            setLoading(false)
        }
    
    }

    useEffect(()=>{
        fetchUserData()
        

    }, [])

    const CancelChanges = () =>{
        setEdit(false)
    }
    
    

    const handleFormSubmit = async(e) =>{
        e.preventDefault()
        try{
        setLoading(true)
        delete UserData.email;
        const editDetail = await axioInstance.patch('/user/updateUserDetails', UserData)
        console.log("edited response", editDetail)
        fetchUserData()
        setEdit(false)
        setLoading(false)
        }catch(e){
            console.log(e)
            setLoading(false)
        }
        
    }

    const AddFormData = (e) =>{
        setEdit(true)
        const{name, value} = e.target
        console.log(name)
        setUserData({...UserData,
            [name]: value
        })


    }

    const changeAvatar = () => {
        setOpenImageEdit(true)


    }

    const handleSuccess = () =>{
        setOpenImageEdit(false)
        fetchUserData()
        
    }



    return (
        loading ? <div>Loading...</div>: (
        <div className="flex">
            <div>
                <Sidebar/>
            </div>
        <div className="w-[50vw] mx-auto p-8">
            
            
            <div className="w-full text-lg">
                <div className="flex justify-center items-center text-2xl">
                <div onClick={changeAvatar} className="mr-4 cursor-pointer">
                <Avatar src={UserData.avatar}></Avatar>

                </div>
                
                <h1 className="text-2xl text-center">Edit your Profile</h1>
                </div>
                <Link to={"/changePassword"}>
                <h2 className="text-gray-200 underline pt-2 pb-2">Change Your Password</h2>
                </Link>
                
                

                <form onSubmit={handleFormSubmit}>
                
                <div className="w-full p-2">
                    <Label text={"Full Name: "}></Label>
                    <Input onChange={AddFormData} name="fullname" value={UserData.fullname} placeholder="Enter your fullname" variant="solid" />
                </div>

                <div className="w-full p-2">
                    <Label text={"Username: "}></Label>
                    <Input onChange={AddFormData} name="username" value={UserData.username} placeholder="Enter your Username..." variant="solid" />
                </div>

                <div className="w-full p-2">
                    <Label text={"Email: "}></Label>
                    <Input disabled={true} name="email" value={UserData.email} placeholder="Enter your Email..." variant="solid" />
                </div>

                

                <div className="w-full p-2">
                    <Button type="Submit" className='w-full' variant="contained">
                        Save Changes
                    </Button>

                    
                </div>

                {Edit && (
                     <div className="w-full p-2">
                     <Button onClick={CancelChanges} type="Submit" className='w-full' variant="contained">
                        Cancel Changes
                    </Button>
                    </div>
                    )}
            </form>


            </div>
        </div>

        {openImageEdit && (
            <div className={`bg-black fixed top-20 bottom-0 right-0 left-${selector ? "40": "20"} w-full p-2}
                backdrop-blur-md z-8 bg-gray-900 bg-opacity-50`}>
                <div>
                    <ChangePhoto 
                    photoUrl={REACT_APP_USER_AVATAR}
                    label="avatar"
                    onSuccess = {handleSuccess}
                    />
                </div>

                
                
                <Button onClick={()=>{
                    setOpenImageEdit(false)
                }} className='w-1/2 ml-10' variant="contained">Cancel Changes</Button>
                
                
            </div>
        )}
        </div>)
    )
}