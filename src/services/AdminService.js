import BaseService from "./BaseService";
import http from "./HttpService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/admin";
const apiTogglle = API_BASE_URL_ENV() + "/admin/block";
const apiDashboard = API_BASE_URL_ENV() + "/admin/dashboard";
const apiLogout = API_BASE_URL_ENV() + "/admin/logout";
const apiImageProfile = API_BASE_URL_ENV() + "/admin/imageProfile";

export default class AdminService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  updateProfile(data) {
    const body = { ...data };
    return http.put(apiEndpoint, body);
  }

  getList(params) {
    if (params) {
      return http.get(`${this.apiEndpoint}/admin`, { params });
    } else {
      return http.get(`${this.apiEndpoint}/admin`);
    }
  }

  getDashboard = () => {
    return http.get(apiDashboard);
  };

  changeAvatar = (data) => {
    return http.put(apiImageProfile, data);
  };

  toggleStatus(id, data) {
    return http.put(`${apiTogglle}/${id}`, data);
  }

  logout() {
    return http.post(apiLogout);
  }
}
