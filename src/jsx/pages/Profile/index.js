import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {AvField, AvForm} from "availity-reactstrap-validation";
import { useEffect, useState } from "react";
import AdminService from "../../../services/AdminService";
import { toast } from "react-toastify";
import BaseService from "../../../services/BaseService";
import { Translate } from "../../Enums/Tranlate";
import Select from 'react-select';
import { changeAdminProfile, changeAdminProfileData } from "../../../store/actions/AuthActions";
import Loader from "../../common/Loader";
const countryCodes = require("country-codes-list");

const Profile = () =>{
    const Auth = useSelector(state=> state.auth?.auth?.admin)
    const [admin, setAdmin] = useState({})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const lang = useSelector(state=> state.auth?.lang)
    const adminService = new AdminService()
    const [countriesOptions, setCountriesOptions] = useState([])

    useEffect(() => {
        const myCountryCodesObject = countryCodes.customList(
          "countryCode",
          "{countryNameEn}/{countryNameLocal} +{countryCallingCode}"
        );
        const entries = Object.entries(myCountryCodesObject);
        setCountriesOptions(
          entries?.map((c) => {
            return {
              label: c[1].split("+")[0],
              value: c[1].split("+")[1],
            };
          })
        );
    }, []);

    useEffect(()=>{
        setAdmin({...Auth, country_code: countriesOptions?.find(res=> res.value === Auth.country_code)})
    }, [countriesOptions])

    const handlerText = (e)=>{
        setAdmin({...admin, [e.target.name]: e.target?.value})
    }

    const submit = ()=>{
        let data = {
            f_name: admin.f_name,
            l_name: admin.l_name,
            phone: admin.phone,
            country_code: "+965", //admin.country_code.value,
            email: admin.email,
        }

        setLoading(true)
        adminService?.updateProfile({...data, password: admin.password})?.then(res=>{
            if(res?.data?.status === 200){
                toast.success(Translate[lang].profile_updated_successfully)
                let userDetails = JSON.parse(localStorage.getItem('userDetails'))
                let adminData = {
                    ...userDetails.admin,
                    ...data
                }
                localStorage.setItem('userDetails', JSON.stringify({...userDetails,admin: adminData}));
                dispatch(changeAdminProfileData(adminData))
            }
            setLoading(false)
        })
    }

    const fileHandler = (e) => {
        let filesAll = e.target.files
        const filesData = Object.values(filesAll)
        
        new BaseService().postUpload(filesData[0]).then(res=>{
            if(res.data.status){
                let data = {
                    avatar: res.data.url
                }
                adminService.changeAvatar(data).then(res2=>{
                    if(res2?.status === 200){
                        setAdmin({...admin, avatar: res.data.url})
                        let userDetails = JSON.parse(localStorage.getItem('userDetails'))
                        let adminData = {
                            ...userDetails,
                            admin: {
                                ...userDetails.admin,
                                avatar: res.data.url
                            }
                        }
                        localStorage.setItem('userDetails', JSON.stringify(adminData));
                        dispatch(changeAdminProfile(res.data.url))
                    }
                })
            }
        })
    }

    if(loading){
        return <Card style={{height: '400px'}}>
        <Card.Body>
            <Loader />
        </Card.Body>
    </Card>
    }

    return<>
        <Card>
            <Card.Body>
                <AvForm onValidSubmit={submit}>
                    <Row>
                        <Col md={12} className='mb-3'>
                            <div style={{width: 'max-content'}}>
                                {!!admin?.avatar ? 
                                    <img src={admin?.avatar} 
                                        alt='profile' 
                                        style={{width: '98px', height: '98px', borderRadius: '50%'}} /> 
                                    :
                                <div>
                                    <i className="la la-user" 
                                        style={{
                                            fontSize: '4rem',
                                            border: '1px solid #dedede',
                                            borderRadius: '50%',
                                            padding: '1rem'
                                        }}>
                                    </i>
                                </div>}
                                <input 
                                    type='file' 
                                    onChange={(e)=>fileHandler(e)} 
                                    style={{
                                        position: 'absolute',
                                        left: lang === 'en' ? '14px' : 'auto',
                                        right: lang === 'ar' ? '14px' : 'auto',
                                        width: '98px',
                                        height: '98px',
                                        opacity: '0',
                                        zIndex: '99999',
                                        top: '0',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].first_name}
                                type='text'
                                placeholder={Translate[lang].first_name}
                                bsSize="lg"
                                name='f_name'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                    pattern: {
                                        value: '/^[A-Za-z0-9 ]+$/',
                                        errorMessage: `Name format is invalid`
                                    }
                                }}
                                value={admin.f_name}
                                onChange={(e)=> handlerText(e)}
                            />
                        </Col>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].last_name}
                                type='text'
                                placeholder={Translate[lang].last_name}
                                bsSize="lg"
                                name='l_name'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                    pattern: {
                                        value: '/^[A-Za-z0-9 ]+$/',
                                        errorMessage: `Name format is invalid`
                                    }
                                }}
                                value={admin.l_name}
                                onChange={(e)=> handlerText(e)}
                            />
                        </Col>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].email}
                                type='email'
                                placeholder={Translate[lang].email}
                                bsSize="lg"
                                name='email'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    }
                                }}
                                value={admin.email}
                                onChange={(e)=> handlerText(e)}
                            />
                        </Col>
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].password}
                                type='text'
                                placeholder={Translate[lang].password}
                                bsSize="lg"
                                name='password'
                                value={admin.password}
                                onChange={(e)=> handlerText(e)}
                            />
                        </Col>
                        {/* <Col md={6}>
                            <label className="text-label">{Translate[lang]?.country_code}</label>
                            <Select
                                value={admin?.country_code}
                                name="country_code"
                                placeholder={Translate[lang]?.select}
                                options={countriesOptions}
                                onChange={(e)=> handlerText(e)}
                            />
                        </Col> */}
                        <Col md={6}>
                            <AvField
                                label={Translate[lang].phone}
                                type='number'
                                placeholder={Translate[lang].phone}
                                bsSize="lg"
                                name='phone'
                                validate={{
                                    required: {
                                        value: true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                    pattern: {
                                        value: '/^[0-9 ]+$/',
                                        errorMessage: `Phone format is invalid`
                                    }
                                }}
                                value={admin.phone}
                                onChange={(e)=> handlerText(e)}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-4 text-right">
                        <Col md={12}>
                            <Button type="submit" variant="primary">
                            {Translate[lang].edit}
                            </Button>
                        </Col>
                    </Row>
                </AvForm>
            </Card.Body>
        </Card>
    </>
}
export default Profile;