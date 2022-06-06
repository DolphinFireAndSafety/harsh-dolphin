import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../../components/footer/Footer'
import { Header } from '../../components/header/Header'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCookie } from '../../utils/cookies'
import Cookies from 'js-cookie';
import configs from '../../configs/apiConfigs'
import { checkLogin, getLocationData } from '../../services/auth'
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store/hook';
import { addAddress } from '../../store/bookNow/bookNowSlice'
import { getCountryName, getStateName } from '../../services/common'

export const MainPage = () => {
    let pCountryName: any = '', pStateName: any = '';
    let dCountryName: any = '', dStateName: any = '';
    const history = useNavigate();
    const location: any = useLocation();
    const dispatch = useAppDispatch();
    const [deliveryCountryName, setDeliveryCountryName] = useState('');
    const [pickupCountryName, setPickupCountryName] = useState('');
    const [pickupStateName, setPickupStateName] = useState('');
    const [deliveryStateName, setDeliveryStateName] = useState('');
    const addressData = useAppSelector((state) => state.bookNow.data);
    useEffect(() => {
        const login = getCookie();
        let sessId: any = "", overview: any = "";
        if (location && location.search) {
            sessId = new URLSearchParams(location.search).get('sessId');
            overview = new URLSearchParams(location.search).get('overview');
        }
        if (!login || login === undefined) {
            if (sessId) {
                checkSessionId();
            } else {
                history('/login');
            }
        } else if (location && location.pathname === '/') {
            if (sessId) {
                if (login.encryptedId === sessId) {
                    if (overview) {
                        fetchLocationData();
                    } else {
                        history('/booknow');
                    }
                } else {
                    Cookies.remove('coolie_cookie');
                    Cookies.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
                    checkSessionId();
                }
            } else {
                history('/booknow');
            }
        }
        if (location && location.pathname === '/overview' || location.pathname === '/payment') {
            if (!addressData || !addressData.serviceType || !addressData.pickupAddress || !addressData.deliveryAddress) {
                history('/booknow');
            }
        }
        if (location && location.pathname === '/payment') {
            if (!addressData.invoiceInfo) {
                history('/booknow');
            }
        }
    }, []);

    const checkSessionId = () => {
        console.log('checkSessionId', new URLSearchParams(location.search).get('sessId'));
        let request = {
            encrypted_id: new URLSearchParams(location.search).get('sessId')
        }
        checkLogin(request)
            .then((success) => {
                console.log('success Checklogin', success);
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    Cookies.set('coolie_cookie', json, { expires: 30 });
                    Cookies.remove('coolie_cookie'); Cookies.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
                    const key1 = 'id';
                    const key2 = 'name';
                    const key3 = 'email';
                    const key4 = 'mobile';
                    const key5 = 'encryptedId';
                    var json: any = {};
                    json[key1] = success.response.id;
                    json[key2] = success.response.first + " " + success.response.last;
                    json[key3] = success.response.email;
                    json[key4] = success.response.mobile;
                    json[key5] = new URLSearchParams(location.search).get('sessId');
                    Cookies.set('coolie_cookie', json, { expires: 30 });
                    Cookies.set('coolie_cookie', json, { domain: configs.COOKIE_DOMAIN, url: '/', expires: 30 });
                    if (location && location.search) {
                        let overview: any = new URLSearchParams(location.search).get('overview');
                        if (overview) {
                            fetchLocationData();
                        } else {
                            history('/booknow');
                        }
                    } else {
                        history('/booknow');
                    }
                } else if (success && success.status === false && success.errorcode === 500 && success.message) {
                    toast.error(success.message);
                    Cookies.remove('coolie_cookie'); Cookies.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
                    history('/login');
                }
            })
            .catch((error) => {
                console.log('Error while check login', error);
                Cookies.remove('coolie_cookie'); Cookies.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
                history('/login');
            })
    }

    const fetchLocationData = async () => {

        const overview: any = new URLSearchParams(location.search).get('overview');
        const request = {
            encrypted_parameter: overview
        }
        getLocationData(request)
            .then(async (success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    // if (success.response.origin_country) {
                    //     let data = await fetchCountryName(success.response.origin_country, 'pickup');
                    // }
                    // if (success.response.destination_country) {
                    //     let data1 = await fetchCountryName(success.response.destination_country, 'delivery');
                    // }
                    // if (success.response.origin_state) {
                    //     let data = await fetchStateName(success.response.origin_state, 'pickup');
                    // }
                    // if (success.response.destination_state) {
                    //     let data1 = await fetchStateName(success.response.destination_state, 'delivery');
                    // }
                    let pickupAddress: any = {
                        address1: success.response.origin,
                        address2: '',
                        pincode: success.response.origin_pincode,
                        city: success.response.origin_city,
                        state: success.response.origin_state_name,
                        country: success.response.origin_country_name,
                        landmark: '',
                        latitude: success.response.latitude,
                        longitude: success.response.longitude,
                        formatted_address: success.response.origin,
                        companyName: ''
                    }
                    let deliveryAddress: any = {
                        address1: success.response.destination,
                        address2: '',
                        pincode: success.response.destination_pincode,
                        city: success.response.destination_city,
                        state: success.response.destination_state_name,
                        country: success.response.destination_country_name,
                        landmark: '',
                        latitude: success.response.latitude1,
                        longitude: success.response.longitude1,
                        formatted_address: success.response.destination,
                        companyName: ''
                    }
                    const dataTemp: any = {
                        pickupAddress: pickupAddress,
                        deliveryAddress: deliveryAddress,
                        serviceType: success.response.sevice_name,
                        serviceTypeId: success.response.service_type,
                        pickupHubId: success.response.sourcehub,
                        deliveryHubId: success.response.destinationhub,
                        pickupHub: success.response.origin_hubname ? success.response.origin_hubname.company_name : '',
                        deliveryHub: success.response.destination_hubname ? success.response.destination_hubname.company_name : '',
                    }
                    dispatch(addAddress(dataTemp));
                    history('/overview');
                }
                else {
                    if (success && success.status === false && success.message) {
                        toast.error(success.message);
                    }
                    history('/booknow');
                }
            })
            .catch((error) => {
                console.log('Error while check login', error);
                Cookies.remove('coolie_cookie'); Cookies.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
                history('/login');
            })
    }
    const fetchCountryName = async (countryId: any, type: any) => {
        await getCountryName(countryId)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickup') {
                        setPickupCountryName(success.response);
                        pCountryName = success.response;
                    } else {
                        setDeliveryCountryName(success.response);
                        dCountryName = success.response;
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error while fetching country id', error);

            })
    }
    const fetchStateName = async (stateId: any, type: any) => {
        await getStateName(stateId)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickup') {
                        // await setPickupStateName(success.response);
                        pStateName = success.response;
                    } else {
                        // setDeliveryStateName(success.response);
                        dStateName = success.response;
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error while fetching state id', error);

            })
    }
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
