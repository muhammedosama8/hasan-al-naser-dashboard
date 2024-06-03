import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminService from "../../../services/AdminService";
import Loader from "../../common/Loader";
import NoData from "../../common/NoData";
import Pagination from "../../common/Pagination/Pagination";
import { Translate } from "../../Enums/Tranlate";
import CardItem from "./CardItem";
import "./style.scss";

const Admins = () => {
  const [admins, setAdmins] = useState(null);
  const [hasData, setHasData] = useState(null);
  const [search, setSearch] = useState(null);
  const [tab, setTab] = useState("admins");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const adminService = new AdminService();
  const Auth = useSelector((state) => state.auth?.auth);
  const isExist = (data) => Auth?.admin?.admin_roles?.includes(data);
  const lang = useSelector((state) => state.auth?.lang);

  return (
    <div className="admin">
      {/* <div className="tabs-div">
        <span
          style={{
            color: tab === "admins" ? "var(--primary)" : "#7E7E7E",
            borderBottom: tab === "admins" ? "2px solid" : "none",
          }}
          onClick={() => setTab("admins")}
        >
          All Employees
        </span>
        <span
          style={{
            padding: "5px 16px",
            color: tab === "rule" ? "var(--primary)" : "#7E7E7E",
            borderBottom: tab === "rule" ? "2px solid" : "none",
          }}
          onClick={() => setTab("rule")}
          className="mx-2"
        >
          Rules
        </span>
      </div> */}
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between p-3 align-items-center">
          <div className="input-group w-50">
            <input
              type="text"
              style={{
                borderRadius: "8px",
                color: "initial",
                padding: "18px 16px",
              }}
              className="form-control"
              placeholder={`${Translate[lang]?.search_by} I.D, ${Translate[lang]?.name}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              className="flaticon-381-search-2"
              style={{
                position: "absolute",
                zIndex: "1",
                right: lang === "en" && "16px",
                left: lang === "ar" && "16px",
                top: "50%",
                transform: "translate(0, -50%)",
              }}
            ></div>
          </div>
          <div>
            {/* {isExist("admin") && (
              <Button
                variant="light"
                style={{ fontWeight: "400" }}
                className="mx-2 h-75 radius-30 "
                onClick={() => navigate("/admins/add-admins")}
              >
                <i
                  class={`la ${
                    lang === "en" ? "mr-2" : "ml-2"
                  } la-cloud-download-alt`}
                ></i>
                {Translate[lang]?.export}
              </Button>
            )} */}
            {isExist("admin") && (
              <Button
                variant="primary"
                style={{ fontWeight: "400" }}
                className="me-2 h-75 radius-30 "
                onClick={() => navigate("/admins/add-admins")}
              >
                <i
                  className={`la la-plus ${
                    lang === "en" ? "mr-2" : "ml-2"
                  } plus-icon`}
                ></i>
                {Translate[lang]?.add_admin}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className={`${hasData === 0 ? "text-center" : ""}`}>
          {loading && (
            <div style={{ height: "300px" }}>
              <Loader />
            </div>
          )}
          {hasData === 1 && !loading && (
            <Table responsive>
              <thead>
                <tr>
                  <th className="px-2">
                    <strong>I.D</strong>
                  </th>
                  <th className="px-2">
                    <strong>{Translate[lang]?.name}</strong>
                  </th>
                  <th className="px-2">
                    <strong>{Translate[lang]?.email}</strong>
                  </th>
                  <th className="px-2">
                    <strong>{Translate[lang]?.phone}</strong>
                  </th>
                  <th className="px-2">
                    <strong>{Translate[lang]?.permissions}</strong>
                  </th>
                  <th className="px-2">
                    <strong>{Translate[lang]?.status}</strong>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {admins?.length > 0 &&
                  admins?.map((item, index) => {
                    return (
                      <CardItem
                        key={index}
                        index={index}
                        item={item}
                        setShouldUpdate={setShouldUpdate}
                      />
                    );
                  })}
              </tbody>
            </Table>
          )}
          {hasData === 0 && <NoData />}
          <Pagination
            setData={setAdmins}
            service={adminService}
            shouldUpdate={shouldUpdate}
            setHasData={setHasData}
            setLoading={setLoading}
            search={search}
          />
        </Card.Body>
      </Card>
    </div>
  );
};
export default Admins;
