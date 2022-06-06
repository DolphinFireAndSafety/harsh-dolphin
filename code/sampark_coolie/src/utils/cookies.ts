import Cookie from 'js-cookie';
import apiConfigs from '../configs/apiConfigs';
/**
 * Returns the clinic_cookie is JSON Object.
 */
export const getCookie = () => {
    // const str: any = localStorage.getItem('login');
    // return JSON.parse(str);
    return Cookie.getJSON('coolie_cookie');
}
/**
 * Return true if login else false.
 */
export const isLogin = () => {
    try {
        /*  const str: any = localStorage.getItem('login');
         if (str === null) {
             return false;
         }
         if (JSON.parse(str).uniqueId) {
             return true;
         }
         return false; */
        const str: any = Cookie.getJSON('coolie_cookie');
        if (str === undefined || str === null || str === '') {
            return false;
        }
        if (str.xpr_user_id) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

export const updateCookie = (firstName?: string, lastName?: string, email?: string, emailVerified?: string, userAccess?: string) => {
    const str: any = localStorage.getItem('login');
    const obj = JSON.parse(str);
    if (firstName) {
        obj.firstName = firstName;
    }
    if (lastName) {
        obj.lastName = lastName;
    }
    if (email) {
        obj.email = email;
    }
    if (emailVerified || emailVerified === null) {
        obj.emailVerified = '';
    }
    localStorage.removeItem('login');
    localStorage.setItem('login', JSON.stringify(obj));

}
/**
 * Prepares cookie in string with separator;
 * for e.g name=value;age=value;
 */
export const prepareCookie = () => {
    const json = Cookie.getJSON('coolie_cookie');
    let cookieString: string = '';
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            let val = json[key];
            cookieString = cookieString + key + '=' + val + ';';
        }
    }
    return cookieString;
}

export const removeCookie = () => {
    Cookie.remove('coolie_cookie');
    Cookie.remove("coolie_cookie", { domain: apiConfigs.COOKIE_DOMAIN, path: '/' });
}