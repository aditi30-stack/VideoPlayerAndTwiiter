import { useState } from "react"
import { MenuOptions } from "./Menu"

export const DropDown = ({options, onSelect}) =>{
    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = () =>{
        setIsOpen((prev) => !prev)
    }

    return (
       <div onClick={handleToggle} className="relative flex w-2 p-1 text-xl font-bold cursor-pointer">
        <p>.</p>
        <p>.</p>
        <p>.</p>

        {isOpen ? <MenuOptions options={options} onSelect={onSelect}/>: ""}
       </div>
    )
}