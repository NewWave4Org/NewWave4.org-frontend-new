const isProd = process.env.NODE_ENV === 'production';

const prefix = isProd ? '/NewWave4.org-frontend-new' : '';

export { prefix };