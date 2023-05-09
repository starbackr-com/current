import { createSlice } from '@reduxjs/toolkit';
import { saveValue } from '../../utils';

const initialState = {
  wcdata: [],
  wcPubkeys: [],
};

export const walletconnectSlice = createSlice({
  name: 'walletconnect',
  initialState,
  reducers: {
    addWalletconnect: (state, action) => {
      const newWcData = action.payload.filter(
        (wcKey) => !state.wcPubkeys.includes(wcKey.nwcpubkey),
      );
      const newPubkeys = [
        ...state.wcPubkeys,
        ...newWcData.map((item) => item.nwcpubkey),
      ];
      state.wcPubkeys = newPubkeys;
      state.wcdata = [...newWcData, ...state.wcdata];
    },
    changeWalletconnect: (state, action) => {
      const updatedWalletconnectObject = action.payload;
      const index = state.wcdata.findIndex(
        (item) => item.nwcpubkey === updatedWalletconnectObject.nwcpubkey,
      );
      state.wcdata[index] = updatedWalletconnectObject;
    },
    hydrate: (state, action) => {
      state.wcPubkeys = action.payload.map((item) => item.nwcpubkey);
      state.wcdata = [...action.payload];
    },
  },
});

export const wcListener = async (action, listenerApi) => {
  const {
    walletconnect: { wcdata },
  } = listenerApi.getState();
  const json = JSON.stringify(wcdata);
  await saveValue('wcdata', json);
};

export const { addWalletconnect, changeWalletconnect, hydrate } =
  walletconnectSlice.actions;

export default walletconnectSlice.reducer;
