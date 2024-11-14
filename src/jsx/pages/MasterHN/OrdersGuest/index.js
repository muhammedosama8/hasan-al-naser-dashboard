import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardItem from "./CardItem";
import OrdersStatus from "./OrdersStatus";
import { Translate } from "../../../Enums/Tranlate";
import Loader from "../../../common/Loader";
import NoData from "../../../common/NoData";
import Pagination from "../../../common/Pagination/Pagination";
import OrdersService from "../../../../services/OrdersGuestService";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";
import logo from '../../../../images/master.png'

const OrdersGuest = () => {
  const [dateSearch, setDatesearch] = useState({
    from: moment(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`),
    to: moment(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`),
  });
  const [param, setParam] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [item, setItem] = useState({});
  const [modal, setModal] = useState(false);
  const [hasData, setHasData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const navigate = useNavigate();
  const ordersService = new OrdersService();
  // const controlService = new ControlService();
  const Auth = useSelector((state) => state.auth?.auth);
  const lang = useSelector((state) => state.auth?.lang);
  const isExist = (data) => Auth?.admin?.admin_roles?.includes(data);

  const printOrders = () => {
    const printWindow = window.open("", "_blank");
    let pages = ``;

    for( let i = 0 ; i < selectedOrders?.length; i++){
      let productsCode = ``
      let subCart = selectedOrders[i]?.sub_carts
      for (let a = 0; a < subCart?.length; a++) {
        let itemsText = ``;
        for(let x=0; x< subCart[a]?.product?.variant?.length; x++){
          if(subCart[a]?.product?.variant[x].variant?.name_en === 'color'){
            itemsText += `<p style="margin-bottom: 0.5rem">
            ${lang === 'en' ? subCart[a]?.product?.variant[x].variant?.name_en : subCart[a]?.product?.variant[x].variant?.name_ar}: <span style="
                background: ${subCart[a]?.product?.variant[x].variant_value?.value_en};
                height: 24px;
                width: 24px;
                display: inline-block;
                margin: 0 4px;
            "></span>
            </p>`
        } else{
            itemsText += `<p style="margin-bottom: 0.5rem">
            ${lang === 'en' ? subCart[a]?.product?.variant[x].variant?.name_en : subCart[a]?.product?.variant[x].variant?.name_ar}: ${lang === 'en' ? subCart[a]?.product?.variant[x].variant_value?.value_en : subCart[a]?.product?.variant[x].variant_value?.value_ar}
            </p>`
        }
        }
        productsCode += `<div style="text-align: center; margin-top: 1rem">
          <div style="display: flex; justify-content: space-between; border: 1px solid #dedede; padding: 15px 25px; height: 100%">
              <div>
                  <img src=${subCart[a]?.product?.product_images?.length ? subCart[a]?.product?.product_images[0]?.url : ''} alt="product" style="width: 8rem" />
              </div>
              <div className="details">
                  <p style="margin-bottom: 0.5rem">${lang === 'en' ? subCart[a]?.product?.name_en : subCart[a]?.product?.name_ar}</p>
                  <p style="margin-bottom: 0.5rem">${Translate[lang].quantity}: ${subCart[a]?.amount}</p>
                  <p style="margin-bottom: 0.5rem">${Translate[lang].price}: ${subCart[a]?.price?.toFixed(3)} ${Translate[lang].kwd}</p>
                  ${subCart[a]?.dynamic_variant_carts?.map(res=>{
                    return `<p>
                        ${lang === 'en' ? res.dynamic_variant?.name_en : res.dynamic_variant?.name_ar}: ${res?.amount}*${res?.dynamic_variant?.price?.toFixed(3)}
                        ${Translate[lang].kwd}
                    </p>`
                })}
                  ${itemsText}
              </div>
          </div>
          </div>`
        
      }
      
      pages += `<div style="min-height: 100vh; margin-bottom: 1rem">
      <div>
          <div style="background-color: rgb(222 222 222 / 21%); border: 1px solid #c3c1c1; border-radius: 12px; padding: 8px 1rem; text-align: center">
              <img src=${logo} alt="logo" style="width: 60px ;height: 60px" />
          </div>
          <div style="margin-top: 1rem; text-align: center">
              <p style="margin-bottom: 0.5rem">${Translate[lang].welcome} ${selectedOrders[i]?.guest_name}</p>
              <h3 style="margin: 0">${Translate[lang].application_submitted}</h3>
          </div>
          <div style="margin-top: 1rem">
              <div style="text-align: center">
                  <p style="margin-bottom: 0.5rem">${Translate[lang].details} ${Translate[lang].product}</p>
              </div>
              <div style="display: grid; grid-template-columns: auto auto; gap: 8px; padding-left: 1rem ; padding-right: 1rem">
                  ${productsCode}
              </div>
  
              <div style="margin-top: 1rem; display: flex; justify-content: space-between ;background-color: rgb(222 222 222 / 21%); border: 1px solid #c3c1c1; border-radius: 12px; padding: 13px; padding-left: 1rem ; padding-right: 1rem">
                  <p style="margin: 0">${Translate[lang].order_id}: ${selectedOrders[i]?.id}</p>
                  <p style="margin: 0">${Translate[lang].day}: ${selectedOrders[i]?.createdAt?.split('T')[0]}</p>
              </div>
  
              <div style="padding-top: 1rem; display: flex">
                  <div style="width: 33.333333%; padding-left: 1rem ; padding-right: 1rem">
                          <div style="background-color: #dedede; padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem ; padding-right: 1rem">
                              <h4 style="margin: 0">${Translate[lang].details} ${Translate[lang].address}</h4>
                          </div>
                          <div style="background-color: rgb(222 222 222 / 21%); padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem ; padding-right: 1rem">
                              <p style="margin-bottom: 0.5rem">${Translate[lang].governorate}: ${!!selectedOrders[i]?.user_addresses?.length && lang==='en' ? selectedOrders[i]?.user_addresses[0]?.governorate?.name_en : selectedOrders[i]?.user_addresses?.governorate?.name_ar}</p>
                              <p style="margin-bottom: 0.5rem">${Translate[lang].area}: ${lang==='en' ? selectedOrders[i]?.user_addresses[0]?.area?.name_en : selectedOrders[i]?.user_addresses?.area?.name_ar}</p>
                              <p style="margin-bottom: 0.5rem">${Translate[lang].street}: ${!!selectedOrders[i]?.user_addresses?.length ? selectedOrders[i]?.user_addresses[0]?.street : ''}</p>
                              <p style="margin-bottom: 0.5rem">${Translate[lang].house_number}: ${!!selectedOrders[i]?.user_addresses?.length ? selectedOrders[i]?.user_addresses[0]?.houseNumber : ''}</p>
                              <p style="margin-bottom: 0.5rem">${Translate[lang].block}: ${!!selectedOrders[i]?.user_addresses?.length ? selectedOrders[i]?.user_addresses[0]?.block : ''}</p>
                              <p style="margin-bottom: 0.5rem">${Translate[lang].address_name}: ${!!selectedOrders[i]?.user_addresses?.length ? selectedOrders[i]?.user_addresses[0]?.addressName : ''}</p>
                          </div>
                  </div>
                  <div style="width: 66.666666%; padding-left: 1rem ; padding-right: 1rem">
                          <div style="background-color: #dedede; padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem ; padding-right: 1rem">
                              <h4 style="margin: 0">${Translate[lang].details} ${Translate[lang].order}</h4>
                          </div>
                          <div style="background-color: rgb(222 222 222 / 21%); padding-top: 1rem; padding-bottom: 1rem; padding-left: 1rem ; padding-right: 1rem ">
                            <p style="margin-bottom: 0.5rem">${Translate[lang].name}: ${selectedOrders[i]?.guest_name}</p>
                            <p style="margin-bottom: 0.5rem">${Translate[lang].phone}: ${selectedOrders[i]?.guest_phone}</p>
                            <p style="margin-bottom: 0.5rem">${Translate[lang].sub_total}: ${(selectedOrders[i]?.total-selectedOrders[i]?.shipping_fee)?.toFixed(3)} ${Translate[lang].kwd}</p>
                            <p style="margin-bottom: 0.5rem">${Translate[lang].delivery_fees}: ${selectedOrders[i]?.shipping_fee?.toFixed(3)} ${Translate[lang].kwd}</p>
                            <p style="margin-bottom: 0.5rem">${Translate[lang].total_price}: ${selectedOrders[i]?.total?.toFixed(3)} ${Translate[lang].kwd}</p>
                          </div>
                  </div>
              </div>
              <div style="text-align: center;margin-top: 1rem">
                  <p style="margin: 0; font-size: 14px">Thanks Master HN</p>
                  <p style="margin: 0; font-size: 14px">Powered by Cloud Lift Solutions</p>
              </div>
          </div>
      </div>
      </div>`
    }

    let htmlCode = `<html>
    <head>
        <title>${Translate[lang]?.invoice}</title>
        <style>
          *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        </style>
    </head>
    <body style="direction: ${lang==='en' ? 'ltr' : 'rtl'};">
    ${pages}
    </body>
    </html>
    `;
    printWindow.document.write(htmlCode);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 2500);
  };

  const handleDate= (dateString)=>  {
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = date.getFullYear();

    // Format the date as 'DD-M-YYYY'
    return `${month}/${day}/${year}`
  }

  const onApply = (event, picker) => {
    setDatesearch({
      from: moment(handleDate(picker.startDate?._d)),
      to: moment(handleDate(picker.endDate?._d)),
    });
    setParam({
      from: picker.startDate?._d,
      to: picker.endDate?._d,
    })
    setShouldUpdate(prev=> !prev)
  };

  const onCancel= ()=>  {
    setDatesearch({
      from: `0${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
      to: `0${new Date().getMonth() + 1}/${new Date().getDate() + 1}/${new Date().getFullYear()}`,
    });
    setParam({})
    setShouldUpdate(prev=> !prev)
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 ">
        <div className="input-group w-50">
          <input
            type="text"
            style={{
              borderRadius: "8px",
              color: "initial",
              padding: "18px 33px 18px 16px",
            }}
            className="form-control"
            placeholder={`${Translate[lang]?.search_by} ${Translate[lang]?.order_id}, ${Translate[lang]?.name}, ${Translate[lang]?.phone}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="flaticon-381-search-2"
            style={{
              position: "absolute",
              zIndex: "2",
              right: lang === "en" && "16px",
              left: lang === "ar" && "16px",
              top: "50%",
              transform: "translate(0, -50%)",
            }}
          ></div>
        </div>
        <div className="d-flex w-50 justify-content-end">
        {isExist("order") && (
            <Button
              variant="outline-primary"
              className={`mx-2 h-75 `}
              style={{
                textWrap: 'nowrap',
                cursor: !selectedOrders?.length ? 'not-allowed' : 'pointer'
              }}
              disabled={!selectedOrders?.length}
              onClick={printOrders}
            >
              {Translate[lang].print} <i className="la la-print" />
            </Button>
          )}
          <DateRangePicker
            onApply={onApply} 
            onCancel={onCancel}
            initialSettings={{ startDate: '08/19/2024', endDate: dateSearch?.to }}
          >
            <input type="text" style={{width: '15rem'}} className="form-control" />
          </DateRangePicker>
        </div>
      </div>

      <Card>
        <Card.Body className={`${hasData === 0 ? "text-center" : ""}`}>
          {loading && (
            <div style={{ height: "300px" }}>
              <Loader />
            </div>
          )}
          {(hasData === 1 && !loading) && (
            <Table responsive>
              <thead>
                <tr className="text-center">
                  <th>
                    <strong>{Translate[lang]?.order_id}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.customer_name}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.email}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.phone}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.address}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.total_price}</strong>
                  </th>
                  {/* <th>
                    <strong>{Translate[lang]?.delivery_day}</strong>
                  </th> */}
                  <th>
                    <strong>{Translate[lang]?.payment_method}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.reference_id}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.invoice_id}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.post_date}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.createdAt}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.status}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.details}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.invoice}</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((item, index) => {
                  return (
                    <CardItem
                      key={index}
                      index={index}
                      item={item}
                      setItem={setItem}
                      setModal={setModal}
                      selectedOrders={selectedOrders}
                      setSelectedOrders={setSelectedOrders}
                    />
                  );
                })}
              </tbody>
            </Table>
          )}
          {(hasData === 0 && !loading)&& <NoData />}
          <Pagination
            setData={setOrders}
            service={ordersService}
            shouldUpdate={shouldUpdate}
            setHasData={setHasData}
            setLoading={setLoading}
            search={search}
            param={param}
          /> 
        </Card.Body>
      </Card>
      {modal && (
        <OrdersStatus
          modal={modal}
          setModal={setModal}
          item={item}
          setShouldUpdate={setShouldUpdate}
        />
      )}
    </>
  );
};
export default OrdersGuest;
