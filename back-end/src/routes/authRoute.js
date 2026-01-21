import express from 'express';

const router = express.Router();
router.post('/signup', async (req, res) => {
  // Call the signUp controller function here
  res.send('Sign Up Endpoint');
});