import BaseService from "./BaseService";
import http from "./HttpService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/home/partner";

export default class PartnersService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }
}
