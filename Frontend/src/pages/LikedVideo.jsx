import { useEffect, useState } from "react";
import MultiActionAreaCard from "../components/VideoCard";
import { axioInstance, setupInterceptors } from "../interceptors";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";


export const LikedPage = () => {
    const navigate = useNavigate()
    const [likedVideos, setLikedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const toggleSelector = useSelector((state) => state.toggleReducer);


    useEffect(()=>{
        setupInterceptors(navigate)
    }, [navigate])

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                setLoading(true);
                const response = await axioInstance.get('/like/videos');
                console.log("Liked videos are:", response.data.data);

                const videoIds = response.data.data.map((item) => item.video);
                console.log("Video IDs:", videoIds);

                const newVideos = videoIds.map(async(vid) => 
                    await axioInstance.get(`/video/searchvideo/${vid}`)
                )

                const result = await Promise.all(newVideos)
                console.log("result is", result)
                let resultingVideos = result.filter((v) => v.data.data !== null)
                setLikedVideos(resultingVideos)
                setLoading(false)
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedVideos();
    }, []);

    return (
        loading ? (
            <div>Loading...</div>
        ) : (
            <div className="flex">
                {/* Sidebar */}
                <div className="z-20">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className={`gap-3 w-[90vw]`}>
                    <h1 className="font-bold text-2xl text-center p-4">Your Liked Videos</h1>
                    <div className="flex flex-wrap space-x-4 z-0">
                        {likedVideos && likedVideos.length > 0 && likedVideos.map(video => (
                            <Link key={video?.data?.data?._id} to={`/video/${video.data.data._id}`}>
                            <MultiActionAreaCard 
                                thumbnail={video?.data?.data?.thumbnail} 
                                title={video?.data?.data?.title} 
                                description={video?.data?.data?.description} 
                                views={video?.data?.data?.views} 
                                
                            />
                            </Link>
                        ))}
                        {likedVideos.length <1 && (
                            <div>No video to Show!</div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};
