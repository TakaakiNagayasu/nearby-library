import type { z, ZodObject, ZodRawShape } from "zod";

export const createParameter = <Gen extends ZodObject<ZodRawShape>>(
  inputValues: z.infer<Gen>,
  equalSymbol: string,
  joinSymbol: string
): string => {
  const paramMap = new Map<string, string>();

  Object.entries(inputValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      paramMap.set(key, String(value));
    }
  });

  const urlParameter = Array.from(paramMap)
    .map(([key, value]) => `${key}${equalSymbol}${value}`)
    .join(joinSymbol);
  return urlParameter;
};

export const createUrlParameter = <Req extends ZodObject<ZodRawShape>>(
  inputUrlValues: z.infer<Req>
): string => {
  return createParameter(inputUrlValues, "=", "&");
};

export const createQParameter = <Q extends ZodObject<ZodRawShape>>(
  inputQValues: z.infer<Q>
): string => {
  return Object.values(inputQValues).length > 0
    ? `q=${createParameter(inputQValues, ":", "+")}`
    : "";
};
