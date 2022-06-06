import { AxiosRequestConfig } from "axios";

export enum METHOD_TYPE {
    GET = 1,
    POST = 2,
    PUT = 3,
    DELETE = 4,
}
export enum BODY_TYPE {
    RAW = 1,
    FORM_DATA = 2
}
export interface CommonApiOptions {
    url: string;
    method: METHOD_TYPE;
    body?: {
        type: BODY_TYPE;
        data: {
            [key: string]: any;
        };
    },
    apiOptions: AxiosRequestConfig;
}