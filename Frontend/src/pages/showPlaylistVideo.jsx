import { useEffect, useState } from "react"
import { axioInstance } from "../interceptors"
import Sidebar from "../components/Sidebar"
import { useParams } from "react-router-dom"
import MultiActionAreaCard from "../components/VideoCard"

export const ShowVideos = () =>{
    const [userVideos, setUserVideos] = useState([])
    const {playlistId} = useParams()
    

    useEffect(()=>{
        fetchUserVideos()
        

    }, [])

    const fetchUserVideos = async() =>{
        const response = await axioInstance.get(`/playlist/getPlaylist/${playlistId}`)
        console.log(response.data.data)
        setUserVideos(response.data.data.videos)
    }

    
    return (
        <div className="flex">
            <div>
                <Sidebar/>
            </div>

           <div className="flex gap-4 flex-wrap">
            {userVideos && userVideos.length > 0 &&(
                userVideos.map((video) =>(
                    <MultiActionAreaCard
                    key={video._id}
                    title={video.title}
                    description={video.description}
                    views={video.views}
                    thumbnail={video.thumbnail}
                    />

                ))
            )}

           </div>

        </div>
    )
}