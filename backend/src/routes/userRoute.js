const express= require('express');
const router = express.Router();
const userController= require('../controllers/user.controller');

router.post('/', userController.validateUser, userController.createUser );
router.get("/:id", userController.getUserById);
module.exports=router;