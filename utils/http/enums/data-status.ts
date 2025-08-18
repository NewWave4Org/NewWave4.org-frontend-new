const DataStatus = {
  PENDING: 'loading',
  FULFILLED: 'fulfilled',
  REJECT: 'error',
  IDLE: 'idle',
} as const;

type DataStatus = (typeof DataStatus)[keyof typeof DataStatus];

export default DataStatus;
