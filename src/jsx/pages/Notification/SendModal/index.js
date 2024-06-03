import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap"
import {AvField, AvForm} from "availity-reactstrap-validation";
import { toast } from "react-toastify";
import NotificationService from "../../../../services/NotificationService";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";

const SendModal = ({modal, setModal, item})=>{
    const [loading, setLoading]= useState()
    const notificationService = new NotificationService()
    const lang = useSelector(state=> state.auth?.lang)

    const submit = () =>{
        setLoading(true)
        notificationService.send(item?.id)?.then(res=>{
            if(res?.status === 200){
                toast.success('Notification Send Successfully')
                setLoading(false)
                setModal()
            }
        })
    }

    return(
        <Modal className="fade" show={modal} onHide={()=>{
            setModal()
            }}>
                <AvForm
                    className='form-horizontal'
                    onValidSubmit={submit}>
            <Modal.Header>
            <Modal.Title>{Translate[lang].send}</Modal.Title>
            <Button
                variant=""
                className="close"
                onClick={()=>{
                    setModal()
                }}
                >
                <span>&times;</span>
            </Button>
            </Modal.Header>
            <Modal.Body>
                <Row>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].english_title}
                                type='text'
                                placeholder={Translate[lang].english_title}
                                bsSize="lg"
                                name='name_en'
                                disabled
                                value={item.title_en}
                            />
                        </Col>

                        <Col md={6}>
                            <AvField
                                label={Translate[lang].arabic_title}
                                type='text'
                                placeholder={Translate[lang].arabic_title}
                                value={item.title_ar}
                                name='name_ar'
                                disabled
                            />
                        </Col>
                        <Col md={6}>
                            <label className="d-block">{Translate[lang].english_description}</label>
                            <textarea
                                style={{
                                    border: '1px solid hsl(0, 0%, 80%)',
                                    padding: '6px 12px',
                                    width: '100%',
                                    borderRadius: '0.3rem',
                                    maxHeight: '200px',
                                    minHeight: '100px',
                                    height:' 200px'
                                }}
                                name ='message_en'
                                type="text" 
                                value={item.description_en}
                                disabled
                                placeholder={Translate[lang].english_description}
                            />
                        </Col>
                        <Col md={6}>
                            <label className="d-block">{Translate[lang].arabic_description}</label>
                            <textarea
                                style={{
                                    border: '1px solid hsl(0, 0%, 80%)',
                                    padding: '6px 12px',
                                    width: '100%',
                                    borderRadius: '0.3rem',
                                    maxHeight: '200px',
                                    minHeight: '100px',
                                    height:' 200px'
                                }}
                                name ='message_ar'
                                type="text" 
                                value={item.description_ar}
                                disabled
                            />
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
            <Button onClick={setModal} variant="danger light">
            {Translate[lang].cancel}
            </Button>
            <Button 
                    variant="primary" 
                    type='submit'
                    disabled={loading}
                >{Translate[lang].send}</Button>
            </Modal.Footer>
            </AvForm>
        </Modal>)
}

export default SendModal;