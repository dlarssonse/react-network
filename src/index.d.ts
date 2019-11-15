import { AxiosResponse, AxiosError } from 'axios';
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
export declare function ServiceError(error: Error | AxiosError<any>, response?: any): IServiceError;
/**
 *
 * @param response
 * @param error
 */
export declare const handleAxiosResponse: (response: AxiosResponse<any> | null, error?: AxiosError<any> | null | undefined) => {
    error: IServiceError;
    data?: undefined;
} | {
    data: any;
    error: null;
};
/**
 *
 * @param promise
 */
export declare const unboxAxios: (promise: Promise<AxiosResponse<any>>) => Promise<{
    response: AxiosResponse<any>;
    error: null;
} | {
    response: null;
    error: AxiosError<any> | undefined;
}>;