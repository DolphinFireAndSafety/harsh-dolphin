import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import { useForm } from 'react-hook-form';
import { checkPincodeAvaibility, getCargoTypes, getHubs, getmodeTypes, getServiceTypes, getSLA, getVendorContactDetails, getVendorList } from '../../services/booknow';
import { AddressModal } from '../../components/addressModal/AddressModal';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store/hook'
import { addAddress, addPickupVendorAddressDetails, addDeliverVendorAddressDetails, addPickupVendorContactDetails, addDeliverVendorContactDetails } from '../../store/bookNow/bookNowSlice'
import { useNavigate, useLocation } from 'react-router-dom';

export const BookNowNew = () => {
    let autcompleteRef: any = useRef();
    let autcompleteRef2: any = useRef();
    let autocomplete: any;
    let autocomplete2: any;
    const { register, getValues, setError, setValue, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            servicetype: 'Door to Door', pickuphub: '', deliveryhub: '',
        }
    });
    const [modes, setModes] = useState('');
    const [selectedMode, setSelectedMode]: any = useState('');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickupAddress, setPickupAddress]: any = useState('');
    const [deliveryAddress, setDeliveryAddress]: any = useState('');
    const [modalTitle, setModalTitle] = useState('Pickup Address');
    const [pickupHubs, setPickupHubs] = useState([]);
    const [deliveryHubs, setDeliveryHubs] = useState([]);
    const history = useNavigate();
    const dispatch = useAppDispatch();
    const addressData = useAppSelector((state) => state.bookNow.data);

    useEffect(() => {
        console.log('addressDataBack', addressData);
        // onLoadGetPlace();
        fetchModeTypes();

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
                        address1: '', landmark: '',
                        companyName: ''
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
                        pickupForm.address1 = place.formatted_address.trim();
                        pickupForm.companyName = place.name.trim();
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
                        address1: '', landmark: '', companyName: ''
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
                        deliveryForm.address1 = place.formatted_address.trim();
                        deliveryForm.companyName = place.name.trim();
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



        if (addressData) {
            console.log('addressData', addressData.pickupAddress);

            setValue('servicetype', addressData.serviceType);
            setValue('pickuphub', addressData.pickupHub);
            setValue('deliveryhub', addressData.deliveryHub);
            setPickupAddress(addressData.pickupAddress);
            setDeliveryAddress(addressData.deliveryAddress);
            setPickupHubs([]);
            setDeliveryHubs([]);
        }
        return () => {
            document.body.removeChild(googleScript);
        }
    }, []);

    const fetchModeTypes = () => {
        getmodeTypes()
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setModes(success.response);
                    if (success && success.response && success.response.length > 0) {
                        setSelectedMode(success.response[0]);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('errorMode', error);
            })
    }

    useEffect(() => {
        if (selectedMode) {
            let modeId: any = selectedMode.id;
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
    }, [selectedMode]);

    useEffect(() => {
        if (watch('servicetype') && addressData && watch('servicetype') !== addressData.serviceType) {
            setValue('pickuphub', '');
            setValue('deliveryhub', '');
            setPickupAddress('');
            setDeliveryAddress('');
        }
    }, [watch('servicetype')]);

    const onLoadGetPlace = () => {
        console.log('GoggleFunCall');

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
                            address1: '', landmark: '',
                            companyName: ''
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
                            pickupForm.address1 = place.formatted_address.trim();
                            pickupForm.companyName = place.name.trim();
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
                            address1: '', landmark: '', companyName: ''
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
                            deliveryForm.address1 = place.formatted_address.trim();
                            deliveryForm.companyName = place.name.trim();
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
        }
    }

    const handleAddressModalOk = (addressForm: any) => {
        if (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub" || watch('servicetype') === "Hub To Door") {
            console.log('addressForm', addressForm);
            getHubs(addressForm.pincode).then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    if (modalTitle === 'Pickup Address') {
                        setPickupHubs(success.response);
                        setPickupAddress(addressForm);
                        if (success.response && success.response.length > 0) {
                            setValue('pickuphub', success.response[0].id);
                        }
                    } else {
                        setDeliveryHubs(success.response);
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
        setIsModalVisible(false)
    }
    const handleProcced = (data: any) => {
        if (!pickupAddress || !pickupAddress.pincode) {
            toast.error('Pickup address pincode is required.');
            return;
        }
        if (!deliveryAddress || !deliveryAddress.pincode) {
            toast.error('Delivery address pincode is required.');
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
                    let pickHubName: any = '', deliveryHubName: any = '';
                    if (data.servicetype === 'Hub To Hub' || data.servicetype === 'Hub To Door' && pickupHubs && pickupHubs.length > 0) {
                        pickHubName = pickupHubs.find((item: any) => { return Number(item.id) === Number(data.pickuphub) });
                    }
                    if (data.servicetype === 'Hub To Hub' || data.servicetype === 'Door To Hub') {
                        deliveryHubName = deliveryHubs.find((item: any) => { return Number(item.id) === Number(data.deliveryhub) });
                    }
                    let selectedServiceType: any = serviceTypes.find((item: any) => { return data.servicetype === item.name });
                    const dataTemp: any = {
                        pickupAddress: pickupAddress,
                        deliveryAddress: deliveryAddress,
                        serviceType: data.servicetype,
                        serviceTypeId: selectedServiceType.id,
                        pickupHubId: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Hub To Door') ? data.pickuphub : '',
                        deliveryHubId: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Door To Hub') ? data.deliveryhub : '',
                        pickupHub: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Hub To Door') ? pickHubName.company_name : '',
                        deliveryHub: (data.servicetype === 'Hub To Hub' || data.servicetype === 'Door To Hub') ? deliveryHubName.company_name : '',
                    }
                    dispatch(addAddress(dataTemp));
                    history('/overview');
                } else if (success && success.status === false && success.msg) {
                    toast.error(success.msg)
                }
            })
            .catch((error) => {
                console.log('errorMode', error);
            })
    }

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
                                        {/* <span className="detect-cont"><i><img src={require("../../assets/images/gps.png")} /></i><a onClick={() => { detectMyLocation() }}>Detect my location</a></span> */}
                                    </div>
                                    {
                                        (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === 'Hub To Door') &&
                                        <div className="selcet_wrap">
                                            <label>Pickup Hub<sup>*</sup></label>
                                            <select {...register('pickuphub', { required: (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === 'Hub To Door') ? true : false })}>
                                                {
                                                    (pickupHubs && pickupHubs.length > 0) &&
                                                    pickupHubs.map((item: any) => {
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
                                    </div>
                                    {
                                        (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === "Door To Hub") &&
                                        <div className="selcet_wrap">
                                            <label>Delivery Hub<sup>*</sup></label>
                                            <select {...register('deliveryhub', { required: (watch('servicetype') === 'Hub To Hub' || watch('servicetype') === 'Door To Hub') ? true : false })}>
                                                {
                                                    (deliveryHubs && deliveryHubs.length > 0) &&
                                                    deliveryHubs.map((item: any) => {
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
                        </div>
                        <div className="proceed-buton proceed-wrap">
                            <button className="proceedBtn" onClick={handleSubmit(handleProcced)}>Proceed</button>
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
