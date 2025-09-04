import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalProps {
  isModalOpen: boolean;
  modalType: string | null;
  payload: unknown; // може бути user, article, event і т.д.
}

const initialState: ModalProps = {
  modalType: null,
  isModalOpen: false,
  payload: null,
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ modalType: string; payload?: unknown }>) => {
      state.isModalOpen = true;
      state.modalType = action.payload.modalType;
      state.payload = action.payload.payload || null;
    },
    closeModal: state => {
      state.isModalOpen = false;
      state.modalType = null;
      state.payload = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
