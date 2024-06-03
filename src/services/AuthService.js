import axios from "axios";
import swal from "sweetalert";
import { API_BASE_URL_ENV } from "../jsx/common/common";
import {
  changeAdminRules,
  loginConfirmedAction,
  Logout,
  setLang,
} from "../store/actions/AuthActions";

const tokenKey = "token";

export function login(email, password) {
  const postData = { email, password };
  return axios.post(`${API_BASE_URL_ENV()}/admin/login`, postData);
}

export function formatError(errorResponse) {
  switch (errorResponse?.message) {
    case "EMAIL_EXISTS":
      //return 'Email already exists';
      swal("Oops", "Email already exists", "error");
      break;
    case "User not Exist.":
      swal("Oops", "Email not found", "error", { button: "Try Again!" });
      break;
    case "Incorrect Password.":
      //return 'Invalid Password';
      swal("Oops", "Incorrect Password", "error", { button: "Try Again!" });
      break;
    case "كلمة سر خاطئة":
      //return 'Invalid Password';
      swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
      break;
    case "USER_DISABLED":
      return "User Disabled";
    default:
      return "";
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function saveTokenInLocalStorage(tokenDetails) {
  localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
  localStorage.setItem(tokenKey, tokenDetails.accessToken);
  localStorage.setItem(
    "HasanAlNaserAdminRules",
    JSON.stringify(tokenDetails.admin.admin_roles?.map((item) => item.role))
  );
}

export function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = localStorage.getItem("userDetails");
  const adminRules = localStorage.getItem("HasanAlNaserAdminRules");
  const adminLang = localStorage.getItem("adminLang");
  let tokenDetails = "";

  if (!tokenDetailsString) {
    dispatch(Logout(navigate));
    return;
  }

  tokenDetails = JSON.parse(tokenDetailsString);
  let rules = JSON.parse(adminRules);
  dispatch(loginConfirmedAction(tokenDetails));
  dispatch(changeAdminRules(rules));

  if (adminLang === "en") {
    dispatch(setLang("en"));
  } else {
    dispatch(setLang("ar"));
  }
}
