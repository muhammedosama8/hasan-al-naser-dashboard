import { useEffect, useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../../../../common/DeleteModal";
import { Translate } from "../../../../Enums/Tranlate";
import AddressModal from "./AddressModal";

const CardItem = ({ item, index, setModal, setItem, selectedOrders, setSelectedOrders }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const Auth = useSelector((state) => state.auth?.auth);
  const lang = useSelector((state) => state.auth?.lang);
  const [detailsModal, setDetailsModal] = useState(false)
  const isExist = (data) => Auth?.admin?.admin_roles?.includes(data);
  const navigate = useNavigate()

  const changeStatusToggle = () => {
    if (!isExist("masterHN")) {
      return;
    }
    setModal(true);
    setItem(item);
  };

  return (
    <tr key={index} className="text-center">
      <td>
        <input 
          type='checkbox' 
          className="mx-3"
          name="e"
          onClick={(e)=> {
            if(e.target.checked){
              setSelectedOrders([...selectedOrders, item])
            } else {
              let filter = selectedOrders?.filter(res=> res.id !== item.id)
              setSelectedOrders(filter)
            }
          }}
          id={index}
        />
        <label for={index}>{item.id}</label>
      </td>
      <td>
        {item.user.username || "-"}
      </td>
      <td>{item.user.email || "-"}</td>
      <td>
        {item.user.phone}
      </td>
      <td className="text-center">
        {item?.user_address ? <button 
          onClick={()=> setDetailsModal(true)}
          style={{textDecoration: 'underline'}}
          className="btn btn-link text-black"
        >{Translate[lang].address}</button> : "-"}
      </td>
      <td>{item?.total.toFixed(3)}</td>
      {/* <td>{item?.day?.split("T")[0] || "-"}</td> */}
      <td className="text-capitalize">
        {item.payments[0]?.payment_type === "knet"
          ? Translate[lang][item.payments[0]?.payment_type]
          : Translate[lang][item.payment_method]}
      </td>
      <td>{item?.payments[0]?.Ref || "-"}</td>
      <td>{item?.payments[0]?.invoice_id || "-"}</td>
      <td>{item?.payments[0]?.PostDate || "-"}</td>
      <td style={{textWrap: 'nowrap'}}>{item?.payments[0]?.createdAt?.split("T")[0] || "-"}</td>
      <td>
        <Badge
          className="text-capitalize"
          style={{ cursor: "pointer", color: item.status === "ordered" ? '#fff': '#444' }}
          onClick={changeStatusToggle}
          variant={`${
            item.status === "delivered"
              ? "success"
              : item.status === "canceled"
              ? "danger"
              : item.status === "ordered"
              ? "primary"
              : item.status === "process"
              ? "warning"
              : item.status === "shipped"
              ? "info"
              : ""
          } light`}
        >
          {Translate[lang][item.status]}
        </Badge>
      </td>
      <td>
        <Link style={{ textDecoration: "underline" }} to='/orders/details' state={ item }>
          {Translate[lang].details}
        </Link>
      </td>
      <td className="d-flex align-items-center cursor-pointer">
        <i 
          className="la la-eye"
          style={{margin: '12px auto 0'}}
          onClick={()=> navigate('/orders/invoice', {state: item})}
        ></i>
      </td>
      {detailsModal && <AddressModal modal={detailsModal} setModal={setDetailsModal} item={item?.user_address} />}
    </tr>
  );
};
export default CardItem;
