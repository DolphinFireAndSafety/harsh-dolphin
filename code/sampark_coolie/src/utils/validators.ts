
export const allowOnlyAlphaAndDigits = (email: string) => {
    const regEx = /^[A-Za-z0-9]*$/;
    return regEx.test(email);
}