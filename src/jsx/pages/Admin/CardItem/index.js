import { useEffect, useState } from "react";
import { Badge, Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../../common/DeleteModal";
import AdminService from "../../../../services/AdminService";
import { useSelector } from "react-redux";
import { Rules } from "../../../Enums/Rules";
import { toast } from "react-toastify";
import { Translate } from "../../../Enums/Tranlate";

const CardItem = ({ item, index, setShouldUpdate }) => {
  const [status, setStatus] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const adminService = new AdminService();
  const Auth = useSelector((state) => state.auth?.auth);
  const isExist = (data) => Auth?.admin?.admin_roles?.includes(data);
  const lang = useSelector((state) => state.auth?.lang);

  useEffect(() => {
    setStatus(!item.isBlocked);
  }, [item]);

  const changeStatusToggle = (e) => {
    let data = {
      isBlocked: status,
    };
    adminService.toggleStatus(item.id, data).then((res) => {
      if (res?.status === 200) {
        toast.success(Translate[lang].updated_status_successfully);
        setStatus(!status);
      }
    });
  };

  return (
    <tr key={index}>
      <td>
        <strong>{item?.id}</strong>
      </td>
      <td>{`${item?.f_name} ${item?.l_name}`}</td>
      <td>{item?.email}</td>
      <td style={{ direction: "ltr" }}>
        {item?.phone.includes("+965") ? "" : item?.country_code} {item?.phone}
      </td>
      <td>
        <Badge
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/rules/${item?.id}`)}
          variant={
            item?.admin_roles?.length >= Rules?.length
              ? "outline-success"
              : item?.admin_roles?.length === 0
              ? "outline-danger"
              : "outline-secondary"
          }
        >
          {item?.admin_roles?.length >= Rules?.length
            ? Translate[lang]?.full_permissions
            : item?.admin_roles?.length === 0
            ? Translate[lang]?.no_permissions
            : Translate[lang]?.some_permissions}
        </Badge>
      </td>
      <td>
        <Form.Check
          type="switch"
          id={`custom-switch${index}`}
          checked={status}
          disabled={!isExist("admin")}
          onChange={(e) => changeStatusToggle(e)}
        />
      </td>
      <td>
        {isExist("admin") && (
          <Dropdown>
            <Dropdown.Toggle className="light sharp i-false">
              <i className="la la-ellipsis-v" style={{ fontSize: "27px" }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admins/edit-admin/${item.id}/${item?.f_name}`, {
                    state: { edit: true, id: item.id, item: item },
                  })
                }
              >
                {Translate[lang]?.edit}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setDeleteModal(true)}>
                {Translate[lang]?.delete}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </td>
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          titleMsg={item?.f_name}
          deletedItem={item}
          modelService={adminService}
          setShouldUpdate={setShouldUpdate}
          onCloseModal={setDeleteModal}
        />
      )}
    </tr>
  );
};
export default CardItem;
