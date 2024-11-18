import { configureStore } from '@reduxjs/toolkit'
import toggleReducer from './ToggleSlice'



export const Store = configureStore({
    reducer: {
        toggleReducer: toggleReducer,
        
       
    }
})