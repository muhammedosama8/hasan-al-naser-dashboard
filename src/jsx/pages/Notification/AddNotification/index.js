import { useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap"
import {AvField, AvForm} from "availity-reactstrap-validation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NotificationService from "../../../../services/NotificationService";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";

const AddNotification = ()=>{
    const [formData, setFormData] = useState({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const notificationService = new NotificationService()
    const lang = useSelector(state=> state.auth.lang)


    const submit = () =>{
        if(!formData?.description_en || !formData?.description_ar){
            toast.error('Enter Message First')
            return
        }
        let data ={
            title_en: formData?.title_en,
            title_ar: formData?.title_ar,
            description_en: formData?.description_en,
            description_ar: formData?.description_ar,
        }
        setLoading(true)
        notificationService.create(data)?.then(res=>{
            if(res?.status === 201){
                toast.success('Notification Added Successfully')
                setLoading(false)
                navigate('/notification')
            }
        })
    }

    return(
        <Card>
                <AvForm
                    className='form-horizontal'
                    onValidSubmit={submit}>
            <Card.Body>
                    <Row>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].english_title}
                                type='text'
                                placeholder={Translate[lang].english_title}
                                bsSize="lg"
                                name='title_en'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                    pattern: {
                                        value: '/^[A-Za-z0-9 ]+$/',
                                        errorMessage: `English format is invalid`
                                    }
                                }}
                                value={formData.title_en}
                                onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                            />
                        </Col>

                        <Col md={6}>
                            <AvField
                                label={Translate[lang].arabic_title}
                                type='text'
                                placeholder={Translate[lang].arabic_title}
                                value={formData.title_ar}
                                name='title_ar'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                    pattern: {
                                        value: '/^[\u0621-\u064A0-9 ]+$/',
                                        errorMessage: `Arabic format is invalid`
                                    }
                                }}
                                onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
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
                                name ='description_en'
                                type="text" 
                                value={formData.description_en}
                                required
                                placeholder={Translate[lang].english_description}
                                onChange={(e) => setFormData({...formData, description_en: e.target.value})}
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
                                name ='description_ar'
                                type="text" 
                                value={formData.description_ar}
                                required
                                placeholder={Translate[lang].arabic_description}
                                onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                            />
                        </Col>
                    </Row>
            </Card.Body>
            <Modal.Footer className="justify-content-between">
                <Button onClick={()=>navigate('/notification')} variant="danger light">
                {Translate[lang].cancel}
                </Button>
                <Button 
                    variant="primary" 
                    type='submit'
                    disabled={loading}
                >{Translate[lang].send}</Button>
            </Modal.Footer>
            </AvForm>
        </Card>)
}

export default AddNotification;