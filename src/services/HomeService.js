import BaseService from "./BaseService";
import http from './HttpService'

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/home";

export default class HomeService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    // Collection
    getCollection() {
        return http.get(`${this.apiEndpoint}/collection`);
    }
    createCollection(data) {
        return http.post(`${this.apiEndpoint}/collection`, data);
    }

    // What We Do
    getBarcode() {
        return http.get(`${this.apiEndpoint}/barcode`);
    }
    createBarcode(data) {
        return http.post(`${this.apiEndpoint}/barcode`, data);
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
