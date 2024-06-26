import { Button, Col, Modal, Row } from "react-bootstrap"
import {AvForm} from "availity-reactstrap-validation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Translate } from "../../../../Enums/Tranlate";
import { useSelector } from "react-redux";
import DeleteModal from "../../../../common/DeleteModal";

const ChooseEditModal = ({modal, setModal, dynamicVariants,isEdit, setShouldUpdate})=>{
    const [choose, setChoose] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const navigate = useNavigate()
    // const dynamicVariantService= new DynamicVariantService()
    const lang = useSelector(state=> state.auth.lang)

    const submit = () =>{
        if(!choose){
            toast.error('Select First')
            return
        }
        if(isEdit){
            navigate(`/dynamic-variant/edit-dynamic-variant/${choose.id}`, {state: choose})
        } else{
            setDeleteModal(true)
        }
    }

    return(
        <Modal show={modal} onHide={setModal}>
            <AvForm
                    className='form-horizontal'
                    onValidSubmit={submit}>
            <Modal.Header>
            <Modal.Title>{Translate[lang]?.chosse} {Translate[lang]?.dynamic_variant}</Modal.Title>
            <Button
                variant=""
                className="close"
                onClick={setModal}
                >
                <span>&times;</span>
            </Button>
            </Modal.Header>
            <Modal.Body>
                    <Row>
                        {dynamicVariants?.map((variant)=>{
                            return <Col md={12}>
                                <label className="w-100">
                                    <input type='radio' name='dynamicVariant' className="mr-3" onChange={()=>setChoose(variant)} />
                                    {lang==='en' ? variant?.name_en : variant.name_ar}
                                </label>
                            </Col>
                        })}
                    </Row>
                
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={setModal} variant="danger light">
                {Translate[lang]?.close}
            </Button>
            <Button 
                variant="primary" 
                type='submit'
                >
                    {isEdit ? Translate[lang]?.edit : Translate[lang]?.delete}
                </Button>
            </Modal.Footer>
            </AvForm>
            {deleteModal && <DeleteModal
                      open={deleteModal}
                      titleMsg={lang==='en' ? choose.name_en : choose.name_ar}
                      deletedItem={choose}
                    //   modelService={dynamicVariantService}
                      setShouldUpdate={setShouldUpdate}
                      onCloseModal={setDeleteModal}
                      setModal={setModal}
                      isEdit={setModal}
                    />}
        </Modal>)
}

export default ChooseEditModal;