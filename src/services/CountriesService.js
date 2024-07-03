import BaseService from "./BaseService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/country/governorate";

export default class CountryiesService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

}
