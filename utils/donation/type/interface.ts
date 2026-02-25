export const DonationProvider = {
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',
} as const;

export const DonationStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PROCESSING: 'PROCESSING',
  REFUNDED: 'REFUNDED'
} as const;

export type DonationProviderType = typeof DonationProvider[keyof typeof DonationProvider];
export type DonationStatusType = typeof DonationStatus[keyof typeof DonationStatus];

export interface IDonationRequestDTO {
  page: number;
  size?: number,
  transactionId?: string | null;
  userEmail?: string | null;
  provider?:  DonationProviderType;
  status?: DonationStatusType;
  dateFrom?: string;
  dateTo?: string;
}

export interface IDonation {
  id: number,
  referenceId: string,
  createdAt: string,
  updatedAt: string,
  paymentIntentId: string,
  name: string,
  email: string,
  amount: number,
  currency: string,
  purpose: string,
  comment: string,
  paymentProvider: DonationProviderType,
  paymentStatus: DonationStatusType
}

export interface IDonationResponseDTO {
  totalPages: number,
  totalElements: number,
  pageable: {
    paged: boolean,
    pageNumber: number,
    pageSize: number,
    offset: number,
    sort: {
      sorted: boolean,
      empty: boolean,
      unsorted: boolean
    },
    unpaged: boolean
  },
  size: number,
  content: IDonation[],
  number: number,
  sort: {
    sorted: boolean,
    empty: boolean,
    unsorted: boolean
  },
  first: boolean,
  last: boolean,
  numberOfElements: number,
  empty: boolean
}