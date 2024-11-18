import { Outlet } from "react-router-dom"
import PrimarySearchAppBar from "./HeaderComponent";


export const Headers = () =>{
    return (
        <div className="bg-gray-800 w-screen h-screen text-white overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30">
            <PrimarySearchAppBar/>

            </div>
            


            <div className="w-full bg-gray-800 pt-20">
            <Outlet/>

            </div>

           
        </div>
    )
}