import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import CategoriesService from "../../../../../services/CategoriesService";
import DeleteModal from "../../../../common/DeleteModal";
import { Translate } from "../../../../Enums/Tranlate";

const CardItem = ({item, setItem, index, setAddModal, setShouldUpdate}) =>{
    const [deleteModal, setDeleteModal] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const categoriesService = new CategoriesService()

    const changeIsDeleted = ()=>{
        categoriesService.remove(item.id, { isDeleted: false }).then(res=>{
            if(res && res?.status === 200){
                setShouldUpdate(prev=> !prev)
            }
        })
    }
    useEffect(()=>{
        setIsDeleted(item.isDeleted)
    },[item])

    return(
        <tr key={index} className='text-center'>
            <td>
                <strong>{item.id}</strong>
            </td>
            <td>
                        <img
                          src={item?.image}
                          className="rounded-lg"
                          width="40"
                          height="40"
                          alt={item.id}
                        />
                    </td>
            <td>{item.name}</td>
            <td>
                {isExist('categories') && <Dropdown>
                    <Dropdown.Toggle
                        // variant="success"
                        className="light sharp i-false"
                    >
                        <i className="la la-ellipsis-v" style={{fontSize: '27px'}}></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={()=> {
                            setItem(item)
                            setAddModal(true)
                        }}> {Translate[lang]?.edit}</Dropdown.Item>
                        {!isDeleted && <Dropdown.Item onClick={()=> setDeleteModal(true)}>{Translate[lang]?.deactive}</Dropdown.Item>}
                        {isDeleted && <Dropdown.Item onClick={()=> changeIsDeleted()}>{Translate[lang]?.active}</Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>}
            </td>

            {deleteModal && <DeleteModal
                      open={deleteModal}
                      titleMsg={lang==='en' ? item.name_en : item.name_ar}
                      deletedItem={item}
                      modelService={categoriesService}
                      onCloseModal={setDeleteModal}
                      setShouldUpdate={setShouldUpdate}
                      isDeleted={true}
                    />}
            </tr>
    )
}
export default CardItem;