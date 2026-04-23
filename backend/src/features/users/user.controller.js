import User from "./user.model.js"
import mongoose from "mongoose"

//  get users 
export const getUsers = async(req, res)=>{
    try {
      
        const users = await User.find().select("-password")
 

        res.status(200).json(
            users
        )
    } catch (error) {
        console.log(error)
    }
}

// create user 
export const createUser  = async(req, res)=>{
    try {
        // check if the email is already exist
        const existingUser = await User.findOne({
            email: req.body.email
        })
        if(existingUser){
            res.status(400).json({
                status: 'failed',
                message: 'Email already exists'
            })
            return
        }
          const user = await User.create(req.body)
         
          await user.save()
        res.status(201).json({
            status: 'success',
            message: 'User created successfully'
        })
    } catch (error) {
        console.log(error)
    }
}

// get single user
export const getUser = async(req, res)=>{
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
        const user = await User.findOne({_id: id})
        if(!user){
            res.status(404).json({
                status: 'failed',
                message: 'User not found'
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: 'User found',
            data: user
        })
    } catch (error) {
        console.log(error)
    }
}
//  update user 
export const updateUser = async(req, res)=>{
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
        const user = await User.findByIdAndUpdate(id, req.body)
        if(!user){
            res.status(404).json({ status: 'failed', message: 'User not found'})
            return
        }
        res.status(200).json({ status: 'success', message: 'User updated successfully'})
    } catch (error) {
         console.log(error)
    }
}
//  delete user 
export const deletUser = async(req, res)=>{
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }
        const user = await User.findByIdAndDelete(id)
        if(!user){
            res.status(404).json({ status: 'failed', message: 'User not found'})
            return
        }
        res.status(200).json({
            status: 'Success',
            message: 'Deleted user successfully'
        })
    } catch (error) {
         console.log(error)
    }
}
