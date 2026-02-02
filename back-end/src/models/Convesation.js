import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
  },
);
const groupSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    avatarUrl: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    createdAt: { type: Date, default: Date.now },
    },
);
const lastMessageSchema = mongoose.Schema(
{

    _id:{type:String},
    content:{type:String, default:null},
    senderId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt:{ type:Date, default: null},
},{
    _id:false
}
);
const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ["single", "group"], required: true },
  participants: 
    {
      type: [conversationSchema],
      ref: "User",
      required: true,
      index: true,
    },
  group:{
    type:[groupSchema],
  },
  lastMessageAt: { type: Date},
  seenBy:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
  ],
  lastMessage:{
    type:[lastMessageSchema],
    default:null,
  },
  unreadCount:{
    type: Map,
    of:Number,
    default:{}
  }
},{
    timestamps: true
});
conversationSchema.index({"participants.userId":1, lastMessageAt:-1});
export default mongoose.model("Conversation", messageSchema);
