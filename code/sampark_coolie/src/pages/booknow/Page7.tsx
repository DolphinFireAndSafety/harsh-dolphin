import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Address } from '../../components/overview/Address';
import { getmodeTypes } from '../../services/booknow';

export const Page7 = () => {
    const [invoices, setInvoices]: any = useState([]);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceValue, setInvoiceValue] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [Dimensions, setDimensions] = useState({ length: '', weight: '', height: '' });
    const [noOfBox, setNoOfBox] = useState(1);
    const [grossWeight, setGrossWeight] = useState('');
    const [dimentionalWeight, setDimentionalWeight] = useState('');
    const [chargeableWeight, setChargeableWeight] = useState('');
    const [invoiceNumberValidation, setInvoiceNumberValidation] = useState({ isValid: true, msg: '' });
    const [grossWeightValidation, setGrossWeightValidation] = useState({ isValid: true, msg: '' });
    const [chargeableWeightValidation, setChargeableWeightValidation] = useState({ isValid: true, msg: '' });
    const [mode, setMode] = useState('');
    const { register, setValue, getValues, setError, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            mode: 'Air',
            servicepreferences: 'Airline',
            volumetricconsignment: 'Yes',
            cargotype: '',
            pickupdate: '',
            pickuptime: '',
            flightno: '',
            airline: '',
            consignment: false,
            insurecargo: 'Yes'
        }
    });

    useEffect(() => {
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
    }, []);

    const addNoOfBox = () => {
        setNoOfBox(noOfBox + 1);
    }
    const subNoOfBox = () => {
        if (noOfBox === 1) {
            return;
        }
        setNoOfBox(noOfBox - 1);
    }

    const addInvoice = () => {
        if (!invoiceNumber) {
            setInvoiceNumberValidation({ isValid: false, msg: 'Invoice number is required.' });
            return;
        }
        // if (!grossWeight) {
        //     setGrossWeightValidation({ isValid: false, msg: 'Gross weight / box is required.' });
        //     return;
        // }
        // if (!chargeableWeight) {
        //     setInvoiceNumberValidation({ isValid: false, msg: 'Invoice number is required.' });
        //     return;
        // }
        setInvoices([...invoices, {
            invoiceNumber: invoiceNumber,
            invoiceValue: '200 kgs',
            noOfBox: noOfBox
        }]);
    }

    const handleEditInvoice = (index: any) => {

    }
    return (
        <section>
            <div className="container">
                <div className="hero-section">
                    <h1>Book Now</h1>
                    <Address />
                    <span className="border-space"><hr /></span>

                    <div className="custom-container">

                        <div className="mode-wrap progressBar">
                            <div className="progressCir"></div>
                            <div className="select-mode">
                                <div className="container">
                                    <dl className="service_box">
                                        <dt>Select Mode <sup>*</sup></dt>
                                        {
                                            (mode) &&
                                            <dd>
                                                <label className="custRadio">{mode[1]}
                                                    <input type="radio" value={mode[1]} {...register('mode', { required: true })} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </dd>
                                        }
                                        {/* <dd>
                                            <label className="custRadio">Air
                                                <input type="radio" value='Air' {...register('mode', { required: true })} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </dd>
                                        <dd>
                                            <label className="custRadio">Surface
                                                <input type="radio" value={'Surface'} {...register('mode', { required: true })} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </dd>
                                        <dd>
                                            <label className="custRadio">Rail
                                                <input type="radio" value='Rail' {...register('mode', { required: true })} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </dd> */}
                                    </dl>
                                    <div className="address-list">
                                        <div className="addCont">
                                            <div className="selcet_wrap">
                                                <label>Services Preferences<sup>*</sup></label>
                                                <div className="tabs-btn">
                                                    <a className={watch('servicepreferences') === 'SLA' ? "active" : ''} onClick={() => { setValue('servicepreferences', 'SLA') }}>SLA</a>
                                                    <a className={watch('servicepreferences') === 'Airline' ? "active" : ''} onClick={() => { setValue('servicepreferences', 'Airline') }}>Airline</a>
                                                </div>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Cargo Type<sup>*</sup></label>
                                                <select {...register('cargotype', { required: true })}>
                                                    <option>General Cargo</option>
                                                    <option>General Cargo</option>
                                                    <option>General Cargo</option>
                                                    <option>General Cargo</option>
                                                    <option>General Cargo</option>
                                                </select>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Preferred Pickup Time<sup>*</sup></label>
                                                <select {...register('pickuptime', { required: true })}>
                                                    <option>09:00 - 11:00 hrs.</option>
                                                    <option>09:00 - 11:00 hrs.</option>
                                                    <option>09:00 - 11:00 hrs.</option>
                                                    <option>09:00 - 11:00 hrs.</option>
                                                    <option>09:00 - 11:00 hrs.</option>
                                                </select>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Flight No.<sup>*</sup></label>
                                                <select {...register('flightno', { required: true })}>
                                                    <option>1749295032</option>
                                                    <option>1749295032</option>
                                                    <option>1749295032</option>
                                                    <option>1749295032</option>
                                                    <option>1749295032</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="addCont">
                                            <div className="selcet_wrap">
                                                <label>Volumetric Consignment<sup>*</sup></label>
                                                <div className="tabs-btn">
                                                    <a className={watch('volumetricconsignment') === 'Yes' ? "active" : ''} onClick={() => { setValue('volumetricconsignment', 'Yes') }}>Yes</a>
                                                    <a className={watch('volumetricconsignment') === 'No' ? "active" : ''} onClick={() => { setValue('volumetricconsignment', 'No') }} >No</a>
                                                </div>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Pickup Date<sup>*</sup></label>
                                                <select {...register('pickupdate', { required: true })}>
                                                    <option>12th Jan 2022</option>
                                                    <option>12th Jan 2022</option>
                                                    <option>12th Jan 2022</option>
                                                    <option>12th Jan 2022</option>
                                                    <option>12th Jan 2022</option>
                                                </select>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Airline<sup>*</sup></label>
                                                <select {...register('airline', { required: true })}>
                                                    <option>Kingfisher</option>
                                                    <option>Kingfisher</option>
                                                    <option>Kingfisher</option>
                                                    <option>Kingfisher</option>
                                                    <option>Kingfisher</option>
                                                </select>
                                            </div>
                                            <div className="selcet_wrap">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <label className="cust-checkbox">This consignment is sent by company and not from individual.
                                    <input type="checkbox" {...register('consignment', { required: true })} />
                                    <span className="checkmark"></span>
                                </label>

                            </div>
                        </div>

                        <div className="mode-wrap  mt-5 progressBar">
                            <div className="progressCir"></div>
                            <div className="invoice-wrap">
                                {
                                    (invoices && invoices.length > 0) &&
                                    invoices.map((invoice: any, index: any) => {
                                        return (
                                            <ul className="invoice-table">
                                                <li> <label>Invoice Number</label>{invoice.invoiceNumber}</li>
                                                <li> <label>Invoice Value</label>{invoice.invoiceValue}</li>
                                                <li> <label>No. of Boxes</label>{invoice.noOfBox}</li>
                                                <li><a onClick={() => { handleEditInvoice(index) }}><img src={require("../../assets/images/edit.png")} /></a></li>
                                            </ul>
                                        )
                                    })
                                }
                                {/* <ul className="invoice-table">
                                    <li> <label>Invoice Number</label>132454654876867</li>
                                    <li> <label>Invoice Value</label>₹ 4000</li>
                                    <li> <label>No. of Boxes</label>2</li>

                                    <li><a href=""><img src={require("../../assets/images/edit.png")} /></a></li>
                                </ul>

                                <ul className="invoice-table">
                                    <li> <label>Invoice Number</label>132454654876867</li>
                                    <li> <label>Invoice Value</label>₹ 4000</li>
                                    <li> <label>No. of Boxes</label>2</li>

                                    <li><a href=""><img src={require("../../assets/images/edit.png")} /></a></li>
                                </ul> */}


                                <ul className="invoice-table2">
                                    <div className="invoice-header">
                                        <label>Invoice {invoices && invoices.length > 0 ? (invoices.length + 1) : ''}</label>
                                        <a href=""><img src={require("../../assets/images/close.png")} /></a>
                                    </div>
                                    <li>
                                        <label>Invoice Number</label>
                                        <input type="text" name="" className="gross-input" value={invoiceNumber} onChange={(e) => { setInvoiceNumber(e.target.value) }} />

                                    </li>
                                    <li>
                                        <label>Invoice Value</label>
                                        <input type="text" name="" className="gross-input" value={invoiceValue} onChange={(e) => { setInvoiceValue(e.target.value) }} />
                                    </li>
                                    <li>
                                        <label>E-Way Bill Number</label>
                                        <input type="text" name="" className="gross-input" value={billNumber} onChange={(e) => { setBillNumber(e.target.value) }} />

                                    </li>
                                    <li className="sec-one">
                                        <label>No. of Boxes<sup>*</sup></label>
                                        <div className="boxex-number">
                                            <button className="minus" onClick={subNoOfBox}>-</button>
                                            <input type="text" value={noOfBox} />
                                            <button className="plus" onClick={addNoOfBox}>+</button>
                                        </div>
                                    </li>
                                    <li className="sec-two">

                                        <label>Dimensions<sup>*</sup></label>
                                        <dl>
                                            <dd>
                                                <input type="text" placeholder='Length' name="" value={Dimensions.length} onChange={(e) => { setDimensions({ ...Dimensions, length: e.target.value }) }} />
                                                {/* <input type="text" name="" /> */}
                                            </dd>
                                            <dd>
                                                <input type="text" placeholder='Weight' name="" value={Dimensions.weight} onChange={(e) => { setDimensions({ ...Dimensions, weight: e.target.value }) }} />
                                                {/* <input type="text" name="" /> */}
                                            </dd>
                                            <dd>
                                                <input type="text" placeholder='Height' name="" value={Dimensions.height} onChange={(e) => { setDimensions({ ...Dimensions, height: e.target.value }) }} />
                                                {/* <input type="text" name="" /> */}
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <label>Gross Weight / Box*</label>
                                        <input type="text" className="gross-input" value={grossWeight} onChange={(e) => { setGrossWeight(e.target.value) }} />

                                    </li>
                                    <li>
                                        <label>Dimentional Weight*</label>
                                        <input type="text" className="gross-input" value={dimentionalWeight} onChange={(e) => { setDimentionalWeight(e.target.value) }} />
                                    </li>
                                    <li>
                                        <label>Chargeable Weight*</label>
                                        <input type="text" name="" className="gross-input" value={chargeableWeight} onChange={(e) => { setChargeableWeight(e.target.value) }} />

                                    </li>
                                </ul>

                                <ul className="invoice-table display-none">
                                    <a className="upload-file" onClick={() => { addInvoice() }}>
                                        <img src={require("../../assets/images/add.png")} />
                                    </a>

                                </ul>
                            </div>
                        </div>

                        <div className="mode-wrap mode-wrap-second mt-5 progressBar progNone">
                            <div className="progressCir"></div>
                            <div className="select-mode">
                                <dl className="service_box">
                                    <dd>
                                        <label className="custRadio">Insure my cargo
                                            <input type="radio" value="Yes" {...register('insurecargo', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                    <dd>
                                        <label className="custRadio">No, I have already Insured my cargo
                                            <input value="No" type="radio" {...register('insurecargo', { required: true })} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        <div className="proceed-buton">
                            <button className="proceedBtn">Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
