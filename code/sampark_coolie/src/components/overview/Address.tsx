import React, { useState, useEffect, useRef } from 'react';
import { getHubs, getmodeTypes, getServiceTypes } from '../../services/booknow';
import { useAppSelector, useAppDispatch } from '../../store/hook'
import { AddressModal } from '../addressModal/AddressModal';
import { addAddress } from '../../store/bookNow/bookNowSlice';
import { toast } from 'react-toastify';
export const Address = () => {
    let autcompleteRefEdit: any = useRef();
    let autcompleteRefEdit2: any = useRef();
    let autocompleteEdit: any;
    let autocompleteEdit2: any;

    const addressData = useAppSelector((state) => state.bookNow.data);
    const [isEdit, setIsEdit] = useState(false);
    const [mode, setMode] = useState('');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [modalTitle, setModalTitle] = useState('Pickup Address');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickupAddress, setPickupAddress]: any = useState('');
    const [deliveryAddress, setDeliveryAddress]: any = useState('');
    const [pickupHubs, setPickupHubs] = useState([]);
    const [deliveryHubs, setDeliveryHubs] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [selectedPickupHub, setSelectedPickupHub] = useState('');
    const [selecteddeliveryHub, setSelectedDeliveryHub] = useState('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isEdit) {
            setSelectedServiceType(addressData.serviceType);
            setPickupAddress(addressData.pickupAddress);
            setDeliveryAddress(addressData.deliveryAddress);
            setSelectedPickupHub(addressData.pickupHubId);
            setSelectedDeliveryHub(addressData.deliveryHubId);
            onLoadGetPlace();
            fetchMode();
            if (addressData.serviceType === 'Hub To Hub' || addressData.serviceType === 'Hub To Door') {
                fetchGetHubs(addressData.pickupAddress.pincode, 'pickupAddress');
            }
            if (addressData.serviceType === 'Hub To Hub' || addressData.serviceType === 'Door To Hub') {
                fetchGetHubs(addressData.deliveryAddress.pincode, 'deliveryAddress');
            }
        }
    }, [isEdit]);

    const onLoadGetPlace = () => {
        if (true) {
            const googleScript = document.createElement('script');
            googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDIDMklRxHmFYWU8Vvo1P-dVkB_nbHARj8&libraries=places`
            googleScript.id = "googlePlaceScript";
            window.document.body.appendChild(googleScript);
            googleScript.addEventListener('load', () => {
                try {
                    //@ts-ignore
                    autocompleteEdit = new window.google.maps.places.Autocomplete(
                        autcompleteRefEdit.current,
                        {
                            types: ['address'],
                        }
                    );
                    autocompleteEdit.addListener('place_changed', () => {
                        const place = autocompleteEdit.getPlace();
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
                        setModalTitle('Pickup Address');
                        setPickupAddress(pickupForm);
                        setIsModalVisible(true);
                    });

                } catch (err) {
                    console.log(err);
                }
                try {
                    //@ts-ignore
                    autocompleteEdit2 = new window.google.maps.places.Autocomplete(
                        autcompleteRefEdit2.current,
                        {
                            types: ['(regions)'],
                        }
                    );
                    //@ts-ignore
                    autocompleteEdit2.addListener('place_changed', () => {
                        const place = autocompleteEdit2.getPlace();
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
        }
    }

    const fetchMode = () => {
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
    }
    useEffect(() => {
        if (mode) {
            let modeId: any = Number(Object.keys(mode));
            getServiceTypes(modeId)
                .then((success) => {
                    if (success && success.status === true && success.errorcode === 200 && success.response) {
                        setServiceTypes(success.response);
                        if (addressData && addressData.serviceType) {
                            setSelectedServiceType(addressData.serviceType)
                        }
                    } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                    }
                })
                .catch((error) => {
                    console.log('errorMode', error);
                })
        }
    }, [mode]);

    const fetchGetHubs = (pincode: any, type: any) => {
        getHubs(pincode).then((success) => {
            if (type === 'pickupAddress') {
                setPickupHubs(success.response);
                setSelectedPickupHub(addressData.pickupHubId)
            } else {
                setDeliveryHubs(success.response);
                setSelectedDeliveryHub(addressData.deliveryHubId)
            }
        }).catch((error) => {
            console.log('error Hubv', error);
        })
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

    const handleDeliveryHub = (value: any) => {
        setSelectedDeliveryHub(value);
    }
    const handlePickHub = (value: any) => {
        setSelectedPickupHub(value);
    }

    const handleAddressModalOk = (addressForm: any) => {
        if (selectedServiceType === 'Hub To Hub' || selectedServiceType === "Door To Hub" || selectedServiceType === "Hub To Door") {
            getHubs(addressForm.postal_code).then((success) => {
                if (modalTitle === 'Pickup Address') {
                    setPickupHubs(success.response);
                    setPickupAddress(addressForm);
                } else {
                    setDeliveryHubs(success.response);
                    setDeliveryAddress(addressForm);
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

    const handleSubmitBtn = () => {
        if (pickupAddress && !pickupAddress.pincode) {
            toast.error('Pickup address pincode is required.');
            // setPickupAddressValidation({ isValid: false, msg: 'Pickup address pincode is required.' });
            return;
        }
        if (deliveryAddress && !deliveryAddress.pincode) {
            toast.error('Delivery address pincode is required.');
            // setDeliveryAddressValidation({ isValid: false, msg: 'Delivery address pincode is required.' });
            return;
        }
        let pickHubName: any = '', deliveryHubName: any = '';
        if (selectedServiceType === 'Hub To Hub' || selectedServiceType === 'Hub To Door' && pickupHubs && pickupHubs.length > 0) {
            pickHubName = pickupHubs.find((item: any) => { return Number(item.id) === Number(selectedPickupHub) });
        }
        if (selectedServiceType === 'Hub To Hub' || selectedServiceType === 'Door To Hub') {
            deliveryHubName = deliveryHubs.find((item: any) => { return Number(item.id) === Number(selecteddeliveryHub) });
        }
        let addressUpdate: any = {
            ...addressData,
            pickupAddress: pickupAddress,
            deliveryAddress: deliveryAddress,
            serviceType: selectedServiceType,
            pickupHubId: selectedPickupHub,
            deliveryHubId: selecteddeliveryHub,
            pickupHub: pickHubName.company_name,
            deliveryHub: deliveryHubName.company_name,
        };
        dispatch(addAddress(addressUpdate));
        setIsEdit(false);
    }

    const handleServiceType = (value: any) => {
        setSelectedServiceType(value);
    }

    useEffect(() => {
        if (selectedServiceType === 'Hub To Hub' || selectedServiceType === "Door To Hub" || selectedServiceType === "Hub To Door") {
            if (pickupAddress.pincode) {
                fetchGetHubs(pickupAddress.pincode, 'pickupAddress');
            }
            if (deliveryAddress.pincode) {
                fetchGetHubs(deliveryAddress.pincode, 'deliveryAddress');
            }
        }
    }, [selectedServiceType]);

    return (
        (isEdit) ?
            <>
                <div className="redioService">
                    <dl className="service_box">
                        <dt>Service Type <sup>*</sup></dt>
                        {
                            (serviceTypes && serviceTypes.length > 0) &&
                            serviceTypes.map((service: any) => {
                                return (
                                    <dd>
                                        <label className="custRadio">{service.name}
                                            <input type="radio"
                                                checked={selectedServiceType === service.name ? true : false} value={service.name}
                                                onChange={(e) => { handleServiceType(e.target.value) }}
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
                                <label>Pickup Address<sup>*</sup></label>
                                <input type="text" id="autocompleteEdit"
                                    value={pickupAddress ? pickupAddress.formatted_address : pickupAddress}
                                    onChange={(e) => { setPickupAddress(e.target.value); }}
                                    ref={autcompleteRefEdit} placeholder="City or postal code" />
                                <span className="detect-cont" onClick={() => { detectMyLocation() }}><i><img src={require("../../assets/images/gps.png")} /></i><a href="javascript:;">Detect my location</a></span>
                            </div>
                            {
                                (selectedServiceType === 'Hub To Hub' || selectedServiceType === 'Hub To Door') &&
                                <div className="selcet_wrap">
                                    <label>Pickup Hub<sup>*</sup></label>
                                    <select value={selectedPickupHub} onChange={(e) => { handlePickHub(e.target.value) }}>
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
                                <label>Delivery Address<sup>*</sup></label>
                                <input type="text" id="autocompleteEdit2"
                                    value={deliveryAddress ? deliveryAddress.formatted_address : deliveryAddress}
                                    onChange={(e: any) => {
                                        setDeliveryAddress(e.target.value);
                                    }}
                                    ref={autcompleteRefEdit2} placeholder="City or postal code" />
                            </div>
                            {
                                (selectedServiceType === 'Hub To Hub' || selectedServiceType === "Door To Hub") &&
                                <div className="selcet_wrap">
                                    <label>Delivery Hub<sup>*</sup></label>
                                    <select value={selecteddeliveryHub} onChange={(e) => { handleDeliveryHub(e.target.value) }} >
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
                    <div className="d-flex justify-content-center mt-2">
                        <button className="proceedBtn" onClick={() => { handleSubmitBtn() }}>Submit</button>
                    </div>
                </div>

                {
                    (isModalVisible) &&
                    <AddressModal
                        title={modalTitle}
                        address={modalTitle === 'Pickup Address' ? pickupAddress : deliveryAddress}
                        isModalVisible={isModalVisible}
                        handleOk={(addressForm: any) => {
                            handleAddressModalOk(addressForm);
                        }}
                        handleCancel={() => { setIsModalVisible(false) }}
                    />
                }
            </>
            :
            <div className="redioService">
                <dl className="service_box justify-content-between">
                    <dt>Overview <sup>*</sup></dt>
                    {/* <dt><a onClick={() => { setIsEdit(true) }}><img src={require("../../assets/images/edit.png")} /></a></dt> */}
                </dl>
                <ul className="overview-wrap">
                    <li>
                        <span>Service Type: </span>
                        {addressData && addressData.serviceType}
                    </li>
                    <li><span>Pickup City: </span>
                        {addressData && addressData.pickupAddress && addressData.pickupAddress.city},
                        {addressData && addressData.pickupAddress && addressData.pickupAddress.state}
                    </li>
                    <li><span>Delivery City: </span>{addressData && addressData.deliveryAddress && addressData.deliveryAddress.city},
                        {addressData && addressData.deliveryAddress && addressData.deliveryAddress.state}</li>
                    <li><span></span></li>
                    {
                        (addressData && addressData.serviceType === 'Hub To Hub' || addressData.serviceType === 'Hub To Door') &&
                        <li><span>Pickup Hub:</span>{addressData && addressData.pickupHub}</li>
                    }

                    {
                        (addressData && addressData.serviceType === 'Hub To Hub' || addressData.serviceType === 'Door To Hub') &&
                        <li><span>Delivery Hub: </span>{addressData && addressData.deliveryHub} </li>
                    }
                </ul>
            </div>
    )
}
