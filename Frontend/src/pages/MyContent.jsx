import { useEffect,useState } from "react";
import Sidebar from "../components/Sidebar";
import { axioInstance } from "../interceptors";
import MultiActionAreaCard from "../components/VideoCard";
import { DropDown } from "../components/dropDownList";
import { Edit } from "../components/Edit";
import { useSelector } from "react-redux";
import { Button } from "@mui/joy";
import { Link } from "react-router-dom";
import { REACT_APP_VIDEO_EDIT_URL, REACT_APP_THUMBNAIL_EDIT_URL } from "../../utils";
import { ChangePhoto } from "../components/ChangePhoto";


export const MyContent = () => {
    const [MyVideos, setMyVideos] = useState([]);
    const [editId, setEditId] = useState()
    const [loading, setLoading] = useState(false)
    const selector = useSelector((state) => state.toggleReducer)
    const [openImageEdit, setOpenImageEdit] = useState(false)
    const [vid, setVid] = useState()
    
    

    useEffect(() => {
        
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true)
        const userData = await axioInstance.get(`video/v/user/getUserVideos`);
        console.log("userData", userData);
        setMyVideos(userData.data.data);
        setLoading(false)
        }catch(e) {
            console.log(e)
            setLoading(false)
        }
    };

    const handleSelect = async(option, video) =>{
        
        if(option === "Edit video") {
            setEditId(video)
            
            
        }
        else if(option === "delete video"){
            try{
            setLoading(true)
           const response =  await axioInstance.delete(`/video/delete/${video?._id}`)
            fetchUserData()
            setLoading(false)
            }
           catch(e){
            console.log("Error while deleting video")
            setLoading(false)

           }
           
        }
        else if(option === "Edit thumbnail") {
            setOpenImageEdit(true)
            setVid(video._id)

        }
    }

    const ChangeEdit = () =>{
        setEditId(null)
    }


    const handleEditSuccess = (updatedVideo) => {
        setMyVideos((prevVideos) =>
            prevVideos.map((video) =>
                video._id === updatedVideo._id ? updatedVideo : video
            )
        );
        setEditId(null); 
    };


    const handleSuccess = () =>{
        fetchUserData()
        setOpenImageEdit(false)
        setVid(null)
    }

    

    

    return (
        <div className="flex">
            <div>
                <Sidebar />
            </div>
            
            {loading ? <div>loading...</div>: 
            <div>
                <h1 className="text-xl text-center font-bold p-2 mx-auto w-[90vw]">My Videos</h1>
                <div className="grid lg:grid-cols-3 lg:gap-2 grid-cols-1 gap-3">
                    {MyVideos && MyVideos.length > 0 && MyVideos.map((video) => (
                        
                        <div key={video._id} className="relative w-[280px] h-[300px] mb-10">
                            <Link to={`/video/${video._id}`} >
                            <MultiActionAreaCard
                                title={video.title}
                                description={video.description}
                                thumbnail={video.thumbnail}
                                sx={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                views={video.views}
                            />
                            </Link>
                            <div
                                className="absolute bottom-0 mt-16 z-20 right-0 text-lg left-28 text-gray-800"
                                variant="contained"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropDown onSelect={(option) => handleSelect(option, video)}
                             options={["Edit video", "Edit thumbnail", "delete video"]}/>
                            </div>
                        </div>
                        
                        
                    ))}
                    {MyVideos.length === 0 && !MyVideos &&(
                        <div>
                            No videos to show!
                        </div>
                    )}
                </div>
                
            </div>
            
            }

            
                {editId && (
                <div className={`bg-white fixed top-20 bottom-0 right-0 left-${selector ? "40": "0"}
                backdrop-blur-md z-8 bg-gray-900 bg-opacity-50`}>
                <div className="bg-gray-800 shadow-md">
                    <Edit videoUrl={`${REACT_APP_VIDEO_EDIT_URL}`} data={editId}
                    type={"MyContent"} id={editId._id}
                     onSuccess={handleEditSuccess}/>
                    <Button onClick={ChangeEdit} className="w-1/2" variant="contained">Cancel</Button>

                </div>
                </div>
            )}



        {openImageEdit && (
            <div className={`bg-black fixed top-20 bottom-0 right-0 left-${selector ? "40": "20"} w-full p-2}
                backdrop-blur-md z-8 bg-gray-900 bg-opacity-50`}>
                <div>
                    <ChangePhoto 
                    photoUrl={`${REACT_APP_THUMBNAIL_EDIT_URL}${vid}`}
                    label="thumbnail"
                    onSuccess = {handleSuccess}
                    />
                </div>

                
                
                <Button onClick={()=>{
                    setOpenImageEdit(false)
                }} className='w-1/2 ml-10' variant="contained">Cancel Changes</Button>
                
                
            </div>
        )}


                        
            
        </div>
    );
};
