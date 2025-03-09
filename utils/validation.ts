import * as Yup from 'yup';

export const emailValidation = Yup.string()
    .required('Email field cannot be empty')
    .matches(
        /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i,
        'Please enter a valid email address'
    );

export const phoneValidation = Yup.string().matches(/^\+?\d{6,15}$/, 'Invalid phone');