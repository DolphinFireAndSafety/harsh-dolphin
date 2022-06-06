import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
export const OtherAddress = () => {
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const { register, setValue, getValues, setError, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            ofirstname: '',
            olastname: '',
            oemail: '',
            omobile: '',
            opickupaddress: '',
            olandmark: '',
            ocountry: '',
            ostate: '',
            ocity: '',
            opincode: '',
            ocompanyname: '',
            ogstin: '',
        }
    });
    return (
        <div className="mode-wrap mt-3 progressBar">
            <div className="progressCir"></div>

            <div className="select-mode">
                <div className="container">
                    <ul className="main-form">
                        <li>
                            <label>Reciever’s First Name<sup>*</sup></label>
                            <input type="text" {...register('ofirstname', { required: true })} />
                            {
                                (errors && errors.ofirstname && errors.ofirstname.type === 'required') &&
                                <span className='text-danger'>Reciever firstname is required.</span>
                            }
                        </li>
                        <li>
                            <label>Reciever’s Last Name<sup>*</sup></label>
                            <input type="text" {...register('olastname', { required: true })} />
                            {
                                (errors && errors.olastname && errors.olastname.type === 'required') &&
                                <span className='text-danger'>Reciever lastname is required.</span>
                            }
                        </li>
                        <li>
                            <label>Reciever’s Email<sup>*</sup></label>
                            <input type="text" {...register('oemail', {
                                required: true,
                                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            })} />
                            {
                                (errors && errors.oemail && errors.oemail.type === 'required') &&
                                <span className='text-danger'>Reciever email is required.</span>
                            }
                            {
                                (errors && errors.oemail && (errors.oemail.type === 'pattern')) &&
                                <span className='text-danger'>Reciever email is invalid.</span>
                            }
                        </li>
                        <li>
                            <label>Mobile Number of Reciever<sup>*</sup></label>
                            <input type="text" {...register('omobile', {
                                required: true,
                                pattern: /^[0-9]+$/,
                                minLength: 10, maxLength: 10
                            })} />
                            {
                                (errors && errors.omobile && errors.omobile.type === 'required') &&
                                <span className='text-danger'>Reciever mobile number is required.</span>
                            }
                            {
                                (errors && errors.omobile && (errors.omobile.type === 'pattern' || errors.omobile.type === "minLength" || errors.omobile.type === "max")) &&
                                <span className='text-danger'>Reciever mobile number is invalid.</span>
                            }
                        </li>
                        <li className="full ">
                            <label>Pickup Address<sup>*</sup></label>
                            <input type="text" {...register('opickupaddress', { required: true })} />
                            <input type="text" />
                            {
                                (errors && errors.opickupaddress && errors.opickupaddress.type === 'required') &&
                                <span className='text-danger'>Reciever address is required.</span>
                            }
                            {/* <span className="detect-cont"><i><img src={require("../../assets/images/gps.png")} /></i><a href="">Detect my location</a></span> */}
                        </li>
                        <li className="full">
                            <label>Landmark<sup>*</sup></label>
                            <input type="text" {...register('olandmark', { required: true })} />
                            {
                                (errors && errors.olandmark && errors.olandmark.type === 'required') &&
                                <span className='text-danger'>Reciever landmark is required.</span>
                            }
                        </li>
                        <li>
                            <label>Country<sup>*</sup></label>
                            <input type="text" disabled={true} {...register('ocountry')} />
                            {
                                (errors && errors.ocountry && errors.ocountry.type === 'required') &&
                                <span className='text-danger'>Reciever country is required.</span>
                            }

                        </li>
                        <li>
                            <label>State<sup>*</sup></label>
                            <input type="text" disabled={true} {...register('ostate')} />
                            {
                                (errors && errors.ostate && errors.ostate.type === 'required') &&
                                <span className='text-danger'>Reciever state is required.</span>
                            }
                        </li>
                        <li>
                            <label>City<sup>*</sup></label>
                            <input type="text" disabled={true} {...register('ocity')} />
                            {
                                (errors && errors.ocity && errors.ocity.type === 'required') &&
                                <span className='text-danger'>Reciever city is required.</span>
                            }
                        </li>
                        <li>
                            <label>Pin-Code<sup>*</sup></label>
                            <input disabled={true} type="text" {...register('opincode', {
                                required: false,
                                // minLength: 6, maxLength: 6,
                                // pattern: /^[0-9]+$/,
                            })} />
                            {
                                (errors && errors.opincode && errors.opincode.type === 'required') &&
                                <span className='text-danger'>Reciever pincode is required.</span>
                            }
                            {
                                (errors && errors.opincode && (errors.opincode.type === 'pattern' || errors.opincode.type === "minLength" || errors.opincode.type === "maxLength")) &&
                                <span className='text-danger'>Reciever pincode is invalid.</span>
                            }
                        </li>

                        <li >
                            <label>Company name<sup>*</sup></label>
                            <input type="text" {...register('ocompanyname', { required: true })} />
                            {
                                (errors && errors.ocompanyname && errors.ocompanyname.type === 'required') &&
                                <span className='text-danger'>Reciever company name is required.</span>
                            }
                        </li>
                        <li>
                            <label>GSTIN</label>
                            <input type="text" {...register('ogstin', { required: false })} />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
