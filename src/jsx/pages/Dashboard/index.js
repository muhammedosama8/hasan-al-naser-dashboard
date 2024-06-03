import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import AdminService from "../../../services/AdminService";
import "./style.scss";
import { Translate } from "../../Enums/Tranlate";

const Home = () => {
  const [formData, setFormData] = useState({
    totalUsers: "",
    totalAdmins: "",
    totalCategories: "",
    totalSubCategories: "",
    totalBrands: "",
    totalOrders: "",
    ordersOnTheWay: "",
    ordersCanceled: "",
    ordersDelivered: "",
    totalSales: "",
    salesDaily: "",
  });
  const [loading, setLoading] = useState(false);
  const adminService = new AdminService();
  const lang = useSelector((state) => state.auth.lang);

  useEffect(() => {
    setLoading(true);
    adminService.getDashboard().then((res) => {
      if (res && res?.status === 200) {
        setFormData(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Row>
        {Object.entries(formData)?.map((data) => {
          return (
            <Col className="col-md-3 col-sm-4">
              <Card style={{ height: "128.75px" }}>
                <Card.Body>
                  <div class="skeleton-loader">
                    <div class="loader-header"></div>
                    <div class="loader-content"></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  }

  return (
    <div className="row dashboard">
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-4">
        <div className="card">
          <div className="card-body">
            <p className="mb-1">Successful Tanker</p>
            <p className="fs-32 mb-0 text-black font-w700">
              {formData.totalUsers}
            </p>
          </div>
        </div>
      </div>
      {/* <div className="col-md-3 col-sm-4">
            <div className="card">
              <div className="card-body">
                <i className='la la-truck' style={{fontSize: '2rem'}}></i>
                <div>
                  <span className="fs-32 text-black font-w600">
                    {formData.totalOrders}
                  </span>
                  <p className="fs-14 mb-1">{Translate[lang]?.total_orders}</p>
                </div>
              </div>
            </div>
          </div> */}
      {/* <div className="col-md-3 col-sm-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.orders} (<span className="text-primary">{Translate[lang]?.on_the_way}</span>)</p>
                    <span className="fs-32 text-black font-w600">
                    {formData.ordersOnTheWay}
                    </span>
                  </div>
                  <i className='la la-truck text-primary' style={{fontSize: '2rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.orders} (<span className="text-danger">{Translate[lang]?.canceled}</span>)</p>
                    <span className="fs-32 text-black font-w600">
                    {formData.ordersCanceled}
                    </span>
                  </div>
                  <i className='la la-times text-danger' style={{fontSize: '2rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.orders} (<span className="text-success">{Translate[lang]?.delivered}</span>)</p>
                    <span className="fs-32 text-black font-w600">
                    {formData.ordersDelivered}
                    </span>
                  </div>
                  
                  <i className='la la-check-circle text-success' style={{fontSize: '2rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_sales} </p>
                    <span className="fs-32 text-black font-w600">
                    {formData.totalSales}
                    </span>
                  </div>
                  <i className='la la-dollar' style={{fontSize: '2rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.sales} ({Translate[lang]?.daily})</p>
                    <span className="fs-32 text-black font-w600">
                    {formData.salesDaily}
                    </span>
                  </div>
                  <i className='la la-dollar' style={{fontSize: '2rem'}}></i>
                </div>
              </div>
            </div>
          </div> */}
    </div>
  );
};

export default Home;
