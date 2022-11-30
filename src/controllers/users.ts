import { createAccessToken, createRefreshToken, sendRefreshToken } from './../utils/auth';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express"
import express from 'express'
import { compare, hash} from 'bcryptjs'
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient()
const router = express.Router()


router.post('/', async (req: any, res: any) => {
  const {firstName, lastName, email, password } = req.body
  const result = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password
    }
  })
  res.status(201).json(result)
})

router.post('/logout', async (req: any, res: any) => {
  sendRefreshToken(res, "")
})

router.get('/info', async (req: any, res: any) => {
  const authorization = req.headers["authorization"]
    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      console.log(await prisma.user.findFirstOrThrow({where: {id:payload.userId}}))
    } catch (err) {
      console.log(err);
      return null;
    }
})

router.post('/login', async (req: Request, res: any) => {
    const {email, password} = req.body
    const user = await prisma.user.findFirstOrThrow({where: {email:email}})

    if(!user) {
        throw new Error(`User not found`)
    }
    const valid = await compare(password, user.password)

    if (!valid) {
      throw new Error("bad password");
    }

    sendRefreshToken(res, createRefreshToken(user));
console.log(createAccessToken(user))
   return {
      accessToken: createAccessToken(user),
      user,
    };
})

router.post('/register', async (req: any, res: any) => {
    const {firstName, lastName, email, password} = req.body
    const hashedPassword = await hash(password, 12)

    try {
      await prisma.user.create({
        data: {firstName, lastName, email, password: hashedPassword}
      })
    } catch(err) {
      console.log(err)
      return false
    }
    return true
})

router.put('/:id', async (req: Request, res: Response) => {
       const {id} = req.params 
       const {oldPassword, newPassword} = req.body
       const password = newPassword
       const user = await prisma.user.update({
        where: {id : Number(id)},
        data: {password: password}
       })
       res.status(200).json(user)
})

router.delete(`/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
    const user = await prisma.user.findFirstOrThrow({
    where: { id:Number(id) },
  })
  res.status(200).json(user)
})



export const usersController = router