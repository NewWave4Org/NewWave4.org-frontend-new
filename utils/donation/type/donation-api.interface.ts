import { IDonationRequestDTO, IDonationResponseDTO } from "./interface";

interface IDonationApi {
  getAllDonations: (data: IDonationRequestDTO) => Promise<IDonationResponseDTO>;
}

export type {IDonationApi};