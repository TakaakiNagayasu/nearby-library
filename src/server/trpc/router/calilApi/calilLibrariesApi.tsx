import { router, publicProcedure } from "../../trpc";
import { clientEnv } from "../../../../env/schema.mjs";
import { z } from "zod";
import { api } from "../apiInterface";
import { CONSTANTS } from "../../../../config/constants";
import type { LatitudeLongitudeLimit } from "../../../../object/LatitudeLongitudeLimitObject";
import { latitudeLongitudeLimitZodObject } from "../../../../object/LatitudeLongitudeLimitObject";
import type {
  CalilLibraries,
  CalilLibrariesFromGeoCode,
  CalilLibrariesFromSystemid,
} from "../../../../interface/calilLibrariesApiInterface";
import type { SystemidObject } from "../../../../object/SystemidsObject";
import { systemidZodObject } from "../../../../object/SystemidsObject";

export const calilLibrariesApiRouter = router({
  searchLibrariesFromGeoCode: publicProcedure
    .input(latitudeLongitudeLimitZodObject)
    .mutation(async ({ input }) => {
      return api<
        ConvertTypeFromGeoCodeZodObject,
        UnusedZodObject,
        CalilLibraries,
        CalilLibrariesFromGeoCode,
        typeof convertLibrariesFromGeoCodeApiResponse
      >(
        convertLibrariesFromGeoCodeInput(input),
        {},
        CONSTANTS.CALIL_LIBRARIES_API_URL,
        convertLibrariesFromGeoCodeApiResponse
      );
    }),

  searchLibrariesFromSystemid: publicProcedure
    .input(systemidZodObject)
    .mutation(async ({ input }) => {
      return api<
        ConvertTypeFromSystemidZodObject,
        UnusedZodObject,
        CalilLibraries,
        CalilLibrariesFromSystemid,
        typeof convertLibrariesFromSystemidApiResponse
      >(
        convertLibrariesFromSystemidInput(input),
        {},
        CONSTANTS.CALIL_LIBRARIES_API_URL,
        convertLibrariesFromSystemidApiResponse
      );
    }),
});

const convertLibrariesFromGeoCodeInput = (
  input: LatitudeLongitudeLimit
): ConvertTypeFromGeoCode => ({
  appkey: clientEnv.NEXT_PUBLIC_CALIL_APP_KEY,
  format: "json",
  callback: "no",
  geocode: `${input.longitude},${input.latitude}`,
  limit: input.limit,
});

const convertTypeFromGeoCodeZodObject = z.object({
  appkey: z.string().or(z.undefined()),
  format: z.string(),
  callback: z.string(),
  geocode: z.string(),
  limit: z.string(),
});

type ConvertTypeFromGeoCodeZodObject = typeof convertTypeFromGeoCodeZodObject;

type ConvertTypeFromGeoCode = z.infer<typeof convertTypeFromGeoCodeZodObject>;

const convertLibrariesFromSystemidInput = (
  input: SystemidObject
): ConvertTypeFromSystemid => ({
  appkey: clientEnv.NEXT_PUBLIC_CALIL_APP_KEY,
  format: "json",
  callback: "no",
  systemid: input.systemid,
});

const convertTypeFromSystemidZodObject = z.object({
  appkey: z.string().or(z.undefined()),
  format: z.string(),
  callback: z.string(),
  systemid: z.string(),
});
type ConvertTypeFromSystemidZodObject = typeof convertTypeFromSystemidZodObject;

type ConvertTypeFromSystemid = z.infer<typeof convertTypeFromSystemidZodObject>;

const unusedZodObject = z.object({
  unused: z.undefined(),
});

type UnusedZodObject = typeof unusedZodObject;

const convertLibrariesFromGeoCodeApiResponse = (
  json: CalilLibraries
): CalilLibrariesFromGeoCode => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return json.map(({ geocode, systemname, ...rest }) => {
    const [longitude, latitude] = geocode.split(",");
    return {
      ...rest,
      longitude: Number.parseFloat(longitude ?? "0"),
      latitude: Number.parseFloat(latitude ?? "0"),
    };
  });
};

const convertLibrariesFromSystemidApiResponse = (
  json: CalilLibraries
): CalilLibrariesFromSystemid => {
  return json.map(({ formal, libkey, systemid, systemname }) => ({
    formal,
    libkey,
    systemid,
    systemname,
  }));
};
