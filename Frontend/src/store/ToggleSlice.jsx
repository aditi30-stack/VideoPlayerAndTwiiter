import { createSlice } from "@reduxjs/toolkit";

export const ToggleSlice = createSlice({
    name: 'Toggle',
    initialState: false,
    reducers: {
        toggleState(state) {
            return !state
        }
    }
})

export const {toggleState} = ToggleSlice.actions
export default ToggleSlice.reducer