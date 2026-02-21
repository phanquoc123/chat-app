import e from "express";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async(req,res) => {
    try {

        const { to, message } = req.body;
        const from = req.user._id;

        if(from === to){
            return res.status(400).json(
                {
                 message: 'You cannot send friend request to yourself'
                }
            );
        }

        const userExist = await User.exists({ _id: to });
        if(!userExist){
            return res.status(404).json(
                {
                 message: 'User not found'
                }
            );
        }

        let userA = from.toString();
        let userB = to.toString();

        if(userA > userB){
            [userA, userB] = [userB, userA];
        }
        const [alreadyFriends, existquest] = await Promise.all([
            Friend.exists({ userA, userB }),
            FriendRequest.findOne({
                $or:[
                    {from, to},
                    {from: to, to:from}
                ]
            })
        ]);
        if(alreadyFriends){
            return res.status(400).json(
                {
                 message: 'You are already friends'
                }
            );
        }
        if(existquest){
            return res.status(400).json(
                {
                 message: 'Friend request already exists'
                }
            );
        }

        const friendRequest = await FriendRequest.create({
            from,
            to,
            message
        });
        return res.status(201).json(
            {
             message: 'Friend request sent successfully',
             data: friendRequest
            }
        );
    } catch (error) {
        console.error('Send Friend Request error:', error);
        return res.status(500).json(
            {
             message: 'Internal Server Error'
            }
        );
    }
}
export const acceptFriendRequest = async(req,res) => {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;

        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json(
                {
                 message: 'Friend request not found'
                }
            );
        }

        if(friendRequest.to.toString() !== userId.toString()){
            return res.status(403).json(
                {
                 message: 'You are not authorized to accept this friend request'
                }
            );
        }

       
        let userA = friendRequest.from.toString();
        let userB = friendRequest.to.toString();
        
        if(userA > userB){
            [userA, userB] = [userB, userA];
        }

        await Friend.create({
            userA,
            userB
        })

        await FriendRequest.findByIdAndDelete(requestId);

        const requestFromUser = await User.findById(friendRequest.from).select("_id displayName avatarUrl email").lean();

        return res.status(200).json(
            {
             message: 'Friend request accepted successfully',
             data:requestFromUser
            }
        );
    } catch (error) {
        console.error('Accept Friend error:', error);
        return res.status(500).json(
            {
             message: 'Internal Server Error'
            }
        );
    }
}
export const  declineFriendRequest = async(req,res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json(
                {
                 message: 'Friend request not found'
                }
            );
        }

        if(friendRequest.to.toString() !== userId.to.toString()){
            return res.status(403).json(
                {
                 message: 'You are not authorized to decline this friend request'
                }
            );
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(204).json(
            {
             message: 'Friend request declined successfully'
            }
        );
    } catch (error) {
        console.error('Decline Friend error:', error);
        return res.status(500).json(
            {
             message: 'Internal Server Error'
            }
        );
    }
}
export const getAllFriends = async(req,res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friend.find({
            $or:[
                { userA: userId },
                { userB: userId }
            ]
        })
        .populate('userA','_id displayName avatarUrl email')
        .populate('userB','_id displayName avatarUrl email')
        .lean();
        if(friendships.length === 0){
            return res.status(200).json({
                message: 'No friends found',
                data: []
            });
        }
        const friends = friendships.map((friend) => friend.userA._id.toString() === userId.toString() ? friend.userB : friend.userA);
        return res.status(200).json({
            message: 'Friends retrieved successfully',
            data: friends
        });
    } catch (error) {
        console.error('Get All Friends error:', error);
        return res.status(500).json(
            {
             message: 'Internal Server Error'
            }
        );
    }
}
export const getFriendRequests = async(req,res) => {
    try {
        const userId = req.user._id;
        const polulateFields = '_id username displayName avatarUrl'
        const [sent, received] =await Promise.all([
            FriendRequest.find({from:userId}).populate("to",polulateFields),
            FriendRequest.find({to:userId}).populate("from",polulateFields)

        ]
          
        )
        return res.status(200).json({sent,received}
        );
    } catch (error) {
        console.error('Get Friend Requests error:', error);
        return res.status(500).json(
            {
             message: 'Internal Server Error'
            }
        );
    }
}