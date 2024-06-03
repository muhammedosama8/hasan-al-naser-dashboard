import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminService from "../../../../services/AdminService";
import {useLocation} from 'react-router-dom';
import Select from 'react-select';
import CountryiesService from "../../../../services/CountriesService";
import {AvField, AvForm} from "availity-reactstrap-validation";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";
import { Rules } from "../../../Enums/Rules";
const countryCodes = require("country-codes-list");

const AddAdmin = () => {
   const location = useLocation();
   const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      // country_code: '',
      password: '',
      rules: []
   })
   const [loading, setLoading] = useState(false)
   const [countriesOptions, setCountriesOptions] = useState([])
   const [showPassword, setShowPassword] = useState(false)
   const navigate = useNavigate()
   const adminService = new AdminService()
   const countryiesService = new CountryiesService()
   const lang = useSelector(state=> state.auth?.lang)

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
      if(location?.state?.edit){
         let item = location.state?.item
         setFormData({
            first_name: item?.f_name,
            last_name: item?.l_name,
            email: item?.email,
            phone: item?.phone,
            // country_code: item?.country_code,
            password: '',
            rules: item.admin_roles?.map(res=> res.role)
         })
      }
   },[])

   const inputHandler = (e) =>{
      setFormData({...formData, [e.target.name]: e.target.value})
   }

   const onSubmit = (e) =>{
      e.preventDefault();
      // if(!location?.state?.edit && formData.password.length < 6){
      //    setError({...formData, password: true})
      //    return
      // }
      
      let data = {
         f_name: formData?.first_name,
         l_name: formData?.last_name,
         country_code: "+965",
         rules: formData.rules
      }
      if(location?.state?.edit){
         setLoading(true)
         adminService.update(location.state?.id, data).then((response) =>{
            if(response?.status === 200){
               toast.success('Admin Updated Successfully')
               navigate('/admins')
            }
            setLoading(false)
         })
      } else {
         // if(!formData.country_code){
         //    toast.error('Select Country')
         //    return
         // }
         data['password'] = formData?.password
         data['email'] = formData?.email
         data['phone'] = formData?.phone

         setLoading(true)
         adminService.create(data).then((response) =>{
            if(response?.status === 201){
               toast.success(`${Translate[lang].added} ${Translate[lang].admin} ${Translate[lang].successfully}`)
               navigate('/admins')
            }
            setLoading(false)
         })
      }
   }

   return (
      <Card className="p-4">
         <AvForm onValidSubmit={onSubmit}>
         <div className="row">
            <div className="col-lg-6 col-sm-6 mb-3">
               <AvField
						label ={`${Translate[lang]?.first_name}`}
						name ='first_name'
						type='text'
						value={formData?.first_name}
						errorMessage="Please enter a valid First Name"
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
						placeholder={`${Translate[lang]?.first_name}`}
						onChange={(e)=> inputHandler(e)}
					/>
            </div>
            <div className="col-lg-6 col-sm-6 mb-3">
               <AvField
						label ={`${Translate[lang]?.last_name}`}
						name ='last_name'
						type='text'
						value={formData?.last_name}
						errorMessage="Please enter a valid Last Name"
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
						placeholder={`${Translate[lang]?.last_name}`}
						onChange={(e)=> inputHandler(e)}
					/>
            </div>
           {!location?.state?.edit &&  <div className="col-lg-6 col-sm-6 mb-3">
               <AvField
						label ={`${Translate[lang]?.email}`}
						name ='email'
						type='email'
						value={formData?.email}
						errorMessage="Please enter a valid Email"
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
						placeholder='example@example.com'
						onChange={(e)=> inputHandler(e)}
					/>
            </div>}
            {!location?.state?.edit && <div className="col-lg-6 col-sm-6 mb-3">
               <AvField
						label ={`${Translate[lang]?.password}`}
						name ='password'
						type={`${showPassword ? 'password' : 'text'}`}
						value={formData?.password}
						errorMessage="Please enter a valid Password"
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
                  onFocus={(e)=> setShowPassword(false)}
                  onBlur={(e)=> setShowPassword(true)}
						placeholder={`${Translate[lang]?.password}`}
						onChange={(e)=> inputHandler(e)}
					/>
            </div>}
            {/* {!location?.state?.edit && <div className="col-lg-3 col-sm-6 mb-3">
                  <label className="text-label">{Translate[lang]?.country_code}</label>
                  <Select
                     value={formData?.country_code}
                     name="country_code"
                     placeholder={Translate[lang]?.select}
                     options={countriesOptions}
                     onChange={(e)=> setFormData({...formData, country_code: e})}
                  />
            </div>} */}
            {!location?.state?.edit && <div className="col-lg-6 col-sm-6 mb-3">
                  <AvField
						label ={`${Translate[lang]?.phone}`}
						name ='phone'
						type='number'
						value={formData?.phone}
						errorMessage="Please enter a valid Phone"
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
						placeholder={`${Translate[lang]?.phone}`}
						onChange={(e)=> inputHandler(e)}
					/>
            </div>}
            <Table className="w-50" responsive>
                    <thead>
                        <tr>
                            <th className="w-50">
                                <strong> {Translate[lang]?.rule}</strong>
                            </th>
                            <th className="w-25 text-center"> 
                                <strong>{Translate[lang]?.full_permissions}</strong>
                            </th>
                            <th className="w-25 text-center">
                                <strong>{Translate[lang]?.read_only}</strong>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Rules?.map((rul,index)=>{
                            return <tr key={index}>
                                <th>
                                    <strong>{Translate[lang][rul.value]}</strong>
                                </th>
                                <th className="text-center">
                                    <input 
                                        type='radio'
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            accentColor: 'var(--primary)'
                                        }}
                                        name={rul.value} 
                                        checked={formData?.rules?.includes(rul?.value)}
                                        onChange={()=> setFormData({...formData, rules: [...formData.rules, rul.value]})}
                                    />
                                </th>
                                <th className="text-center">
                                    <input 
                                        type='radio' 
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            accentColor: 'var(--primary)'
                                        }}
                                       //  checked={!formData.rules?.includes(rul.value)}
                                        name={rul.value} 
                                        onChange={()=> {
                                            let update = formData?.rules?.filter(res=> res!==rul.value)
                                            setFormData({...formData, rules: [...update ]})
                                        }}
                                    />
                                </th>
                            </tr>
                        })}
                    </tbody>
                </Table>
         </div>
         <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" type="button" onClick={()=> navigate('/admins')}>{Translate[lang]?.cancel}</Button>
            <Button variant="primary" type="submit" disabled={loading}>{Translate[lang]?.submit}</Button>
         </div>
      </AvForm>
      </Card>
   );
};

export default AddAdmin;
