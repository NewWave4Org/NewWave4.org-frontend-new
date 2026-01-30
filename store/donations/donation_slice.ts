import { createSlice } from "@reduxjs/toolkit";
import { getAllDonations } from "./action";

interface IDonations {
  donations: any[]
}

const initialState:IDonations = {
  donations: []
};

const donationSlice = createSlice({
  name: 'donationSlice',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllDonations.fulfilled, (state, action) => {
      state.donations = action.payload.content;
    });
  }
});


export default donationSlice.reducer;