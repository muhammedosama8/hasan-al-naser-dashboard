import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import uploadImg from '../../../../images/upload-img.png';
import './style.scss'
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BaseService from "../../../../services/BaseService";
import Loader from "../../../common/Loader";
import { Translate } from "../../../Enums/Tranlate";
import MHBannerService from "../../../../services/MHBannerService";

const Banners = () =>{
    const [isAdd, setIsAdd] = useState(true)
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSumbitLoading] = useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const bannerService = new MHBannerService()

    const [formData, setFormData] = useState([
        {src:'', loading: false},
        {src:'', loading: false},
        {src:'', loading: false},
        {src:'', loading: false},
        {src:'', loading: false},
    ])

    useEffect(()=>{
        bannerService?.getList()?.then(res=>{
            if(res && res?.status === 200){
                if(res.data?.data?.length === 0){
                    return
                }
                if(res.data?.data?.length > 0){
                    setIsAdd(false)
                }
                let data = res.data?.data?.map(item=>{
                    return {
                        src: item?.image,
                        loading: false
                    }
                })

                if(data?.length < 5){
                    let complete =[]
                    for(let i=data?.length; i<5; i++){
                        complete.push({src: '', product: ''})
                    }
                    setFormData([...data, ...complete])
                } else {
                    setFormData([...data])
                }
            }
            setLoading(false)
        })
    },[])

    const fileHandler = (e, index) => {
        if(e?.target.files?.length === 0){
            return
        }
        let updateImages = formData.map((item, ind)=>{
            if(ind === index){
                return {
                    ...item,
                    loading: true
                }
            } else {
                return {...item}
            }
        } )
        setFormData([...updateImages])
        let filesAll = e.target.files
        const filesData = Object.values(filesAll)

        
        new BaseService().postUpload(filesData[0]).then(res=>{
            if(res && res?.data?.status){
                let updateImages = formData.map((item, ind)=>{
                    if(ind === index){
                        return {
                            ...item,
                            src: res.data.url,
                            loading: false
                        }
                    } else {
                        return {...item}
                    }
                } )
                setFormData([...updateImages])
            }
        })
    }
    console.log(isAdd,formData)
    const onSubmit = () => {
        let data = {
            banners: formData?.filter(res=> !!res.src)?.map((item,index)=>{
                let res = {
                    image: item?.src
                }
                return res
            })
        }
        
        if(isAdd){
            if(data.banners?.length === 0){
                toast.error('Add Image')
                return
            }
            setSumbitLoading(true)
            bannerService.create(data)?.then(res=>{
                if(res && res?.status === 201){
                    toast.success('Banners Added Successfully')
                    setIsAdd(false)
                }
                setSumbitLoading(false)
            }).catch(()=> setSumbitLoading(false))
        } else {
            setSumbitLoading(true)
            bannerService.update(data)?.then(res=>{
                if(res && res?.status === 200){
                    toast.success('Banners Updated Successfully')
                    setIsAdd(false)
                }
                setSumbitLoading(false)
            }).catch(()=> setSumbitLoading(false))
        }
        
    }

    if(loading){
        return <Card className="py-5">
            <Card.Body>
                <Loader />
            </Card.Body>
        </Card>
    }
    return(
        <>
        {formData?.map((data, index)=>{
            return <Card className="p-4" key={index}>
                    <Row>
                    <Col md={12}>
                    <h4>{Translate[lang].banner} {index+1}</h4>
                    <div className="image-placeholder">	
                        <div className="avatar-edit">
                            <input type="file" 
                                    onChange={(e) => {
                                        if(!isExist('masterHN')){
                                            toast.error('Not Allowed, Don`t have Permission')
                                            return
                                        }
                                        fileHandler(e,index)
                                    }} 
                                    id={`imageUpload${index}`} /> 					
                            <label htmlFor={`imageUpload${index}`}  name=''></label>
                        </div>
                        <button 
                            className="delete"
                            type="button"
                            onClick={()=>{
                                let update= formData?.map((item, ind)=>{
                                    if(ind === index){
                                        return{
                                            ...item,
                                            src: ''
                                        }
                                    } else {
                                        return item
                                    }
                                })
                                setFormData([...update])
                            }}
                        >
                            <i className="la la-trash text-danger"></i>
                        </button>
                        <div className="avatar-preview">
                            <div id={`imagePreview${index}`}>
                            {(!!data?.src && !data.loading) && <img id={`saveImageFile${index}`} src={data?.src} alt='icon' />}
                            {(!data?.src && !data.loading) && <img id={`saveImageFile${index}`} src={uploadImg} alt='icon'
                                style={{
                                    width: '80px',
                                    height: '80px',
                                }}
							/>}
                            {data.loading && <Loader />}
                            </div>
                        </div>
                    </div>
                    </Col>
                    </Row>
            </Card>
        })}
        {isExist('masterHN') && <div className="d-flex justify-content-end mb-4">
            <Button 
                variant="primary" 
                className="px-5"
                disabled={submitLoading}
                onClick={()=> onSubmit()}
            >{Translate[lang].submit}</Button>
        </div>}
    </>)
}
export default Banners;