import { useEffect, useState } from "react";
import {AvField, AvForm} from "availity-reactstrap-validation";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import AreasService from "../../../../services/AreasServices";
import SettingService from "../../../../services/SettingServices";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";
import Loader from "../../../common/Loader";

const inital = {
    delivery_possibility: true,
    delivery_fee: '',
    cash_in_delivery: '',
    delivery_all_area: true,
    shipping_fee: '',
    areas: []
}
const Delivery = () => {
    const [formData, setFormData] = useState(inital)
    const [loading, setLoading] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const areasService = new AreasService()
    const settingService = new SettingService()
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

    const formDataHandler = (e)=>{
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    useEffect(()=>{
        setLoadingData(true)
        settingService.getList().then(res=>{
            let response = res?.data?.data
            if(response){
                let data = {
                    delivery_possibility: response.delivery_possibility,
                    delivery_fee: response.delivery_fee,
                    cash_in_delivery: response.cash_in_delivery,
                    delivery_all_area: response.delivery_all_area,
                    shipping_fee: response.shipping_fee
                }
                setIsAdd(false)
                setFormData({...data})
            } else {
                setIsAdd(true)
            }
            setLoadingData(false)
        })
    },[])

    useEffect(()=>{
        if(!formData.delivery_all_area){
            areasService.getList(1).then(res=>{
                let data = res?.data?.data?.map(are=>{
                    return{
                        ...are,
                        delivery_fee: are?.delivery_fee
                    }
                })
                setFormData({...formData, areas: [...data]})
            })
        }
    }, [formData.delivery_all_area])

    const submit = () =>{
        let data = {
            delivery_possibility: true,
            delivery_all_area: formData.delivery_all_area,
            cash_in_delivery: parseFloat(formData.cash_in_delivery),
            delivery_fee: parseFloat(formData.delivery_fee),
            shipping_fee: parseFloat(formData.shipping_fee)
        }
        data['area_fees'] = formData.areas?.map(area=>{
            return{
                delivery_fee: area.delivery_fee,
                id: area.id
            }
        })
        setLoading(true)
        settingService.create(data).then(res=>{
            setLoading(false)
            if(res?.status === 201){
                toast.success('Delivery Updated Successfully')
                setIsAdd(false)
            }
        })
    }

    if(loadingData){
        return <Card className="py-5" style={{height: '300px'}}>
            <Card.Body>
                <Loader />
            </Card.Body>
      </Card>
    }
    return <Card>
        <Card.Body>
            <AvForm>
                {(!isAdd && isExist('delivery')) && <button 
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '28px',
                        position: 'absolute',
                        right: lang==='en' ? '12px' : 'auto',
                        left: lang==='ar' ? '12px' : 'auto',
                        top: '12px',
                        zIndex: '1'
                    }}
                    type="button" 
                    onClick={()=> setIsAdd(true)} >
                    <i className="la la-edit"></i>
                </button>}
                <Row className="mb-3">
                    <Col md={6}>
                        <label className="text-label">{Translate[lang].possible_delivery}</label>
                        <Form.Check
                            type="switch"
                            id={`delivery_possibility`}
                            disabled={!isAdd}
                            checked={formData.delivery_possibility}
                           onChange={(e)=> setFormData({...formData, delivery_possibility: e.target.checked})}
                        />
                    </Col>
                    {formData.delivery_possibility && <Col md={6}>
                        <label className="text-label">{Translate[lang].type_of_area}</label>
                        <div className="d-flex mt-2" style={{gap: '24px'}}>
                            <label className="text-label">{Translate[lang].per_area}</label>
                            <Form.Check
                                type="switch"
                                id={`delivery_all_area`}
                                disabled={!isAdd}
                                checked={formData.delivery_all_area}
                                onChange={(e)=> setFormData({...formData, delivery_all_area: e.target.checked})}
                            />
                            <label className="text-label">{Translate[lang].all_area}</label>
                        </div>
                    </Col>}
                </Row>
                {formData.delivery_possibility && <Row>
                    <Col md={6}>
                        <AvField
                            label={Translate[lang].cash_in_delivery_fees}
                            placeholder={Translate[lang].cash_in_delivery_fees}
                            type='number'
                            name='cash_in_delivery'
                            disabled={!isAdd}
                            errorMessage="Please Enter a Valid Value"
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: Translate[lang].field_required
                                },
                            }}
                            value={formData.cash_in_delivery}
                            onChange={(e)=> formDataHandler(e)}
                        />
                    </Col>
                    <Col md={6}>
                        <AvField
                            label={Translate[lang].delivery_fees}
                            placeholder={Translate[lang].delivery_fees}
                            type='number'
                            name='delivery_fee'
                            disabled={!isAdd}
                            errorMessage="Please Enter a Valid Value"
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: Translate[lang].field_required
                                },
                            }}
                            value={formData.delivery_fee}
                            onChange={(e)=> formDataHandler(e)}
                        />
                    </Col>
                    <Col md={6}>
                        <AvField
                            label={`${Translate[lang].shipping_fee}: (${Translate[lang].price_per_kg})`}
                            placeholder={`${Translate[lang].shipping_fee}: (${Translate[lang].price_per_kg})`}
                            type='number'
                            name='shipping_fee'
                            disabled={!isAdd}
                            // errorMessage="Please Enter a Valid Value"
                            // validate={{
                            //     required: {
                            //         value: true,
                            //         errorMessage: Translate[lang].field_required
                            //     },
                            // }}
                            value={formData.shipping_fee}
                            onChange={(e)=> formDataHandler(e)}
                        />
                    </Col>
                    {!formData.delivery_all_area && <Row className="my-3 px-3">
                        {formData.areas?.map((area,index)=>{
                        return <Col md={3}>
                            <AvField
                            label={lang==='en'? area.name_en : area.name_ar}
                            placeholder={Translate[lang].delivery_fees}
                            type='number'
                            disabled={!isAdd}
                            name={`${area.delivery_fee}`}
                            errorMessage="Please Enter a Valid Value"
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: Translate[lang].field_required
                                },
                            }}
                            min={0}
                            value={area.delivery_fee}
                            onChange={(e)=> {
                                let update = formData.areas?.map((are,ind)=>{
                                    if(ind === index){
                                        return{
                                            ...are,
                                            delivery_fee: e.target.value
                                        }
                                    } else{
                                        return are
                                    }
                                })
                                setFormData({...formData, areas: update})
                            }}
                        />
                        </Col>
                    })}
                    </Row>}
                    {/* <Col md={6}>
                        <AvField
                            label='Amount'
                            placeholder='Amount'
                            type='text'
                            name='amount'
                            errorMessage="Please Enter a Valid Value"
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: Translate[lang].field_required
                                },
                            }}
                            value={formData.amount}
                            onChange={(e)=> formDataHandler(e)}
                        />
                    </Col> */}
                </Row>}
                {isExist('delivery') && <div className="d-flex justify-content-between mt-4">
                    {/* <Button variant="secondary" type="button" onClick={()=> setFormData(inital)}>Cancel</Button> */}
                    <div></div>
                    {isAdd && <Button variant="primary" type="submit" onClick={submit} disabled={loading}>{Translate[lang].submit}</Button>}
                </div>}
            </AvForm>
        </Card.Body>
    </Card>
}
export default Delivery;