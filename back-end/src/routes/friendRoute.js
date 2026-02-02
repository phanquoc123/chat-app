import express from 'express';
import { sendFriendRequest,
acceptFriendRequest,
declineFriendRequest,
getAllFriends,
getFriendRequests} from '../controllers/friendController.js';

const router = express.Router();
router.post('/requests',sendFriendRequest);
router.post('/requests/:id/accept',acceptFriendRequest);
router.post('/requests/:id/decline',declineFriendRequest);
router.get('/',getAllFriends);
router.get('/requests',getFriendRequests);

export default router;