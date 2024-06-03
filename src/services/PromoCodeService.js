import BaseService from "./BaseService";
import http from './HttpService'

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/promoCode";
const apiToggleStatusEndpoint = API_BASE_URL_ENV() + "/promoCode/status";
const apiGetPromoCodeEndpoint = API_BASE_URL_ENV() + "/cart/promoCode";

export default class PromoCodeService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    toggleStatus(id, data) {
        return http.put(`${apiToggleStatusEndpoint}/${id}`, data);
    }
    getPromoCode(data) {
        return http.post(apiGetPromoCodeEndpoint, data);
    }
}
