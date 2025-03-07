import type { ZodObject, ZodRawShape } from "zod";
import type { z } from "zod";
import { createQParameter, createUrlParameter } from "./CreateParameter";

interface GoogleBooksApi<
  Req extends ZodObject<ZodRawShape>,
  Q extends ZodObject<ZodRawShape>,
  Res extends object,
  Ret
> {
  createUrlParameter: (inputUrlValues: Req) => string;
  createQParameter: (inputQValues: Q) => string;
  fetchUrl: (
    url: string,
    urlParameter: string,
    qParameter: string
  ) => Promise<Res>;
  processReturnParameter: (json: Res, processFunction: () => object) => Ret;
}

export const api = async <
  Req extends ZodObject<ZodRawShape>,
  Q extends ZodObject<ZodRawShape>,
  Res extends object,
  Ret,
  ProcessFunction extends (json: Res) => Ret
>(
  inputUrlValues: z.infer<Req>,
  inputQValues: z.infer<Q>,
  url: string,
  processFunction: ProcessFunction
): Promise<Ret> => {
  const urlParameter: string = createUrlParameter(inputUrlValues);
  const qParameter: string = createQParameter(inputQValues);
  const json = await fetchUrl<Res>(url, urlParameter, qParameter);
  return processReturnParameter(json, processFunction);
};

const fetchUrl = async <Res extends object>(
  url: string,
  urlParameter: string,
  qParameter: string
): Promise<Res> => {
  const fetchUrl = `${url}?${urlParameter}${
    qParameter.length > 0 ? "&" : ""
  }${qParameter}`;
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const json = await response.json();
  return json;
};

const processReturnParameter = <
  Res extends object,
  Ret,
  ProcessFunction extends (json: Res) => Ret
>(
  json: Res,
  processFunction: ProcessFunction
): Ret => {
  return processFunction(json);
};

export const apiInstance: GoogleBooksApi<
  ZodObject<ZodRawShape>,
  ZodObject<ZodRawShape>,
  object,
  object
> = {
  createUrlParameter,
  createQParameter,
  fetchUrl,
  processReturnParameter: (
    json: object,
    processFunction: (json: object) => object
  ) => {
    return processFunction(json);
  },
};
