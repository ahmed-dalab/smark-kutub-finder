import { Router } from 'express'
import { getUsers, createUser, getUser, updateUser, deletUser } from './user.controller.js'
const userRouter = Router()

//  get users 
userRouter.get('/', getUsers)
// create user 
userRouter.post('/', createUser)
// get user 
userRouter.get('/:id', getUser)
// update user
userRouter.put('/:id', updateUser)
// delete user
userRouter.delete('/:id', deletUser)

export default userRouter