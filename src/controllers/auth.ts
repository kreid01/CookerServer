import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken, sendRefreshToken } from './../utils/auth';
import express from 'express'

const prisma = new PrismaClient()
const router = express.Router()

router.post("/", async (req: any, res: any) => {
     const token = req.cookies.reksat;
     if (!token) {
       return res.send({ ok: false, accessToken: "" });
     }
     let payload: any = null;
     try {
       payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
     } catch (err) {
       console.log(err);
       return res.send({ ok: false, accessToken: "" });
     }

     const user = await prisma.user.findFirst({where: { id: payload.userId }});

     if (!user) {
       return res.send({ ok: false, accessToken: "" });
     }

     if (user.tokenVersion !== payload.tokenVersion) {
       return res.send({ ok: false, accessToken: "" });
     }

     sendRefreshToken(res, createRefreshToken(user));

     return res.send({ ok: true, accessToken: createAccessToken(user) });
   });

export const authController = router