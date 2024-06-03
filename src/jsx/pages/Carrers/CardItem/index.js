import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { Translate } from "../../../Enums/Tranlate";
import DeleteModal from "../../../common/DeleteModal";
import CareersService from "../../../../services/CareersService";
import { toast } from "react-toastify";

const CardItem = ({ item, index, setShouldUpdate }) => {
  const [status, setStatus] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const lang = useSelector((state) => state.auth?.lang);
  const careersService = new CareersService();

  useEffect(()=>{
    setStatus(item?.status)
  },[])

  const changeStatus = () => {
    careersService.update(item.id).then(res=>{
      if(res?.status === 200){
        toast.success('Status Changed Successfully.')
        setStatus(status === 'open' ? 'closed' : 'open')
      }
    })
  }

  return (
    <tr key={index} className="text-center">
      <td>
        <strong>{item.id}</strong>
      </td>
      <td>
        {item?.full_name ? (
          <p
            className="mb-0 user"
            style={{
              fontWeight: !!item?.full_name && "800",
              opacity: ".75",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {item?.full_name}
          </p>
        ) : (
          "-"
        )}
      </td>
      <td>{item.email || "-"}</td>
      <td>
        {item?.phone || "-"}
      </td>
      <td>
        <a href={item?.cv} target='_blank' >
          CV
        </a>
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
          modelService={careersService}
          onCloseModal={setDeleteModal}
          setShouldUpdate={setShouldUpdate}
        />
      )}
    </tr>
  );
};
export default CardItem;
