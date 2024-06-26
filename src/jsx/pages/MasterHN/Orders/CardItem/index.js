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
    if (!isExist("home")) {
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
          onClick={(e)=> {
            if(e.target.checked){
              setSelectedOrders([...selectedOrders, item])
            } else {
              let filter = selectedOrders?.filter(res=> res.id !== item.id)
              setSelectedOrders(filter)
            }
          }}
        />
        <strong>{item.id}</strong>
      </td>
      <td>
        {item.user.f_name || "-"} {item.user.l_name}
      </td>
      <td>{item.user.email || "-"}</td>
      <td>
        {item.user.country_code}
        {item.user.phone}
      </td>
      <td className="text-center">
        {item?.user_address ? <button 
          onClick={()=> setDetailsModal(true)}
          className="btn btn-link text-black"
        >{Translate[lang].address}</button> : "-"}
      </td>
      <td>{item.total}</td>
      <td>{item?.day?.split("T")[0] || "-"}</td>
      <td>
        {item.interval_hour?.from?.split(":")[0] || "-"}:
        {item.interval_hour?.from?.split(":")[1] || "-"}
      </td>
      <td>
        {item.interval_hour?.to?.split(":")[0] || "-"}:
        {item.interval_hour?.to?.split(":")[1] || "-"}
      </td>
      <td className="text-capitalize">
        {item.payments[0]?.payment_type === "knet"
          ? Translate[lang][item.payments[0]?.payment_type]
          : Translate[lang][item.payment_method]}
      </td>
      <td>{item?.payments[0]?.Ref || "-"}</td>
      <td>{item?.payments[0]?.invoice_id || "-"}</td>
      <td>{item?.payments[0]?.PostDate || "-"}</td>
      <td>{item?.payments[0]?.createdAt?.split("T")[0] || "-"}</td>
      <td>
        <Badge
          className="text-capitalize"
          style={{ cursor: "pointer" }}
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
          onClick={()=> navigate('/orders/invoice', {state: item})}
        ></i>
        {isExist("home") && (
          <Dropdown>
            <Dropdown.Toggle
              // variant="success"
              className="light sharp i-false"
            >
              <i className="la la-ellipsis-v" style={{ fontSize: "27px" }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item>Edit</Dropdown.Item> */}
              <Dropdown.Item onClick={() => setDeleteModal(true)}>
                {Translate[lang].delete}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </td>
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          titleMsg={item.customer_name}
          deletedItem={item.id}
          onCloseModal={setDeleteModal}
        />
      )}
      {detailsModal && <AddressModal modal={detailsModal} setModal={setDetailsModal} item={item?.user_address} />}
    </tr>
  );
};
export default CardItem;
