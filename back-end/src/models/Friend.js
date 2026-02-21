import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    userA:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userB:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

// Sorting is now handled in the controller before creating Friend records
// No need for pre-save hook

friendSchema.index({userA: 1, userB: 1}, {unique: true}); 
export default mongoose.model("Friend", friendSchema);