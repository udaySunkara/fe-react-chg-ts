import axios from 'axios';

import { LenderGetResponse, LenderPostResponse } from 'lib/types';

const baseURL = 'http://localhost:3000';
const HTTPService = {
  get: (URL: string): Promise<LenderGetResponse> => {
    return axios.get(`${baseURL}/${URL}`).then((res) => res.data);
  },
  post: (URL: string, requestBody: any): Promise<LenderPostResponse> => {
    return axios.post(`${baseURL}/${URL}`, requestBody).then((res) => res.data);
  },
};

export default HTTPService;
