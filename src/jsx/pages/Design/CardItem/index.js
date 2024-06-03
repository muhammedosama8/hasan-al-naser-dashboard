import { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { Translate } from "../../../Enums/Tranlate";
import DeleteModal from "../../../common/DeleteModal";
import DesignService from "../../../../services/DesignService";
import AddModal from "../AddModal";

const CardItem = ({ item, index, setShouldUpdate }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const lang = useSelector((state) => state.auth?.lang);
  const designService = new DesignService();
  const Auth = useSelector(state=> state.auth?.auth)
  const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

  return (
    <tr key={index} className="text-center">
      <td>
        <strong>{item.id}</strong>
      </td>
      <td>
        <img src={item?.image} alt={item.id} width='60' />
      </td>
      <td>{item?.title}</td>
      <td>
        {isExist('design') && <Dropdown>
            <Dropdown.Toggle
              className="light sharp i-false"
            >
              <i className="la la-ellipsis-v" style={{ fontSize: "27px" }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setEditModal(true)}>
                {Translate[lang].edit}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setDeleteModal(true)}>
                {Translate[lang].delete}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}
      </td>
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          titleMsg={item.title}
          deletedItem={item}
          modelService={designService}
          onCloseModal={setDeleteModal}
          setShouldUpdate={setShouldUpdate}
        />
      )}
      {editModal && <AddModal modal={editModal} item={item} setShouldUpdate={setShouldUpdate} setModal={()=>setEditModal(false)} />}
    </tr>
  );
};
export default CardItem;
