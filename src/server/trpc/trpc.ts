import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { appRouter } from "./router/_app";
import { type Context } from "./context";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { createTRPCReact } from "@trpc/react-query";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export type AppRouter = typeof appRouter;

export const trpc = createTRPCReact<AppRouter>();

export const router = t.router;

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return {
    req,
    res,
    session: await getServerSession(req, res, authOptions),
  };
};

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
