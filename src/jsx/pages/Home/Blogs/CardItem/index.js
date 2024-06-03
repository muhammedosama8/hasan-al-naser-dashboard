import { useEffect, useState } from "react";
import { Badge, Dropdown, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BlogService from "../../../../../services/BlogService";
import DeleteModal from "../../../../common/DeleteModal";
import { Translate } from "../../../../Enums/Tranlate";

const CardItem = ({ item, index, setShouldUpdate, setIndexEdit }) =>{
    const [deleteModal, setDeleteModal] = useState(false)
    const [quantity, setQuantity] = useState(item.amount)
    
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const navigate = useNavigate()
    const blogService = new BlogService()

    // const changeIsDeleted = ()=>{
    //   productsService.remove(item.id, { isDeleted: false }).then(res=>{
    //       if(res?.status === 200){
    //           setShouldUpdate(prev=> !prev)
    //           toast.success('Status Updated Successfully')
    //       }
    //   })
    // }

    // const changeStatusToggle = (e) =>{
    //   productsService.remove(item.id, { isDeleted: !e.target.checked }).then(res=>{
    //     if(res?.status === 200){
    //         setShouldUpdate(prev=> !prev)
    //         toast.success('Status Updated Successfully')
    //     }
    // })
    // }

    return(
        <tr key={index} className='text-center'>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>
                        <img
                          src={item?.image}
                          className="rounded-lg"
                          width="50"
                          height="50"
                          alt={item.id}
                        />
                    </td>
                    <td>{item.title?.slice(0, 35)} {item?.title?.length > 35 && '...'}</td>
                    <td>
                      <Badge variant="success light">{item.category}</Badge>
                    </td>
                    <td>{item.date?.split('T')[0]}</td>
                    <td>
                      {isExist('home') && <Dropdown>
                        <Dropdown.Toggle
                          className="light sharp i-false"
                        >
                          <i className="la la-ellipsis-v" style={{fontSize: '27px'}}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=>{
                            navigate(`/home/add-blog/${item.id}`, {state: item})
                          }}>{Translate[lang]?.edit}</Dropdown.Item>
                          <Dropdown.Item onClick={()=> setDeleteModal(true)}>{Translate[lang]?.delete}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>}
                    </td>
                    {deleteModal && <DeleteModal
                      open={deleteModal}
                      titleMsg={item.title}
                      deletedItem={item}
                      modelService={blogService}
                      onCloseModal={setDeleteModal}
                      setShouldUpdate={setShouldUpdate}
                    />}
                  </tr>
    )
}
export default CardItem;