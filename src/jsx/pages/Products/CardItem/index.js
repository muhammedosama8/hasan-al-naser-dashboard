import { useEffect, useState } from "react";
import { Badge, Dropdown, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../common/DeleteModal";
import { Translate } from "../../../Enums/Tranlate";
import ProductsService from "../../../../services/ProductsService";

const CardItem = ({item, index, setShouldUpdate,setIndexEdit, }) =>{
    const [deleteModal, setDeleteModal] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [quantity, setQuantity] = useState(item.amount)
    
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const navigate = useNavigate()
    const productsService = new ProductsService()

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
                          src={item?.show_product_images[0]?.url}
                          className="rounded-lg"
                          width="40"
                          height="40"
                          alt={item.id}
                        />
                    </td>
                    <td>{item.title}</td>
                    <td>
                      <Badge variant="success light">{item.type}</Badge>
                    </td>
                    {/* 
                    <td>
                      <Form.Check
                        type="switch"
                        id={`custom-switch${index}`}
                        checked={!item.isDeleted}
                        disabled={!isExist('products')}
                        onChange={(e)=> changeStatusToggle(e)}
                      />
                    </td> */}
                    <td>
                      {isExist('home') && <Dropdown>
                        <Dropdown.Toggle
                          className="light sharp i-false"
                        >
                          <i className="la la-ellipsis-v" style={{fontSize: '27px'}}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=>{
                            navigate(`/home/products/add-products/${item.id}`, {state: item})
                          }}>{Translate[lang]?.edit}</Dropdown.Item>
                          <Dropdown.Item onClick={()=> {}}>{Translate[lang]?.active}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>}
                    </td>
                    {deleteModal && <DeleteModal
                      open={deleteModal}
                      titleMsg={item.title}
                      deletedItem={item}
                      modelService={productsService}
                      onCloseModal={setDeleteModal}
                      setShouldUpdate={setShouldUpdate}
                    />}
                  </tr>
    )
}
export default CardItem;