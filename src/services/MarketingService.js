import BaseService from "./BaseService";
import http from './HttpService'

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/marketing";

export default class MarketingService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    //Banners
    getBanners() {
        return http.get(`${this.apiEndpoint}/marketingBanner`);
    }
    createBanners(data) {
        return http.post(`${this.apiEndpoint}/marketingBanner`, data);
    }

    // Video
    getVideo() {
        return http.get(`${this.apiEndpoint}/marketingVideo`);
    }
    createVideo(data) {
        return http.post(`${this.apiEndpoint}/marketingVideo`, data);
    }

    // Services
    getServices() {
        return http.get(`${this.apiEndpoint}/marketingService`);
    }
    createServices(data) {
        return http.post(`${this.apiEndpoint}/marketingService`, data);
    }
}
