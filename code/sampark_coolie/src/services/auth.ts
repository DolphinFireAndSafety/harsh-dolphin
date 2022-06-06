import configs from "../configs/apiConfigs";
import { BODY_TYPE, CommonApiOptions, METHOD_TYPE } from "../constants/api";
import { commonApi } from "../helpers/api";
import { attachHeader } from "../utils/apiHandler";

export const login = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'customerlogin',
        method: METHOD_TYPE.POST,
        body: {
            type: BODY_TYPE.RAW,
            data: data
        },
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
}

export const checkLogin = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'customerlogincheckkey',
        method: METHOD_TYPE.POST,
        body: {
            type: BODY_TYPE.RAW,
            data: data
        },
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
}

export const getLocationData = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'decryptbookingparameters',
        method: METHOD_TYPE.POST,
        body: {
            type: BODY_TYPE.RAW,
            data: data
        },
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
}