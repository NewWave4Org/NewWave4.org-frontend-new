import axios from 'axios';
import { prefix } from '../prefix';

axios.defaults.baseURL = `${prefix}`;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
