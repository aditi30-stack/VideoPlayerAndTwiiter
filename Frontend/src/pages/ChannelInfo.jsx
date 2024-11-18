import { useSelector } from "react-redux"
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import { axioInstance } from "../interceptors";
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import MultiActionAreaCard from "../components/VideoCard";
import { Link } from "react-router-dom";

export const ChannelInfo = () =>{
    const [userData, setUserData] = useState([])
    const [userVideos, setUserVideos] = useState([])
    const {channelId} = useParams()
    const selector = useSelector((state)=> state.toggleReducer)
    

    useEffect(()=>{
        const fetchUserInfo = async() =>{
            const [result1, result2] = await Promise.allSettled([
                axioInstance.get(`/dashboard/stats/${channelId}`),
                axioInstance.get(`/dashboard/videos/${channelId}`)
            ])
           
            

            if(result1.status === "fulfilled") {
                
                setUserData(result1.value.data.data)
            }

            if(result2.status === "fulfilled") {
                console.log(result2.value.data.data[0].TotalVideos)
                setUserVideos(result2.value.data.data[0].TotalVideos)
            }

        }
        fetchUserInfo()
        

    }, [])

    return (
        <div>
            <div>
                <Sidebar/>
            </div>

            <div className="mx-auto my-0 w-[60vw] flex flex-col">
                <div className="w-[380px] h-[300px]">
                <img className="w-full h-full" src={userData.coverImage}
                alt="User cover Image"
                >
                </img>

                </div>

                <div className="flex items-center pt-2 pl-1 text-xl space-x-4">
                    <div>
                    <Avatar src={userData.avatar}/>

                    </div>
                    <div className="p-4 font-bold">
                        {userData.username}
                    </div>
                    <div className="text-gray-400 text-md">
                        {userData.subscribers} subscribers
                    </div>

                    <div className="text-gray-400 text-md">
                        {userData.TotalVideos} videos
                    </div>
                    

                </div>

               <div className="p-2  mt-4 text-xl mb-4 font-bold">
                For you
                </div>
                
                {userVideos && userVideos.length > 0 && (
                
                <div className="flex flex-row flex-wrap gap-2.5 mt-4">
                    
                {userVideos.map((item) => (
                <Link to={`/video/${item._id}`} key={item._id}>
                <MultiActionAreaCard 
                key={item._id}
                title={item.title}
                thumbnail={item.thumbnail}
                description={item.description}
                views={item.views}
                />
                </Link>
                ))}
                </div>
                )}
                
                
                
                

              
                
            </div>
            
        </div>
    )
}