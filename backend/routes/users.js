const express = require('express');

const router = express.Router();
const Usercontroller = require('../controllers/user')
const upload = require('../helper/upload')
const protectRoute = require('../middleware/AuthUser')
const uploadFields = upload.fields([
    { name: 'pic', maxCount: 2}
])


router.post('/SignIn',Usercontroller.SignIn);

router.post('/SignUp',uploadFields,Usercontroller.SignUp);

router.get('/getUser',Usercontroller.getall);
router.get('/getSingleUser/:id',Usercontroller.getuser)
router.get('/secure',protectRoute,Usercontroller.me)
module.exports = router;
