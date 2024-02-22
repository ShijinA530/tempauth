const express = require('express');
const authController = require('../controllers/authControllers');
const router = express.Router();

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.post('/candidate',authController.candidate_post);
router.get('/candidate',authController.candidate_get);
router.post('/admin',authController.admin_login_post);
router.post('/voter-add',authController.voter_add_post);
router.post('/candidate-delete',authController.candidate_delete_post);
router.get('/voter',authController.voter_get);

module.exports = router;