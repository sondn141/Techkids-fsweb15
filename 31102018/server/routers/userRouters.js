const express = require("express");;
const UserRouter = express.Router();

const UserModel = require("../model/userModel");

UserRouter.use((req, res, next) => {
    next();
});

UserRouter.get("/", async(req, res) => {
    try {
        const users = await UserModel.find({}, "name email avatar intro post").populate("post");
        res.json({ success: 1, users })
    } catch (error) {
        res.status(500).json({ success: 0, error: err });
    }
});

UserRouter.get("/:id", async(req, res) => {
    var userId = req.params.id;
    try {
        const userFound = await UserModel.findById(userId)
        if(!userFound){
            res.json({success: 0, message: "Not found!"});
        } else{
            res.json({success: 0, user: userFound});
        }
    } catch (error) {
        res.status(500).json({success: 0, message: error})
    }
});

UserRouter.post("/", async(req, res) => {
    const {name, email, password, avatar, intro} = req.body;
    try {
        const userCreated = UserModel.create({name, email, password, avatar, intro});
        res.status(201).json({success: 1, user: userCreated});
    } catch (error) {
        res.status(500).json({success: 0, message: error});
    }
})

UserRouter.put("/:id", async (req, res) => {
    var userId = req.params.id;
    const {name, password, avatar, intro, post} = req.body;
    try {
        const userFound = await UserModel.findById(userId);
        if(!userFound){
            res.status(404).json({success: 0, message: "Not Found!"})
        } else{
            for(key in {name, password, avatar, intro, post}){
                if(userFound[key] && req.body[key]){
                    userFound[key] = req.body[key];
                }
            }
            let userUpdated = await userFound.save();
            res.json({success: 1, user: userUpdated});
        }
    } catch (error) {
        console.log(error)
    }
})

UserRouter.delete("/:id", async(req, res) => {
    const userId = req.params.id;
    try {
        UserModel.remove({_id:userId});
        res.json({success: 1});
    } catch (error) {
        res.status(500).json({success: 0, message: err})
    }
})

module.exports = UserRouter;