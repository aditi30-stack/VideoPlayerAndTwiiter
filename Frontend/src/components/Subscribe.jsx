import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { axioInstance, setupInterceptors } from "../interceptors";
import { useNavigate } from "react-router-dom";

export const SubscribeComponent = ({ owner }) => {
    const navigate = useNavigate();
    const [subscribed, setSubscribed] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setupInterceptors(navigate);
    }, [navigate]);

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                const response = await axioInstance.get(`/subscription/find/${owner}`);
                setSubscribed(response.data.data.isSubscribed); 
                setLoading(false); 
            } catch (e) {
                console.log(e);
                setLoading(false); 
            }
        };
        fetchSubscriptionStatus();
    }, [owner]);

    const toggleSubscription = async () => {
        try {
            const response = await axioInstance.post(`/subscription/c/${owner}`);
            setSubscribed((prev) => !prev);
        } catch (e) {
            console.log(e);
        }
    };

    if (loading) return <div>Loading...</div>; 

    return (
        <div className="w-4/5">
            <Button onClick={toggleSubscription} className="w-full" variant="contained">
                {subscribed ? "Subscribed" : "Subscribe"} 
            </Button>
        </div>
    );
};
