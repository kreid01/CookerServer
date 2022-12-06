import { createAccessToken, createRefreshToken } from "./../utils/auth";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import express from "express";
import { compare, hash } from "bcryptjs";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/info", async (req: any, res: any) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return null;
  }

  try {
    const token = authorization.split(" ")[1];
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    console.log(
      await prisma.user.findFirstOrThrow({ where: { id: payload.userId } })
    );
  } catch (err) {
    console.log(err);
    return null;
  }
});

router.post("/login", async (req: Request, res: any) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirstOrThrow({ where: { email: email } });

  if (!user) {
    res.status(404).send(`User not found`);
  }
  const valid = await compare(password, user.password);

  if (!valid) {
    res.status(404).send("bad password");
  }

  res.status(200).json(createAccessToken(user));
});

router.post("/register", async (req: any, res: any) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await hash(password, 12);

  try {
    await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });
  } catch (err) {
    console.log(err);
    res.status(400);
  }
  res.status(200);
});

router.get("/auth", async (req: Request, res: Response) => {
  const authorization = req.headers["authorization"];
  console.log(authorization);
  if (!authorization) {
    res.status(401);
  }
  try {
    if (authorization !== undefined) {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await prisma.user.findFirstOrThrow({
        where: { id: payload.userId },
      });
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const password = newPassword;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { password: password },
  });
  res.status(200).json(user);
});

router.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(post);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findFirstOrThrow({
    where: { id: Number(id) },
  });
  res.status(200).json(user);
});

export const usersController = router;
