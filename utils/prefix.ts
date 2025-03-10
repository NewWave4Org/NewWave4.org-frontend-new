const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? process.env.NEXT_PUBLIC_BASE_PATH || "" : '';

export { prefix };
