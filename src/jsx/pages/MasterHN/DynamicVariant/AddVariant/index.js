
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Select from 'react-select'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Translate } from "../../../../Enums/Tranlate";

const AddDynamicVariant = ()=>{
   const [formData, setFormData] =useState({category: ''})
   const [dynamicVariant, setDynamicVariant] = useState([
      {
         name_en: "",
         name_ar: "",
         available_amount: '',
         has_amount: false,
         price: ''
      }
   ])
   let dynamic_variant_id = window?.location?.pathname?.split('/dynamic-variant/edit-dynamic-variant/')[1]
   const [ categoriesOptions, setCategoriesOptions] = useState()
   const [ isAdd, setIsAdd] = useState(true)
   const [ id, setId] = useState(null)
   // const categoriesService = new CategoriesService()
   // const dynamicVariantService = new DynamicVariantService()
   const navigate = useNavigate()
   const lang = useSelector(state => state.auth.lang)

   useEffect(()=>{
      if(window.history.state?.usr){
         setIsAdd(false)
         setId(window.history.state?.usr?.id)
         setDynamicVariant([window.history.state?.usr])
         return
      }
   }, [])

   useEffect(()=>{
      // categoriesService.getList().then(res=>{
      //    if(res.data?.status === 200){
      //       let categories =  res.data?.meta?.data?.map(item=>{
      //          return{
      //             id: item?.id,
      //             value: item?.id,
      //             label: lang === 'en' ? item.name_en : item.name_ar
      //          }
      //       })
      //       setCategoriesOptions(categories)
      //    }
      // })
   },[lang])

   const onSubmit = (e) =>{
      e.preventDefault()
      let data ={
         category_id: formData?.category?.value,
         dynamic_variant: dynamicVariant

      }
      let editedData ={
         name_en: dynamicVariant[0].name_en,
         name_ar: dynamicVariant[0].name_ar,
         available_amount: parseInt(dynamicVariant[0].available_amount),
         has_amount: dynamicVariant[0].has_amount,
         price: parseFloat(dynamicVariant[0].price)
      }
      if(isAdd){
         // dynamicVariantService.create(data).then(res=> {
         //    if(res?.status === 201){
         //       toast.success('Dynamic Variant Added Successfully')
         //       navigate('/dynamic-variant')
         //    }
         // })
      } else {
         // dynamicVariantService.update(id, editedData)?.then(res => {
         //    if(res?.status === 200){
         //       toast.success('Dynamic Variant Updated Successfully')
         //       navigate('/dynamic-variant')
         //    }
         // })
      }
      
   }

   return(
      <Card>
         <Card.Body>
            <form className="add-variant" onSubmit={onSubmit}>
            <div className="row">
               {!dynamic_variant_id && <div className="col-lg-6 mb-2">
                  <div className="form-group mb-3">
                     <label className="text-label">{Translate[lang].category}</label>
                     <Select
                        value={formData.category}
                        name="category"
                        placeholder={Translate[lang].select}
                        options={categoriesOptions}
                        onChange={(e)=> {
                           setFormData({category: e})
                        }}
                     />
                  </div>
               </div>}

               {dynamicVariant?.map((item, itemIndex)=>(
                  <Col style={{boxShadow: '0 0 2px #dedede'}} md={12} className='mb-3 py-4 position-relative' key={itemIndex}>
                     {itemIndex > 0 && <button 
                           className="position-absolute"
                           type='button' 
                           style={{
                              height: 'fit-content', 
                              right: lang === 'en' ? '16px' : 'auto', 
                              left: lang === 'ar' ? '16px' : 'auto', 
                              top: '16px',zIndex: '2',
                              padding: '2px 8px', backgroundColor: 'var(--danger)',
                              color: '#fff', border: 'none', borderRadius: '8px'
                           }}
                           onClick={()=>{
                              let update = dynamicVariant?.filter((_,index)=> index !== itemIndex)
                              setDynamicVariant(update)
                           }}
                        >X</button>}
                     <Row>
                        <Col lg={6} md={6} className='mb-3'>
                           <div className="form-group">
                              <label className="text-label">{Translate[lang].english_name}</label>
                              <input
                              type="text"
                              name="en"
                              className="form-control"
                              placeholder={Translate[lang].english_name}
                              required
                              // pattern="[\u0600-\u06FF\s]+"
                              value={item?.name_en}
                              onChange={(e)=> {
                                 let update = dynamicVariant?.map((res, index)=>{
                                    if(index === itemIndex){
                                       return{
                                          ...res,
                                          name_en: e.target.value
                                       }
                                    } else {
                                       return res
                                    }
                                 })
                                 setDynamicVariant([...update])
                              }}
                           />
                           </div>
                        </Col>
                        <Col md={6} className='mb-3'>
                           <label>{Translate[lang].arabic_name}</label>
                           <input
                              type="text"
                              name="ar"
                              className="form-control"
                              placeholder={Translate[lang].arabic_name}
                              required
                              // pattern="[\u0600-\u06FF\s]+"
                              value={item?.name_ar}
                              onChange={(e)=> {
                                 let update = dynamicVariant?.map((res, index)=>{
                                    if(index === itemIndex){
                                       return{
                                          ...res,
                                          name_ar: e.target.value
                                       }
                                    } else {
                                       return res
                                    }
                                 })
                                 setDynamicVariant([...update])
                              }}
                           />
                        </Col>
                        <Col md={2}>
                           <label className="text-label">{Translate[lang].has_amount}</label>
                           <Form.Check
                           type="switch"
                           id={`has_amount${itemIndex}`}
                           checked={item.has_amount}
                           onChange={(e)=> {
                              let update = dynamicVariant?.map((res, index)=>{
                                 if(index === itemIndex){
                                    return{
                                       ...res,
                                       has_amount: e.target.checked
                                    }
                                 } else {
                                    return res
                                 }
                              })
                              setDynamicVariant([...update])
                           }}
                           />
                        </Col>
                        <Col md={4}>
                           <label>{Translate[lang].available_amount}</label>
                           <input
                              type="number"
                              name="avilable_amount"
                              className="form-control"
                              placeholder={Translate[lang].available_amount}
                              required
                              // pattern="[\u0600-\u06FF\s]+"
                              value={item?.available_amount}
                              onChange={(e)=> {
                                 let update = dynamicVariant?.map((res, index)=>{
                                    if(index === itemIndex){
                                       return{
                                          ...res,
                                          available_amount: e.target.value
                                       }
                                    } else {
                                       return res
                                    }
                                 })
                                 setDynamicVariant([...update])
                              }}
                           />
                        </Col>
                        <Col md={6}>
                           <label>{Translate[lang].price}</label>
                           <input
                              type="number"
                              name="price"
                              className="form-control"
                              placeholder={Translate[lang].price}
                              required
                              // pattern="[\u0600-\u06FF\s]+"
                              value={item?.price}
                              onChange={(e)=> {
                                 let update = dynamicVariant?.map((res, index)=>{
                                    if(index === itemIndex){
                                       return{
                                          ...res,
                                          price: e.target.value
                                       }
                                    } else {
                                       return res
                                    }
                                 })
                                 setDynamicVariant([...update])
                              }}
                           />
                        </Col>
                     </Row>
                  </Col>
               ))}
                  <div className="d-flex w-100 justify-content-end mb-3">
                     {isAdd && <Button 
                        variant="link" 
                        style={{color: 'blue'}}
                        type="button" 
                        onClick={()=>setDynamicVariant([...dynamicVariant, {
                           name_en: "",
                           name_ar: "",
                           available_amount: '',
                           has_amount: false,
                           price: ''
                        }])}
                     >{Translate[lang].add_new_value}</Button>}
                  </div>
            </div>
            <div className="d-flex justify-content-between">
               <div></div>
               <div>
                  <Button variant="primary" type="submit">{Translate[lang].submit}</Button>
               </div>
            </div>
            </form>
         </Card.Body>
      </Card>
    )
}
export default AddDynamicVariant;