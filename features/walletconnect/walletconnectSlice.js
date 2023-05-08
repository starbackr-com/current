import { createSlice } from '@reduxjs/toolkit';
import { saveValue } from '../../utils';

const initialState = {
  wcdata: [],
};

export const walletconnectSlice = createSlice({
  name: 'walletconnect',
  initialState,
  reducers: {
    addWalletconnect: (state, action) => {
      const deduplicated = [...new Set([...action.payload, ...state.wcdata])];
      state.wcdata = deduplicated;
    },
    changeWalletconnect: (state, action) => {
      const updatedWalletconnectObject = action.payload;
      const index = state.wcdata.findIndex(
        (item) => item.nwcpubkey === updatedWalletconnectObject.nwcpubkey,
      );

      state.wcdata[index] = updatedWalletconnectObject;
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

export const { addWalletconnect, changeWalletconnect } = walletconnectSlice.actions;

export default walletconnectSlice.reducer;
