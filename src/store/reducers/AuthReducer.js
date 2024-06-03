import {
  LOADING_TOGGLE_ACTION,
  LOGIN_CONFIRMED_ACTION,
  LOGIN_FAILED_ACTION,
  LOGOUT_ACTION,
  LOGIN,
  CHANGE_RULES,
  SET_LOGO,
  SET_LANG,
  CHANGE_PROFILE,
  CHANGE_PROFILE_DATA,
} from "../actions/AuthActions";

const initialState = {
  lang: localStorage.getItem("adminLang") || "ar",
  email: "",
  password: "",
  auth: {
    email: "",
    idToken: "",
    localId: "",
    expiresIn: "",
    refreshToken: "",
    admin: "",
  },
  errorMessage: "",
  successMessage: "",
  showLoading: false,
  logo: "",
};

export function AuthReducer(state = initialState, action) {
  if (action.type === LOGIN) {
    return {
      ...state,
      email: action.payload.email,
      password: action.payload.password,
    };
  }
  if (action.type === LOGIN_CONFIRMED_ACTION) {
    return {
      ...state,
      auth: {
        ...action.payload,
        admin: {
          ...action.payload.admin,
          admin_roles: action.payload.admin?.admin_roles?.map(
            (rul) => rul["role"]
          ),
        },
      },
      errorMessage: "",
      successMessage: "Login Successfully Completed",
      showLoading: false,
    };
  }
  if (action.type === CHANGE_PROFILE) {
    return {
      ...state,
      auth: {
        ...state.auth,
        admin: {
          ...state.auth.admin,
          avatar: action.payload,
        },
      },
    };
  }
  if (action.type === CHANGE_PROFILE_DATA) {
    return {
      ...state,
      auth: {
        ...state.auth,
        admin: {
          ...state.auth.admin,
          ...action.payload,
        },
      },
    };
  }

  if (action.type === LOGOUT_ACTION) {
    return {
      ...state,
      errorMessage: "",
      successMessage: "",
      auth: {
        email: "",
        idToken: "",
        localId: "",
        expiresIn: "",
        refreshToken: "",
      },
    };
  }

  if (action.type === LOGIN_FAILED_ACTION) {
    return {
      ...state,
      errorMessage: action.payload,
      successMessage: "",
      showLoading: false,
    };
  }

  if (action.type === LOADING_TOGGLE_ACTION) {
    return {
      ...state,
      showLoading: action.payload,
    };
  }

  if (action.type === CHANGE_RULES) {
    return {
      ...state,
      auth: {
        ...state.auth,
        admin: {
          ...state.auth.admin,
          admin_roles: action.payload,
        },
      },
    };
  }
  if (action.type === SET_LOGO) {
    return {
      ...state,
      logo: action.payload,
    };
  }
  if (action.type === SET_LANG) {
    return {
      ...state,
      lang: action.payload,
    };
  }
  return state;
}
