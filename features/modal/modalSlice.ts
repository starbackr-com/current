import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ModalProps = {
  mounted: boolean;
  data: any;
};

type ModalState = {
  subscriptionModal: ModalProps;
  paymentModal: {
    mounted: boolean;
    data?: {
      invoice: string;
      receiver: string | undefined;
    };
  };
};

type DisplayPayload =
  | {
      modalKey: 'subscriptionModal';
      data: undefined;
    }
  | {
      modalKey: 'paymentModal';
      data: {
        invoice: string;
        receiver: string | undefined;
      };
    };

type DismissPayload = {
  modalKey: keyof ModalState;
};

const initialState: ModalState = {
  subscriptionModal: { mounted: false, data: undefined },
  paymentModal: { mounted: false, data: undefined },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    displayModal: (state, action: PayloadAction<DisplayPayload>) => {
      state[action.payload.modalKey].mounted = true;
      state[action.payload.modalKey].data = action.payload.data;
    },
    dismissModal: (state, action: PayloadAction<DismissPayload>) => {
      state[action.payload.modalKey].mounted = false;
      state[action.payload.modalKey].data = undefined;
    },
  },
});

export const { displayModal, dismissModal } = modalSlice.actions;

export default modalSlice.reducer;
