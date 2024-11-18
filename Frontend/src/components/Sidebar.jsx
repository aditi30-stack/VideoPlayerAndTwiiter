import React from 'react';
import { toggleState } from '../store/ToggleSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const drawerWidth = 'w-60'; 

const Sidebar = () => {
    const selector = useSelector((state) => state.toggleReducer)
    
    const drawerWidth = selector ?'w-60': 'hidden'; 
    
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`fixed top-20 ${drawerWidth} bg-gray-800 shadow-lg shadow-gray-200 h-full`}>
        
        <ul>
          {['Liked Videos', 'History', 'My Content', 'Upload'].map((text, index) => (
            <Link key={text} to={`/${text}`}>
            <li  className="p-2 text-white hover:bg-gray-700 cursor-pointer">
            {text}
            </li>
            </Link>
          ))}
        </ul>
        <hr className="border-gray-700 my-4" />
        <ul>
          {['collection', 'tweet'].map((text, index) => (
            <Link key={text} to={`/${text}`}>
            <li className="p-2 text-white hover:bg-gray-700 cursor-pointer">
              {text}
            </li>
            </Link>
          ))}
          
        </ul>
      </div>

      
      <div className={`flex-grow ${selector ? "ml-[250px]" : "ml-[50px]"} p-4`}>
        <h1 className="text-2xl"></h1>
        <p></p>
      </div>
    </div>
  );
};

export default Sidebar;
