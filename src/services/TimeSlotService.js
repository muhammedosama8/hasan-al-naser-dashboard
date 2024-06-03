import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/timeSlot";
const apiIntervalHoursEndpoint = API_BASE_URL_ENV() + "/timeSlot/intervalHours";

export default class TimeSlotService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }
    getIntervalHours(params) {
        return http.get(apiIntervalHoursEndpoint,{params});
    }
}
