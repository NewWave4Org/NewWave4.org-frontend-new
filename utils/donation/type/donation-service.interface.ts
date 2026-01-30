import { IDonationRequestDTO, IDonationResponseDTO } from "./interface";

interface IDonationService {
  getAllDonations: (data: IDonationRequestDTO) => Promise<IDonationResponseDTO>;
}

export type {IDonationService};