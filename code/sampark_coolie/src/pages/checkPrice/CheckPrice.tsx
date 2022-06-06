import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const CheckPrice = () => {
    const { register, setValue, getValues, setError, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            sla: '',
            cargotype: '',
            noofbox: 1,
            grossweight: '',
            chargeableweight: ''
        }
    });

    const addNoOfBox = () => {
        setValue('noofbox', getValues('noofbox') + 1);
    }
    const subNoOfBox = () => {
        if (getValues('noofbox') === 1) {
            return;
        }
        setValue('noofbox', getValues('noofbox') - 1);
    }
    const handleProceed = (data: any) => {
        console.log('data', data);

    }
    return (
        <section>
            <div className="container">
                <div className="hero-section">
                    <h1>Check Price</h1>
                    <div className="redioService">
                        <dl className="service_box">
                            <dt>Service Type <sup>*</sup></dt>
                            <dd>
                                <label className="custRadio">Door to Door
                                    <input type="radio" checked={true} name="radio" />
                                    <span className="checkmark"></span>
                                </label>
                            </dd>
                            <dd>
                                <label className="custRadio">Hub to Hub
                                    <input type="radio" name="radio" />
                                    <span className="checkmark"></span>
                                </label>
                            </dd>

                            <dd>
                                <label className="custRadio">Door to Hub
                                    <input type="radio" name="radio" />
                                    <span className="checkmark"></span>
                                </label>
                            </dd>
                            <dd>
                                <label className="custRadio">Hub to Door
                                    <input type="radio" name="radio" />
                                    <span className="checkmark"></span>
                                </label>
                            </dd>
                        </dl>
                        <div className="address-list">
                            <div className="addCont">
                                <div className="selcet_wrap">
                                    <label>Pickup Address<sup>*</sup></label>
                                    <select >
                                        <option>Nashik, Maharastra</option>
                                        <option>Nashik, Maharastra</option>
                                        <option>Nashik, Maharastra</option>
                                        <option>Nashik, Maharastra</option>
                                        <option>Nashik, Maharastra</option>
                                    </select>
                                    <span className="detect-cont"><i><img src={require("../../assets/images/gps.png")} /></i><a href="">Detect my location</a></span>
                                </div>
                                {/* <div className="selcet_wrap">
                                  <label>Pickup Address<sup>*</sup></label>
                                  <select>
                                      <option>DTDC UP East HUB - Transportnagar</option>
                                      <option>DTDC UP East HUB - Transportnagar</option>
                                      <option>DTDC UP East HUB - Transportnagar</option>
                                      <option>DTDC UP East HUB - Transportnagar</option>
                                      <option>DTDC UP East HUB - Transportnagar</option>
                                  </select>
                              </div>    */}
                            </div>
                            <div className="addCont">
                                <div className="selcet_wrap">
                                    <label>Delivery Address*<sup>*</sup></label>
                                    <select>
                                        <option>Rudrapur, Uttrakhand</option>
                                        <option>Rudrapur, Uttrakhand</option>
                                        <option>Rudrapur, Uttrakhand</option>
                                        <option>Rudrapur, Uttrakhand</option>
                                        <option>Rudrapur, Uttrakhand</option>
                                    </select>
                                </div>
                                {/* <div className="selcet_wrap">
                                  <label>Delivery Hub<sup>*</sup></label>
                                  <select>
                                      <option>Ekart Transport Nagar Mother Hub</option>
                                      <option>Ekart Transport Nagar Mother Hub</option>
                                      <option>Ekart Transport Nagar Mother Hub</option>
                                      <option>Ekart Transport Nagar Mother Hub</option>
                                      <option>Ekart Transport Nagar Mother Hub</option>
                                  </select>
                              </div>  */}
                            </div>
                        </div>
                        <ul className="check-price-form">
                            <li>
                                <label> SLA<sup>*</sup></label>
                                <select {...register('sla', { required: true })}>
                                    <option>48 hrs.</option>
                                    <option>48 hrs.</option>
                                    <option>48 hrs.</option>
                                    <option>48 hrs.</option>
                                </select>
                            </li>
                            <li>
                                <label>Cargo Type<sup>*</sup></label>
                                <select {...register('cargotype', { required: true })}>
                                    <option>General Cargo</option>
                                    <option>General Cargo</option>
                                    <option>General Cargo</option>
                                    <option>General Cargo</option>
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
                                <input type="text" className="gross-input" {...register('grossweight', { required: true })} />
                            </li>
                            <li>
                                <label>Chargeable Weight<sup>*</sup></label>
                                <input type="text" className="gross-input" {...register('chargeableweight', { required: true })} />
                            </li>
                        </ul>
                    </div>
                    <div className="proceed-buton proceed-wrap">
                        <button className="proceedBtn" onClick={handleSubmit(handleProceed)}>Proceed</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
