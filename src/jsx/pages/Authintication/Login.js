import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AvField, AvForm } from "availity-reactstrap-validation";
import {
  loadingToggleAction,
  loginAction,
} from "../../../store/actions/AuthActions";
import { Translate } from "../../Enums/Tranlate";
import login from "../../../images/logo-bg1.png";

function Login(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const Auth = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.auth.lang);

  function onLogin(e) {
    e.preventDefault();
    dispatch(loadingToggleAction(true));
    dispatch(loginAction(email, password, navigate));
  }

  return (
    <div className={`login-wrapper ${lang}`}>
      <div className="login-aside-right d-flex flex-column justify-content-center">
        <div className="row justify-content-center align-items-center">
          <div className="col-xl-6 col-xxl-8 col-md-12">
            <div className="authincation-content auth-form">
                    <div className=" mb-4">
                      <h5>{Translate[lang].sign_in}</h5>
                    </div>
                    {props.errorMessage && (
                      <div className="text-danger">{props.errorMessage}</div>
                    )}
                    {props.successMessage && (
                      <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                        {props.successMessage}
                      </div>
                    )}
                    <AvForm onValidSubmit={onLogin} className="login-form">
                      <Row>
                        <Col
                          md={12}
                          className="form-group mb-2 d-flex justify-content-between"
                        >
                          <label
                            style={{ fontSize: "14px", marginTop: "14px" }}
                          >
                            {Translate[lang].email}
                          </label>
                          <AvField
                            name="email"
                            type="email"
                            value={email}
                            errorMessage="Please Enter a Valid Value"
                            className="radius-30 h-56"
                            validate={{
                              required: {
                                value: true,
                                errorMessage: Translate[lang].field_required,
                              },
                            }}
                            placeholder={Translate[lang].email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Col>
                        <Col
                          md={12}
                          className="form-group position-relative d-flex justify-content-between"
                        >
                          <label
                            style={{ fontSize: "14px", marginTop: "14px" }}
                          >
                            {Translate[lang].password}
                          </label>
                          <AvField
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            className="radius-30 h-56"
                            errorMessage="Please enter a valid password"
                            validate={{
                              required: {
                                value: true,
                                errorMessage: Translate[lang].field_required,
                              },
                            }}
                            placeholder={Translate[lang].password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {showPassword ? (
                            <i
                              className="la la-eye-slash position-absolute"
                              style={{
                                top: "24px",
                                right: lang === "en" ? "8%" : "auto",
                                left: lang === "ar" ? "8%" : "auto",
                              }}
                              onClick={() => setShowPassword(false)}
                            ></i>
                          ) : (
                            <i
                              className="la la-eye position-absolute"
                              style={{
                                top: "24px",
                                right: lang === "en" ? "8%" : "auto",
                                left: lang === "ar" ? "8%" : "auto",
                              }}
                              onClick={() => setShowPassword(true)}
                            ></i>
                          )}
                        </Col>
                      </Row>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-4 radius-30 h-56"
                          disabled={Auth?.showLoading}
                        >
                          {Translate[lang].login}
                        </button>
                      </div>
                    </AvForm>
                    <div className="text-center mb-2">
          {/* <label
            className="poweredBy d-block"
            style={{ textWrap: "nowrap", fontSize: "12px" }}
          >
            Powered by{" "}
            <a
              href="https://www.leapsolutionskw.com/"
              target="_blank"
              rel="noreferrer"
            >
              leap solutions kw{" "}
            </a>
          </label> */}
          {/* <p style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.87)" }}>
            <a
              href="https://www.leapsolutionskw.com/"
              target="_blank"
              rel="noreferrer"
            >
              Terms and conditions
            </a>
            <div className="dot"></div>
            <a
              href="https://www.leapsolutionskw.com/"
              target="_blank"
              rel="noreferrer"
            >
              Privacy policy
            </a>
          </p> */}
        </div>
            </div>
          </div>
        </div>
      </div>
      <div className="login-aside-left position-relative">
        <div
          className="w-75 position-absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <img src={login} alt="logo" className="w-100" />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  };
};
export default connect(mapStateToProps)(Login);
