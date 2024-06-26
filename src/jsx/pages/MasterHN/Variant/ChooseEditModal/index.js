import { Button, Col, Modal, Row } from "react-bootstrap"
import {AvForm} from "availity-reactstrap-validation";
import { useState } from "react";
import { toast } from "react-toastify";

const ChooseEditModal = ({modal, setModal, variants, setShouldUpdate})=>{
    const [choose, setChoose] = useState([])
    const [loading, setLoading] = useState(false)
    // const variantService= new VariantService()

    const submit = () =>{
        if(choose.length === 0){
            toast.error('Select First')
            return
        }
        setLoading(true)
        choose.map(async (item,index) => {
            // const response = await variantService.remove(item.id);
            // if (response?.status === 200) {
            //     if(index === choose.length-1) {
            //         toast.success('Deleted Successfully')
            //         setShouldUpdate(prev => !prev);
            //     }
            // }
            if(index === choose.length-1) setLoading(false)
        })
    }

    return(
        <Modal show={modal} onHide={setModal}>
            <AvForm
                    className='form-horizontal'
                    onValidSubmit={submit}>
            <Modal.Header>
            <Modal.Title>Chosse Variant</Modal.Title>
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
                        {variants?.map((variant)=>{
                            return <Col md={12}>
                                <label className="w-100">
                                    <input type='checkbox' name='variant' value={variant} className="mr-3" onChange={(e)=>{
                                        if(e.target.checked){
                                            setChoose([...choose, variant])
                                        } else {
                                            let update = choose.filter((res,ind)=> res.id !== variant.id)
                                            setChoose([...update])
                                        }
                                    }} />
                                    {variant?.name_en}
                                </label>
                            </Col>
                        })}
                    </Row>
                
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={setModal} variant="danger light">
                Close
            </Button>
            <Button 
                variant="primary" 
                type='submit'
                disabled={loading}
                >
                    Delete
                </Button>
            </Modal.Footer>
            </AvForm>
        </Modal>)
}

export default ChooseEditModal;