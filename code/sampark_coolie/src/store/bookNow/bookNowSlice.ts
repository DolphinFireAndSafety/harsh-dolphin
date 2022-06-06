import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { data } from 'jquery'
import type { RootState } from '../index'

// Define a type for the slice state
interface BookNowState {
    data: any,
    vendors: any
}

// Define the initial state using that type
const initialState: BookNowState = {
    data: {},
    vendors: ''
}

export const bookNowSlice = createSlice({
    name: 'bookNow',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        addAddress: (state, action: PayloadAction<number>) => {
            state.data = action.payload
        },
        addInvoiceInfo: (state, action: PayloadAction<number>) => {
            let data: any = action.payload;
            state.data = { ...state.data, ...data }
        },
        addPickupVendorAddressDetails: (state, action: PayloadAction<any>) => {
            state.vendors = { ...state.vendors, pickup: action.payload }
        },
        addDeliverVendorAddressDetails: (state, action: PayloadAction<any>) => {
            state.vendors = { ...state.vendors, deliver: action.payload }
        },
        addPickupVendorContactDetails: (state, action: PayloadAction<any>) => {
            state.vendors = { ...state.vendors, pickupContact: action.payload }
        },
        addDeliverVendorContactDetails: (state, action: PayloadAction<any>) => {
            state.vendors = { ...state.vendors, deliverContact: action.payload }
        },
        clearData: (state) => {
            state.data = {};
            state.vendors = '';
        },
    },
})

export const { addAddress, addInvoiceInfo, addPickupVendorAddressDetails, addDeliverVendorAddressDetails,
    addPickupVendorContactDetails, addDeliverVendorContactDetails, clearData
} = bookNowSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.bookNow.data

export default bookNowSlice.reducer