import { IDonationService } from "./type/donation-service.interface";
import { IDonationRequestDTO, IDonationResponseDTO } from "./type/interface";

class DonationService implements IDonationService {
  private donationService: IDonationService;

  constructor(donationService: IDonationService) {
    this.donationService = donationService;
  }

  async getAllDonations(data: IDonationRequestDTO): Promise<IDonationResponseDTO> {
    return this.donationService.getAllDonations(data);
  };
}

export default DonationService;