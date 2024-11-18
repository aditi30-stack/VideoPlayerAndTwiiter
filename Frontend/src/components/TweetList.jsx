import { useEffect, useState } from "react"
import { axioInstance } from "../interceptors"
import ThumbUpOffAlt from "@mui/icons-material/ThumbUpOffAlt";
import { Avatar} from "@mui/material";

export const TweetList = () => {
    const [allTweets, setAllTweets] = useState([])
    const [error, setError] = useState("")

    useEffect(()=>{
       getAllTweets()

    }, [])

    const getAllTweets = async () => {
        try{
            setError("")
        const tweetList = await axioInstance.get("/tweet/getalltweets");
        console.log(tweetList.data.data)
        setAllTweets(tweetList.data.data);
        setError("")
        }catch(e) {
            console.log(e)
            setError("Error getting all Tweets")

        }
    };


    const AddTweet = async(id) =>{
        const response = await axioInstance.post(`/like/toggle/t/${id}`)
        console.log("tweet response", response.data)
        getAllTweets()
        

    }


   
    return (
        <div className="grid grid-cols-3 gap-4 mb-10">
                    {allTweets && allTweets.length > 0 && allTweets.map((tweet) => (
                        <div
                            className="border shadow-lg rounded-md bg-black py-10 h-[250px] flex flex-col"
                            key={tweet._id}
                            
                        >
                            <div className="ml-4 flex">
                            <Avatar src={tweet.usernamesList.avatar}/>
                            <div className="ml-4 font-semibold text-lg">
                                {tweet.usernamesList.username}
                            </div>
                            </div>

                            <div>
                                {tweet.content}

                            </div>

                            <div className="flex space-x-4 ml-4 mt-4">
                                <ThumbUpOffAlt className="cursor-pointer" onClick={()=>{
                                    AddTweet(tweet._id)
                                }}/>
                                <div>
                                    {tweet.totalTweetLikes}

                                </div>
                            </div>

                            <div>
                            </div>
                            



                        </div>

                            
                    ))}

                {error && (
                    <div className="text-white font-bold bg-red-500 p-2 mt-4">
                        {error}
                    </div>
                )}
                </div>
    )
}
