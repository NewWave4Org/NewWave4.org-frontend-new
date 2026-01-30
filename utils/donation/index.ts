import DonationApi from "./donation-api";
import DonationService from "./donation-service";

const donationApi = new DonationApi();
const donationService = new DonationService(donationApi);

export {donationService};