import express from 'express';

// import { checkFriendship } from '../middlewares/friendMiddleware.js';
import { createConversation, getConversation, getMessages } from '../controllers/conversationController.js';
import { checkFriendship } from '../middlewares/friendMiddleware.js';


const router = express.Router();

router.get('/', getConversation);
router.post('/',checkFriendship,createConversation);
router.get('/:conversationId/messages',getMessages);
export default router;