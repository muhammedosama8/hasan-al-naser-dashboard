import { useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import ChooseEditModal from "../ChooseEditModal";
import { Translate } from "../../../../Enums/Tranlate";

const CardItem = ({item, index, setShouldUpdate}) =>{
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const [chooseModal, setChooseModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    return(
        <tr key={index} className='text-center'>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>{lang==='en' ? item.name_en : item.name_ar}</td>
                    <td style={{display: 'grid', gap:'10px',gridTemplateColumns: 'auto auto auto'}}>
                      {item.dynamic_variants?.map((variant, index)=>{
                        return <Badge variant="outline-primary light" className="mr-2">
                          {lang ==='en' ? variant?.name_en : variant?.name_ar}
                        </Badge>
                      })}
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
                          <Dropdown.Item onClick={()=> {
                            setIsEdit(true)
                            setChooseModal(true)}}>
                            {Translate[lang]?.edit}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={()=> {
                            setIsEdit(false)
                            setChooseModal(true)
                            }}>{Translate[lang]?.delete}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>}
                    </td>
                    
                    {chooseModal && <ChooseEditModal
                    modal={chooseModal}
                    setModal={()=>setChooseModal(false)}
                    dynamicVariants={item.dynamic_variants}
                    isEdit={isEdit}
                    setShouldUpdate={setShouldUpdate}
                    />}
                  </tr>
    )
}
export default CardItem;