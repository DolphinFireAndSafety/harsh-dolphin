import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import { useForm } from 'react-hook-form';
import { checkPincodeAvaibility, getCargoTypes, getHubs, getmodeTypes, getServiceTypes, getSLA, getVendorContactDetails, getVendorList } from '../../services/booknow';
import { AddressModal } from '../../components/addressModal/AddressModal';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store/hook'
import { addAddress, addPickupVendorAddressDetails, addDeliverVendorAddressDetails, addPickupVendorContactDetails, addDeliverVendorContactDetails } from '../../store/bookNow/bookNowSlice'
import { useNavigate, useLocation } from 'react-router-dom'
export const BookNow = () => {
    let autcompleteRef: any = useRef();
    let autcompleteRef2: any = useRef();
    let autocomplete: any;
    let autocomplete2: any;

    const { register, getValues, setError, setValue, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            servicetype: 'Door to Door', pickupaddress: '', pickuphub: '', deliveryaddress: '', deliveryhub: '',
            sla: '',
            cargotype: '',
            noofbox: 1,
            grossweight: '',
            chargeableweight: ''
        }
    });
    const [mode, setMode] = useState('');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [isCheckPrice, setIsCheckPrice] = useState(false);
    const [location, setLocation]: any = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickupAddress, setPickupAddress]: any = useState('');
    const [deliveryAddress, setDeliveryAddress]: any = useState('');
    const [modalTitle, setModalTitle] = useState('Pickup Address');
    const [pickupAddressValidation, setPickupAddressValidation]: any = useState({ isValid: true, msg: '' });
    const [deliveryAddressValidation, setDeliveryAddressValidation]: any = useState({ isValid: true, msg: '' });
    const [pickupHub, setPickupHub] = useState([]);
    const [deliveryHub, setDeliveryHub] = useState([]);
    const [cargoTypes, setCargoTypes] = useState([]);
    const [SLAs, setSLAs] = useState([]);
    const history = useNavigate();
    const dispatch = useAppDispatch();
    const addressData = useAppSelector((state) => state.bookNow.data);


    useEffect(() => {
        console.log('addressDataBack', addressData);
        onLoadGetPlace();
        getmodeTypes()
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setMode(success.response);
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('errorMode', error);
            })
        if (addressData) {
            setValue('servicetype', addressData.serviceType);
            setValue('pickuphub', addressData.pickupHub);
            setValue('deliveryhub', addressData.deliveryHub);
            setPickupAddress(addressData.pickupAddress);
            setDeliveryAddress(addressData.deliveryAddress);
        }
    }, []);

    const onLoadGetPlace = () => {
        if (!document.getElementById('googlePlaceScript')) {
            const googleScript = document.createElement('script');
            googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCtTed7y_ePqg1QoDMHOyu01FtP_Ot-mDU&libraries=places`
            googleScript.id = "googlePlaceScript";
            window.document.body.appendChild(googleScript);
            googleScript.addEventListener('load', () => {
                try {
                    //@ts-ignore
                    autocomplete = new window.google.maps.places.Autocomplete(
                        autcompleteRef.current,
                        {
                            types: ['establishment'],
                        }
                    );
                    autocomplete.addListener('place_changed', () => {
                        const place = autocomplete.getPlace();
                        console.log('pickupPlace', place);

                        let pickupForm = {
                            subpremise: '',
                            street_number: '',
                            route: '',
                            sublocality_level_1: '',
                            locality: '',
                            administrative_area_level_1: '',
                            country: '',
                            postal_code: '',
                            latitude: '',
                            longitude: '',
                            address_level_1_short: '',
                            neighborhood: '',
                            formatted_address: '',
                            address1: '', landmark: ''
                        };
                        for (let start = 0; start < place.address_components.length; start++) {
                            const addressType = place.address_components[start].types[0];
                            if (addressType === "street_number") {
                                pickupForm.street_number = place.address_components[start].long_name;
                            } else if (addressType === "subpremise") {
                                pickupForm.subpremise = place.address_components[start].short_name;
                            } else if (addressType === "route") {
                                pickupForm.route = place.address_components[start].long_name;
                            } else if (addressType === "sublocality_level_1") {
                                pickupForm.sublocality_level_1 = place.address_components[start].long_name;
                            } else if (addressType === "locality") {
                                pickupForm.locality = place.address_components[start].long_name;
                            } else if (addressType === "administrative_area_level_1") {
                                pickupForm.administrative_area_level_1 = place.address_components[start].long_name;
                                pickupForm.address_level_1_short = place.address_components[start].short_name;
                            } else if (addressType === "country") {
                                pickupForm.country = place.address_components[start].long_name;
                            } else if (addressType === "postal_code") {
                                pickupForm.postal_code = place.address_components[start].short_name;
                            } else if (addressType === 'neighborhood') {
                                pickupForm.neighborhood = place.address_components[start].long_name;
                            }
                            pickupForm.latitude = place.geometry.location.lat();
                            pickupForm.longitude = place.geometry.location.lng();
                            pickupForm.formatted_address = place.formatted_address.trim();
                        }
                        console.log('pickupAddress', pickupForm);

                        setModalTitle('Pickup Address');
                        setPickupAddress(pickupForm);
                        setIsModalVisible(true);
                    });

                } catch (err) {
                    console.log(err);
                }
                try {
                    //@ts-ignore
                    autocomplete2 = new window.google.maps.places.Autocomplete(
                        autcompleteRef2.current,
                        {
                            types: ['establishment'],
                        }
                    );
                    //@ts-ignore
                    autocomplete2.addListener('place_changed', () => {
                        const place = autocomplete2.getPlace();
                        let deliveryForm = {
                            subpremise: '',
                            street_number: '',
                            route: '',
                            sublocality_level_1: '',
                            locality: '',
                            administrative_area_level_1: '',
                            country: '',
                            postal_code: '',
                            latitude: '',
                            longitude: '',
                            address_level_1_short: '',
                            neighborhood: '',
                            formatted_address: '',
                            address1: '', landmark: ''
                        };
                        for (let start = 0; start < place.address_components.length; start++) {
                            const addressType = place.address_components[start].types[0];
                            if (addressType === "street_number") {
                                deliveryForm.street_number = place.address_components[start].long_name;
                            } else if (addressType === "subpremise") {
                                deliveryForm.subpremise = place.address_components[start].short_name;
                            } else if (addressType === "route") {
                                deliveryForm.route = place.address_components[start].long_name;
                            } else if (addressType === "sublocality_level_1") {
                                deliveryForm.sublocality_level_1 = place.address_components[start].long_name;
                            } else if (addressType === "locality") {
                                deliveryForm.locality = place.address_components[start].long_name;
                            } else if (addressType === "administrative_area_level_1") {
                                deliveryForm.administrative_area_level_1 = place.address_components[start].long_name;
                                deliveryForm.address_level_1_short = place.address_components[start].short_name;
                            } else if (addressType === "country") {
                                deliveryForm.country = place.address_components[start].long_name;
                            } else if (addressType === "postal_code") {
                                deliveryForm.postal_code = place.address_components[start].short_name;
                            } else if (addressType === 'neighborhood') {
                                deliveryForm.neighborhood = place.address_components[start].long_name;
                            }
                            deliveryForm.latitude = place.geometry.location.lat();
                            deliveryForm.longitude = place.geometry.location.lng();
                            deliveryForm.formatted_address = place.formatted_address.trim();
                        }
                        setDeliveryAddress(deliveryForm);
                        setModalTitle('Delivery Address');
                        setIsModalVisible(true);
                    });

                } catch (err) {
                    console.log(err);
                }
            });
        } else {
            // try {
            //     //@ts-ignore
            //     autocomplete = new window.google.maps.places.Autocomplete(
            //         autcompleteRef.current,
            //         {
            //             types: ['(regions)'],
            //         }
            //     );
            //     autocomplete.addListener('place_changed', () => {
            //         const place = autocomplete.getPlace();
            //         console.log('place2', place);
            //         setLocation(place);
            //         setIsModalVisible(true);
            //     });
            // } catch (err) {
            //     console.log(err);
            // }
        }
    }

    useEffect(() => {
        if (mode) {
            let modeId: any = Number(Object.keys(mode));
            getServiceTypes(modeId)
                .then((success) => {
                    if (success && success.status === true && success.errorcode === 200 && success.response) {
                        setServiceTypes(success.response);
                    } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                    }
                })
                .catch((error) => {
                    console.log('errorMode', error);
                })
        }
    }, [mode]);

    useEffect(() => {
        if (isCheckPrice) {
            fethchCargoTypes();
        }
    }, [isCheckPrice]);

    const fethchCargoTypes = () => {
        let modeId: any = Number(Object.keys(mode));
        const request: any = {
            source_city_name: pickupAddress.city, destination_city_name: deliveryAddress.city, mode: modeId
        }
        getCargoTypes(request)
            .then((success) => {
                if (success) {
                    setCargoTypes(success);
                    if (success && success.length > 0) {
                        setValue('cargotype', success[0].id);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('errorMode', error);
            })
    }

    const fetchSLA = (cargoId: any) => {
        let modeId: any = Number(Object.keys(mode));
        const request: any = {
            source_city_name: pickupAddress.city, destination_city_name: deliveryAddress.city, mode: modeId, cargo: Number(cargoId)
        }
        getSLA(request)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setSLAs(success.response);
                    if (success && success.response && success.response.length > 0) {
                        setValue('sla', success.response[0].id);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('errorSLA', error);
            })
    }

    const handleModal = () => {
        $(".detect-cont a").click(function () {
            $(".direction-pop-up").show();
        });

        $(".loginBtn").click(function () {
            $(".direction-pop-up").hide();
        })
    }
    const addNoOfBox = () => {
        setValue('noofbox', getValues('noofbox') + 1);
    }
    const subNoOfBox = () => {
        if (getValues('noofbox') === 1) {
            return;
        }
        setValue('noofbox', getValues('noofbox') - 1);
    }

    const detectMyLocation = () => {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position: any) => {
                setModalTitle('Pickup Address')
                setIsModalVisible(true);
            })
        }
    }

    const handleProcced = () => {
        if (!pickupAddress || !pickupAddress.pincode) {
            toast.error('Pickup address pincode is required.');
            setPickupAddressValidation({ isValid: false, msg: 'Pickup address pincode is required.' });
            return;
        }
        if (!deliveryAddress || !deliveryAddress.pincode) {
            toast.error('Delivery address pincode is required.');
            setDeliveryAddressValidation({ isValid: false, msg: 'Delivery address pincode is required.' });
            return;
        }
        if ((watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub") && !watch('deliveryhub')) {
            toast.error('Delivery hub is required.');
            return;
        }
        if ((watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Hub To Door") && !watch('pickuphub')) {
            toast.error('Pickup hub is required.');
            return;
        }
        checkPincodeAvaibility({ source_pincode: pickupAddress.pincode, dest_pincode: deliveryAddress.pincode })
            .then((success) => {
                if (success && success.status === true) {
                    setIsCheckPrice(true);
                } else if (success && success.status === false && success.msg) {
                    toast.error(success.msg)
                }
            })
            .catch((error) => {
                console.log('errorMode', error);
            })
    }

    useEffect(() => {
        if (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub" || watch('servicetype') === "Hub To Door") {
            if (pickupAddress && pickupAddress.pincode) {
                fetchGetHubs(pickupAddress.pincode, 'pickupAddress');
            }
            if (deliveryAddress && deliveryAddress.pincode) {
                fetchGetHubs(deliveryAddress.pincode, 'deliveryAddress');
            }
        }
    }, [watch('servicetype')]);

    const fetchGetHubs = (pincode: any, type: any) => {
        getHubs(pincode).then((success) => {
            if (success && success.status === true && success.errorcode === 200 && success.response) {
                if (type === 'pickupAddress') {
                    setPickupHub(success.response);
                    if (success.response && success.response.length > 0) {
                        setValue('pickuphub', success.response[0].id);
                    }
                } else {
                    setDeliveryHub(success.response);
                    if (success.response && success.response.length > 0) {
                        setValue('deliveryhub', success.response[0].id);
                    }
                }
            } else if (success && success.errorcode === 200 && success.status === false) {
                toast.error(success.message);
            }
        }).catch((error) => {
            console.log('error Hubv', error);
        })
        if (isCheckPrice) {
            fethchCargoTypes();
        }
    }

    const handleAddressModalOk = (addressForm: any) => {
        if (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub" || watch('servicetype') === "Hub To Door") {
            console.log('addressForm', addressForm);
            getHubs(addressForm.pincode).then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (modalTitle === 'Pickup Address') {
                        setPickupHub(success.response);
                        setPickupAddress(addressForm);
                        if (success.response && success.response.length > 0) {
                            setValue('pickuphub', success.response[0].id);
                        }
                    } else {
                        setDeliveryHub(success.response);
                        setDeliveryAddress(addressForm);
                        if (success.response && success.response.length > 0) {
                            setValue('deliveryhub', success.response[0].id);
                        }
                    }
                } else if (success && success.errorcode === 200 && success.status === false) {
                    toast.error(success.message);
                }
            }).catch((error) => {
                console.log('error Hubv', error);
            })
        } else {
            if (modalTitle === 'Pickup Address') {
                setPickupAddress(addressForm);
            } else {
                setDeliveryAddress(addressForm);
            }
        }
        if (isCheckPrice) {
            fethchCargoTypes();
        }
        setIsModalVisible(false)
    }

    useEffect(() => {
        if (watch('cargotype')) {
            fetchSLA(watch('cargotype'));
        }
    }, [watch('cargotype')]);

    const handleSubmitBtn = (data: any) => {
        let pickHubName: any = '', deliveryHubName: any = '';
        if (data.servicetype === 'Hub To Hub' || data.servicetype === 'Hub To Door' && pickupHub && pickupHub.length > 0) {
            pickHubName = pickupHub.find((item: any) => { return Number(item.id) === Number(data.pickuphub) });
        }
        if (data.servicetype === 'Hub To Hub' || data.servicetype === 'Door To Hub') {
            deliveryHubName = deliveryHub.find((item: any) => { return Number(item.id) === Number(data.deliveryhub) });
        }
        let selectedServiceType: any = serviceTypes.find((item: any) => { return data.servicetype === item.name });
        const dataTemp: any = {
            // pickupAddress: {
            //     address1: pickupAddress.address1,
            //     address2: pickupAddress.sublocality_level_1,
            //     pincode: pickupAddress.postal_code,
            //     city: pickupAddress.locality,
            //     state: pickupAddress.administrative_area_level_1,
            //     country: pickupAddress.country,
            //     landmark: pickupAddress.landmark,
            //     formatted_address: pickupAddress.formatted_address
            // },
            // deliveryAddress: {
            //     address1: deliveryAddress.address1,
            //     address2: deliveryAddress.sublocality_level_1,
            //     pincode: deliveryAddress.postal_code,
            //     city: deliveryAddress.locality,
            //     state: deliveryAddress.administrative_area_level_1,
            //     country: deliveryAddress.country,
            //     landmark: deliveryAddress.landmark,
            //     formatted_address: deliveryAddress.formatted_address
            // },
            pickupAddress: pickupAddress,
            deliveryAddress: deliveryAddress,
            serviceType: data.servicetype,
            serviceTypeId: selectedServiceType.id,
            pickupHubId: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Hub To Door') ? data.pickuphub : '',
            deliveryHubId: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Door To Hub') ? data.deliveryhub : '',
            pickupHub: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Hub To Door') ? pickHubName.company_name : '',
            deliveryHub: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Door To Hub') ? deliveryHubName.company_name : '',
            sla: data.sla,
            cargoType: data.cargotype,
            noOfBox: data.noofbox,
            grossWeight: data.grossweight,
            chargeableWeight: data.chargeableweight,
        }
        dispatch(addAddress(dataTemp));
        history('/overview');
    }

    const getVendors = (pickupHubId: any, type: any) => {
        getVendorList(pickupHubId)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickup') {
                        dispatch(addPickupVendorAddressDetails(success.response));
                    } else {
                        dispatch(addDeliverVendorAddressDetails(success.response));
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
                console.log('successVendor', success);

            })
            .catch((error) => {

            })
    }
    const fetchVendorContactDetails = (vendorId: any, type: any) => {
        getVendorContactDetails(vendorId)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (type === 'pickup') {
                        dispatch(addPickupVendorContactDetails(success.response));
                    } else {
                        dispatch(addDeliverVendorContactDetails(success.response));
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
                console.log('successVendorContact', success);

            })
            .catch((error) => {
                console.log('error while fetching vendor details', error);

            })
    }

    useEffect(() => {
        if (watch('pickuphub') && (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Hub To Door")) {
            getVendors(watch('pickuphub'), 'pickup');
            fetchVendorContactDetails(watch('pickuphub'), 'pickup');
        }
    }, [watch('pickuphub')]);
    useEffect(() => {
        if (watch('deliveryhub') && (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub")) {
            getVendors(watch('deliveryhub'), 'delivery');
            fetchVendorContactDetails(watch('deliveryhub'), 'delivery');
        }
    }, [watch('deliveryhub')]);

    return (
        <>
            <section id="container">
                <div className="container">
                    <div className="hero-section">
                        <h1>Book Now</h1>
                        <div className="redioService">
                            <dl className="service_box">
                                <dt>Service Type <sup>*</sup></dt>
                                {
                                    (serviceTypes && serviceTypes.length > 0) &&
                                    serviceTypes.map((service: any) => {
                                        return (
                                            <dd key={service.id}>
                                                <label className="custRadio">{service.name}
                                                    <input type="radio"
                                                        checked={watch('servicetype') === service.name ? true : false} value={service.name}
                                                        {...register('servicetype', { required: true })}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </dd>
                                        )
                                    })
                                }
                            </dl>
                            <div className="address-list">
                                <div className="addCont">
                                    <div className="selcet_wrap">
                                        <label>Pickup City<sup>*</sup></label>
                                        <input type="text" id="autocomplete"
                                            value={pickupAddress ? pickupAddress.formatted_address : pickupAddress}
                                            onChange={(e) => { setPickupAddress(e.target.value); }}
                                            ref={autcompleteRef} placeholder="City or postal code" />
                                        <span className="detect-cont"><i><img src={require("../../assets/images/gps.png")} /></i><a onClick={() => { detectMyLocation() }}>Detect my location</a></span>
                                    </div>
                                    {
                                        (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === 'Hub To Door') &&
                                        <div className="selcet_wrap">
                                            <label>Pickup Hub<sup>*</sup></label>
                                            <select {...register('pickuphub', { required: (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === 'Hub To Door') ? true : false })}>
                                                {
                                                    (pickupHub && pickupHub.length > 0) &&
                                                    pickupHub.map((item: any) => {
                                                        return (
                                                            <option key={item.id} value={item.id}>{item.company_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    }
                                </div>

                                <div className="addCont">
                                    <div className="selcet_wrap">
                                        <label>Delivery City<sup>*</sup></label>
                                        <input type="text" id="autocomplete2"
                                            value={deliveryAddress ? deliveryAddress.formatted_address : deliveryAddress}
                                            onChange={(e: any) => {
                                                setDeliveryAddress(e.target.value);
                                            }}
                                            ref={autcompleteRef2} placeholder="City or postal code" />
                                        {/* <select {...register('deliveryaddress', { required: true })}>
                                            <option>Rudrapur, Uttrakhand</option>
                                            <option>Rudrapur, Uttrakhand</option>
                                            <option>Rudrapur, Uttrakhand</option>
                                            <option>Rudrapur, Uttrakhand</option>
                                            <option>Rudrapur, Uttrakhand</option>
                                        </select> */}
                                    </div>
                                    {
                                        (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub") &&
                                        <div className="selcet_wrap">
                                            <label>Delivery Hub<sup>*</sup></label>
                                            <select {...register('deliveryhub', { required: (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === 'Door To Hub') ? true : false })}>
                                                {
                                                    (deliveryHub && deliveryHub.length > 0) &&
                                                    deliveryHub.map((item: any) => {
                                                        return (
                                                            <option key={item.id} value={item.id}>{item.company_name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    }
                                </div>
                            </div>
                            {
                                (isCheckPrice) &&
                                <ul className="check-price-form">
                                    <li>
                                        <label> SLA<sup>*</sup></label>
                                        <select {...register('sla', { required: true })}>
                                            {/* <option>48 hrs.</option>
                                            <option>48 hrs.</option>
                                            <option>48 hrs.</option>
                                            <option>48 hrs.</option> */}
                                            {
                                                (SLAs && SLAs.length > 0) &&
                                                SLAs.map((item: any) => {
                                                    return (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </li>
                                    <li>
                                        <label>Cargo Type<sup>*</sup></label>
                                        <select {...register('cargotype', { required: true })}>
                                            {
                                                (cargoTypes && cargoTypes.length > 0) &&
                                                cargoTypes.map((item: any) => {
                                                    return (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select></li>
                                    <li>
                                    </li>
                                    <li>
                                        <label>No. of Boxes<sup>*</sup></label>
                                        <div className="boxex-number">
                                            <button disabled={watch('noofbox') === 1 ? true : false} className="minus" onClick={() => { subNoOfBox() }}>-</button>
                                            <input type="text" {...register('noofbox', { required: true })} />
                                            <button className="plus" onClick={() => { addNoOfBox() }}>+</button>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Gross Weight / Box<sup>*</sup></label>
                                        <input type="text" className="gross-input"
                                            {
                                            ...register('grossweight', {
                                                required: true,
                                                pattern: /^[0-9]+$/
                                            })
                                            }
                                        />
                                        {
                                            (errors && errors.grossweight && errors.grossweight.type === 'required') &&
                                            <span className='text-danger'>Gross weight is required.</span>
                                        }
                                        {
                                            (errors && errors.grossweight && errors.grossweight.type === 'pattern') &&
                                            <span className='text-danger'>Gross weight is invalid.</span>
                                        }
                                    </li>
                                    <li>
                                        <label>Chargeable Weight<sup>*</sup></label>
                                        <input type="text" className="gross-input"
                                            {...register('chargeableweight', {
                                                required: true,
                                                pattern: /^[0-9]+$/
                                            })}
                                        />
                                        {
                                            (errors && errors.chargeableweight && errors.chargeableweight.type === 'required') &&
                                            <span className='text-danger'>Chargeable weight is required.</span>
                                        }
                                        {
                                            (errors && errors.chargeableweight && errors.chargeableweight.type === 'pattern') &&
                                            <span className='text-danger'>Chargeable weight is invalid.</span>
                                        }
                                    </li>
                                </ul>
                            }
                        </div>
                        <div className="proceed-buton proceed-wrap">
                            {
                                (isCheckPrice) ?
                                    <button className="proceedBtn" onClick={handleSubmit(handleSubmitBtn)}>Submit</button>
                                    :
                                    <button className="proceedBtn" onClick={() => { handleProcced() }}>Proceed</button>
                            }
                        </div>
                    </div>
                </div>
            </section>
            {
                (isModalVisible) &&
                <AddressModal
                    title={modalTitle}
                    address={modalTitle === 'Pickup Address' ? pickupAddress : deliveryAddress}
                    isModalVisible={isModalVisible}
                    handleOk={(addressForm: any) => {
                        handleAddressModalOk(addressForm);
                        $('#autocomplete').blur()
                        $('#autocomplete2').blur()
                    }}
                    handleCancel={() => { setIsModalVisible(false) }}
                />
            }
        </>
    )
}
