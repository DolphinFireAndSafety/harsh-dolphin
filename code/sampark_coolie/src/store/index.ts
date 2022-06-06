import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import bookNowReducer from './bookNow/bookNowSlice'
// ...

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        bookNow: bookNowReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch