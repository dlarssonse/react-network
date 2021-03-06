import { AxiosError, AxiosResponse } from "axios";
import { isArray } from "util";

/**
 *
 */
export interface IServiceError {
  name: string;
  message: string;
  response?: AxiosResponse<any> | undefined;
  request?: any;
  code?: string | undefined;
  stack?: string | undefined;
  config?: any;
  isAxiosError?: boolean | undefined;
}

/**
 *
 * @param error
 * @param response
 */
export function ServiceError(
  error: Error | Error[] | AxiosError<any>,
  response?: any
): IServiceError | IServiceError[] {
  if (isArray(error)) {
    const errors: IServiceError[] = [];
    error.forEach(err => {
      errors.push({ response, ...err });
    });
    return errors;
  }

  return {
    response,
    ...error
  };
}

/**
 *
 * @param param0 response: AxiosResponse<any> | null, error?: AxiosError<any> | null
 */
export const handleAxiosResponse = ({
  response,
  error
}: {
  response: AxiosResponse<any> | null;
  error?: AxiosError<any> | AxiosError<any>[] | null;
}) => {
  return error
    ? { error: ServiceError(error), items: 0 }
    : response === null
    ? { error: ServiceError(new Error("response is empty")), items: 0 }
    : response.status !== 200
    ? {
        error: ServiceError(
          new Error(
            "response code is " + response.status + " not 200 as expected"
          ),
          { ...response }
        ),
        items: 0
      }
    : {
        data: response.data,
        error: null,
        items: response.headers["x-items-count"]
          ? Number(response.headers["x-items-count"])
          : 0
      };
};

/**
 *
 * @param param0 response: AxiosResponse<any> | null, error?: AxiosError<any> | null
 */
export const handleAxiosGraphQLResponse = ({
  response,
  error,
  type
}: {
  response: AxiosResponse<any> | null;
  error?: AxiosError<any> | AxiosError<any>[] | null;
  type: string;
}) => {
  return error
    ? { error: ServiceError(error), items: 0 }
    : response === null
    ? { error: ServiceError(new Error("response is empty")), items: 0 }
    : response.status !== 200
    ? {
        error: ServiceError(
          new Error(
            "response code is " + response.status + " not 200 as expected"
          ),
          { ...response }
        ),
        items: 0
      }
    : response.data.errors
    ? { error: ServiceError(response.data.errors, { ...response }), items: 0 }
    : {
        data: response.data.data[type],
        error: null,
        items: response.headers["x-items-count"]
          ? Number(response.headers["x-items-count"])
          : 0
      };
};

/**
 *
 * @param promise
 */
export const unboxAxios = (promise: Promise<AxiosResponse<any>>) =>
  promise.then(
    (response: AxiosResponse<any>) => ({ response, error: null }),
    (error: AxiosError<any> | AxiosError<any>[] | undefined) => ({
      response: null,
      error
    })
  );
