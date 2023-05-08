import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    wcdata: [],
};

export const walletconnectSlice = createSlice({
  name: 'walletconnect',
  initialState,
  reducers: {
    addWalletconnect: (state, action) => {
      const wcArray = action.payload;
      console.log('wcarray: ', action.payload);
      console.log(state.wcdata);
      const deduplicated = [
        ...new Set([...action.payload, ...state.wcdata]),
      ];
      state.wcdata = deduplicated;
    },
    changeWalletconnect: (state, action) => {
      const updatedWalletconnectObject = action.payload;
      console.log(state.wcdata);
      const index = state.wcdata.findIndex(
        (item) => item.nwcpubkey === updatedWalletconnectObject.nwcpubkey,
      );

      state.wcdata[index] = updatedWalletconnectObject;
    },
  },
});

export const { addWalletconnect, changeWalletconnect } =
  walletconnectSlice.actions;

export default walletconnectSlice.reducer;
