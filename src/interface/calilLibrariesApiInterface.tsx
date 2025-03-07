import { z } from "zod";

export const calilLibrariesZodObject = z.array(
  z.object({
    libid: z.string().default(""),
    formal: z.string().default(""),
    libkey: z.string().default(""),
    systemid: z.string().default(""),
    systemname: z.string().default(""),
    url_pc: z.string().default(""),
    geocode: z.string().default(""),
    distance: z.string().default(""),
  })
);

export type CalilLibrariesZodObject = typeof calilLibrariesZodObject;

export type CalilLibraries = z.infer<typeof calilLibrariesZodObject>;

export type CalilLibrariesFromGeoCode = Array<
  Omit<CalilLibraries[number], "systemname" | "geocode"> & {
    latitude: number;
    longitude: number;
  }
>;
export type CalilLibrariesFromSystemid = Array<
  Pick<CalilLibraries[number], "formal" | "libkey" | "systemid" | "systemname">
>;
