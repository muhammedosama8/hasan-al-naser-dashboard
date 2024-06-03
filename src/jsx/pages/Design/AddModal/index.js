import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap"
import {AvField, AvForm} from "availity-reactstrap-validation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";
import BaseService from "../../../../services/BaseService";
import Loader from "../../../common/Loader";
import uploadImg from "../../../../images/upload-img.png"
import '../style.scss'
import DesignService from "../../../../services/DesignService";

const AddModal = ({modal, setModal, setShouldUpdate, item})=>{
    const [formData, setFormData]= useState({
        title: "",
        image: ""
    })
    const [loading, setLoading]= useState(false)
    const [loadingSubmit, setLoadingSubmit]= useState(false)
    const [edit, setEdit]= useState(false)
    const designService = new DesignService()
    const lang = useSelector(state=> state.auth?.lang)

    useEffect(()=>{
        if(item){
            setEdit(true)
            setFormData({...item})
        }
    },[])

    const fileHandler = (e) => {
        setLoading(true)
        let files = e.target.files
        const filesData = Object.values(files)

        setFormData({...formData, image: ""})

        if (filesData.length) {
            new BaseService().postUpload(filesData[0]).then(res=>{
                if(res.data.status){
                    setFormData({...formData, image: res.data.url})
                }
                setLoading(false)
            })
        }
    }

    const hamdleSubmit = (e) => {
        e.preventDefault()
        setLoadingSubmit(true)
        let data = {
            title: formData.title,
            image: formData.image
        }
        if(edit){
            designService.update(formData.id, data).then(res=>{
                if(res?.status === 200){
                    toast.success('Updated Successfully.')
                    setShouldUpdate(prev=> !prev)
                    setModal()
                }
                setLoadingSubmit(false)
            }).catch(()=> setLoadingSubmit(false))
        } else {
            designService.create(data).then(res=>{
                if(res?.status === 201){
                    toast.success('Added Successfully.')
                    setShouldUpdate(prev=> !prev)
                    setModal()
                }
                setLoadingSubmit(false)
            }).catch(()=> setLoadingSubmit(false))
        }

    }

    return(
        <Modal className="fade design-modal" show={modal} onHide={()=>{
            setModal()
            }}>
                <AvForm
                    className='form-horizontal'
                    onValidSubmit={hamdleSubmit}>
            <Modal.Header>
            <Modal.Title>{Translate[lang].add}</Modal.Title>
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
                        <Col md={12}>
                            <AvField
                                label={Translate[lang].title}
                                type='text'
                                placeholder={Translate[lang].title}
                                bsSize="lg"
                                name='title'
                                value={formData.title}
                                onChange={e=> setFormData({...formData, title: e.target.value})}
                            />
                        </Col>

                        <Col md={12}>
                                <div className='form-group w-100'>
                                    <label className="m-0">{Translate[lang]?.image}</label>
                                    <div className="image-placeholder">
                      <div className="avatar-edit w-100 h-100">
                        <input
                          type="file"
                          className="w-100 h-100 d-block cursor-pointer"
                          style={{opacity: '0'}}
                          onChange={(e) => fileHandler(e)}
                          id={`imageUpload`}
                        />
                      </div>
                      
                      <div className="avatar-preview">
                        {!!formData?.image ? (
                          <div id={`imagePreview`}>
                            <img
                              id={`saveImageFile`}
                              src={formData?.image}
                              alt="icon"
                            />
                          </div>
                        ) : (
                          <div id={`imagePreview-`}>
                            {(!formData?.image && loading)  && <Loader></Loader>}
                            {(!formData?.image && !loading) && (
                              <img
                                id={`saveImageFile`}
                                src={uploadImg}
                                alt="icon"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                                </div>
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
                    disabled={loadingSubmit}
                >{Translate[lang].send}</Button>
            </Modal.Footer>
            </AvForm>
        </Modal>)
}

export default AddModal;