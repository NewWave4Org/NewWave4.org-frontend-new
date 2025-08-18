import { createSlice } from '@reduxjs/toolkit';

interface ModalProps {
  isModalOpen: boolean;
  modalType: string | null;
  user: unknown;
}

const initialState: ModalProps = {
  modalType: null,
  isModalOpen: false,
  user: null,
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload.modalType;
      state.user = action.payload.user;
    },
    closeModal: state => {
      state.isModalOpen = false;
      state.modalType = null;
      state.user = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
