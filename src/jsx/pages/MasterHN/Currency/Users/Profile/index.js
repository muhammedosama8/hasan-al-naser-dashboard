import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import Select from 'react-select';
import {AvField, AvForm} from "availity-reactstrap-validation";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";
import '../style.scss'
import CountryiesService from "../../../../services/CountriesService";
import AreasService from "../../../../services/AreasServices";
import { types } from "../../../Enums/Orders";

const UserProfile =()=>{
    const [edit, setEdit] = useState(false)
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({
        f_name: '',
        l_name: '',
        email: '',
        phone: '',
        country_code: '',
        address: {
            addressName: "",
            block: "",
            street: "",
            country_id: 0,
            area_id: 0,
            type: "",
            avenue: "",
            buildingNumber: "",
            floorNumber: "",
            officeNumber: "",
            houseNumber: "",
            aptNumber: "",
            otherInstructions: "",
        }
    })
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const countryiesService = new CountryiesService()
    const areasService = new AreasService()
    const [countriesOptions, setCountriesOptions] = useState([])
    const [areasOptions, setAreasOptions] = useState([])
    const [locationTypesOptions, setLocationTypesOptions] = useState([])

    useEffect(()=>{
        setUser({
            ...user,
            ...window?.history?.state?.usr,
            phone: window?.history?.state?.usr.user_phones?.filter(res=> res.is_default)[0]?.phone
        })
        
        let orders =[
            {id: 1,order: 't-shirt', quantity: '3', total_price: 280, payment_status: 'cash', status: 'Ordered'},
            {id: 2,order: 't-shirt', quantity: '3', total_price: 380, payment_status: 'visa', status: 'Processing'},
            {id: 3,order: 't-shirt', quantity: '3', total_price: 180, payment_status: 'cash', status: 'Shipped'},
            {id: 4,order: 't-shirt', quantity: '3', total_price: 80, payment_status: 'visa', status: 'Delivered'},
            {id: 5,order: 't-shirt', quantity: '3', total_price: 80, payment_status: 'visa', status: 'Canceled'},
          ]
          setOrders([...orders])
    },[])

    const onSubmit = (e) =>{
        e.preventDefault();
        setEdit(false)
    }


    useEffect(()=>{
        if(edit){
            countryiesService.getList().then(res=>{
                if(res?.status === 200){
                let data = res.data.data?.map(item=>{
                    return{
                        label: lang==='en' ? `${item.name_en} (${item?.country_code || ''})` : `${item.name_ar} (${item?.country_code || ''})`,
                        name_en: item.name_en,
                        country_code: item?.country_code,
                        type: item.type,
                        value: item.id,
                        id: item.id
                    }
                })
                setCountriesOptions(data)
                }
            })
            let data = types.map(res=>{
                return{
                    ...res,
                    label: lang==='en' ? res.label : res.ar
                }
            })
            setLocationTypesOptions([...data])
        }
    },[edit])

    useEffect(()=>{
        if(!!user.country_code){
            areasService.getList(user.country_code.id).then(res=>{
                let data = res?.data?.data?.map(are=>{
                    return{
                        ...are,
                        label: lang==='en' ? are.name_en : are.name_ar,
                        value: are.id,
                        id: are.id,
                    }
                })
                setAreasOptions([...data])
            })
        }
    },[user.country_code])

    return(<div>
        {!edit && <Card>
            <Card.Body>
                <Row>
                    <Col md={6} className='mb-2'>
                        <h4>{Translate[lang]?.first_name}</h4>
                        <p>{user.f_name}</p>
                    </Col>
                    <Col md={6} className='mb-2'>
                        <h4>{Translate[lang]?.last_name}</h4>
                        <p>{user.l_name}</p>
                    </Col>
                    <Col md={6} className='mb-2'>
                        <h4>{Translate[lang]?.email}</h4>
                        <p className="mb-0">{user.email}</p>
                    </Col>
                    <Col md={6}>
                        <h4>{Translate[lang]?.phone}</h4>
                        <p className="mb-0">{user.phone}</p>
                    </Col>
                </Row>
                {/* {isExist('users') && <button className="edit" onClick={()=> setEdit(true)}>
                    <i className="la la-edit"></i>
                </button>} */}
            </Card.Body>
        </Card>}
        {/* {!edit && <Card>
            <Card.Body>
                <h4>{Translate[lang]?.orders}</h4>
                <Row>
                <Table responsive>
                    <thead>
                    <tr className='text-center'>
                        <th>
                        <strong>I.D</strong>
                        </th>
                        <th>
                        <strong>Type</strong>
                        </th>
                        <th>
                        <strong>Quantity</strong>
                        </th>
                        <th>
                        <strong>Total Price</strong>
                        </th>
                        <th>
                        <strong>Payment Method</strong>
                        </th>
                        <th>
                        <strong>STATUS</strong>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map((item, index)=>{
                        return <tr key={index} className='text-center'>
                        <td>
                        <strong>{item.id}</strong>
                        </td>                    
                        <td>{item.order}</td>
                        <td>{item.quantity}</td>
                        <td>{item.total_price}</td>
                        <td>{item.payment_status}</td>
                        <td>
                        <Badge
                            variant={`${item.status === 'Delivered' ? 'success' : 
                                    item.status === 'Canceled' ? 'danger' :
                                    item.status === 'Ordered' ? 'primary' :
                                    item.status === 'Processing' ? 'warning' :
                                    item.status === 'Shipped' ? 'info' : ''}  light`}
                        >
                            {item.status}
                        </Badge>
                        </td>
                        </tr>
                    })}
                    </tbody>
                </Table>
                </Row>
            </Card.Body>
        </Card>} */}
        {edit && <Card>
            <Card.Body>
                <AvForm onValidSubmit={onSubmit}>
                    <Row>
                        <Col sm={6}>
                            <AvField 
                                label={Translate[lang].first_name}
                                placeholder={Translate[lang].first_name}
                                type='text'
                                value={user.f_name}
                                name='f_name'
                                errorMessage="Please enter a valid Name"
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, f_name: e.target.value})
                                }}
                            />
                        </Col>
                        <Col sm={6}>
                            <AvField 
                                type='text'
                                label={Translate[lang].last_name}
                                placeholder={Translate[lang].last_name}
                                value={user.l_name}
                                name='l_name'
                                errorMessage="Please enter a valid Name"
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, l_name: e.target.value})
                                }}
                            />
                        </Col>
                        <Col sm={6}>
                            <AvField 
                                type='email'
                                label={Translate[lang].email}
                                placeholder={Translate[lang].email}
                                value={user.email}
                                name='email'
                                errorMessage="Please enter a valid Email"
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, email: e.target.value})
                                }}
                            />
                        </Col>
                        <Col sm={3}>
                            <label className="text-label">{Translate[lang].country_code}</label>
                            <Select
                                value={user?.country_code}
                                name="country_code"
                                placeholder={Translate[lang].select}
                                options={countriesOptions}
                                onChange={(e)=> setUser({...user, country_code: e})}
                            />
                        </Col>
                        <Col sm={3}>
                            <AvField 
                                type='number'
                                label={Translate[lang].phone}
                                placeholder={Translate[lang].phone}
                                value={user.phone}
                                name='phone'
                                errorMessage="Please enter a valid Phone"
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, phone: e.target.value})
                                }}
                            />
                        </Col>
                        <Col sm={12}>
                            <AvField 
                                type='text'
                                label={Translate[lang].address_name}
                                placeholder={Translate[lang].address_name}
                                value={user.address.addressName}
                                name='address'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, addressName: e.target.value}})
                                }}
                            />
                        </Col>
                        <Col sm={6}>
                            <AvField 
                                type='text'
                                label={Translate[lang].block}
                                placeholder={Translate[lang].block}
                                value={user.address.block}
                                name='block'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, block: e.target.value}})
                                }}
                            />
                        </Col>
                        <Col sm={6}>
                            <AvField 
                                type='text'
                                label={Translate[lang].street}
                                placeholder={Translate[lang].street}
                                value={user.address.street}
                                name='street'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, street: e.target.value}})
                                }}
                            />
                        </Col>
                        <Col sm={3}>
                            <label className="text-label">{Translate[lang].area}</label>
                            <Select
                                value={user.address?.area_id}
                                name="area"
                                placeholder={Translate[lang].select}
                                options={areasOptions}
                                noOptionsMessage={()=> `${Translate[lang].select} ${Translate[lang].area} ${Translate[lang].first}`}
                                onChange={(e)=> setUser({...user, address: {...user.address, area_id: e}})}
                            />
                        </Col>
                        <Col sm={3}>
                            <AvField 
                                type='text'
                                label={Translate[lang].avenue}
                                placeholder={Translate[lang].avenue}
                                value={user.address.avenue}
                                name='avenue'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, avenue: e.target.value}})
                                }}
                            />
                        </Col>
                        <Col sm={3}>
                            <label className="text-label">{Translate[lang].type}</label>
                            <Select
                                value={user.address?.type}
                                name="type"
                                placeholder={Translate[lang].select}
                                options={locationTypesOptions}
                                onChange={(e)=> setUser({...user, address: {...user.address, type: e}})}
                            />
                        </Col>
                        {user.address.type?.value === 'building' && <Col sm={3}>
                            <AvField 
                                type='text'
                                label={Translate[lang].building_number}
                                placeholder={Translate[lang].building_number}
                                value={user.address.buildingNumber}
                                name='buildingNumber'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, buildingNumber: e.target.value}})
                                }}
                            />
                        </Col>}
                        {user.address.type?.value === 'building' && <Col sm={3}>
                            <AvField 
                                type='text'
                                label={Translate[lang].floor_number}
                                placeholder={Translate[lang].floor_number}
                                value={user.address.floorNumber}
                                name='floorNumber'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, floorNumber: e.target.value}})
                                }}
                            />
                        </Col>}
                        {user.address.type?.value === 'building' && <Col sm={3}>
                            <AvField 
                                type='text'
                                label={Translate[lang].apt_number}
                                placeholder={Translate[lang].apt_number}
                                value={user.address.aptNumber}
                                name='aptNumber'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, aptNumber: e.target.value}})
                                }}
                            />
                        </Col>}
                        {user.address.type?.value === 'office' && <Col sm={3}>
                            <AvField 
                                type='text'
                                label={Translate[lang].office_number}
                                placeholder={Translate[lang].office_number}
                                value={user.address.officeNumber}
                                name='officeNumber'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, officeNumber: e.target.value}})
                                }}
                            />
                        </Col>}
                        {user.address.type?.value === 'house' && <Col sm={3}>
                            <AvField 
                                type='text'
                                label={Translate[lang].house_number}
                                placeholder={Translate[lang].house_number}
                                value={user.address.houseNumber}
                                name='houseNumber'
                                validate={{
                                    required: {
                                        value:true,
                                        errorMessage: Translate[lang].field_required
                                    },
                                }}
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, houseNumber: e.target.value}})
                                }}
                            />
                        </Col>}
                        <Col sm={12}>
                            <AvField 
                                type='text'
                                label={Translate[lang].other_instructions}
                                placeholder={Translate[lang].other_instructions}
                                value={user.address.otherInstructions}
                                name='otherInstructions'
                                onChange={(e)=>{
                                    setUser({...user, address: {...user.address, otherInstructions: e.target.value}})
                                }}
                            />
                        </Col>
                    </Row>
                    <div>
                        <div></div>
                        <Button variant="primary" type="submit">
                            {Translate[lang].edit}
                        </Button>
                    </div>
                </AvForm>
            </Card.Body>
        </Card>}
    </div>)
}
export default UserProfile;