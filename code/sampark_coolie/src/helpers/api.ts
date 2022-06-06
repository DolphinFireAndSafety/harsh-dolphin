import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { METHOD_TYPE, BODY_TYPE, CommonApiOptions } from '../constants/api';
const handleResponse = (response: AxiosResponse) => {
    if (response.status !== 200) throw response;
    else if (!response.data || (response.data && response.data.status && response.data.status.error === true)) throw response;
    else if (response.data === "") throw 'Something went wrong';
    return response.data;
}
const callGet = (options: CommonApiOptions) => {
    return Axios.get(options.url, options.apiOptions).then(response => {
        return handleResponse(response);
    }).then(success => {
        return success;
    }).catch(error => {
        if (error.data) throw JSON.parse(JSON.stringify(error.data.status));
        else throw 'Something went wrong';
    })
}
const prepareFormData = (data: { [key: string]: any }): FormData => {
    let formData = new FormData();
    for (let property in data) {
        formData.append(property, data[property]);
    }
    return formData;
}
const callPostIntermediate = (options: CommonApiOptions) => {
    if (options.body) {
        switch (options.body.type) {
            case BODY_TYPE.RAW:
                return callPost(options);
            case BODY_TYPE.FORM_DATA:
                options.body.data = prepareFormData(options.body.data);
                return callPost(options);
            default:
                throw 'Invalid call to function commonApi with invalid body type';
        }
    } else {
        throw 'No Body Defined';
    }
}
const callPost = (options: CommonApiOptions) => {
    if (options.body) {
        return Axios.post(options.url, options.body.data, options.apiOptions).then(response => {
            return handleResponse(response);
        }).then(success => {
            return success;
        }).catch(error => {
            if (error.data) throw JSON.parse(JSON.stringify(error.data.status));
            else throw 'Something went wrong';
        });
    }
    throw 'No Body Defined';
}
/** 
 * @param - method GET - 1, POST - 2, PUT - 3, DELETE - 4
*/
export const commonApi = (options: CommonApiOptions) => {
    switch (options.method) {
        case METHOD_TYPE.GET:
            return callGet(options);
        case METHOD_TYPE.POST:
            return callPostIntermediate(options);
        default:
            throw 'Invalid call to function commonApi';
    }
}