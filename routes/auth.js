const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


//REGISTER
router.get("/register", async (req,res) => {
    
    try{

        //GENERATE NEW PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //CREATE NEW USER
        const newUser = new User({
            username : req.body.username,
            fullName : req.body.fullName,
            email : req.body.email,
            password : hashedPassword,
        })
        
        //SAVE 
        const user = await newUser.save();

        res.status(200).json(user);
    }catch (err){
        res.status(500).json(err);
    }
});



//LOGIN
router.post("/login", async(req,res)=> {
    try{

        const user = await User.findOne({email : req.body.email});
        !user && res.status(404).json("user not found")

        if(user){
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            !validPassword && res.status(400).json("Wrong Password")

            if(validPassword){
                const accessToken = jwt.sign({id : user._id}, "mySecretKey");
                res.json({
                    username: user.username,
                    accessToken
                })
            }
        }

    }catch(err){
        res.status(500).json(err);
    }
}) 


const verify = (req,res,next) => {
    const authHeader =  req.headers.authorization
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, "mySecretKey", (err,user) => {
            if(err){
                return res.status(403).json("Token is not valid!")
            }
            req.users = user;
            next()
        })
    }else{
        res.status(401).json("You are not authenticated!")
    }

}


//PROFILE
router.get('/profile/:userId',verify, async (req,res) => {

    if(req.users.id === req.params.userId){
        const userDetails = await User.findById(req.params.userId) 
        res.status(200).json(userDetails)
    }else{
        res.status(403).json("You are not allowed to access this user details")
    }
})



module.exports = router;