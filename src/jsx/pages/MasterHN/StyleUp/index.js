import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import uploadImg from '../../../../images/upload-img.png';
import Select from 'react-select';
import './style.scss'
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BaseService from "../../../../services/BaseService";
import Loader from "../../../common/Loader";
import { Translate } from "../../../Enums/Tranlate";
import { AvField, AvForm } from "availity-reactstrap-validation";

const StyleUp = () =>{
    const [isAdd, setIsAdd] = useState(true)
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSumbitLoading] = useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    // const bannerService = new BannerService()

    const [formData, setFormData] = useState({
        main_image: {src:'', loading: false},
        sheets: [{
            title: '',
            items: [{
                src: '', srcLoading: false, 
                color: '', colorLoading: false
            }]
        }]
    })

    // useEffect(()=>{
    //     bannerService?.getList()?.then(res=>{
    //         if(res && res?.status === 200){
    //             if(res.data?.meta?.data?.length === 0){
    //                 return
    //             }
    //             if(res.data?.meta?.data?.length > 0){
    //                 setIsAdd(false)
    //             }
    //             let data = res.data?.meta?.data?.map(item=>{
    //                 return {
    //                     src: item?.image,
    //                     loading: false
    //                 }
    //             })

    //             if(data?.length < 5){
    //                 let complete =[]
    //                 for(let i=data?.length; i<5; i++){
    //                     complete.push({src: '', product: ''})
    //                 }
    //                 setFormData([...data, ...complete])
    //             } else {
    //                 setFormData([...data])
    //             }
    //         }
    //         setLoading(false)
    //     })
    // },[])

    const fileMainImageHandler = (e) => {
        if(e?.target.files?.length === 0){
            return
        }
        setFormData({...formData, main_image: {src: '', loading: true}})

        let filesAll = e.target.files
        const filesData = Object.values(filesAll)
        new BaseService().postUpload(filesData[0]).then(res=>{
            if(res && res?.data?.status){
                setFormData({...formData, main_image: {src: res.data.url, loading: false}})
            }
        })
    }
    
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
            // bannerService.create(data)?.then(res=>{
            //     if(res && res?.status === 201){
            //         toast.success('Banners Added Successfully')
            //         setIsAdd(false)
            //     }
            //     setSumbitLoading(false)
            // })
        } else {
            setSumbitLoading(true)
            // bannerService.update(data)?.then(res=>{
            //     if(res && res?.status === 200){
            //         toast.success('Banners Updated Successfully')
            //         setIsAdd(false)
            //     }
            //     setSumbitLoading(false)
            // })
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
    <AvForm className='form-horizontal' onValidSubmit={onSubmit}>
        <Card className="p-4">
            <Row className="mb-2">
                <Col md={12}>
                    <h4>{Translate[lang].main_image}</h4>
                    <div className="image-placeholder">	
                        <div className="avatar-edit">
                            <input type="file" 
                                    onChange={(e) => {
                                        if(!isExist('masterHN')){
                                            toast.error('Not Allowed, Don`t have Permission')
                                            return
                                        }
                                        fileMainImageHandler(e)
                                    }} 
                                    id={`imageUpload`} /> 					
                            <label htmlFor={`imageUpload`}  name=''></label>
                        </div>
                        <button 
                            className="delete"
                            type="button"
                            onClick={()=>{
                                setFormData({...formData, main_image: {src:'', loading: false}})
                            }}
                        >
                            <i className="la la-trash text-danger"></i>
                        </button>
                        <div className="avatar-preview">
                            <div>
                            {(!!formData?.main_image?.src && !formData?.main_image.loading) && <img src={formData?.main_image?.src} alt='icon' />}
                            {(!formData?.main_image?.src && !formData?.main_image.loading) && <img src={uploadImg} alt='icon'
                                style={{
                                    width: '80px',
                                    height: '80px',
                                }}
							/>}
                            {formData?.main_image.loading && <Loader />}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <hr />
            {formData?.sheets?.map((sheet, index) => {
                return <Row key={index} className="mb-4">
                <Col md={12}>
                    <h2>Sheet {index+1}</h2>
                </Col>
                <Col md={6}>
                    <AvField
                        label={Translate[lang]?.title}
                        type='text'
                        placeholder={Translate[lang]?.english}
                        bsSize="lg"
                        name={`title${index}`}
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: Translate[lang].field_required
                                },
                            }}
                        value={sheet.title}
                        onChange={(e) => {
                            let update = formData?.sheets?.map((item, ind)=>{
                                if(index === ind){
                                    return{
                                        ...item,
                                        title: e.target?.value
                                    }
                                } else {
                                    return item
                                }
                            })
                            setFormData({...formData, sheets: update})
                        }}
                    />
                </Col>
                <Col md={6}></Col>
                {sheet?.items?.map((item,ind)=> {
                    return <>
                    <Col md={6} className="item-image mt-2">
                    <h4>{Translate[lang].color}</h4>
                    <div className="image-placeholder color">	
                        <div className="avatar-edit">
                            <input type="file" 
                                onChange={(e) => {
                                    if(!isExist('masterHN')){
                                        toast.error('Not Allowed, Don`t have Permission')
                                        return
                                    }
                                        fileMainImageHandler(e)
                                    }} 
                            /> 					
                        </div>
                        <button 
                            className="delete"
                            type="button"
                            onClick={()=>{
                                // setFormData({...formData, main_image: {src:'', loading: false}})
                            }}
                        >
                            <i className="la la-trash text-danger"></i>
                        </button>
                        <div className="avatar-preview">
                            <div>
                                {(!!sheet?.src && !sheet?.loading) && <img src={sheet?.src} alt='icon' />}
                                {(!sheet?.src && !sheet?.loading) && <img src={uploadImg} alt='icon' style={{ width: '80px', height: '80px', }} />}
                                {sheet?.loading && <Loader />}
                            </div>
                        </div>
                    </div>
                    </Col>
                    <Col md={6} className="item-image mt-2">
                        <h4>{Translate[lang].image}</h4>
                        <div className="image-placeholder image">	
                            <div className="avatar-edit">
                                <input type="file" 
                                        onChange={(e) => {
                                            if(!isExist('masterHN')){
                                                toast.error('Not Allowed, Don`t have Permission')
                                                return
                                            }
                                            fileMainImageHandler(e)
                                        }} 
                                        id={`imageUpload${index}`} /> 					
                                <label htmlFor={`imageUpload${index}`}  name=''></label>
                            </div>
                            <button 
                                className="delete"
                                type="button"
                                onClick={()=>{
                                    // setFormData({...formData, main_image: {src:'', loading: false}})
                                }}
                            >
                                <i className="la la-trash text-danger"></i>
                            </button>
                            <div className="avatar-preview">
                                <div>
                                    {(!!sheet?.src && !sheet?.loading) && <img src={sheet?.src} alt='icon' />}
                                    {(!sheet?.src && !sheet?.loading) && <img src={uploadImg} alt='icon' style={{ width: '80px', height: '80px', }} />}
                                    {sheet?.loading && <Loader />}
                                </div>
                            </div>
                        </div>
                    </Col>
                    {ind === sheet?.items?.length-1 && <Col md={12} className="text-center mt-4">
                    <Button 
                        variant='outline-secondary' 
                        onClick={()=>{
                            let update = formData?.sheets?.map((res,i) => {
                                if(i === index){
                                    return {
                                        ...res,
                                        items: [...res?.items , {
                                            src: '', srcLoading: false, 
                                            color: '', colorLoading: false
                                        }]
                                    }
                                } else {
                                    return res
                                }
                            })
                            setFormData({...formData, sheets: update})
                        }}
                        style={{
                            borderRadius: '50%',
                            padding: '10px 13px'
                        }}>
                        <i 
                            className="la la-plus" 
                            style={{
                                fontSize: '2rem'
                            }}
                        ></i>
                    </Button>
                    </Col>}
                    <Col md={12}><hr /></Col>
                </>
                })}
            </Row>
            })}
        </Card>

        {isExist('masterHN') && <div className="d-flex justify-content-between mb-4">
            <Button 
                variant='secondary'
                onClick={()=> setFormData({...formData, sheets: [...formData?.sheets, { title: '', items: [{src: '', logo: ''}]
            }]})}>
                Add New Sheet
            </Button>
            <Button 
                variant="primary" 
                className="px-5"
                disabled={submitLoading}
                type="submit"
            >{Translate[lang].submit}</Button>
        </div>}
    </AvForm>)
}
export default StyleUp;