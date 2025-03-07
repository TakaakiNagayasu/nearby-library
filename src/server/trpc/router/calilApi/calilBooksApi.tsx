import { router, publicProcedure } from "../../trpc";
import { clientEnv } from "../../../../env/schema.mjs";
import { z } from "zod";
import { api } from "../apiInterface";
import { CONSTANTS } from "../../../../config/constants";
import type { IsbnCodesSystemidDetailZodObject } from "../../../../object/IsbnCodesSystemidDetailObject";
import { isbnCodesSystemidDetailZodObject } from "../../../../object/IsbnCodesSystemidDetailObject";
import type {
  CalilBooksApiResponse,
} from "../../../../interface/calilBooksApiInterface";
import type { SessionZodObject } from "../../../../object/SessionObject";
import { sessionZodObject } from "../../../../object/SessionObject";

export const calilBooksApiRouter = router({
  firstSearchCalilBooks: publicProcedure
    .input(isbnCodesSystemidDetailZodObject)
    .mutation(async ({ input }) => {
      return api<
        ConvertFirstTypeZodObject,
        UnusedZodObject,
        CalilBooksApiResponse,
        CalilBooksApiResponse,
        typeof convertCalilBooksApiResponse
      >(
        convertFirstInput(input),
        {},
        CONSTANTS.CALIL_BOOKS_API_URL,
        convertCalilBooksApiResponse
      );
    }),

  sessionSearchCalilBooks: publicProcedure
    .input(sessionZodObject)
    .mutation(async ({ input }) => {
      return api<
        ConvertSecondTypeZodObject,
        UnusedZodObject,
        CalilBooksApiResponse,
        CalilBooksApiResponse,
        typeof convertCalilBooksApiResponse
      >(
        convertSessionInput(input),
        {},
        CONSTANTS.CALIL_BOOKS_API_URL,
        convertCalilBooksApiResponse
      );
    }),
});

const convertFirstInput = (
  input: z.infer<IsbnCodesSystemidDetailZodObject>
): ConvertFirstType => ({
  appkey: clientEnv.NEXT_PUBLIC_CALIL_APP_KEY,
  format: "json",
  callback: "no",
  isbn: input.isbnCodes,
  systemid: input.systemidDetail,
});

const convertFirstTypeZodObject = z.object({
  appkey: z.string().or(z.undefined()),
  format: z.string(),
  callback: z.string(),
  isbn: z.string(),
  systemid: z.string(),
});

type ConvertFirstTypeZodObject = typeof convertFirstTypeZodObject;

type ConvertFirstType = z.infer<typeof convertFirstTypeZodObject>;

const convertSessionInput = (
  input: z.infer<SessionZodObject>
): ConvertSecondType => ({
  appkey: clientEnv.NEXT_PUBLIC_CALIL_APP_KEY,
  format: "json",
  callback: "no",
  session: input.session,
});

const convertSessionTypeZodObject = z.object({
  appkey: z.string().or(z.undefined()),
  format: z.string(),
  callback: z.string(),
  session: z.string(),
});

type ConvertSecondTypeZodObject = typeof convertSessionTypeZodObject;

type ConvertSecondType = z.infer<typeof convertSessionTypeZodObject>;

const unusedZodObject = z.object({
  unused: z.undefined(),
});

type UnusedZodObject = typeof unusedZodObject;

const convertCalilBooksApiResponse = (
  json: CalilBooksApiResponse
): CalilBooksApiResponse => {
  return json;
};
