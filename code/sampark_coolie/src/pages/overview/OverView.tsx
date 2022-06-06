import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Address } from '../../components/overview/Address';
import { checkPrice, getAirline, getCargoTypes, getflightbyairline, getmodeTypes, getSLA } from '../../services/booknow';
import { useAppSelector, useAppDispatch } from '../../store/hook';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import moment from 'moment'
import { addInvoiceInfo } from '../../store/bookNow/bookNowSlice';
import { useNavigate, useLocation } from 'react-router-dom'
import { getCookie } from '../../utils/cookies';
import { toast } from 'react-toastify';
import { allowOnlyAlphaAndDigits } from '../../utils/validators';
import _ from 'lodash';
export const OverView = () => {
    const [invoices, setInvoices]: any = useState([]);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceValue, setInvoiceValue] = useState('');
    const [billNumber, setBillNumber] = useState('');
    const [Dimensions, setDimensions]: any = useState({ length: '', weight: '', height: '' });
    const [noOfBox, setNoOfBox] = useState(1);
    const [grossWeight, setGrossWeight]: any = useState('');
    const [dimentionalWeight, setDimentionalWeight]: any = useState('');
    const [chargeableWeight, setChargeableWeight]: any = useState('');
    const addressData = useAppSelector((state) => state.bookNow.data);
    const vendors = useAppSelector((state) => state.bookNow.vendors);
    const [modes, setModes] = useState([]);
    const [cargoTypes, setCargoTypes] = useState([]);
    const [airlines, setAirlines]: any = useState('');
    const [flights, setFlights]: any = useState([]);
    const [pickupDate, setPickupDate]: any = useState(null);
    const [isEditInvoice, setIsEditInvoice] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState('');
    const [pickupDateValidation, setPickupValidation] = useState({ isValid: true, msg: '' });
    const [invoiceGlobalError, setInvoiceGlobalError] = useState({ isValid: true, msg: '' });
    const dispatch = useAppDispatch();
    const history = useNavigate();
    const [SLAs, setSLAs] = useState([]);
    const [timeList, setTimeList]: any = useState([
        { startTime: 8, timeSlot: '08:00 - 10:00 Hrs.' },
        { startTime: 10, timeSlot: '10:00 - 12:00 Hrs.' },
        { startTime: 12, timeSlot: '12:00 - 14:00 Hrs.' },
        { startTime: 14, timeSlot: '14:00 - 16:00 Hrs.' },
        { startTime: 16, timeSlot: '16:00 - 18:00 Hrs.' },
        { startTime: 18, timeSlot: '18:00 - 20:00 Hrs.' },
        { startTime: 20, timeSlot: '20:00 - 22:00 Hrs.' },
        { startTime: 22, timeSlot: '22:00 - 00:00 Hrs.' },
        { startTime: 24, timeSlot: '00:00 - 02:00 Hrs.' },
        { startTime: 26, timeSlot: '02:00 - 04:00 Hrs.' },
        { startTime: 28, timeSlot: '04:00 - 06:00 Hrs.' },
        { startTime: 30, timeSlot: '06:00 - 08:00 Hrs.' },
    ]);
    const { register, setValue, getValues, setError, formState: { errors }, handleSubmit, watch, control } = useForm({
        defaultValues: {
            mode: '',
            servicepreferences: 'SLA',
            volumetricconsignment: 'No',
            cargotype: '',
            // pickupdate: '',
            pickuptime: '08:00 - 10:00 Hrs.',
            flightno: '',
            airline: '',
            consignment: 'company',
            // insurecargo: 'Yes',
            sla: '', uom: "cms"
        }
    });
    useEffect(() => {
        console.log('addressDataBackOverview', addressData);
        if (addressData && addressData.invoiceInfo) {
            setValue('mode', addressData.invoiceInfo.mode);
            setValue('servicepreferences', addressData.invoiceInfo.servicePreferences);
            setValue('volumetricconsignment', addressData.invoiceInfo.volumetricConsignment);
            setValue('cargotype', addressData.invoiceInfo.cargoType);
            setPickupDate(addressData.invoiceInfo.pickupDate)
            setValue('pickuptime', addressData.invoiceInfo.pickupTime);
            setValue('airline', addressData.invoiceInfo.airline);
            setValue('flightno', addressData.invoiceInfo.flightNo);
            setValue('consignment', addressData.invoiceInfo.consignmentFrom);
            setInvoices(addressData.invoiceInfo.invoices);
            setValue('sla', addressData.invoiceInfo.sla)
            // setValue('insurecargo', addressData.invoiceInfo.insureCargo);
        }
    }, []);

    useEffect(() => {
        if (watch('volumetricconsignment') && addressData && !addressData.invoiceInfo) {
            setInvoices([]);
        }
    }, [watch('volumetricconsignment')]);

    useEffect(() => {
        getmodeTypes()
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setModes(success.response);
                    if (success && success.response && success.response.length > 0) {
                        setValue('mode', success.response[0].id);
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('errorMode', error);
            })
        fetchAirlines();
    }, [addressData]);

    useEffect(() => {
        if (modes) {
            fethchCargoTypes();
        }
    }, [modes]);

    useEffect(() => {
        if (watch('cargotype')) {
            fetchSLA(watch('cargotype'));
        }
    }, [watch('cargotype')]);

    const fetchSLA = (cargoId: any) => {
        let modeId: any = getValues('mode');
        const request: any = {
            source_city_name: addressData.pickupAddress.city, destination_city_name: addressData.deliveryAddress.city, mode: modeId, cargo: Number(cargoId)
        }
        getSLA(request)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setSLAs(success.response);
                    // if (success && success.response && success.response.length > 0) {
                    //     setValue('sla', success.response[0].id);
                    // }
                    if (addressData.invoiceInfo.cargoType === getValues('cargotype') && addressData.invoiceInfo.sla) {
                        setValue('sla', addressData.invoiceInfo.sla)
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {
                    setSLAs([]);
                    setValue('sla', '');
                }
            })
            .catch((error) => {
                console.log('errorSLA', error);
            })
    }

    const fetchAirlines = () => {
        getAirline()
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setAirlines(success.response);
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error_Airline', error);
            })
    }
    const fetchFlights = () => {
        const request: any = {
            "source_city_name": addressData.pickupAddress.city,
            "destination_city_name": addressData.deliveryAddress.city,
            "airline": getValues('airline'),
            "pickup_date": moment(pickupDate).format('DD-MM-YYYY'),
            "cargo": getValues('cargotype'),
            "timeslot": getValues('pickuptime')
        }
        getflightbyairline(request)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    setFlights(success.response);
                    if (success && success.response && success.response.length > 0) {
                        setValue('flightno', success.response[0].id)
                    }
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {

                }
            })
            .catch((error) => {
                console.log('error_Flights', error);
            })
    }

    const fethchCargoTypes = () => {
        let modeId: any = getValues('mode');
        if (modeId && addressData && addressData.pickupAddress && addressData.pickupAddress.city && addressData.deliveryAddress && addressData.deliveryAddress.city) {
            const request: any = {
                source_city_name: addressData.pickupAddress.city, destination_city_name: addressData.deliveryAddress.city, mode: modeId
            }
            getCargoTypes(request)
                .then((success) => {
                    if (success) {
                        setCargoTypes(success);
                        // if (success && success.length > 0) {
                        //     setValue('cargotype', success[0].id);
                        // }
                        if (addressData && addressData.invoiceInfo && addressData.invoiceInfo.cargoType) {
                            setValue('cargotype', addressData.invoiceInfo.cargoType);
                        }
                    } else if (success && success.status === false && success.errorcode === 200 && success.message) {
                        toast.error('something went wrong.')
                    }
                })
                .catch((error) => {
                    console.log('errorMode', error);
                })
        }
    }


    const addNoOfBox = () => {
        setNoOfBox(noOfBox + 1);
        if (grossWeight) {
            setChargeableWeight(grossWeight * (noOfBox + 1));
        }
    }
    const subNoOfBox = () => {
        if (noOfBox === 1) {
            return;
        }
        setNoOfBox(noOfBox - 1);
        if (grossWeight) {
            setChargeableWeight(grossWeight * (noOfBox - 1));
        }
    }

    const funsave = () => {
        $("#tblinvoicetableshow").removeClass('display-none');    
        $("#tblinvoicecustomox").addClass('display-none');
        $("#btnsave").addClass('display-none');      
    }
    const addsave = () => {
          
        $("#tblinvoicetableshow").addClass('display-none');
        $("#tblinvoicecustomox").removeClass('display-none');
        $("#btnsave").removeClass('display-none');  
   }

   const resetInvoice = () => {

   }
    const addInvoice = (mode: any) => {  
    if(mode == 1)
    {
        if (getValues('volumetricconsignment') === 'Yes') {
            if (!invoiceNumber) {
                setInvoiceGlobalError({ isValid: false, msg: 'Invoice number is required.' });
                return;
            }
            if (!invoiceValue) {
                setInvoiceGlobalError({ isValid: false, msg: 'Invoice value is required.' });
                return;
            }
            if (!billNumber) {
                setInvoiceGlobalError({ isValid: false, msg: 'E-Way bill number is required.' });
                return;
            }
            if (!Dimensions.length || !Dimensions.height || !Dimensions.weight) {
                setInvoiceGlobalError({ isValid: false, msg: 'Dimensions is required.' });
                return;
            }
            if ((Dimensions.length && isNaN(Dimensions.length)) || (Dimensions.height && isNaN(Dimensions.height)) || (Dimensions.weight && isNaN(Dimensions.weight))) {
                setInvoiceGlobalError({ isValid: false, msg: 'Dimensions is invalid.' });
                return;
            }
            if (!grossWeight) {
                setInvoiceGlobalError({ isValid: false, msg: 'Gross weight / box is required.' });
                return;
            }
            if (isNaN(grossWeight)) {
                setInvoiceGlobalError({ isValid: false, msg: 'Gross weight / box is invalid.' });
                return;
            }
            if (!dimentionalWeight) {
                setInvoiceGlobalError({ isValid: false, msg: 'Dimentional Weight is required.' });
                return;
            }
            if (isNaN(dimentionalWeight)) {
                setInvoiceGlobalError({ isValid: false, msg: 'Dimentional Weight is invalid.' });
                return;
            }
            if (!chargeableWeight) {
                setInvoiceGlobalError({ isValid: false, msg: 'Chargeable weight is required.' });
                return;
            }
            if (isNaN(chargeableWeight)) {
                setInvoiceGlobalError({ isValid: false, msg: 'Chargeable weight is invalid.' });
                return;
            }

        } else {
            if (!invoiceNumber) {
                setInvoiceGlobalError({ isValid: false, msg: 'Invoice number is required.' });
                return;
            }
            if (!invoiceValue) {
                setInvoiceGlobalError({ isValid: false, msg: 'Invoice value is required.' });
                return;
            }
            if (!billNumber) {
                setInvoiceGlobalError({ isValid: false, msg: 'E-Way bill number is required.' });
                return;
            }
            if (!grossWeight) {
                setInvoiceGlobalError({ isValid: false, msg: 'Gross weight / box is required.' });
                return;
            }
            if (isNaN(grossWeight)) {
                setInvoiceGlobalError({ isValid: false, msg: 'Gross weight / box is invalid.' });
                return;
            }
            if (!chargeableWeight) {
                setInvoiceGlobalError({ isValid: false, msg: 'Chargeable weight is required.' });
                return;
            }
            if (isNaN(chargeableWeight)) {
                setInvoiceGlobalError({ isValid: false, msg: 'Chargeable weight is invalid.' });
                return;
            }
        }
}
         if(mode == 1)
    {
        funsave();
    }
        setInvoiceGlobalError({ isValid: true, msg: '' });
        resetAllFields();
        setInvoices([...invoices, {
            invoiceNumber: invoiceNumber,
            invoiceValue: invoiceValue,
            billNumber: billNumber,
            noOfBox: noOfBox,
            dimensions: Dimensions,
            grossWeight: Number(grossWeight),
            dimentionalWeight: Number(dimentionalWeight),
            chargeableWeight: chargeableWeight
        }]);
    }
    const resetAllFields = () => {
        setInvoiceNumber('');
        setInvoiceValue('');
        setBillNumber('');
        setNoOfBox(1);
        setDimensions({ length: '', weight: '', height: '' });
        setGrossWeight('');
        setDimentionalWeight('');
        setChargeableWeight('');
    }

    const handleEditInvoice = (index: any) => {
        let invoiceData: any = invoices.find((item: any, ind: any) => { return ind === index });
        if (invoiceData) {
            setInvoiceNumber(invoiceData.invoiceNumber);
            setInvoiceValue(invoiceData.invoiceValue);
            setBillNumber(invoiceData.billNumber);
            setNoOfBox(invoiceData.noOfBox);
            setDimensions(invoiceData.dimensions)
            setGrossWeight(invoiceData.grossWeight);
            setDimentionalWeight(Number(invoiceData.dimentionalWeight));
            setChargeableWeight(invoiceData.chargeableWeight);
            setIsEditInvoice(true);
            setSelectedIndex(index);
        }
    }

    const handlesaveEditedInvoice = () => {
        setInvoices(
            invoices.map((item: any, index: any) => {
                if (index === selectedIndex) {
                    return {
                        ...item,
                        invoiceNumber: invoiceNumber,
                        invoiceValue: invoiceValue,
                        billNumber: billNumber,
                        noOfBox: noOfBox,
                        dimensions: Dimensions,
                        grossWeight: Number(grossWeight),
                        dimentionalWeight: Number(dimentionalWeight),
                        chargeableWeight: chargeableWeight
                    }
                } else {
                    return item
                }
            })
        )
        setSelectedIndex('');
        setIsEditInvoice(false);
        resetAllFields();
        funsave();
    }

    const handlePickupDate = (date: any) => {
        setPickupDate(date);
    }

    useEffect(() => {
        if (watch('cargotype') && watch('airline') && watch('pickuptime') && pickupDate) {
            fetchFlights();
        }
    }, [watch('cargotype'), watch('airline'), watch('pickuptime'), pickupDate]);

    const handleProceed = (data: any) => {
        if (!pickupDate) {
            setPickupValidation({ isValid: false, msg: 'Pickup date is required.' });
            return;
        }
        let modeName: any = modes.find((mode: any) => { return mode.id === getValues('mode') });

        const login = getCookie();
        let pickup_lat: any = '', pickup_lon: any = '', drop_lat: any = '', drop_lon: any = '';
        if (addressData && vendors.pickup && vendors.pickup.latitude && vendors.pickup.longitude && (addressData.serviceType === 'Hub To Hub' || addressData.serviceType === 'Hub To Door')) {
            pickup_lat = vendors.pickup.latitude;
            pickup_lon = vendors.pickup.longitude;
        }
        if (addressData && vendors.deliver && vendors.deliver.latitude && vendors.deliver.longitude && (addressData.serviceType === 'Hub To Hub' || addressData.serviceType === 'Door To Hub')) {
            drop_lat = vendors.deliver.latitude;
            drop_lon = vendors.deliver.longitude;
        }
        let totalChargeableWeight: any = 0;
        totalChargeableWeight = _.sumBy(invoices, 'chargeableWeight');

        const request = {
            pickup_lat: pickup_lat ? pickup_lat : addressData.pickupAddress.latitude,
            pickup_lon: pickup_lon ? pickup_lon : addressData.pickupAddress.longitude,
            drop_lat: drop_lat ? drop_lat : addressData.deliveryAddress.latitude,
            drop_lon: drop_lon ? drop_lon : addressData.deliveryAddress.longitude,
            origin: addressData.pickupAddress.city,
            destination: addressData.deliveryAddress.city,
            cargo: getValues('cargotype'),
            sla: getValues('sla'),
            service: getValues('servicepreferences') === 'Airline' ? 1 : 0,
            airline: getValues('airline'),
            flight: getValues('flightno'),
            pickupdate: moment(pickupDate).format('DD-MM-YYYY'),
            chargeableweight: totalChargeableWeight,
            customer_id: login.id,
            service_type: addressData.serviceTypeId,
            promocode: '',
            company_or_individual: getValues('consignment') === 'company' ? 0 : 1

        }
        checkPrice(request)
            .then((success) => {
                if (success && success.status === true && success.errorcode === 200 && success.response) {
                    const invoiceInfo: any = {
                        invoiceInfo: {
                            invoices: invoices,
                            mode: getValues('mode'), // id
                            modeName: modeName.name,
                            servicePreferences: getValues('servicepreferences'),
                            volumetricConsignment: getValues('volumetricconsignment'),
                            cargoType: getValues('cargotype'),
                            pickupDate: pickupDate,
                            pickupTime: getValues('pickuptime'),
                            airline: getValues('airline'),
                            flightNo: getValues('flightno'),
                            insureCargo: '',
                            checkPrice: success.response,
                            uom: getValues('uom'),
                            sla: getValues('sla'),
                            consignmentFrom: getValues('consignment')
                        }
                    }
                    dispatch(addInvoiceInfo(invoiceInfo));
                    history('/payment');
                } else if (success && success.status === false && success.errorcode === 200 && success.message) {
                    toast.error(success.message);
                }

            }).catch((error) => {
                console.log('errorCheckPrice', error);
                toast.error('Something went wrong.')
            })
    }

    const handleDimension = (value: any, type: any) => {
        if (type === 'length') {
            setDimensions({ ...Dimensions, length: value });
        } else if (type === 'width') {
            setDimensions({ ...Dimensions, weight: value });
        } else {
            setDimensions({ ...Dimensions, height: value });
        }
    }
    const handleGrossWeight = (value: any) => {
        setGrossWeight(value);
        if (noOfBox) {
            setChargeableWeight(noOfBox * value);
        }
    }
    useEffect(() => {
        if (Dimensions && Dimensions.weight && Dimensions.length && Dimensions.height && noOfBox) {
            calculateDimentionalWeight();
        }
    }, [Dimensions, noOfBox, watch('uom')]);
    const calculateDimentionalWeight = () => {
        if (watch('uom') === 'cms') {
            setDimentionalWeight(((Dimensions.height * Dimensions.weight * Dimensions.length * noOfBox) / 6000).toFixed(2));
        } else {
            setDimentionalWeight(((Dimensions.height * Dimensions.weight * Dimensions.length * noOfBox) / 366).toFixed(2));
        }
    }
    useEffect(() => {
        if (dimentionalWeight) {
            if (dimentionalWeight > chargeableWeight) {
                setChargeableWeight(dimentionalWeight);
            } else {
                setChargeableWeight(noOfBox * grossWeight);
            }
        }
    }, [dimentionalWeight]);
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
                                            (modes && modes.length > 0) &&
                                            modes.map((mode: any) => {
                                                return (
                                                    <dd key={mode.id}>
                                                        <label className="custRadio">{mode.name}
                                                            <input type="radio" checked={watch('mode') === mode.id ? true : false} value={mode.id} {...register('mode', { required: true })} />
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
                                                <label>Services Preferences<sup>*</sup></label>
                                                <div className="tabs-btn">
                                                    <a className={watch('servicepreferences') === 'SLA' ? "active" : ''} onClick={() => { setValue('servicepreferences', 'SLA') }}>SLA</a>
                                                    <a className={watch('servicepreferences') === 'Airline' ? "active" : ''} onClick={() => { setValue('servicepreferences', 'Airline') }}>Airline</a>
                                                </div>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Cargo Type<sup>*</sup></label>
                                                <select {...register('cargotype', { required: true })}>
                                                    <option value={''}>Select cargo type</option>
                                                    {
                                                        (cargoTypes && cargoTypes.length > 0) &&
                                                        cargoTypes.map((item: any) => {
                                                            return (
                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="selcet_wrap">
                                                <label>Preferred Pickup Time<sup>*</sup></label>
                                                <select {...register('pickuptime', { required: true })}>
                                                    {
                                                        timeList.map((time: any) => {

                                                            if ((moment(pickupDate).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) && moment().format('HH') < time.startTime && time.startTime < 24) {
                                                                return (
                                                                    <option key={time.startTime} value={time.timeSlot}>{time.timeSlot}</option>
                                                                )
                                                            } else if ((moment(pickupDate).format('DD-MM-YYYY') !== moment().format('DD-MM-YYYY'))) {
                                                                return (
                                                                    <option key={time.startTime} value={time.timeSlot}>{time.timeSlot}</option>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    {/* <option value={'08:00 - 10:00 Hrs.'}>08:00 - 10:00 Hrs.</option>
                                                    <option value={'10:00 - 12:00 Hrs.'}>10:00 - 12:00 Hrs.</option>
                                                    <option value={'12:00 - 13:00 Hrs.'}>12:00 - 13:00 Hrs.</option>
                                                    <option value={'13:00 - 16:00 Hrs.'}>13:00 - 16:00 Hrs.</option>
                                                    <option value={'18:00 - 20:00 Hrs.'}>18:00 - 20:00 Hrs.</option>
                                                    <option value={'20:00 - 22:00 Hrs.'}>20:00 - 22:00 Hrs.</option>
                                                    <option value={'22:00 - 00:00 Hrs.'}>22:00 - 00:00 Hrs.</option>
                                                    <option value={'00:00 - 02:00 Hrs.'}>00:00 - 02:00 Hrs.</option>
                                                    <option value={'02:00 - 04:00 Hrs.'}>02:00 - 04:00 Hrs.</option>
                                                    <option value={'04:00 - 06:00 Hrs.'}>04:00 - 06:00 Hrs.</option>
                                                    <option value={'06:00 - 08:00 Hrs.'}>06:00 - 08:00 Hrs.</option> */}
                                                </select>
                                                {
                                                    (errors && errors.pickuptime && errors.pickuptime.type === 'required') &&
                                                    <span className='text-danger'>Preferred pickup time is required.</span>
                                                }
                                            </div>
                                            {
                                                (watch('servicepreferences') === 'Airline') &&
                                                <div className="selcet_wrap">
                                                    <label>Flight No.<sup>*</sup></label>
                                                    <select {...register('flightno', { required: watch('servicepreferences') === 'Airline' ? true : false })}>
                                                        <option value={''}>Select flight no</option>
                                                        {
                                                            (flights && flights.length > 0) &&
                                                            flights.map((flight: any) => {
                                                                return (
                                                                    <option key={flight.id} value={flight.id}>{flight.flight_no}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        (errors && errors.flightno && errors.flightno.type === 'required') &&
                                                        <span className='text-danger'>Flight no is required.</span>
                                                    }
                                                </div>
                                            }

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
                                                <KeyboardDatePicker
                                                    id="date-picker-dialog"
                                                    format="DD-MM-YYYY"
                                                    value={pickupDate}
                                                    minDate={moment()}
                                                    onChange={(date) => { handlePickupDate(date) }}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                                {
                                                    (!pickupDateValidation.isValid) &&
                                                    <span className='text-danger'>{pickupDateValidation.msg}</span>
                                                }
                                            </div>
                                            {
                                                (watch('servicepreferences') === 'Airline') &&
                                                <div className="selcet_wrap">
                                                    <label>Airline<sup>*</sup></label>
                                                    <select {...register('airline', { required: watch('servicepreferences') === 'Airline' ? true : false })}>
                                                        <option value={''}>Select airline</option>
                                                        {
                                                            (airlines) &&
                                                            Object.entries(airlines).map(([key, value]: any) => {
                                                                return (
                                                                    <option key={key} value={key}>{value}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        (errors && errors.airline && errors.airline.type === 'required') &&
                                                        <span className='text-danger'>Airline is required.</span>
                                                    }
                                                </div>
                                            }


                                            <div className="selcet_wrap">
                                                {
                                                    (watch('servicepreferences') === 'SLA') &&
                                                    <>
                                                        <label> SLA<sup>*</sup></label>
                                                        <select {...register('sla', { required: watch('servicepreferences') === 'SLA' ? true : false })}>
                                                            <option value={''}>Select SLA</option>
                                                            {
                                                                (SLAs && SLAs.length > 0) &&
                                                                SLAs.map((item: any) => {
                                                                    return (
                                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <label className="custRadio">This consignment is sent by company.
                                    <input type="radio" {...register('consignment', { required: true })} value="company" />
                                    <span className="checkmark"></span>
                                </label>
                                <label className="custRadio">This consignment is sent by individual.
                                    <input type="radio" {...register('consignment', { required: true })} value="individual" />
                                    <span className="checkmark"></span>
                                </label>
                                {
                                    (errors && errors.consignment && errors.consignment.type === 'required') &&
                                    <span className='text-danger'>terms & condition is required.</span>
                                }

                            </div>
                        </div>

                        <div className="mode-wrap  mt-5 progressBar progNone">
                            <div className="progressCir"></div>
                            <div className="invoice-wrap">
                                {
                                    (invoices && invoices.length > 0) &&
                                    invoices.map((invoice: any, index: any) => {
                                        return (
                                            <ul key={invoice.invoiceNumber + index} className="invoice-table">
                                                <li> <label>Invoice Number</label>{invoice.invoiceNumber}</li>
                                                {
                                                    watch('volumetricconsignment') === 'Yes' &&
                                                    <li> <label>Invoice Value</label>{invoice.invoiceValue}</li>
                                                }
                                                <li> <label>No. of Boxes</label>{invoice.noOfBox}</li>
                                                {
                                                    watch('volumetricconsignment') === 'No' &&
                                                    <li> <label>Chargeable Weight</label>{invoice.chargeableWeight}</li>
                                                }
                                                <li><a onClick={() => { addsave(); handleEditInvoice(index) }}><img src={require("../../assets/images/edit.png")} /></a></li>
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


                                <ul className="invoice-table2" id = 'tblinvoicecustomox'>
                                    <div className="invoice-header">
                                        <label>Invoice {invoices && invoices.length > 0 ? (invoices.length + 1) : ''}</label>
                                        {/* <a href=""><img src={require("../../assets/images/close.png")} /></a> */}
                                    </div>
                                    {
                                        watch('volumetricconsignment') === 'Yes' &&
                                        <>
                                            <label className='custRadio m-2'>CM
                                                <input type="radio" value="cms" {...register('uom', { required: watch('volumetricconsignment') === 'Yes' ? true : false })} /><span className="checkmark"></span>
                                            </label>
                                            <label className='custRadio mt-2 m-2'>Inch
                                                <input type="radio" value="inch" {...register('uom', { required: watch('volumetricconsignment') === 'Yes' ? true : false })} /><span className="checkmark"></span>
                                            </label>
                                            <li></li>
                                            <li></li>
                                        </>
                                    }
                                    {
                                        (errors && errors.uom && errors.uom.type === 'required') &&
                                        <span className='text-danger'>Type is required.</span>
                                    }

                                    <li>
                                        <label>Invoice Number<sup>*</sup></label>
                                        <input type="text" name="" className="gross-input"
                                            value={invoiceNumber} onChange={(e) => {
                                                if (allowOnlyAlphaAndDigits(e.target.value)) {
                                                    setInvoiceNumber(e.target.value)
                                                }
                                            }} />

                                    </li>
                                    {
                                        // (watch('volumetricconsignment') === 'Yes') &&
                                        <>
                                            <li>
                                                <label>Invoice Value<sup>*</sup></label>
                                                <input type="text" name="" className="gross-input" value={invoiceValue}
                                                    onChange={(e) => {
                                                        if (allowOnlyAlphaAndDigits(e.target.value)) {
                                                            setInvoiceValue(e.target.value)
                                                        }
                                                    }} />
                                            </li>
                                            <li>
                                                <label>E-Way Bill Number<sup>*</sup></label>
                                                <input type="text" name="" className="gross-input" value={billNumber}
                                                    onChange={(e) => {
                                                        if (allowOnlyAlphaAndDigits(e.target.value)) {
                                                            setBillNumber(e.target.value)
                                                        }
                                                    }} />

                                            </li>
                                        </>
                                    }

                                    <li className="sec-one">
                                        <label>No. of Boxes<sup>*</sup></label>
                                        <div className="boxex-number">
                                            <button className="minus" onClick={subNoOfBox}>-</button>
                                            <input type="text" value={noOfBox} />
                                            <button className="plus" onClick={addNoOfBox}>+</button>
                                        </div>
                                    </li>
                                    {
                                        (watch('volumetricconsignment') === 'Yes') &&
                                        <li className="sec-two">
                                            <label>Dimensions<sup>*</sup></label>
                                            <dl>
                                                <dd>
                                                    <input type="text" placeholder='Length' name="" value={Dimensions.length} onChange={(e: any) => {
                                                        if (!isNaN(e.target.value)) {
                                                            handleDimension(e.target.value, 'length');
                                                        }
                                                    }} />
                                                    {/* <input type="text" name="" /> */}
                                                </dd>
                                                <dd>
                                                    <input type="text" placeholder='width' name="" value={Dimensions.weight} onChange={(e: any) => {
                                                        if (!isNaN(e.target.value)) {
                                                            handleDimension(e.target.value, 'width');
                                                        }
                                                    }} />
                                                    {/* <input type="text" name="" /> */}
                                                </dd>
                                                <dd>
                                                    <input type="text" placeholder='Height' name="" value={Dimensions.height} onChange={(e: any) => {
                                                        if (!isNaN(e.target.value)) {
                                                            handleDimension(e.target.value, 'height');
                                                        }
                                                    }} />
                                                    {/* <input type="text" name="" /> */}
                                                </dd>
                                            </dl>
                                        </li>
                                    }
                                    <li>
                                        <label>Gross Weight / Box<sup>*</sup></label>
                                        <input type="text" className="gross-input" value={grossWeight} onChange={(e: any) => {
                                            if (!isNaN(e.target.value)) {
                                                handleGrossWeight(e.target.value)
                                            }
                                        }} />

                                    </li>
                                    {
                                        (watch('volumetricconsignment') === 'Yes') &&
                                        <li>
                                            <label>Dimentional Weight<sup>*</sup></label>
                                            <input type="text" disabled={true} className="gross-input" value={dimentionalWeight} />
                                        </li>
                                    }
                                    <li>
                                        <label>Chargeable Weight<sup>*</sup></label>
                                        <input type="text" name="" disabled={true} className="gross-input" value={chargeableWeight} />

                                    </li>
                                    {
                                        (!invoiceGlobalError.isValid) &&
                                        <span className='text-danger'>{invoiceGlobalError.msg}</span>
                                    }

                                </ul>
                                <ul>
                                    <li className='d-flex justify-content-end m-3'>
                                        <button id = 'btnsave' className='proceedBtn save-btn' onClick={() => {
                                       
                                            if (isEditInvoice) {
                                                handlesaveEditedInvoice()
                                            } else {
                                                
                                                addInvoice(1)
                                                
                                            }

                                        }}>Save</button>
                                    </li>
                                </ul>


                                <ul className="invoice-table display-none" id = "tblinvoicetableshow" >
                                    {
                                        
                                        (isEditInvoice) ?
                                            <a className="upload-file" onClick={() => {handlesaveEditedInvoice();}}>
                                                Save
                                            </a>
                                            :
                                            <a className="upload-file" onClick={() => { addsave();
                                            resetAllFields() }}>
                                                <img src={require("../../assets/images/add.png")} />
                                            </a>

                                    }
                                </ul>
                            </div>
                        </div>

                        {/* <div className="mode-wrap mode-wrap-second mt-5 progressBar progNone">
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
                        </div> */}

                        <div className="proceed-buton">
                            <button className="proceedBtn" disabled={invoices.length === 0} onClick={handleSubmit(handleProceed)}>Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
