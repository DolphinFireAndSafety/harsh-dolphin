import configs from "../configs/apiConfigs";
import { BODY_TYPE, CommonApiOptions, METHOD_TYPE } from "../constants/api";
import { commonApi } from "../helpers/api";
import { attachHeader } from "../utils/apiHandler";

export const getmodeTypes = () => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getMode',
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};

export const getServiceTypes = (modeId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + "getservicetypebymode/" + modeId,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getHubs = (pincode: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + "gethubsbypincode/" + pincode,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};

export const checkPincodeAvaibility = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'checkPincodeAvailability',
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
export const getCargoTypes = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getCargoTypefromLinehaul',
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

export const getSLA = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getSLAfromLinehaul',
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

export const getAirline = () => {
    const request: CommonApiOptions = {
        url: configs.API_URL + "getairline",
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};

export const getflightbyairline = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getflightbyairline_date',
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

export const bookingFrom = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'bookingform',
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

export const checkPrice = (data: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + 'getpickup_new',
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

export const getVendorList = (vendorId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + "getVendor/" + vendorId,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};
export const getVendorContactDetails = (vendorId: any) => {
    const request: CommonApiOptions = {
        url: configs.API_URL + "getContactPerson/" + vendorId,
        method: METHOD_TYPE.GET,
        apiOptions: {
            headers: attachHeader(false),
            withCredentials: false
        }
    };
    return commonApi(request);
};