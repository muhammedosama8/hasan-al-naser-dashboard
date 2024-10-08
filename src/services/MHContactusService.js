import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/setting/contactUs";
const apiUpdateEndpoint = API_BASE_URL_ENV() + "/setting/closeContactUs";

export default class MHContactusService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    update(id) {
        return http.put(`${apiUpdateEndpoint}/${id}`);
    }
}
