import React, { useEffect, useState } from 'react';
import { Modal, ModalTitle } from 'react-bootstrap';;

export const AddressModal = ({ title, address, isModalVisible, handleOk, handleCancel }: any) => {
    const [pincodeError, setPincodeError] = useState({ isValid: true, msg: '' });
    const [globlaError, setGlobalError] = useState({ isValid: true, msg: '' });
    const [addressForm, setAddressForm]: any = useState({
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
    });

    useEffect(() => {
        if (address) {
            setAddressForm(address);
        }
    }, []);

    const handleForm = () => {
        if (!addressForm.address1) {
            setGlobalError({ isValid: false, msg: 'Address1 is required.' });
            return;
        }
        if (addressForm.postal_code.length < 6) {
            setGlobalError({ isValid: false, msg: 'Pincode is invalid.' });
            return;
        }
        if (!addressForm.postal_code) {
            setGlobalError({ isValid: false, msg: 'Pincode is invalid.' });
            return;
        }
        if (!addressForm.locality) {
            setGlobalError({ isValid: false, msg: 'City is required.' });
            return;
        }
        if (!addressForm.administrative_area_level_1) {
            setGlobalError({ isValid: false, msg: 'State is required.' });
            return;
        }
        if (!addressForm.country) {
            setGlobalError({ isValid: false, msg: 'Country is required.' });
            return;
        }
        let formatted_address_temp: any = '';

        if (addressForm.address1) {
            formatted_address_temp = addressForm.address1 + ", ";
        }
        // if (addressForm.sublocality_level_1) {
        //     formatted_address_temp = formatted_address_temp + addressForm.sublocality_level_1 + ", ";
        // }
        // if (addressForm.locality) {
        //     formatted_address_temp = formatted_address_temp + addressForm.locality + ", ";
        // }
        // if (addressForm.administrative_area_level_1) {
        //     formatted_address_temp = formatted_address_temp + addressForm.administrative_area_level_1 + ", ";
        // }
        // if (addressForm.country) {
        //     formatted_address_temp = formatted_address_temp + addressForm.country + ", ";
        // }
        // if (addressForm.postal_code) {
        //     formatted_address_temp = formatted_address_temp + addressForm.postal_code + ".";
        // }
        let address: any = {
            address1: addressForm.address1,
            address2: addressForm.sublocality_level_1,
            pincode: addressForm.postal_code,
            city: addressForm.locality,
            state: addressForm.administrative_area_level_1,
            country: addressForm.country,
            landmark: addressForm.landmark,
            latitude: addressForm.latitude,
            longitude: addressForm.longitude,
            formatted_address: formatted_address_temp,
            companyName: addressForm.companyName
        }
        handleOk(address)
    }
    return (
        <Modal className="direction-pop-up" show={isModalVisible} onHide={handleCancel} backdrop={true} keyboard={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="directionCont">
                    <div className="direction-wrap">
                        <ul className="direction-form">
                            <li className="full">
                                <label>Address 1<sup>*</sup></label>
                                <input type="text" value={addressForm.address1} onChange={(e) => { setAddressForm({ ...addressForm, address1: e.target.value }) }} />
                            </li>
                            <li className="full">
                                <label>Address 2</label>
                                <input type="text" value={addressForm.sublocality_level_1} onChange={(e) => { setAddressForm({ ...addressForm, sublocality_level_1: e.target.value }) }} />
                            </li>
                            <li>
                                <label>Pin code<sup>*</sup></label>
                                <input type="text" value={addressForm.postal_code} onChange={(e) => { setAddressForm({ ...addressForm, postal_code: e.target.value }) }} />
                            </li>
                            <li>
                                <label>City<sup>*</sup></label>
                                <input type="text" value={addressForm.locality} onChange={(e) => { setAddressForm({ ...addressForm, locality: e.target.value }) }} />
                            </li>
                            <li>
                                <label>State<sup>*</sup></label>
                                <input type="text" value={addressForm.administrative_area_level_1} onChange={(e) => { setAddressForm({ ...addressForm, administrative_area_level_1: e.target.value }) }} />
                            </li>
                            <li>
                                <label>Country<sup>*</sup></label>
                                <input type="text" value={addressForm.country} onChange={(e) => { setAddressForm({ ...addressForm, country: e.target.value }) }} />
                            </li>
                            <li className="full">
                                <label>Landmark</label>
                                <input type="text" value={addressForm.landmark} onChange={(e) => { setAddressForm({ ...addressForm, landmark: e.target.value }) }} />
                            </li>
                            {
                                (globlaError && !globlaError.isValid) &&
                                <span className='text-danger'>{globlaError.msg}</span>
                            }
                            <li className="full text-center"><button className="loginBtn " onClick={() => { handleForm() }}>Confirm</button></li>
                        </ul>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
