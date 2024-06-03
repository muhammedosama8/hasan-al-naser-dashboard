import React from "react";

import { Link, useNavigate } from "react-router-dom";
/// Image
import { Dropdown } from "react-bootstrap";
import Logout from "../../pages/Authintication/Logout";
import { useDispatch, useSelector } from "react-redux";
import { setLang } from "../../../store/actions/AuthActions";
import { Translate } from "../../Enums/Tranlate";
import usa from "../../../images/usa.svg";
import kwait from "../../../images/kwait.svg";

const Header = ({ onNote }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector((state) => state.auth.lang);
  const admin = useSelector((state) => state.auth.auth.admin);
  var path = window.location.pathname.split("/");
  var name = path[path.length - 1].split("-");
  var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  var finalName = filterName;

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar d-flex"
                style={{ textTransform: "capitalize", alignItems: "center" }}
              >
                {finalName[0] === ""
                  ? Translate[lang].dashboard
                  : Translate[lang][finalName.join("_")]}
              </div>
            </div>
            <ul className="navbar-nav header-right p-0">
              <Dropdown
                as="li"
                className="nav-item dropdown notification_dropdown "
              >
                <Dropdown.Toggle
                  variant=""
                  className="nav-link ai-icon"
                  href="#"
                  role="button"
                  style={{
                    background: "#F3F6F9",
                  }}
                  data-toggle="dropdown"
                >
                  {/* <img
                    src={lang === "en" ? usa : kwait}
                    width={21}
                    alt="language"
                  />{" "} */}
                  <span style={{ fontSize: "15px", fontWeight: "500" }}>
                    {lang === "en" ? "Eng (US)" : "اللغه العربيه"}
                  </span>{" "}
                  <i
                    className="la la-angle-down"
                    style={{ fontSize: "12px" }}
                  ></i>
                </Dropdown.Toggle>

                <Dropdown.Menu align="right" className="mt-2 custom-dropdown">
                  <ul className="timeline text-center">
                    <li
                      className="py-2"
                      style={{
                        backgroundColor:
                          lang === "en" ? "var(--bg-primary)" : "#fff",
                        color: lang === "en" ? "#fff" : "var(--bg-primary)",
                        cursor: "pointer",
                      }}
                      onClick={() => dispatch(setLang("en"))}
                    >
                      English
                    </li>
                    <li
                      className="py-2"
                      style={{
                        backgroundColor:
                          lang === "ar" ? "var(--bg-primary)" : "#fff",
                        color: lang === "ar" ? "#fff" : "var(--bg-primary)",
                        cursor: "pointer",
                      }}
                      onClick={() => dispatch(setLang("ar"))}
                    >
                      اللغه العربيه
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown as="li" className="nav-item dropdown header-profile">
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link i-false"
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    padding: "5px 13px",
                    borderRadius: ".5rem",
                    textTransform: "capitalize",
                    cursor: "pointer",
                  }}
                >
                  {/* <i className="la la-user" style={{fontSize: '32px', color: 'var(--primary)'}}></i> */}
                  <span>{admin?.f_name?.charAt(0)}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu align="right" className="mt-2 custom-dropdown">
                  <Link to="/profile" className="dropdown-item ai-icon">
                    <svg
                      id="icon-user1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx={12} cy={7} r={4} />
                    </svg>
                    <span className={lang === "en" ? "ml-2" : "mr-2"}>
                      {Translate[lang]?.profile}{" "}
                    </span>
                  </Link>
                  <Logout />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
