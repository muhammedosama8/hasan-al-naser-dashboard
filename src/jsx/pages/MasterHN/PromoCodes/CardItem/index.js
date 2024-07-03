import { useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Translate } from "../../../../Enums/Tranlate";
import DeleteModal from "../../../../common/DeleteModal";

const CardItem = ({item, index, setShouldUpdate}) =>{
    const [status, setStatus] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    // const promoCodeService = new PromoCodeService()
    const navigate = useNavigate()

    useEffect(()=>{
        setStatus(item.is_active)
    },[item])

    const changeStatusToggle = (e)=>{
        setStatus(e.target.checked)
        // promoCodeService.toggleStatus(item?.id, {is_active: e.target.checked}).then(res=>{
        //   if(res?.status === 200){
        //     toast.success('Update Status Successfully')
        //   }
        // })
    }
    
    return(
        <tr key={index} className='text-center'>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {item.amount}
                    </td>
                    <td>{Translate[lang][item.Type]}</td>
                    <td>{item.createdAt.split('T')[0]}</td>
                    <td>{item.end_date.split('T')[0]}</td>
                    <td>{item.max_usage}</td>
                    <td>{item.count_usage}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`custom-switch${index}`}
                        checked={status}
                        disabled={!isExist('masterHN')}
                        onChange={(e)=> changeStatusToggle(e)}
                      />
                    </td>
                    <td>
                      {isExist('masterHN') && <Dropdown>
                        <Dropdown.Toggle
                          // variant="success"
                          className="light sharp i-false"
                        >
                          <i className="la la-ellipsis-v" style={{fontSize: '27px'}}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=> navigate('/promo-codes/edit-promo-codes', {state: {item: item}})}>{Translate[lang]?.edit}</Dropdown.Item>
                          <Dropdown.Item onClick={()=> setDeleteModal(true)}>{Translate[lang]?.delete}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>}
                    </td>
                    {deleteModal && <DeleteModal
                      open={deleteModal}
                      titleMsg={item.name}
                      deletedItem={item}
                      // modelService={promoCodeService}
                      onCloseModal={setDeleteModal}
                      setShouldUpdate={setShouldUpdate}
                    />}
                  </tr>
    )
}
export default CardItem;