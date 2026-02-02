import mongoose from 'mongoose';
const FriendRequest = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message:{
        type: String,
        maxlength: 300,
    }
}, { timestamps: true });
FriendRequest.index({from: 1, to: 1}, {unique: true});
FriendRequest.index({from: 1});
FriendRequest.index({to: 1});

export default mongoose.model("FriendRequest", FriendRequest);