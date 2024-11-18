import { useEffect } from "react"
import ResponsiveDrawer from "../components/Sidebar"
import { VideoContainer } from "../components/VideoContainer"

export const Home = () =>{

    return (
        <div className="flex">
            <div>
                <ResponsiveDrawer/>
            </div>

            <VideoContainer/>
        </div>
    )
}