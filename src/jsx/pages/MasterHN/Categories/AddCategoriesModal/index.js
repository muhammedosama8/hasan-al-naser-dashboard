import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap"
import {AvField, AvForm} from "availity-reactstrap-validation";
import { toast } from "react-toastify";
import uploadImg from '../../../../../images/upload-img.png';
import CategoriesService from "../../../../../services/CategoriesService";
import BaseService from "../../../../../services/BaseService";
import Loader from "../../../../common/Loader";
import { useSelector } from "react-redux";
import { Translate } from "../../../../Enums/Tranlate";

const AddCategoriesModal = ({addModal, setAddModal, item, setShouldUpdate})=>{
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        name_en: '',
        name_ar: '',
        image: ''
    })
    const [isAdd, setIsAdd] = useState(false)
    const [loading, setLoading] = useState(false)
    const lang = useSelector(state=> state.auth?.lang)
    const categoriesService = new CategoriesService()
console.log(formData)
    useEffect(() => {
        if(Object.keys(item)?.length === 0){
            setIsAdd(true)
        } else {
            setIsAdd(false)
            setFormData({
                id: item?.id,
                name_en: item?.name_en,
                name_ar: item?.name_ar,
                image: item?.image,
            })
        }
    },[item])

    const fileHandler = (e) => {
        if(e.target.files?.length === 0){
            return
        }
        setLoading(true)
        let files = e.target.files
        const filesData = Object.values(files)
 
        if (filesData.length) {
            new BaseService().postUpload(filesData[0]).then(res=>{
                if(res.data.status){
                    setFormData({...formData, image: res.data.url})
                }
                setLoading(false)
            })
        }
    }

    const submit = () =>{
        if(!formData?.image){
            return
        }
        let data ={
            name_en: formData?.name_en,
            name_ar: formData?.name_ar,
            image: formData?.image
        }
        if(isAdd){
            categoriesService.create(data)?.then(res=>{
                if(res && res?.status === 201){
                    toast.success('Category Added Successfully')
                    setAddModal()
                    setShouldUpdate(prev=> !prev)
                }
            })
        } else {
            categoriesService.update(formData?.id, data)?.then(res=>{
                if(res && res?.status === 200){
                    toast.success('Category Updated Successfully')
                    setAddModal()
                    setShouldUpdate(prev=> !prev)
                }
            })
        }
    }

    return(
        <Modal className={lang === 'en' ? "en fade" : "ar fade"} style={{textAlign: lang === 'en' ? 'left' : 'right'}} show={addModal} onHide={()=>{
            setAddModal()
            }}>
                <AvForm
                    className='form-horizontal'
                    onValidSubmit={submit}>
            <Modal.Header>
            <Modal.Title>{isAdd ? Translate[lang]?.add : Translate[lang]?.edit} {Translate[lang]?.category}</Modal.Title>
            <Button
                variant=""
                className="close"
                style={{right: lang === 'en' ? '0' : 'auto', left: lang === 'ar' ? '0' : 'auto'}}
                onClick={()=>{
                    setAddModal()
                }}
                >
                <span>&times;</span>
            </Button>
            </Modal.Header>
            <Modal.Body>
                
                    <Row>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang]?.english_title}
                                type='text'
                                placeholder={Translate[lang]?.english}
                                bsSize="lg"
                                name='name_en'
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
                                value={formData.name_en}
                                onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                            />
                        </Col>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang]?.arabic_title}
                                type='text'
                                placeholder={Translate[lang]?.arabic}
                                bsSize="lg"
                                name='name_ar'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                value={formData.name_ar}
                                onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                            />
                        </Col>
                        <Col md={12}>
                                <div className='form-group w-100'>
                                    <label className="m-0">{Translate[lang]?.category_image}</label>
                                    <div className="image-placeholder" style={{maxWidth: 'fit-content'}}>	
                                        <div className="avatar-edit h-100">
                                            <input 
                                                type="file" 
                                                className="d-block w-100 h-100 cursor-pointer" 
                                                style={{opacity: '0'}}
                                                onChange={(e) => fileHandler(e)}
                                            /> 					
                                        </div>
                                        <div className="avatar-preview2 m-auto">
                                            <div>
                                            {!!formData?.image && <img src={formData.image} alt='icon'
                                                    className='w-100 h-100' style={{borderRadius: '30px'}} 
                                                />}
                                            {(!formData?.image && !loading) && 
                                                <img
                                                    src={uploadImg} alt='icon'
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                    }}
                                                />}
                                            {(!formData?.image && loading) && <Loader />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </Col>
                    </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={setAddModal} variant="danger light">
            {Translate[lang]?.close}
            </Button>
            <Button 
                    variant="primary" 
                    type='submit'
                    disabled={loading}
                >{isAdd ? Translate[lang]?.add : Translate[lang]?.edit}</Button>
            </Modal.Footer>
            </AvForm>
        </Modal>)
}

export default AddCategoriesModal;