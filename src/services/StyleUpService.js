import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/styleUp";

export default class StyleUpService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  getList(type) {
    return http.get(`${apiEndpoint}/${type}`);
  }

  create(type, data) {
    return http.post(`${apiEndpoint}/${type}`, data);
  }
}
