import React, { useState } from 'react'

import { useAppSelector, useAppDispatch } from '../../store/hook'

import { decrement, increment } from '../../store/counter/counterSlice'

export function Counter() {
    // The `state` arg is correctly typed as `RootState` already
    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()

    return (
        <div>
            <h1>Counter</h1>
            <h3>Count is: {count}</h3>
            <button onClick={() => { dispatch(increment()) }}>Increment</button>
            <button onClick={() => { dispatch(decrement()) }}>Decrement</button>
        </div>
    )
}