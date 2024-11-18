import {Button } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Textarea from '@mui/joy/Textarea';
import { useEffect, useState } from "react";
import { axioInstance, setupInterceptors } from "../interceptors";
import { useNavigate } from "react-router-dom";
import { TweetList } from "../components/TweetList";
import { MyTweet } from "../components/MyTweet";


export const Tweet = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [contentData, setContentData] = useState({
        content: ""
    });
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("All Tweets")
    

    useEffect(() => {
        setupInterceptors(navigate);
    }, [navigate]);

    const AddContent = (e) => {
        if (e.target.value.trim() === "") {
            setError("You cannot post an empty tweet!");
            
        }
        setError("");
        setContentData({ ...contentData, [e.target.name]: e.target.value });
    };

   

    const PostTweet = async () => {
        try {
            setLoading(true);
            await axioInstance.post("/tweet/post", contentData);
            setContentData({...contentData,
                content: ""
            });
            setLoading(false);
            setActiveTab("my Tweet")
        } catch (e) {
            setError("Error while posting the tweet!")
            setLoading(false);
        }
    };

    

    return (
        <div className="flex">
            <div>
                <Sidebar />
            </div>
            <div className="max-w-[40vw] w-[60vw] mx-auto my-10">
                <h1 className="text-xl text-center p-2 font-bold">
                    Hit me Up!!!!

                    <div className="p-8 mt-6 mb-6">
                        <Textarea
                            onChange={AddContent}
                            name="content"
                            value={contentData.content}
                            size="md"
                            placeholder="Type in here…"
                            variant="solid"
                            sx={{ border: 'none', outline: 'none', width: "w-[40vw]", height: "100px" }} 
                        />
                        <Button
                            onClick={PostTweet}
                            variant="contained"
                            disabled={loading || !contentData.content}
                            sx={{ marginTop: "20px", cursor: loading ? "not-allowed" : "pointer" }}
                        >
                            {loading ? "Posting..." : "Post"}
                        </Button>
                        
                        <div className="space-x-8">
                          
                           <button onClick={()=>{
                            setActiveTab("All Tweets")
                           }} className="hover:border-b-2">All Tweets</button>
                           <button onClick={()=>{
                            setActiveTab("my Tweet")
                           }}
                            className="hover:border-b-2">My Tweets</button>
                           <hr></hr>

                        </div>
                    </div>

                    <div>
                        {activeTab === "All Tweets" ? <TweetList/> : <MyTweet/>}
                    </div>
                    
                </h1>

               

                {error && (
                    <div className="text-white font-bold bg-red-500 p-2 mt-4">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
