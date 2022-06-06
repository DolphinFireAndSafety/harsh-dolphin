/**
 * Global app configurations.
 */
const STAGING_HOST = ['app.staging.coolie.com'];
const DEV_HOST = ['app.dev.coolie.com', 'localhost' ,'18.233.166.35'];
const PROD_HOST = ['app.coolie.com'];
const hostname = window.location.hostname;
let configs: any = {};
if (DEV_HOST.findIndex(item => { return item === hostname }) !== -1) {
    // Development environment
    const SOURCE = "http://operations-v2.cargo-baba.com/";
    configs = {
        SOURCE_URL: SOURCE,
        API_URL: SOURCE + 'api/',
        COOKIE_DOMAIN: '.operations-v2.cargo-baba.com',
    }
} else if (STAGING_HOST.findIndex(item => { return item === hostname }) !== -1) {
    // Development environment
    const SOURCE = "http://operations-v2.cargo-baba.com/";
    configs = {
        SOURCE_URL: SOURCE,
        API_URL: SOURCE + 'api/',
        COOKIE_DOMAIN: '.staging.coolie.com',
    }
} else if (PROD_HOST.findIndex(item => { return item === hostname }) !== -1) {
    // Production environment
    const SOURCE = "http://operations-v2.cargo-baba.com/";
    configs = {
        SOURCE_URL: SOURCE,
        API_URL: SOURCE + 'api/',
        COOKIE_DOMAIN: '.coolie.com',
    }
}
export default configs;