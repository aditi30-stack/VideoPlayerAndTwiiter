import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Headers } from "./components/Headers";
import { History } from "./pages/History";
import { Home } from "./pages/Home";
import { VideoId } from "./pages/videoId";
import { LikedPage } from "./pages/LikedVideo";
import {MyAccount} from "./pages/Profile"
import { Upload } from "./pages/Upload";
import { Playlist } from "./pages/Playlist";
import { Tweet } from "./pages/Tweet";
import { ChangePassword } from "./pages/ChangePassword";
import { MyContent } from "./pages/MyContent";
import { ChannelInfo } from "./pages/ChannelInfo";
import { ShowVideos } from "./pages/showPlaylistVideo";


const router = createBrowserRouter([{
  element: <Headers/>,
  path: "/",
  children: [{
    path: "/login",
    element: <Login/>

  }, {
    path: "/signup",
    element: <Signup/>

  }, {
    path: "/History",
    element: <History/>
  }, {
    path: "/video/:videoId",
    element:<VideoId/>
    
  }, {
    path: "/Liked Videos",
    element: <LikedPage/>
  }, {
    path: "/MyAccount",
    element: <MyAccount/>
  }, {
    path: "/upload",
    element: <Upload/>

  },

  {
    path: "/",
    element: <Home/>
  },
  
  {
    path: "/collection",
    element: <Playlist/>
  }, {
    path: "/tweet",
    element: <Tweet/>
  }, {
    path: "/changePassword",
    element: <ChangePassword/>
  }, {
    path: "/My Content",
    element: <MyContent/>
  }, {
    path: "/dashboard/user/:channelId",
    element: <ChannelInfo/>

  }, {
    path: "/playlist/showPlaylist/:playlistId",
    element: <ShowVideos/>
  }]
}])

function App() {

  return (
    <RouterProvider router={router}/>
  )
  
}



export default App;
