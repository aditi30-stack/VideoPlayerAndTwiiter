import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import {useNavigate, useParams}  from "react-router-dom";
import { useEffect, useState } from "react";
import { axioInstance, setupInterceptors } from "../interceptors";
import { AddComments } from "../components/AddComments";
import { Likes } from "../components/Likes";
import { Avatar } from "@mui/material";
import { SubscribeComponent } from "../components/Subscribe";
import { Content } from "../components/contentCard";


export const VideoId = () => {
    const toggleSelector = useSelector((state) => state.toggleReducer);
    const {videoId} = useParams()
    const [videoData, setVideoData] = useState()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    
   

    useEffect(()=>{
        setupInterceptors(navigate)
    }, [navigate])

    useEffect(()=>{
        
       const fetchData = async() =>{
        try {
            try {
                await axioInstance.get(`/video/watchHistory/${videoId}`);
            } catch (error) {
                console.error("Failed to add to watch history:", error);
               
            }

            const response = await axioInstance(`/video/searchVideo/${videoId}`);
            console.log(response.data.data);
            setVideoData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch video data:", error);
        } finally {
            setLoading(false);
        }
    };
       fetchData()

    }, [videoId])

   


    
    return (
        loading ? <div>Loading....</div>: (
        <div className={`flex lg:flex-col  ${toggleSelector ? "bg-white": "bg-gray-800"}`}>
            <div className="flex border-white p-10">
                {toggleSelector ? (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-lg z-20 ">
                        <div className="z-20">
                            <Sidebar />
                        </div>
                    </div>
                    
                ) : (
                    <div>
                        <Sidebar />
                    </div>
                    
                )}
                <div>
            
                <video
                width="640" 
                height="360" 
                controls
                src={videoData?.videoFile || ""} 
                type="video/mp4"
            >
                Your browser does not support the video tag.
            </video>
            

            {videoData &&
            <div className="flex justify-between">
            <div className="text-lg pt-4 pb-2 font-bold">
            <div className="flex items-center">
               <Avatar onClick={()=>{
                navigate(`/dashboard/user/${videoData.owner.username}`)
               }}
               className="mr-4 text-md cursor-pointer" 
               src={videoData?.owner?.avatar}></Avatar>
                
                <div className="w-full mr-10">
                    <div>
                    {videoData?.title}
                    </div>
                    
                    <div className="text-md font-light text-gray-200">
                    uploadedBy: {videoData?.owner?.username}
                    </div>
                </div>
            <SubscribeComponent owner={videoData.owner._id}/>

            </div>
            <div className="w-full mt-4 rounded-md font-light bg-gray-500 p-6">
                {videoData.description}...
            </div>

            </div>

            <div className="text-lg pt-4 pb-2 font-bold">
                <Likes id={videoId}/>
               

            </div>
            </div>
            }
            
            {/* card container */}
            <AddComments id={videoId}/>
            
                

            </div>
                
            {/* content */}

                <Content videofileId = {videoData?._id}/>
               
                
            </div>
            </div>
        )

            
        
    );
};