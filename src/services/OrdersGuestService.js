import { API_BASE_URL_ENV } from "../jsx/common/common";
import BaseService from "./BaseService";
import http from "./HttpService";

const apiEndpoint = API_BASE_URL_ENV() + "/orderGuest/admin";
const apiUpadteEndpoint = API_BASE_URL_ENV() + "/orderGuest/changeStatus";

export default class OrdersGuestService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  changeStatus(id, data){
    return http.put(`${apiUpadteEndpoint}/${id}`, data)
  }
}
