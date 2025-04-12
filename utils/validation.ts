import * as Yup from 'yup';

export const emailValidation = Yup.string()
  .required('Email field cannot be empty')
  .matches(
    /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i,
    'Please enter a valid email address',
  );

export const phoneValidation = Yup.string().matches(
  /^\+?[0-9()\-\s]{6,20}$/,
  'Invalid phone',
);

export const nameValidation = Yup.string()
  .required('Name field cannot be empty')
  .min(2, 'Invalid name')
  .matches(/^[^\d!@#$%^&*()_+={}[\]:;"'<>,.?/~`|-]+$/, 'Invalid name');

export const passwordValidation = Yup.string().required(
  'Password field cannot be empty',
);
