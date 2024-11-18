import { useEffect, useState } from "react";
import { axioInstance } from "../interceptors";
import MultiActionAreaCard from "../components/VideoCard";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

export const History = () => {
    const [historyVideos, setHistoryVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await axioInstance.get(`/user/history`);
                console.log("history", response.data.data);
                setHistoryVideos(response.data.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        loading ? <div>Loading....</div> : (
            <div className="flex">
                <div>
                    <Sidebar />
                </div>

                <div className="w-full">
                    
                    <h1 className="font-bold text-2xl mb-4 text-center">Your Watch History</h1>

                    {historyVideos.length > 0 ? (
                        <div className="grid lg:grid-cols-3 lg:gap-4 grid-cols-1 gap-3">
                            {historyVideos.map((video) => (
                               <Link key={video._id} to={`/video/${video._id}`}>
                                <div className="relative w-[280px] h-[300px] mb-10" key={video._id}>
                               <MultiActionAreaCard 
                                   thumbnail={video.thumbnail} 
                                   title={video.title} 
                                   description={video.description} 
                                   views={video.views} 
                                   
                               />
                               </div>
                               </Link>
                           ))}
                           
                        </div>
                    ) : (
                        <div>No History to show!</div>
                    )}
                </div>
            </div>
        )
    );
};
