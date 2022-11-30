import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from '@prisma/client';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("reksat", token, {
    path: "/refresh_token",
    httpOnly: true,
  });
};

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
}

export const isAuth = ({ context } : any, next: any) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated");
  }

  return next();
};

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};