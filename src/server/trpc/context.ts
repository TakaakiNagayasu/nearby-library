import { type inferAsyncReturnType } from "@trpc/server";
import { type Session } from "next-auth";

import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { PrismaClient } from "@prisma/client";


type CreateContextOptions = {
  session: Session | null;
  prisma: PrismaClient;
  req: NextApiRequest;
  res: NextApiResponse;
};

/** Use this helper for:
 * - testing, so we don't have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
// 2. createContext の型定義
export const createContext = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  const session = await getServerAuthSession({ req, res });

  return {
    session,
    prisma,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
