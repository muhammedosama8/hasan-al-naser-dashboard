import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
// import AdminService from "../../../services/AdminService";
import './style.scss'
import kuwaiCoin from '../../../../images/kuwai-coin.png'
import { Translate } from "../../../Enums/Tranlate";

const Home = () => {
  const [formData ,setFormData] = useState({
    totalUsers: '',
    totalAdmins: '',
    totalCategories: '',
    totalSubCategories: '',
    totalBrands: '',
    totalOrders: '',
    ordersOnTheWay: '',
    ordersCanceled: '',
    ordersDelivered: '',
    totalSales: '',
    salesDaily: ''
  })
  const [loading, setLoading] = useState(false)
  // const adminService = new AdminService()
  const lang = useSelector(state=> state.auth.lang)

  // useEffect(()=>{
  //   setLoading(true)
  //   adminService.getDashboard().then(res=>{
  //     if(res && res?.status===200){
  //       setFormData(res.data.data)
  //     }
  //     setLoading(false)
  //   })
  // },[])

  if(loading) {
    return <Row>
      {Object.entries(formData)?.map(data=>{
        return <Col className="col-md-4 col-sm-6">
          <Card style={{height: '130px'}}>
            <Card.Body>
              <div class="skeleton-loader">
                  <div class="loader-header"></div>
                  <div class="loader-content"></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      })}
    </Row>
  }

  return (
        <div className="row dashboard">
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_users}</p>
                    <span className="fs-35 text-black font-w600">
                      {formData.totalUsers}
                    </span>
                  </div>
                  <i className='la la-users' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_categories}</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.totalCategories}
                    </span>
                  </div>
                  <i className='la la-cubes' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_sub_categories}</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.totalSubCategories}
                    </span>
                  </div>
                  <i className='la la-cube' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_brands}</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.totalBrands}
                    </span>
                  </div>
                  <i className='la la-file-text' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_admins}</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.totalAdmins}
                    </span>
                  </div>
                  <i className='la la-user-shield' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_orders}</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.totalOrders}
                    </span>
                  </div>
                  <i className='la la-truck' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.orders} (<span className="text-primary">{Translate[lang]?.on_the_way}</span>)</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.ordersOnTheWay}
                    </span>
                  </div>
                  <i className='la la-truck text-primary' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.orders} (<span className="text-danger">{Translate[lang]?.canceled}</span>)</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.ordersCanceled}
                    </span>
                  </div>
                  <i className='la la-times text-danger' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.orders} (<span className="text-success">{Translate[lang]?.delivered}</span>)</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.ordersDelivered}
                    </span>
                  </div>
                  
                  <i className='la la-check-circle text-success' style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.total_sales} ({Translate[lang]?.delivered})</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.totalSales}
                    </span>
                  </div>
                  <img src={kuwaiCoin} alt='kuwaiCoin' width='48' />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ textAlign: lang=== 'ar' ? 'right' : 'left'}}>
                    <p className="fs-14 mb-1">{Translate[lang]?.sales} ({Translate[lang]?.ordered})</p>
                    <span className="fs-35 text-black font-w600">
                    {formData.salesDaily}
                    </span>
                  </div>
                  <img src={kuwaiCoin} alt='kuwaiCoin' width='48' />
                </div>
              </div>
            </div>
          </div>

        </div>
  );
};

export default Home;
