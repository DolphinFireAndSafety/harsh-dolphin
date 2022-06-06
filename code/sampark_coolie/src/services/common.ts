import configs from "../configs/apiConfigs";
import { BODY_TYPE, CommonApiOptions, METHOD_TYPE } from "../constants/api";
import { commonApi } from "../helpers/api";
import { attachHeader } from "../utils/apiHandler";

export const getCountryList = () => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'country',
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};

export const getStateList = (countryId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getStates',
        method: METHOD_TYPE.POST,
        body: {
            type: BODY_TYPE.RAW,
            data: countryId
        },
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
}
export const getCityList = (stateId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getCity',
        method: METHOD_TYPE.POST,
        body: {
            type: BODY_TYPE.RAW,
            data: stateId
        },
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
}
export const getCountryId = (countryName: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getcountry_id/' + countryName,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getStateId = (stateName: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getstate_id/' + stateName,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getCityId = (cityName: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getcity_id/' + cityName,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getCountryName = (countryId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'country_name/' + countryId,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getStateName = (stateId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'state_name/' + stateId,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getCityIName = (cityId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'city_name/' + cityId,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};