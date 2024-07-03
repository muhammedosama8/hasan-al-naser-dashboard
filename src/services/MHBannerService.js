import BaseService from "./BaseService";
import { API_BASE_URL_ENV } from "../jsx/common/common";
import http from './HttpService'
const apiEndpoint = API_BASE_URL_ENV() + "/banner_hn";

export default class MHBannerService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }
    update(data) {
        const body = { ...data };
        return http.put(apiEndpoint, body);
    }
}
