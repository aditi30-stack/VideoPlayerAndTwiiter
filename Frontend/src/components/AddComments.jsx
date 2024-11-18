import { useEffect, useState } from "react";
import { setupInterceptors } from "../interceptors";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@mui/joy";
import { axioInstance } from "../interceptors";
import { Avatar, Menu, Button } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { DropDown } from "./dropDownList";
import { REACT_APP_COMMENT_EDIT } from "../../utils";
import { useSelector } from "react-redux";


export const AddComments = ({ id }) => {
  
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [writeComment, setWriteComment] = useState({
    content: "",
    video: id,
  });
  const [likesMap, setLikesMap] = useState({});
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState()
  const [editId, setEditId] = useState()
  const selector = useSelector((state) => state.toggleReducer)
  
  useEffect(() => {
    getcurrentUser()
    setupInterceptors(navigate);
  }, [navigate]);

 

  const getcurrentUser = async() =>{
    const user = await axioInstance("/user/getcurrentUser")
    console.log("current user",user.data.data)
    setCurrentUser(user.data.data.username)



  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axioInstance.get(`/comment/${id}`);
      console.log("comments", response.data.data);
      setComments(response.data.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const PostComment = async () => {
    const commentResponse = await axioInstance.post(`/comment/${id}`, writeComment);
    console.log("comment response", commentResponse.data);
    
    setWriteComment({
      ...writeComment,
      content: "",
      id: "",
    });
    fetchData();
  };

  useEffect(() => {
    
    fetchData();
  }, [id]);

  const writeCommentChange = (e) => {
    setWriteComment({
      ...writeComment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitData = () => {
    PostComment();
    fetchData();
  };

  const getTotalLikesOnComments = async (cid) => {
    const responseTotal = await axioInstance.get(`/like/toggle/c/${cid}`);
    if (Array.isArray(responseTotal.data.data)) {
      setLikesMap((prev) => ({
        ...prev,
        [cid]: responseTotal.data.data.length, 
      }));
    }
  };

  const handleLike = async (cid) => {
    const likeAddedOnComment = await axioInstance.post(`like/toggle/c/${cid}`);
    console.log("like added", likeAddedOnComment.data);
    getTotalLikesOnComments(cid); 
  };
  

  const handleSelect = async(option, cid) =>{
    console.log("cid", cid)
    if(option === "Delete Comment") {
      try {
      const response = await axioInstance.delete(`/comment/delete/${id}`)
      console.log(response.data)
      fetchData()
      }catch(e) {
        console.log(e)

      }
      
    }

    else if(option === "Update Comment") {
      
      setEditId(cid)
      
    }
    

  }

  const EditCommentItem = (e) =>{
    const value = e.target.value;
    if(value !== "") {
    setEditId({...editId,
      [e.target.name]: value
    })
    
    
  }
}

const SaveChanges = async() =>{
  console.log(editId._id)
  try{
  await axioInstance.patch(`/comment/${id}/${editId._id}`, 
    {"Editcontent": editId.content}
  )
  setEditId(null)
  fetchData()
}catch(e) {
  console.log(e)

}
}

  return (
    <div>
      <div className="text-lg pt-4 pb-4 font-bold border-2 bg-black rounded-md">
        Comments:
      </div>
      <div>
        <Input
          onChange={writeCommentChange}
          name="content"
          value={writeComment.content}
          className="p-2 mt-4"
          placeholder="Add a Comment"
          type="text"
          variant="solid"
        />
        {writeComment.content && (
          <Button onClick={handleSubmitData} variant="contained">
            Comment
          </Button>
        )}
        {comments && comments.length > 0 &&
          comments.map((comment, index) => (
            <div key={comment._id} className="text-md pt-4 pb-4 border-b-2 flex items-center space-x-6">
              <div>
                <Avatar alt={"user-display"} src={comment.avatar} />
              </div>
              <div>{comment.content}</div>

              <div className="flex items-center space-x-2">
                <div>
                  <ThumbUpOffAltIcon
                    onClick={() => {
                      handleLike(comment._id);
                    }}
                    className="cursor-pointer"
                  />
                  
                  {likesMap[comment._id] || 0}
                </div>

                {currentUser === comment.username &&(
                  <div>
                  <DropDown onSelect={(option) => handleSelect(option, comment) }
                   options={["Update Comment", "Delete Comment"]} />
                </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* comment editing */}


      {editId && (
                <div className={`bg-white fixed top-20 bottom-0 right-0 left-${selector ? "40": "0"}
                backdrop-blur-md z-8 bg-gray-900 bg-opacity-50 p-2`}>
                <div className="w-1/2 bg-gray-800 shadow-md p-2">
                <div className="p-2">
                    
                    <Input onChange={EditCommentItem}
                    name="content"
                    value={editId.content} variant="solid" />
                </div>
                
                <div className="flex flex-col space-y-2">
                <Button onClick={SaveChanges} variant="contained">Save Changes</Button>
                    
                    <Button onClick={()=>{
                      setEditId(null)
                    }}  variant="contained">Cancel</Button>
                </div>

                

                </div>
                </div>
            )}
      
    </div>
  );
};
