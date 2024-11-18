import { useEffect, useState } from "react";
import { axioInstance } from "../interceptors";
import { Avatar, Button } from "@mui/material";
import Input from "@mui/joy/Input";

export const MyTweet = () => {
  const [myTweets, setMyTweets] = useState([]);
  const [error, setError] = useState("");
  const [tweetData, setTweetData] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    fetchUserTweets();
  }, []);

  const fetchUserTweets = async () => {
    try {
      const response = await axioInstance.get("tweet/user/t/getUserTweets");
      console.log("user response", response.data.data);
      setMyTweets(response.data.data);
    } catch (e) {
      console.log("Error!", e);
    }
  };

  const EditTweet = (tweetData) => {
    setTweetData(tweetData);
    setEditedContent(tweetData.content); 
  };

  const handleSaveChanges = async () => {
    try {
      setError("");
      const response = await axioInstance.patch(`/tweet/t/${tweetData._id}`, {
        newContent: editedContent,
      });
      console.log(response.data);
      fetchUserTweets();
      setTweetData(null); 
    } catch (e) {
      console.log(e);
      setError("Error updating tweet!");
    }
  };

  const DeleteTweet = async (id) => {
    try {
      setError("");
      const response = await axioInstance.delete(`/tweet/t/${id}`);
      console.log(response.data);
      fetchUserTweets();
    } catch (e) {
      console.log(e);
      setError("Error deleting tweet!");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {myTweets &&
          myTweets.length > 0 &&
          myTweets.map((tweet) => (
            <div
              className="border shadow-lg rounded-md bg-black py-10 h-[250px] flex flex-col"
              key={tweet._id}
            >
              <div className="ml-4 flex">
                <Avatar src={tweet.owner?.avatar} />
                <div className="ml-4 font-semibold text-lg">
                  {tweet.owner?.username}
                </div>
              </div>

              <div className="mt-4">{tweet.content}</div>

              <div className="mt-3">
                <Button
                  onClick={() => {
                    EditTweet(tweet);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    DeleteTweet(tweet._id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>

      {error && (
        <div className="text-white font-bold bg-red-500 p-2 mt-4">
          {error}
        </div>
      )}

      {tweetData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h3 className="font-bold text-xl mb-4">Edit Tweet</h3>
            <Input
              placeholder="Edit your tweet"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              fullWidth
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="contained" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => setTweetData(null)}
                color="error"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
