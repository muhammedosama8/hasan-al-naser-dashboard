import { useEffect, useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Translate } from "../../../../Enums/Tranlate";
import DeleteVariantModal from "../DeleteVariantModal";

const CardItem = ({item, index, setShouldUpdate,shouldUpdate}) =>{
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const navigate = useNavigate()
    const [deleteModal, setDeleteModal] = useState(false)

    return(
        <tr key={index} className='text-center'>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>{lang === 'en' ? item.name_en : item.name_ar}</td>
                    <td style={{display: 'grid', gap:'10px',gridTemplateColumns: 'auto auto auto'}}>
                      {item.variants?.map((variant, index)=>{
                        return <Badge key={index} variant="outline-primary light" className="mr-2">
                          {lang === 'en' ? variant?.name_en : variant?.name_ar}
                        </Badge>
                      })}
                    </td>
                    <td>
                      {isExist('masterHN') && <Dropdown>
                        <Dropdown.Toggle
                          className="light sharp i-false"
                        >
                          <i className="la la-ellipsis-v" style={{fontSize: '27px'}}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=> navigate(`/variant/add-variant/${item.id}`)}>
                            {Translate[lang].edit}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={()=> setDeleteModal(true)}>{Translate[lang].delete}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>}
                    </td>
                    {deleteModal && <DeleteVariantModal
                    modal={deleteModal}
                    setModal={()=>  setDeleteModal(false)}
                    variants={item.variants}
                    setShouldUpdate={setShouldUpdate}
                    />}
                  </tr>
    )
}
export default CardItem;