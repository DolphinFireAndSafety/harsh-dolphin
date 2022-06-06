import { getCookie, prepareCookie, removeCookie } from "./cookies"
/**
 * 
 * @param isAttachAuthParam true when request made after login
 * @param isMultiPart true if request is multipart/form-data : default to false
 */
export const attachHeader = (isAttachAuthParam: boolean, isMultiPart: boolean = false) => {
    try {
        const login: any = getCookie();
        if (isAttachAuthParam) {
            let headers = null;
            if (isMultiPart) {
                headers = {
                    'Content-Type': 'multipart/form-data',
                    // 'x-access-param': login.authParam,
                    // 'xpr_user_id': login.uniqueId,
                    'x-access-param': login.xprAuthUser,
                    'xpr_user_id': login.xpr_user_id,
                    'xcookie': prepareCookie(),
                    'xprApp': 'coolie'
                }
            } else {
                headers = {
                    'Content-Type': 'application/json',
                    /* 'x-access-param': login.authParam,
                    'xpr_user_id': login.uniqueId, */
                    'x-access-param': login.xprAuthUser,
                    'xpr_user_id': login.xpr_user_id,
                    'xcookie': prepareCookie(),
                    'xprApp': 'coolie'
                }
            }
            return headers;
        }
        const headers = {
            'Content-Type': 'application/json',
        }
        return headers;
    } catch (error) {
        removeCookie()
        window.location.href = '/';
    }
}