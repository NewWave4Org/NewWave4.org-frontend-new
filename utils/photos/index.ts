import PhotoApi from './photo-api';
import PhotoService from './photo-service';

const photoApi = new PhotoApi();
const photoService = new PhotoService(photoApi);

export { photoService };
