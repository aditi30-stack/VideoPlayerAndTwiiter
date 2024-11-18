import { useEffect, useState } from "react"
import { axioInstance } from "../interceptors"
import MultiActionAreaCard from "./VideoCard"
import { Link } from "react-router-dom"

export const Content = ({videofileId}) =>{
    const [remainingVideos, setRemainingVideos] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        const fetchRemainingVideo = async() =>{
        try {
            setLoading(true)
        const response = await axioInstance.get(`/video/getRemainingVideos/${videofileId}`)
        console.log("video data", response.data.data)
        setRemainingVideos(response.data.data)
        setLoading(false)

        }catch(e) {
            console.log(e)
            setLoading(false)

        }
    }
        fetchRemainingVideo()
        

    }, [videofileId])

    return (
        loading ? <div>
            Loading...

        </div>: (
            <div className="mx-20">
                {remainingVideos && remainingVideos.length > 0 && (

                    remainingVideos.map((video, index) =>(
                        <div key={index} className="mb-10">
                        <Link to={`/video/${video._id}`}>
                        <MultiActionAreaCard thumbnail={video.thumbnail
                        } title={video.title} description={video.description}
                        views={video.views}/>
                        </Link>
                        </div>
                        
                    ))
                    
                )}
                
               

            </div>
        )
    )
}