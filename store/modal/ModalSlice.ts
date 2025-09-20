import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalProps {
  isModalOpen: boolean;
  modalType: string | null;
  payload: unknown;
  title?: string;
}

const initialState: ModalProps = {
  modalType: null,
  isModalOpen: false,
  payload: null,
  title: '',
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ modalType: string; payload?: unknown, title?: string }>) => {
      state.isModalOpen = true;
      state.modalType = action.payload.modalType;
      state.payload = action.payload.payload || null;
      state.title = action.payload.title || null || undefined;
    },
    closeModal: state => {
      state.isModalOpen = false;
      state.modalType = null;
      state.payload = null;
      state.title = '';
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
