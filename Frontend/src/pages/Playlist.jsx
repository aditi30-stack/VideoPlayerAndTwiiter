import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CreatePlaylist } from "../components/createPlaylist";
import { axioInstance, setupInterceptors } from "../interceptors";
import MultiActionAreaCard from "../components/VideoCard";
import { useNavigate } from "react-router-dom";
import { DropDown } from "../components/dropDownList";
import { useSelector } from "react-redux";
import { Edit } from "../components/Edit";
import { REACT_APP_PLAYLIST_URL} from "../../utils";
import { Button } from "@mui/joy";
import { VideoForPlaylist } from "../components/VideoForPlaylist";
import { Link } from "react-router-dom";

export const Playlist = () => {
    const [Playlist, setPlaylist] = useState([]);
    const [createPlaylist, setCreatePlaylist] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [editId, setEditId] = useState();
    const selector = useSelector((state) => state.toggleReducer);
    const [videoToggle, setVideoToggle] = useState(false);
    const [savePlaylistId, setSavePlaylistId] = useState({
        playlistId: null,
        type: ""
        
    })

    const handleChange = () => {
        setCreatePlaylist(false);
    };

    useEffect(() => {
        setupInterceptors(navigate);
    }, [navigate]);

    const fetchPlaylist = async () => {
        try {
            setError("");
            const playlistResponse = await axioInstance.get("/playlist/user");
            console.log("playlist:", playlistResponse.data.data);
            setPlaylist(playlistResponse.data.data);
        } catch (e) {
            console.log(e);
            setError("Error fetching videos");
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [createPlaylist]);

    const handleSuccess = () => {
        fetchPlaylist();
        setCreatePlaylist(false);
    };

    const handleSelect = async (option, playlist) => {
        try {
            setError("");
            if (option === "Delete Playlist") {
                const playlistresponse = await axioInstance.delete(`/playlist/getPlaylist/${playlist._id}`);
                fetchPlaylist();

            } else if (option === "Edit Playlist") {
                setEditId(playlist);

            } else if (option === "Add Video") {
                setSavePlaylistId({
                    playlistId: playlist._id,
                    type: "Add Video",
                    
                })
                setVideoToggle(true);

            } else if (option === "Remove Video") {
                setSavePlaylistId({
                    playlistId: playlist._id,
                    type: "Remove Video",
                    
                })
                setVideoToggle(true)
            }
        } catch (e) {
            setError("Error deleting playlist!");
        }
    };

    const ChangeEdit = () => {
        setEditId(null);
    };

    const handleEditSuccess = (updatedPlaylist) => {
        
        setPlaylist((prevplaylist) =>
            prevplaylist.map((playlist) => (playlist._id === updatedPlaylist._id ? updatedPlaylist : playlist))
        );
        setEditId(null);
    };

    return (
        <div className={`flex z-0 ${videoToggle ? 'backdrop-blur-lg' : ''}`}>
            <Sidebar />
            <div className="w-full relative">
                <h1 className="text-center font-bold text-2xl p-2 z-0">My Playlist</h1>
                <div className="w-[20vw] absolute right-0">
                    <div className="text-lg flex z-10 bg-gray-400 shadow-md text-center rounded-md w-[15vw] p-2">
                        <div>Create Playlist</div>
                        <div
                            onClick={() => setCreatePlaylist(true)}
                            className="text-xl border rounded-full ml-2 px-1 cursor-pointer mb-1"
                        >
                            +
                        </div>
                    </div>

                    {createPlaylist && (
                        <div>
                            <CreatePlaylist onChange={handleChange} onSuccess={handleSuccess} />
                        </div>
                    )}
                </div>

                <div className="flex space-x-4">
                    {Playlist.map((p) => (
                        <div key={p._id}
                        className="relative">
                            <Link to={`/playlist/showPlaylist/${p._id}`}>
                            <MultiActionAreaCard
                             title={p.name} description={p.description}
                             thumbnail={p?.videos[0]?.thumbnail}
                            /></Link>

                            <div className="absolute bottom-3 mt-16 text-lg left-28 text-gray-800" variant="contained">
                                <DropDown
                                    options={["Add Video", "Remove Video", "Delete Playlist", "Edit Playlist"]}
                                    onSelect={(option) => handleSelect(option, p)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editId && (
                <div
                    className={`bg-white fixed top-20 bottom-0 right-0 left-0 backdrop-blur-md z-8 bg-gray-900 bg-opacity-50`}
                >
                    <div className="bg-gray-800 shadow-md">
                        <Edit videoUrl={REACT_APP_PLAYLIST_URL} data={editId} id={editId._id} type={"Playlist"} onSuccess={handleEditSuccess} />
                        <Button onClick={ChangeEdit} className="w-1/2" variant="contained">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {error && (
                <div className="font-bold text-white bg-red-500">
                    {error}
                </div>
            )}

            {videoToggle && (
                
                <div className="fixed top-10 left-20 flex justify-center items-center 
                z-20 backdrop-blur-lg bg-black bg-opacity-60 mt-2
                min-w-[50vw]">
                    <div className="bg-white w-[50vw] text-black p-8 rounded-lg w-[80vw]
                     max-w-3xl ">
                        <VideoForPlaylist playlistData ={savePlaylistId} />
                        <Button
                            onClick={() => setVideoToggle(false)}
                            className="mt-4 w-full border bg-blue-500"
                            variant="contained"
                            sx={{
                                backgroundColor: '#3b82f6', 
                                marginTop: "10px",
                                width: "40vw",
                                
                            }}
                            
                        >
                            Close Video Modal
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
