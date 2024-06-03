import BaseService from "./BaseService";
import http from './HttpService'

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/branding";

export default class BrandingService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    //Banners
    getBanners() {
        return http.get(`${this.apiEndpoint}/brandingBanner`);
    }
    createBanners(data) {
        return http.post(`${this.apiEndpoint}/brandingBanner`, data);
    }
    updateBanners(data) {
        return http.put(`${this.apiEndpoint}/brandingBanner`, data);
    }
    removeBanners(id) {
        return http.delete(`${this.apiEndpoint}/deleteBrandingBanner/${id}`);
    }

    // What We Do
    getWWD() {
        return http.get(`${this.apiEndpoint}/whatWeDo`);
    }
    createWWD(data) {
        return http.post(`${this.apiEndpoint}/whatWeDo`, data);
    }

    // What We Do
    getServices() {
        return http.get(`${this.apiEndpoint}/brandingService`);
    }
    createServices(data) {
        return http.post(`${this.apiEndpoint}/brandingService`, data);
    }

    //Images
    getImages() {
        return http.get(`${this.apiEndpoint}/brandingImages`);
    }
    createImages(data) {
        return http.post(`${this.apiEndpoint}/brandingImages`, data);
    }
    updateImages(id,data) {
        return http.put(`${this.apiEndpoint}/brandingImages/${id}`, data);
    }
    removeImages(id) {
        return http.delete(`${this.apiEndpoint}/brandingImages/${id}`);
    }
}
