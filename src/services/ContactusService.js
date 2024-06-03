import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/home/contactUs";
const apiUpdateEndpoint = API_BASE_URL_ENV() + "/home/closeContactUs";

export default class ContactusService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    update(id) {
        return http.put(`${apiUpdateEndpoint}/${id}`);
    }

}
