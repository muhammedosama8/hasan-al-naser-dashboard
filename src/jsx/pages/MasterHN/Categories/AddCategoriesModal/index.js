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
        name: '',
        img: ''
    })
    const [isAdd, setIsAdd] = useState(false)
    const [loading, setLoading] = useState(false)
    const lang = useSelector(state=> state.auth?.lang)
    const categoriesService = new CategoriesService()

    useEffect(() => {
        if(Object.keys(item)?.length === 0){
            setIsAdd(true)
        } else {
            setIsAdd(false)
            setFormData({
                id: item?.id,
                name: item?.name,
                img: item?.image,
            })
        }
    },[item])

    const fileHandler = (e) => {
        // setFiles([e.target.files[0]])
		// setTimeout(function(){
		// 	var src = document.getElementById(`saveImageFile`)?.getAttribute("src");
		// 	setFormData({...formData, img: {id: '', path: src}})
		// }, 200);

        setLoading(true)
        let files = e.target.files
        const filesData = Object.values(files)
 
        if (filesData.length) {
            new BaseService().postUpload(filesData[0]).then(res=>{
                if(res.data.status){
                    setFormData({...formData, img: res.data.url})
                    setFiles(filesData[0])
                }
                setLoading(false)
            })
        }
    }

    const submit = () =>{
        if(!formData?.img){
            return
        }
        let data ={
            name_en: formData?.en,
            name_ar: formData?.ar,
            image: formData?.img
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
                        <Col md={12}>
                            <AvField
                                label={Translate[lang]?.name}
                                type='text'
                                placeholder={Translate[lang]?.name}
                                bsSize="lg"
                                name='name'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                    // pattern: {
                                    //     value: '/^[A-Za-z0-9 ]+$/',
                                    //     errorMessage: `English format is invalid`
                                    // }
                                }}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                                id={`imageUpload`} 
                                            /> 					
                                            {/* <label htmlFor={`imageUpload`}  name=''></label> */}
                                        </div>
                                        <div className="avatar-preview2 m-auto">
                                            <div id={`imagePreview`}>
                                            {!!formData?.img && 
                                                <img alt='icon'
                                                    id={`saveImageFile`} 
                                                    className='w-100 h-100' 
                                                    style={{borderRadius: '30px'}} 
                                                    src={formData?.img|| URL.createObjectURL(files)}
                                                />}
                                            {/* {files[0]?.name && <img id={`saveImageFile`} className='w-100 h-100' style={{borderRadius: '30px'}} src={URL.createObjectURL(files[0])} alt='icon' />} */}
                                            {(!formData?.img && !loading) && 
                                                <img 
                                                    id={`saveImageFile`} 
                                                    src={uploadImg} alt='icon'
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                    }}
                                                />}
                                            {(!formData?.img && loading) && <Loader />}
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