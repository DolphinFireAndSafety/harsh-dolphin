import { AnyArray } from 'immer/dist/internal';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { bookingFrom } from '../../services/booknow';
import { useAppSelector, useAppDispatch } from '../../store/hook';
import { getCookie } from '../../utils/cookies';
import { getCountryList, getStateList, getCityList, getCountryId, getStateId, getCityId } from '../../services/common';

export const Payment = () => {
    const addressData = useAppSelector((state) => state.bookNow.data);
    const [selectedIndex, setSelectedIndex] = useState('');
    const vendors = useAppSelector((state) => state.bookNow.vendors);
    const [sCountyList, setSCountyList]: any = useState([]);
    const [rCountyList, setRCountyList]: any = useState([]);
    const [sStateList, setSStateList]: any = useState([]);
    const [rStateList, setRStateList]: any = useState([]);
    const [sCityList, setSCityList]: any = useState([]);
    const [rCityList, setRCityList]: any = useState([]);
    const [senderCountryId, setSenderCountryId] = useState('');
    const [senderStateId, setSenderStateId] = useState('');
    const [senderCityId, setSenderCityId] = useState('');
    const [receiverCountryId, setReceiverCountryId] = useState('');
    const [receiverStateId, setReceiverStateId] = useState('');
    const [receiverCityId, setReceiverCityId] = useState('');
    const { register, setValue, getValues, setError, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            sfirstname: '',
            slastname: '',
            semail: '',
            smobile: '',
            spickupaddress: '',
            slandmark: '',
            scountry: '',
            sstate: '',
            scity: '',
            spincode: '',
            scompanyname: '',
            sgstin: '',
            rfirstname: '',
            rlastname: '',
            remail: '',
            rmobile: '',
            rpickupaddress: '',
            rlandmark: '',
            rcountry: '',
            rstate: '',
            rcity: '',
            rpincode: '',
            rcompanyname: '',
            rgstin: '',
            billingpreference: 'Pickup Address',
            insurecargo: 'Yes',
            termsandcond: false,
            legal: false,
            consignment: false,
            promocode: ''
        }
    });

    useEffect(() => {
        if (addressData) {
            console.log('addressDataPayment', addressData);
        }
    }, [addressData]);
    useEffect(() => {
        fetchCountryList('pickupdeliver');
    }, []);

    useEffect(() => {
        if (vendors && vendors.pickup) {
            console.log('vendorsPayment', vendors);
            setValue('spickupaddress', vendors.pickup.address)
            setValue('scountry', vendors.pickup.country);
            setValue('sstate', vendors.pickup.state);
            setValue('scity', vendors.pickup.city);
            setValue('spincode', vendors.pickup.pincode);
            setValue('scompanyname', vendors.pickup.company_name);
            setValue('sgstin', vendors.pickup.gstn);
        }
        if (vendors && vendors.pickupContact && vendors.pickupContact.length > 0) {
            let receiver: any = vendors.pickupContact[0];
            let firstName: any = '', lastName: any = '';
            if (receiver && receiver.contact_name) {
                let name = receiver.contact_name.split(' ');
                console.log('name', name);
                if (name[0]) {
                    firstName = name[0];
                }
                if (name[1]) {
                    lastName = name[1];
                }
            }
            setValue('sfirstname', firstName);
            setValue('slastname', lastName);
            setValue('semail', receiver.contact_email);
            setValue('smobile', receiver.contact_mobile);
        }
        if (vendors && vendors.deliver) {
            console.log('vendorsPayment', vendors);
            setValue('rpickupaddress', vendors.deliver.address)
            setValue('rcountry', vendors.deliver.country);
            setValue('rstate', vendors.deliver.state);
            setValue('rcity', vendors.deliver.city);
            setValue('rpincode', vendors.deliver.pincode);
            setValue('rcompanyname', vendors.deliver.company_name);
            setValue('rgstin', vendors.deliver.gstn);
        }
        if (vendors && vendors.deliverContact && vendors.deliverContact.length > 0) {
            let receiver: any = vendors.deliverContact[0];
            let firstName: any = '', lastName: any = '';
            if (receiver && receiver.contact_name) {
                let name = receiver.contact_name.split(' ');
                console.log('name', name);
                if (name[0]) {
                    firstName = name[0];
                }
                if (name[1]) {
                    lastName = name[1];
                }
            }
            setValue('rfirstname', firstName);
            setValue('rlastname', lastName);
            setValue('remail', receiver.contact_email);
            setValue('rmobile', receiver.contact_mobile);
        }
        console.log('vendorsCheck', vendors);
        if (!vendors) {
            if (addressData.serviceType === 'Door to Door') {
                if (addressData.pickupAddress) {
                    fetchCountryId(addressData.pickupAddress.country, 'pickup');
                    fetchStateId(addressData.pickupAddress.state, 'pickup');
                    fetchCityId(addressData.pickupAddress.city, 'pickup');
                }
                if (addressData.deliveryAddress) {
                    fetchCountryId(addressData.deliveryAddress.country, 'delivery');
                    fetchStateId(addressData.deliveryAddress.state, 'delivery');
                    fetchCityId(addressData.deliveryAddress.city, 'delivery');
                }
            }
        }
    }, [vendors]);

    const fetchCountryId = (countryName: any, type: any) => {
        getCountryId(countryName)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    console.log('successCountryId', success);
                    if (type === 'pickup') {
                        setSenderCountryId(success.response);
                    } else {
                        setReceiverCountryId(success.response);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error while fetching country id', error);

            })
    }
    const fetchStateId = (stateName: any, type: any) => {
        getStateId(stateName)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    console.log('successCountryId', success);
                    if (type === 'pickup') {
                        setSenderStateId(success.response);
                    } else {
                        setReceiverStateId(success.response);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error while fetching state id', error);

            })
    }
    const fetchCityId = (cityName: any, type: any) => {
        getCityId(cityName)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    console.log('successCountryId', success);
                    if (type === 'pickup') {
                        setSenderCityId(success.response);
                    } else {
                        setReceiverCityId(success.response);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error while fetching city id', error);

            })
    }

    const fetchCountryList = (type: any) => {
        getCountryList()
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickupdeliver') {
                        setSCountyList(success.response);
                        setRCountyList(success.response);
                        if (!vendors) {
                            setValue('scountry', success.response[0].id);
                            setValue('rcountry', success.response[0].id);
                        }
                        if (vendors && !vendors.pickup) {
                            setValue('scountry', success.response[0].id);
                        }
                        if (vendors && !vendors.deliver) {
                            setValue('rcountry', success.response[0].id);
                        }
                    } else if (type === 'pickup') {
                        setSCountyList(success.response);
                    } else if (type === 'deliver') {
                        setRCountyList(success.response);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
                console.log('successCountry', success);
            })
            .catch((error) => {
                console.log('error while fetching country list', error);

            })
    }

    const fetchStateList = (countryId: any, type: any) => {
        getStateList({ country_id: countryId })
            .then((success) => {
                console.log('State', success);
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickup') {
                        setSStateList(success.response);
                        if (vendors && vendors.pickup && vendors.pickup.state) {
                            setValue('sstate', vendors.pickup.state);
                        }
                    } else {
                        setRStateList(success.response);
                        if (vendors && vendors.deliver && vendors.deliver.state) {
                            setValue('rstate', vendors.deliver.state);
                        }
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }

            })
            .catch((error) => {

            })
    }
    const fetchCityList = (stateId: any, type: any) => {
        getCityList({ state_id: stateId })
            .then((success) => {
                console.log('city', success);
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickup') {
                        setSCityList(success.response);
                        if (vendors && vendors.pickup && vendors.pickup.city) {
                            setValue('scity', vendors.pickup.city);
                        }
                    } else {
                        setRCityList(success.response);
                        if (vendors && vendors.deliver && vendors.deliver.city) {
                            setValue('rcity', vendors.deliver.city);
                        }
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {

            })
    }

    useEffect(() => {
        if (watch('scountry')) {
            fetchStateList(watch('scountry'), 'pickup');
        }
    }, [watch('scountry')]);
    useEffect(() => {
        if (watch('rcountry')) {
            fetchStateList(watch('rcountry'), 'deliver');
        }
    }, [watch('rcountry')]);
    useEffect(() => {
        if (watch('sstate')) {
            fetchCityList(watch('sstate'), 'pickup');
        }
    }, [watch('sstate')]);
    useEffect(() => {
        if (watch('rstate')) {
            fetchCityList(watch('rstate'), 'deliver');
        }
    }, [watch('rstate')]);

    const handleViewInvoice = (index: any) => {
        setSelectedIndex(index);
    }

    const handleProceedPayment = (data: any) => {
        console.log('dataPayment', data);
        const login = getCookie();
        let modeId: any = Number(Object.keys(addressData.invoiceInfo.mode));
        let volumetricboxes: any = [];
        for (let i = 0; i < addressData.invoiceInfo.invoices.length; i++) {
            let invoiceTemp = {
                "invoice_no": addressData.invoiceInfo.invoices[i].invoiceNumber,
                "length": addressData.invoiceInfo.invoices[i].dimensions.length,
                "width": addressData.invoiceInfo.invoices[i].dimensions.weight,
                "height": addressData.invoiceInfo.invoices[i].dimensions.height,
                "boxes": addressData.invoiceInfo.invoices[i].noOfBox,
                "grossweight": addressData.invoiceInfo.invoices[i].grossWeight,
                "dimentionalweight": addressData.invoiceInfo.invoices[i].dimentionalWeight,
                "chargeableweight": addressData.invoiceInfo.invoices[i].chargeableWeight,
                "invoice_value": addressData.invoiceInfo.invoices[i].invoiceValue,
                "way_bill": addressData.invoiceInfo.invoices[i].billNumber
            }
            volumetricboxes.push(invoiceTemp);
        }

        const request = {
            "customer_id": login.id,
            "mode_id": modeId,
            "service": addressData.invoiceInfo.servicePreferences === "Airline" ? "1" : "0",
            "volumetric_status": addressData.invoiceInfo.volumetricConsignment === "Yes" ? "1" : "0",
            "service_type": addressData.serviceTypeId,
            "origin": addressData.pickupAddress.formatted_address,
            "origin_city": addressData.pickupAddress.city,
            "destination_city": addressData.deliveryAddress.city,
            "destination": addressData.deliveryAddress.formatted_address,
            "pickupdate": moment(addressData.invoiceInfo.pickupDate).format('YYYY-MM-DD'),
            "cargo": addressData.invoiceInfo.cargoType,
            "sla": addressData.sla,
            "airline": addressData.invoiceInfo.airline,
            "flight_no": addressData.invoiceInfo.flightNo,
            "sourcehub": addressData.pickupHubId ? addressData.pickupHubId : '',
            "destinationhub": addressData.deliveryHubId ? addressData.deliveryHubId : '',
            "latitude": addressData.pickupAddress.latitude,
            "longitude": addressData.pickupAddress.longitude,
            "latitude1": addressData.deliveryAddress.latitude,
            "longitude1": addressData.deliveryAddress.longitude,
            "origin_pincode": addressData.pickupAddress.pincode,
            "destination_pincode": addressData.deliveryAddress.pincode,
            "pickup_distance": addressData.invoiceInfo.checkPrice.pickup.distance,
            "drop_distance": addressData.invoiceInfo.checkPrice.drop.distance,
            "pickup_id": addressData.invoiceInfo.checkPrice.pickup.id,
            "drop_id": addressData.invoiceInfo.checkPrice.drop.id,
            "timeslot": addressData.invoiceInfo.pickupTime,
            "no_boxes": addressData.noOfBox,
            "description": "",
            "chargeableweight": addressData.chargeableWeight,
            "grossweight": addressData.grossWeight,
            "totalamount": addressData.invoiceInfo.checkPrice.totalamount,
            "finalamount": addressData.invoiceInfo.checkPrice.finalamount,
            "rates_pickup_charges": addressData.invoiceInfo.checkPrice.rates.unitrate_for_pickup,
            "charges_type_for_pickup": addressData.invoiceInfo.checkPrice.rates.charges_type_for_pickup,
            "charges_type_for_drop": addressData.invoiceInfo.checkPrice.rates.charges_type_for_drop,
            "rates_drop_charges": addressData.invoiceInfo.checkPrice.rates.unitrate_for_drop,
            "pickup_distancein_km": addressData.invoiceInfo.checkPrice.pickup.distance,
            "pickup_to_hub_distance_km": addressData.invoiceInfo.checkPrice.pickuphubkilometers,
            "drop_hub_distance_km": addressData.invoiceInfo.checkPrice.drkilometers, //drkilometer
            "line_haul_charge_id": addressData.invoiceInfo.checkPrice.rates.id,  // rates.id
            "pickup_dropcharges_id": addressData.invoiceInfo.checkPrice.charges.id, // charges.id
            "frieghtcharges": addressData.invoiceInfo.checkPrice.frieghtcharges,
            "weight_id": addressData.invoiceInfo.checkPrice.weight_id,
            "insurance": addressData.invoiceInfo.checkPrice.insurance.id, // insurance.id
            "payment_id": "1",
            "uom": addressData.invoiceInfo.uom === 'cms' ? 0 : 1, // cms = 0 inch =1
            "data": {
                "volumetricboxes": volumetricboxes
            },
            "address": [
                {
                    "address_names": 1300, // flat no
                    "p_address": data.spickupaddress, // pickup hub
                    "address_city": data.scity,
                    "address_state": data.sstate,
                    "address_country": data.scountry,
                    "address_pincode": data.spincode,
                    "address_company": data.scompanyname, // hub name 
                    "address_name": data.sfirstname + " " + data.slastname, // firstname lastname
                    "address_number": data.smobile,
                    "address_gstn": data.sgstin
                },
                {
                    "address_names": 1500,
                    "p_address": data.rpickupaddress,
                    "address_city": data.rcity,
                    "address_state": data.rstate,
                    "address_country": data.rcountry,
                    "address_pincode": data.rpincode,
                    "address_company": data.rcompanyname,
                    "address_name": data.rfirstname + " " + data.rlastname,
                    "address_number": data.rmobile,
                    "address_gstn": data.rgstin
                }
            ]
        }
        console.log('createRequest', request);

        bookingFrom(request)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200) {
                    toast.success(success.message);
                }
            }).then((error) => {
                console.log('book_error', error);

            })

    }
    return (
        <section>
            <div className="container">
                <div className="hero-section">
                    <h1>Book Now</h1>
                    <div className="redioService">
                        <dl className="service_box">
                            <dt>Overview</dt>
                        </dl>

                        <ul className="overview-wrap mb-2">
                            <li>
                                <span>Mode: </span>
                                {addressData && addressData.invoiceInfo && addressData.invoiceInfo.mode && addressData.invoiceInfo.mode[1]}
                            </li>
                            <li><span>SLA: </span>{addressData && addressData.sla}</li>
                            <li><span>Volumetric Consignment: </span>{addressData && addressData.invoiceInfo && addressData.invoiceInfo.volumetricConsignment}</li>
                            <li><span>Service Type:</span>{addressData && addressData.serviceType}</li>
                            <li><span>Date:</span>{addressData && addressData.invoiceInfo && moment(addressData.invoiceInfo.pickupDate).format('DD-MM-YYYY')}</li>
                            <li><span>Time: </span>{addressData && addressData.invoiceInfo && addressData.invoiceInfo.pickupTime}</li>
                        </ul>


                        {/* <div className="overview-cont"> */}
                        {
                            (addressData && addressData.invoiceInfo && addressData.invoiceInfo.invoices && addressData.invoiceInfo.invoices.length > 0) &&
                            addressData.invoiceInfo.invoices.map((invoice: any, index: any) => {
                                return (
                                    <>
                                        <div key={invoice.invoiceNumber + index} className="overview-cont">
                                            <ul className="overview-inner mb-3">
                                                <li><span>Invoice Number:</span> {invoice.invoiceNumber}</li>
                                                <li><span>Invoice Value:</span> ₹ {invoice.invoiceValue}</li>
                                                <li><span>No of box:</span> {invoice.noOfBox}</li>
                                                <li><a onClick={() => { handleViewInvoice(index) }}><img src={require("../../assets/images/down.png")} /></a></li>
                                            </ul>
                                        </div>
                                        {
                                            (selectedIndex === index) &&
                                            <div className="overview-cont mb-2">
                                                <div className="overview-cont">
                                                    <ul className="overview-inner">
                                                        <li><span>Invoice Number:</span> {invoice.invoiceNumber}</li>
                                                        <li><span>Invoice Value:</span> ₹ {invoice.invoiceValue}</li>
                                                        <li><span>No of Box:</span>{invoice.noOfBox}</li>
                                                        <li><a onClick={() => { setSelectedIndex('') }}><img src={require("../../assets/images/close-black.png")} /></a></li>
                                                    </ul>
                                                    <ul className="overview-inner">
                                                        <li><span>Dimensions ( LxWxH ):</span> {invoice.dimensions.length} x {invoice.dimensions.weight} x {invoice.dimensions.height} cms </li>
                                                        <li><span>E-Way Bill Number: </span> {invoice.billNumber} </li>
                                                        <li><span>Gross Weight / Box:</span> {invoice.grossWeight} </li>
                                                    </ul>
                                                    <ul className="overview-inner">
                                                        <li><span>Dimensional Weight:</span> {invoice.dimentionalWeight} </li>
                                                        <li><span>Chargeable Weight: </span> {invoice.chargeableWeight} </li>
                                                        <li><span></span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        }
                                    </>
                                )
                            })
                        }

                    </div>


                    {/* </div> */}

                    <span className="border-space"><hr /></span>

                    <div className="custom-container">

                        <div className="mode-wrap progressBar">
                            <div className="progressCir"></div>

                            <div className="select-mode">
                                <div className="container">
                                    <ul className="main-form">
                                        <li>
                                            <label>Sender's First Name<sup>*</sup></label>
                                            <input type="text"
                                                {...register('sfirstname', { required: true })} />
                                            {
                                                (errors && errors.sfirstname && errors.sfirstname.type === 'required') &&
                                                <span className='text-danger'>Sender firstname is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Sender's Last Name<sup>*</sup></label>
                                            <input type="text" {...register('slastname', { required: true })} />
                                            {
                                                (errors && errors.slastname && errors.slastname.type === 'required') &&
                                                <span className='text-danger'>Sender lastname is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Sender's Email<sup>*</sup></label>
                                            <input type=""
                                                {...register('semail', {
                                                    required: true,
                                                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                                })} />
                                            {
                                                (errors && errors.semail && errors.semail.type === 'required') &&
                                                <span className='text-danger'>Sender email is required.</span>
                                            }
                                            {
                                                (errors && errors.semail && (errors.semail.type === 'pattern')) &&
                                                <span className='text-danger'>Sender email is invalid.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Mobile Number of Sender<sup>*</sup></label>
                                            <input type="text" {...register('smobile', {
                                                required: true,
                                                pattern: /^[0-9]+$/,
                                                minLength: 10, maxLength: 10
                                            })} />
                                            {
                                                (errors && errors.smobile && errors.smobile.type === 'required') &&
                                                <span className='text-danger'>Sender mobile number is required.</span>
                                            }
                                            {
                                                (errors && errors.smobile && (errors.smobile.type === 'pattern' || errors.smobile.type === "minLength" || errors.smobile.type === "max")) &&
                                                <span className='text-danger'>Sender mobile number is invalid.</span>
                                            }
                                        </li>
                                        <li className="full ">
                                            <label>Pickup Address<sup>*</sup></label>
                                            <input type="text" {...register('spickupaddress', { required: true })} />
                                            <input type="text" />
                                            {
                                                (errors && errors.spickupaddress && errors.spickupaddress.type === 'required') &&
                                                <span className='text-danger'>Sender address is required.</span>
                                            }
                                            <span className="detect-cont"><i><img src={require("../../assets/images/gps.png")} /></i><a href="">Detect my location</a></span>
                                        </li>
                                        <li className="full">
                                            <label>Landmark<sup>*</sup></label>
                                            <input type="text" {...register('slandmark', { required: true })} />
                                            {
                                                (errors && errors.slandmark && errors.slandmark.type === 'required') &&
                                                <span className='text-danger'>Sender landmark is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Country<sup>*</sup></label>
                                            {
                                                (senderCountryId) ?
                                                    <input type="text" disabled={true} {...register('scountry')} />
                                                    :
                                                    <select disabled={vendors && vendors.pickup} {...register('scountry', { required: true })}>
                                                        {
                                                            (sCountyList && sCountyList.length > 0) &&
                                                            sCountyList.map((country: any, index: any) => {
                                                                return (
                                                                    <option key={country.id + index} value={country.id}>{country.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                            }

                                            {
                                                (errors && errors.scountry && errors.scountry.type === 'required') &&
                                                <span className='text-danger'>Sender country is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>State<sup>*</sup></label>
                                            <select disabled={vendors && vendors.pickup} {...register('sstate', { required: true })}>
                                                {
                                                    (sStateList && sStateList.length > 0) &&
                                                    sStateList.map((state: any, index: any) => {
                                                        return (
                                                            <option key={state.id + index} value={state.id}>{state.state_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                (errors && errors.sstate && errors.sstate.type === 'required') &&
                                                <span className='text-danger'>Sender state is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>City<sup>*</sup></label>
                                            <select disabled={vendors && vendors.pickup} {...register('scity', { required: true })}>
                                                {
                                                    (sCityList && sCityList.length > 0) &&
                                                    sCityList.map((city: any, index: any) => {
                                                        return (
                                                            <option key={city.id + index} value={city.id}>{city.city_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                (errors && errors.scity && errors.scity.type === 'required') &&
                                                <span className='text-danger'>Sender city is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Pin-Code<sup>*</sup></label>
                                            <input disabled={vendors && vendors.pickup} type="text" {...register('spincode', {
                                                required: true,
                                                minLength: 6, maxLength: 6,
                                                pattern: /^[0-9]+$/,
                                            })} />
                                            {
                                                (errors && errors.spincode && errors.spincode.type === 'required') &&
                                                <span className='text-danger'>Sender pincode is required.</span>
                                            }
                                            {
                                                (errors && errors.spincode && (errors.spincode.type === 'pattern' || errors.spincode.type === "minLength" || errors.spincode.type === "maxLength")) &&
                                                <span className='text-danger'>Sender pincode is invalid.</span>
                                            }
                                        </li>
                                        <li >
                                            <label>Company name<sup>*</sup></label>
                                            <input type="text" {...register('scompanyname', { required: true })} />
                                            {
                                                (errors && errors.scompanyname && errors.scompanyname.type === 'required') &&
                                                <span className='text-danger'>Sender company name is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>GSTIN</label>
                                            <input type="text" {...register('sgstin', { required: false })} />
                                            {/* {
                                                (errors && errors.sgstin && errors.sgstin.type === 'required') &&
                                                <span className='text-danger'>Sender GSTIN is required.</span>
                                            } */}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mode-wrap mt-3 progressBar">
                            <div className="progressCir"></div>

                            <div className="select-mode">
                                <div className="container">
                                    <ul className="main-form">
                                        <li>
                                            <label>Reciever’s First Name<sup>*</sup></label>
                                            <input type="text" {...register('rfirstname', { required: true })} />
                                            {
                                                (errors && errors.rfirstname && errors.rfirstname.type === 'required') &&
                                                <span className='text-danger'>Reciever firstname is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Reciever’s Last Name<sup>*</sup></label>
                                            <input type="text" {...register('rlastname', { required: true })} />
                                            {
                                                (errors && errors.rlastname && errors.rlastname.type === 'required') &&
                                                <span className='text-danger'>Reciever lastname is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Reciever’s Email<sup>*</sup></label>
                                            <input type="text" {...register('remail', {
                                                required: true,
                                                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                            })} />
                                            {
                                                (errors && errors.remail && errors.remail.type === 'required') &&
                                                <span className='text-danger'>Reciever email is required.</span>
                                            }
                                            {
                                                (errors && errors.remail && (errors.remail.type === 'pattern')) &&
                                                <span className='text-danger'>Reciever email is invalid.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Mobile Number of Reciever<sup>*</sup></label>
                                            <input type="text" {...register('rmobile', {
                                                required: true,
                                                pattern: /^[0-9]+$/,
                                                minLength: 10, maxLength: 10
                                            })} />
                                            {
                                                (errors && errors.rmobile && errors.rmobile.type === 'required') &&
                                                <span className='text-danger'>Reciever mobile number is required.</span>
                                            }
                                            {
                                                (errors && errors.rmobile && (errors.rmobile.type === 'pattern' || errors.rmobile.type === "minLength" || errors.rmobile.type === "max")) &&
                                                <span className='text-danger'>Reciever mobile number is invalid.</span>
                                            }
                                        </li>
                                        <li className="full ">
                                            <label>Pickup Address<sup>*</sup></label>
                                            <input type="text" {...register('rpickupaddress', { required: true })} />
                                            <input type="text" />
                                            {
                                                (errors && errors.rpickupaddress && errors.rpickupaddress.type === 'required') &&
                                                <span className='text-danger'>Reciever address is required.</span>
                                            }
                                            <span className="detect-cont"><i><img src={require("../../assets/images/gps.png")} /></i><a href="">Detect my location</a></span>
                                        </li>
                                        <li className="full">
                                            <label>Landmark<sup>*</sup></label>
                                            <input type="text" {...register('rlandmark', { required: true })} />
                                            {
                                                (errors && errors.rlandmark && errors.rlandmark.type === 'required') &&
                                                <span className='text-danger'>Reciever landmark is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Country<sup>*</sup></label>
                                            <select disabled={vendors && vendors.deliver} {...register('rcountry', { required: true })}>
                                                {
                                                    (rCountyList && rCountyList.length > 0) &&
                                                    rCountyList.map((country: any) => {
                                                        return (
                                                            <option key={country.id} value={country.id}>{country.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                (errors && errors.rcountry && errors.rcountry.type === 'required') &&
                                                <span className='text-danger'>Reciever country is required.</span>
                                            }

                                        </li>
                                        <li>
                                            <label>State<sup>*</sup></label>
                                            <select disabled={vendors && vendors.deliver} {...register('rstate', { required: true })} >
                                                {
                                                    (rStateList && rStateList.length > 0) &&
                                                    rStateList.map((state: any) => {
                                                        return (
                                                            <option key={state.id} value={state.id}>{state.state_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                (errors && errors.rstate && errors.rstate.type === 'required') &&
                                                <span className='text-danger'>Reciever state is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>City<sup>*</sup></label>
                                            <select disabled={vendors && vendors.deliver} {...register('rcity', { required: true })}>
                                                {
                                                    (rCityList && rCityList.length > 0) &&
                                                    rCityList.map((city: any) => {
                                                        return (
                                                            <option key={city.id} value={city.id}>{city.city_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                (errors && errors.rcity && errors.rcity.type === 'required') &&
                                                <span className='text-danger'>Reciever city is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>Pin-Code<sup>*</sup></label>
                                            <input disabled={vendors && vendors.deliver} type="text" {...register('rpincode', {
                                                required: true, minLength: 6, maxLength: 6,
                                                pattern: /^[0-9]+$/,
                                            })} />
                                            {
                                                (errors && errors.rpincode && errors.rpincode.type === 'required') &&
                                                <span className='text-danger'>Reciever pincode is required.</span>
                                            }
                                            {
                                                (errors && errors.rpincode && (errors.rpincode.type === 'pattern' || errors.rpincode.type === "minLength" || errors.rpincode.type === "maxLength")) &&
                                                <span className='text-danger'>Reciever pincode is invalid.</span>
                                            }
                                        </li>

                                        <li >
                                            <label>Company name<sup>*</sup></label>
                                            <input type="text" {...register('rcompanyname', { required: true })} />
                                            {
                                                (errors && errors.rcompanyname && errors.rcompanyname.type === 'required') &&
                                                <span className='text-danger'>Reciever company name is required.</span>
                                            }
                                        </li>
                                        <li>
                                            <label>GSTIN</label>
                                            <input type="text" {...register('rgstin', { required: false })} />
                                            {/* {
                                                (errors && errors.rgstin && errors.rgstin.type === 'required') &&
                                                <span className='text-danger'>Reciever GSTIN is required.</span>
                                            } */}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mode-wrap mode-wrap-second mt-5 progressBar progNone">
                            <div className="progressCir"></div>

                            <div className="select-mode billing-cont">
                                <label>Billing Preference<sup>*</sup></label>

                                <dl className="service_box">
                                    <dd>
                                        <label className="custRadio">Pickup Address
                                            <input type="radio" checked={watch('billingpreference') === 'Pickup Address'} value='Pickup Address' {...register('billingpreference', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                    <dd>
                                        <label className="custRadio">Delivery Address
                                            <input type="radio" value='Delivery Address' checked={watch('billingpreference') === 'Delivery Address'} {...register('billingpreference', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                    <dd>
                                        <label className="custRadio">Other Address
                                            <input type="radio" value='Other Address' checked={watch('billingpreference') === 'Other Address'} {...register('billingpreference', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                </dl>
                                <dl className="service_box mt-5">
                                    <dt>Insure This Cargo<sup>*</sup></dt>
                                    <dd>
                                        <label className="custRadio">Yes
                                            <input type="radio" checked={watch('insurecargo') === 'Yes'} value="Yes" {...register('insurecargo', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                    <dd>
                                        <label className="custRadio">No
                                            <input type="radio" checked={watch('insurecargo') === 'No'} value='No' {...register('insurecargo', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                    <dd></dd>
                                    <dd></dd>
                                </dl>
                            </div>
                        </div>


                        <div className="agreement">
                            <label className="cust-checkbox">I agree with Coolie's terms & conditions.
                                <input type="checkbox" checked={watch('termsandcond')} {...register('termsandcond', { required: true })} />
                                <span className="checkmark"></span>
                            </label>
                            <label className="cust-checkbox">I declare that the cargo being transported are not illegal, explosives, military equipment etc.
                                <input type="checkbox" checked={watch('legal')} {...register('legal', { required: true })} />
                                <span className="checkmark"></span>
                            </label>
                            <label className="cust-checkbox">This consignment is sent by company and not from individual.
                                <input type="checkbox" checked={watch('consignment')} {...register('consignment', { required: true })} />
                                <span className="checkmark"></span>
                            </label>
                            {
                                (errors && errors.termsandcond && errors.termsandcond.type === 'required') &&
                                <span className='text-danger'>terms & condition is required.</span>
                            }
                            {
                                (errors && errors.legal && errors.legal.type === 'required') &&
                                <span className='text-danger'>terms & condition is required.</span>
                            }
                            {
                                (errors && errors.consignment && errors.consignment.type === 'required') &&
                                <span className='text-danger'>terms & condition is required.</span>
                            }
                        </div>

                        <div className="row">

                            <div className=" col-lg-5 col-sm-5 col-md-5 col-12">
                            </div>
                            <div className="total-left col-lg-7 col-sm-7 col-md-7 col-12">
                                <label>Apply Promo Code :</label>
                                <input type="text" {...register('promocode')} />
                                <a href="" className="total-right-image"><img src={require("../../assets/images/right.png")} /></a>

                                <div className="main-total">
                                    <h4>Esti. Shipping Charges :</h4>
                                    <label>14,024</label>
                                    <a href=""><i>
                                        <img src={require("../../assets/images/down2.png")} />
                                    </i></a>
                                </div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Pickup Charges :  </td>
                                            <td >₹ {addressData && addressData.invoiceInfo && addressData.invoiceInfo.checkPrice && addressData.invoiceInfo.checkPrice.charges && addressData.invoiceInfo.checkPrice.charges.pickup_charges}</td>
                                        </tr>
                                        <tr>
                                            <td>Delivery Charges :</td>
                                            <td >₹ {addressData && addressData.invoiceInfo && addressData.invoiceInfo.checkPrice && addressData.invoiceInfo.checkPrice.charges && addressData.invoiceInfo.checkPrice.charges.delivery_charges}</td>
                                        </tr>

                                        <tr>
                                            <td>Freight Charges :</td>
                                            <td>₹ {addressData && addressData.invoiceInfo && addressData.invoiceInfo.checkPrice && addressData.invoiceInfo.checkPrice.frieghtcharges}</td>
                                        </tr>
                                        <tr>
                                            <td> Other Charges :</td>
                                            <td>₹ {addressData && addressData.invoiceInfo && addressData.invoiceInfo.checkPrice && addressData.invoiceInfo.checkPrice.otherchargevalue}</td>
                                        </tr>
                                        <tr>
                                            <td>Discount :</td>
                                            <td>₹ {addressData && addressData.invoiceInfo && addressData.invoiceInfo.checkPrice && addressData.invoiceInfo.checkPrice.discount}</td>
                                        </tr>
                                        <tr>
                                            <td> Tax Amount :</td>
                                            <td>₹ {addressData && addressData.invoiceInfo && addressData.invoiceInfo.checkPrice && addressData.invoiceInfo.checkPrice.taxamount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="proceed-buton">
                            <button className="proceedBtn" onClick={handleSubmit(handleProceedPayment)}>Proceed to Payment</button>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}