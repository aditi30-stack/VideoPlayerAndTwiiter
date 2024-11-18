export const MenuOptions = ({options, onSelect}) =>{

    const handleClick = (value) =>{
        
        onSelect(value)
    }
   
    return (
        <ul className="z-30 absolute top-6 left-6 bg-gray-600 shadow-lg rounded-md text-white text-sm w-[200px] p-4">
            {options.length > 0 && options.map((o, index)=>(
                <li onClick={()=>{
                    handleClick(o)
                }} key={index} className="hover:bg-gray-400 mb-1">
                    {o}

                </li>
            ))}
        </ul>
    )
}