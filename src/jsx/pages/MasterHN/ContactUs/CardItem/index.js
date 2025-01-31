import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import MessageModal from "./MessageModal";
import { toast } from "react-toastify";
import MHContactusService from "../../../../../services/MHContactusService";
import { Translate } from "../../../../Enums/Tranlate";
import DeleteModal from "../../../../common/DeleteModal";

const CardItem = ({ item, index, setShouldUpdate }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [status, setStatus] = useState('');
  const [messageModal, setMessageModal] = useState(false);
  const lang = useSelector((state) => state.auth?.lang);
  const contactusService = new MHContactusService();

  useEffect(()=>{
    setStatus(item?.status)
  },[])

  const changeStatus = () => {
    if(status === 'open'){
      contactusService.update(item.id).then(res=>{
        if(res?.status === 200){
          toast.success('Closed Successfully.')
          // setStatus(status === 'open' ? 'closed' : 'open')
          setShouldUpdate(prev=> !prev)
        }
      })
    }
  }

  return (
    <tr key={index} className="text-center">
      <td>
        <strong>{item.id}</strong>
      </td>
      <td>
        {!!item.f_name ?
          <p className="mb-0"
            style={{ fontWeight: "500" }}
          >
            {item?.f_name} {item?.l_name}
          </p> :  "-" }
      </td>
      <td>{item?.email || "-"}</td>
      <td>
        {item?.phone || "-"}
      </td>
      <td>
        <span className="cursor-pointer" onClick={()=> setMessageModal(true)}>
          {item?.message?.slice(0, 25)} {!!item?.message?.slice(25)?.length ? '...' : ''}
        </span>
      </td>
      <td>
        <Form.Check
          type="switch"
          id={`status${index}`}
          checked={status === 'open'}
          onChange={changeStatus}
        />
      </td>
      <td>
        <Dropdown>
            <Dropdown.Toggle
              // variant="success"
              className="light sharp i-false"
            >
              <i className="la la-ellipsis-v" style={{ fontSize: "27px" }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setDeleteModal(true)}>
                {Translate[lang].delete}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      </td>
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          titleMsg={item.full_name}
          deletedItem={item}
          modelService={contactusService}
          onCloseModal={setDeleteModal}
          setShouldUpdate={setShouldUpdate}
        />
      )}
      {messageModal && (
        <MessageModal
          open={messageModal}
          message={item?.message}
          onCloseModal={setMessageModal}
        />
      )}
    </tr>
  );
};
export default CardItem;
