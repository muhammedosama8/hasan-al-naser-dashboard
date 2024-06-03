import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap"
import Select from 'react-select'
import {AvField, AvForm} from "availity-reactstrap-validation";
import { toast } from "react-toastify";
import CountryiesService from "../../../../../services/CountriesService";
import CurrencyService from "../../../../../services/CurrencyService";
import { Translate } from "../../../../Enums/Tranlate";
import { useSelector } from "react-redux";

const AddCurrencyModal = ({addModal, setAddModal, item, setShouldUpdate})=>{
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        rate: '',
        country: '',
    })
    const [isAdd, setIsAdd] = useState(false)
    const [ countriesOptions, setCountriesOptions] = useState([])
    const countriesService = new CountryiesService()
    const currencyService = new CurrencyService()
    const lang = useSelector(state=> state.auth.lang)

    useEffect(()=> {
        countriesService?.getList().then(res=>{
            if(res.data?.status === 200){
                let countries =  res.data?.data?.filter(c=> c?.id !== 1)?.map(item=>{
                   return{
                      id: item?.id,
                      value: item?.id,
                      label: lang === 'en' ? item.name_en : item.name_ar
                   }
                })
                setCountriesOptions(countries)
             }
        })
    },[lang])

    useEffect(() => {
        if(Object.keys(item).length === 0){
            setIsAdd(true)
        } else {
            setIsAdd(false)
            setFormData({
                country: {
                    ...item.country,
                    label: `${item.country?.name_en}`,
                    value: item.country.id
                },
                id: item?.id,
                rate: item.rate,
            })
        }
    },[item])

    const submit = () =>{
        if(!formData?.country){
            return
        }
        
        setLoading(true)
        if(isAdd){
            let data ={
                currency: [{
                    rate: parseFloat(formData?.rate),
                    country_id: formData.country?.value
                }]
            }
            currencyService?.create(data)?.then(res=>{
                if(res?.status === 201){
                    toast.success('Currency Added Successfully')
                    setAddModal()
                    setShouldUpdate(prev=> !prev)
                }
                setLoading(false)
            })
        } else {
            let data ={
                rate: parseFloat(formData?.rate),
                country_id: formData.country?.value
            }
            currencyService?.update(formData?.id, data)?.then(res=>{
                if(res?.status === 200){
                    toast.success('Currency Updated Successfully')
                    setAddModal()
                    setShouldUpdate(prev=> !prev)
                }
                setLoading(false)
            })
        }
    }

    return(
        <Modal className="fade" show={addModal} onHide={setAddModal}>
            <AvForm
                    className='form-horizontal'
                    onValidSubmit={submit}>
            <Modal.Header>
            <Modal.Title>{isAdd ? Translate[lang]?.add : Translate[lang]?.edit} {Translate[lang]?.currency}</Modal.Title>
            <Button
                variant=""
                className="close"
                onClick={setAddModal}
                >
                <span>&times;</span>
            </Button>
            </Modal.Header>
            <Modal.Body>
                
                    <Row>
                        <Col md={12}>
                            <div className='form-group w-100'>
                            <label>{Translate[lang]?.country}</label>
                            <Select
                                value={formData.country}
                                name="country"
                                placeholder={Translate[lang]?.select}
                                options={countriesOptions}
                                onChange={(e)=> setFormData({...formData, country: e})}
                            />
                            </div>
                        </Col>
                        <Col md={12}>
                            <AvField
                                    label={Translate[lang]?.rate}
                                    type='number'
                                    placeholder={Translate[lang]?.rate}
                                    bsSize="lg"
                                    name='rate'
                                    validate={{
                                        required: {
                                            value: true,
                                            errorMessage: Translate[lang].field_required
                                        }
                                    }}
                                    value={formData.rate}
                                    onChange={(e) => setFormData({...formData, rate: e.target.value})}
                                />
                        </Col>
                    </Row>
                
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={setAddModal} variant="danger light">
            {Translate[lang]?.close}
            </Button>
            <Button 
                disabled={loading}
                variant="primary" 
                type='submit'
                >{isAdd ? Translate[lang]?.add : Translate[lang]?.edit}</Button>
            </Modal.Footer>
            </AvForm>
        </Modal>)
}

export default AddCurrencyModal;