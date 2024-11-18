import { useEffect, useState } from "react"
import MultiActionAreaCard from "./VideoCard"
import Checkbox from '@mui/material/Checkbox';
import { Button } from "@mui/material";
import { axioInstance } from "../interceptors";
import { useNavigate } from "react-router-dom";



export const VideoForPlaylist = ({playlistData}) =>{
    
    
    const [allVideos, setAllVideos] = useState([])
    const [selectedVideo, setSelectedVideo] = useState([])
    const [error, setError] = useState("")
    const navigate = useNavigate()
    


    useEffect(()=>{
        if(playlistData.type === "Add Video") {
            AddUserVideos()
            fetchVideos()
        }else if(playlistData.type === "Remove Video") {
            RemoveUserVideosFunction()

           

        }

    }, [playlistData.type])


    const AddUserVideos = async() =>{
        try{
            const videosList = await getUserVideos()

            if(Array.isArray(videosList) && videosList.length > 0) {
                let newVideoArray = []
                 videosList.map((video) =>(
                    newVideoArray.push(video._id)
                 ))
                 console.log("selected videos", selectedVideo)
                 console.log("new Array", newVideoArray)
                 setSelectedVideo([...selectedVideo, ...newVideoArray])
            }

        }catch(e) {
            console.log(e)
        }
    }


    const RemoveUserVideosFunction = async() =>{
        try{
            
            const videosList = await getUserVideos()
            if(Array.isArray(videosList) && videosList.length > 0) {
                setAllVideos(videosList)
            }

        }catch{
            console.log(e)

        }
    }

   
    const getUserVideos = async() =>{
            try{
            const response = await axioInstance.get(`/playlist/getPlaylist/${playlistData.playlistId}`)
            console.log("userVideos", response.data.data.videos)
            const videosList = response.data.data.videos
            return videosList;


        }catch(e) {
                console.log(e)
                setError("Error getting User videos!")
            }
            

    }


    

    const RemoveUserVideo = async() =>{
        try{
            setError("")
        const response = await axioInstance.patch(`/playlist/remove/${playlistData.playlistId}/videos`,
            {"videoId": selectedVideo}
        )
        console.log(response.data.data)
        setError("")
        navigate(`/playlist/showPlaylist/${playlistData.playlistId}`)

    }catch(e) {
        console.log(e)
        setError("Error removing videos!")
    }


    }



    const fetchVideos = async() =>{
        try{
            setError("")

        const response = await axioInstance.get('/video/getAllVideos')
        setAllVideos(response.data.data)
        setError("")
        }catch(e) {
            console.log("Error adding videos!")
            setError("Error adding videos!")
        }

    }



    const AddVideos = async() =>{
        try{
            setError("")
        let response = await axioInstance.post(`/playlist/add/${playlistData.playlistId}/videos`, {
            "videos": selectedVideo
        })
        console.log("video playlist", response.data.data)
        fetchVideos()
        setError("")
        navigate(`/playlist/showPlaylist/${playlistData.playlistId}`)
    }catch(e) {
        console.log(e)
        setError("Error adding videos to the playlist!")
    }
        


    }

    const handleItemCheck = (e) =>{
        const vid = e.target.value
        
        const videoIncluded = selectedVideo.find((videoId) => videoId === vid)
        

        if(videoIncluded !== undefined) {
            const newVideoList = selectedVideo.filter((videoId) => videoId !== vid)
            setSelectedVideo(newVideoList)
        }
        else {
            setSelectedVideo([...selectedVideo, vid])
        }


    }
        

    return (
       
        <div className="flex flex-wrap gap-4 min-w-[50vw]">
            
            {allVideos && allVideos.length > 0 &&(
                allVideos.map((video) =>(
                    
                    <div key={video._id}>

                    <Checkbox
                    checked={selectedVideo.includes(video._id)}
            
                    value={video._id}
                    onChange={handleItemCheck}/>

                    <MultiActionAreaCard 
                    title={video.title}
                    description={video.description}
                    views={video.views}
                    thumbnail={video.thumbnail}

                    
                    />
                    
                    </div>
                    
                ))
                

               
            )}

            {selectedVideo.length > 0 && (
                <Button onClick={playlistData.type === "Add Video" ? AddVideos: RemoveUserVideo}
                className="mt-4 w-full border bg-blue-500"
                variant="contained"
                sx={{
                color: "black",
                backgroundColor: '#3b82f6', 
                marginTop: "10px",
                width: "40vw",
                            
                }}>
               {playlistData.type === "Add Video" ? "Save Videos": "Remove Video"}
                </Button>
            )}

            {error && (
                <p className="bg-red-500 text-white font-bold">
                    {error}
                </p>
            )}
                
           
      </div>      
        
    )
}
