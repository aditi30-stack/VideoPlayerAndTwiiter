import { Subscription } from "../models/SubscriptionModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id;

    if(!channelId) {
        throw new ApiError(200, "channel Id missing!")
    }
    
    let FoundSubscriptionId = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })

    if(!FoundSubscriptionId) {
        let CreatedSubscription = await Subscription.create({
            channel: channelId,
            subscriber: userId
        })
        if(!CreatedSubscription) {
            throw new ApiError(200, "Error creating subscription")
        }
        return res.status(200).json(new ApiResponse(200, CreatedSubscription, "Subscription created"))
    
    }

   let DeletedSubscription =  await Subscription.findByIdAndDelete(FoundSubscriptionId._id)
   if(!DeletedSubscription) {
    throw new ApiError(400, "Subscription not deleted!")
   }

   return res.status(200).json(new ApiResponse(200, DeletedSubscription, "Subscription removed!"))


})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id;

    if(!channelId) {
        throw new ApiError(200, "channel Id missing!")
    }

    let FoundSubscriptionId = await Subscription.find({
        channel: channelId,
        
    }).populate('subscriber', 'username avatar')

    if(FoundSubscriptionId.length === 0) {
        return res.status(200).json(new ApiResponse(200, FoundSubscriptionId, "No subscribers found!"))

    }
    return res.status(200).json(new ApiResponse(200, FoundSubscriptionId, "Subscribers found!"))


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    let SubscribersList = await Subscription.find({
        subscriber: subscriberId
    }).populate('channel', 'username avatar')

    if(SubscribersList.length === 0) {
        return res.status(200).json(new ApiResponse(200, SubscribersList, "Subscribers list not Found!"))
    }

    return res.status(200).json(new ApiResponse(200, SubscribersList, "Subscribers List Found"))
})


const checkSubscription = asyncHandler(async(req, res)=>{
    const {channelId} = req.params
    const userId = req.user._id

    let isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })

    if(isSubscribed) {
        return res.status(200).json(new ApiResponse(200, {isSubscribed: true}, "subscriber found!"))
    }
    else {
        return res.status(200).json(new ApiResponse(200, {isSubscribed: false}, "no subscriber found!"))
    }
    

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkSubscription
}