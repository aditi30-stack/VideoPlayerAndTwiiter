import axios from "axios"
import { useEffect, useState } from "react"
import MultiActionAreaCard from "./VideoCard"
import { useSelector} from 'react-redux';
import { Link } from "react-router-dom";

 const defaultImage = "http://res.cloudinary.com/doncgntap/image/upload/v1728925253/juep1oihvtwuogce3lqq.jpg"

export const VideoContainer = () =>{
    const [Videos, setVideos] = useState([])
    const selector = useSelector((state) => state.toggleReducer)

    useEffect(()=>{
        FetchVideos()
        

    }, [])

    const FetchVideos = async() =>{
        let response = await axios.get("http://localhost:3000/api/v1/video/getAllVideos")
        setVideos(response.data.data)


    }
    return (
        <div>
            {Videos && Videos.length > 0 && (
                <div className={`grid grid-cols-1 gap-4 ${selector ? "lg:grid-cols-3": "lg:grid-cols-4"}`}>
                    {Videos.map((video, index)=>(
                        <Link to={`/video/${video._id}`} key={index}>
                        <MultiActionAreaCard thumbnail={video.thumbnail ===undefined ? defaultImage: video.thumbnail
                        } title={video.title} description={video.description}
                        views={video.views}/>
                        </Link>
                        
                    ))}
                </div>
            )}

        </div>
    )
}