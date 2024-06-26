import { useEffect, useState } from "react";
import { Badge, Dropdown, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../../common/DeleteModal";
import { Translate } from "../../../../Enums/Tranlate";

const CardItem = ({item, index, setShouldUpdate,setIndexEdit, indexEdit}) =>{
    const [deleteModal, setDeleteModal] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [quantity, setQuantity] = useState(item.amount)
    
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const navigate = useNavigate()
    // const productsService = new ProductsService()

    // const changeIsDeleted = ()=>{
    //   productsService.remove(item.id, { isDeleted: false }).then(res=>{
    //       if(res?.status === 200){
    //           setShouldUpdate(prev=> !prev)
    //           toast.success('Status Updated Successfully')
    //       }
    //   })
    // }

    useEffect(()=>{
      setIsDeleted(item.isDeleted)
    },[item])

    const changeStatusToggle = (e) =>{
    //   productsService.remove(item.id, { isDeleted: !e.target.checked }).then(res=>{
    //     if(res?.status === 200){
    //         setShouldUpdate(prev=> !prev)
    //         toast.success('Status Updated Successfully')
    //     }
    // })
    }
    
    const updateQuantity = () =>{
      let data ={
        amount: parseInt(quantity)
      }
      // productsService.update(item.id, data)?.then(res=>{
      //   if(res.data?.status === 200){
      //       toast.success('Product Updated Successfully')
      //       setIndexEdit(null)
      //   }
      // })
    }

    return(
        <tr key={index} className='text-center'>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>
                        <img
                          src={item?.images[0]?.url}
                          className="rounded-lg"
                          width="40"
                          height="40"
                          alt={item.id}
                        />
                    </td>
                    <td>{lang === 'en' ? item.name_en : item.name_ar}</td>
                    <td>
                      <Badge variant="success light">{lang === 'en' ? item.category?.name_en : item.category?.name_ar}</Badge>
                    </td>
                    <td>{item.price}</td>
                    {/* <td>
                      <input
                        type='number'
                        value={quantity}
                        min={1}
                        style={{
                          width: '5rem',
                          padding: '5px',
                          border: '1px solid #dedede',
                          borderRadius: '5px'
                        }}
                        onChange={(e)=>{
                          setQuantity(e.target.value)
                        }}
                        onFocus={()=>setIndexEdit(index)}
                      />
                      {index === indexEdit &&<i 
                        className="la la-check-circle ml-2"
                        style={{
                          fontSize: '1.35rem',
                          cursor: 'pointer'
                        }}
                        onClick={updateQuantity}
                      ></i>}
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`custom-switch${index}`}
                        checked={!item.isDeleted}
                        disabled={!isExist('home')}
                        onChange={(e)=> changeStatusToggle(e)}
                      />
                    </td> */}
                    <td>
                      {/* {isExist('home') && <Dropdown>
                        <Dropdown.Toggle
                          className="light sharp i-false"
                        >
                          <i className="la la-ellipsis-v" style={{fontSize: '27px'}}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=>{
                            navigate(`/products/add-products/${item.id}`)
                          }}>{Translate[lang]?.edit}</Dropdown.Item>
                          {!isDeleted && <Dropdown.Item onClick={()=> setDeleteModal(true)}>{Translate[lang]?.deactive}</Dropdown.Item>}
                        {isDeleted && <Dropdown.Item onClick={()=> changeIsDeleted()}>{Translate[lang]?.active}</Dropdown.Item>}
                        </Dropdown.Menu>
                      </Dropdown>} */}
                      <i className="la la-eye cursor-pointer" onClick={()=>navigate(`/products/${item.id}`, {state: item.code})}></i>
                    </td>
                    {/* {deleteModal && <DeleteModal
                      open={deleteModal}
                      titleMsg={lang==='en' ? item.name_en : item.name_ar}
                      deletedItem={item}
                      modelService={productsService}
                      onCloseModal={setDeleteModal}
                      setShouldUpdate={setShouldUpdate}
                      isDeleted={true}
                    />} */}
                  </tr>
    )
}
export default CardItem;