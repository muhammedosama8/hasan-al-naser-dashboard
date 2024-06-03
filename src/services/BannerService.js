import BaseService from "./BaseService";
import http from './HttpService'

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/banner";

export default class BannerService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    update(data) {
        return http.put(apiEndpoint, data);
    }
}
