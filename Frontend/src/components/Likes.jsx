import { useEffect, useState } from "react"
import { axioInstance, setupInterceptors } from "../interceptors"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

export const Likes = ({id}) =>{
    const [likes, setLikes] = useState()
    const [addLike, setAddLike] = useState(false)

    

    useEffect(()=>{
        const fetchLikes = async() =>{
            const LikesResponse = await axioInstance.get(`/like/video/${id}`)
            
            setLikes(LikesResponse.data.data)

        }
        fetchLikes()
    }, [addLike])

    const AddLike = async() =>{
        try {
        const response = await axioInstance.post(`like/toggle/v/${id}`)
        console.log("likes are",response)
        setAddLike((prev)=> !prev)
        }catch(e) {
            console.log(e)
        }
        
    }
    
   

    return (
        <div className="flex w-1/5">
            <div className="mr-2 cursor-pointer">
           <ThumbUpOffAltIcon onClick={AddLike} fill="blue"/>

            </div>
            <div>
                {likes}
            </div>



        </div>
    )

}