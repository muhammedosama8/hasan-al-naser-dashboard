
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Select from 'react-select'
import { InputTags } from "react-bootstrap-tagsinput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from '../../../../common/Loader'
import { useSelector } from "react-redux";
import { Translate } from "../../../../Enums/Tranlate";
import VariantService from "../../../../../services/VariantService";
import CategoriesService from "../../../../../services/CategoriesService";

const AddVariant = ()=>{
   const [formData, setFormData] = useState({
      category: '', variant: []
   })
   let variant_id = window?.location?.pathname?.split('/variant/add-variant/')[1]
   const [ categoriesOptions, setCategoriesOptions] = useState([])
   const [ tags, setTags] = useState([])
   const [ isAdd, setIsAdd] = useState(true)
   const [ loading, setLoading] = useState(false)
   const [ id, setId] = useState(null)
   const categoriesService = new CategoriesService()
   const variantService = new VariantService()
   const navigate = useNavigate()
   const lang = useSelector(state=> state.auth.lang)

   useEffect(()=>{
      setFormData({
         category: '', variant: []
      })
      setTags([])
   },[lang])

   useEffect(()=>{
      categoriesService.getList().then(res=>{
         if(res.data?.status === 200){
            let categories =  res.data?.data?.data?.map(item=>{
               return{
                  id: item?.id,
                  value: item?.id,
                  label: lang === 'en' ? item.name_en : item.name_ar
               }
            })
            setCategoriesOptions(categories)
         }
      })
   }, [lang])

   useEffect(()=>{
      if(!!formData?.category && !id){
         variantService.getVariant(formData?.category?.id)?.then(res=>{
            if(res?.status === 200){
               if(res.data?.data.data?.length > 0){
                  let tags = res.data?.data.data?.map(tag=> tag.name_en.toLowerCase())
                  setIsAdd(false)
                  setTags([...tags])
                  setFormData({
                     ...formData, 
                     variant: res.data?.data?.data.map(item=> {
                        return{
                           ...item,
                           name_en: item.name_en.toLowerCase()
                        }
                     })
                  })
               } else{
                  setIsAdd(true)
               }
            }
         })
      }
   },[formData?.category])

   useEffect(()=>{
      if(!!formData?.category || !!variant_id){
         setLoading(true)
         variantService.getVariant(Number(variant_id))?.then(res=>{
            setId(Number(variant_id))
            if(res?.status === 200){
               if(res.data?.data.data?.length > 0){
                  let tags = res.data?.data.data?.map(tag=> tag.name_en.toLowerCase()) // lang === 'en' ?  : tag.name_ar
                  setIsAdd(false)
                  setTags([...tags])
                  setFormData({
                     category: categoriesOptions?.filter(opt=> opt.id === Number(variant_id))[0], 
                     variant: res.data?.data?.data.map(item=> {
                        return{
                           ...item,
                           name_en: item.name_en.toLowerCase()
                        }
                     })
                  })
               } else{
                  setIsAdd(true)
               }
            }
            setLoading(false)
         })
      }
   },[window.location.pathname])


   let checkTypeVariant = (val) => {
      let check= val.toLowerCase().indexOf('color') !== -1 ? true : false
      if(val === 'color' || val === 'colour' || val === 'coulor' || val === 'اللون' || val === 'ألوان' || val === 'الوان' || val === 'الألوان' || check){
         return true
      }
      return false
   }

   const generateVariant = () =>{
      let filterFormDataVariant = formData?.variant?.map(item => item.name_en)
      let filterFound = tags.filter(item => filterFormDataVariant.includes(item));
      let filterNotFound = tags.filter(item => !filterFormDataVariant.includes(item));

      let filter = formData?.variant?.filter(res=> filterFound?.includes(res.name_en))
      
      let update = filterNotFound?.map((tag)=>{
         if(lang === 'ar'){
            return {
               name_en: '',
               name_ar: tag,
               variant_values: [
                  {
                     value_ar: "",
                     value_en: checkTypeVariant(tag) ? '#dfdfdf' : ''
                  }
               ]
            }
         } else{
            return {
               name_en: tag,
               name_ar: checkTypeVariant(tag) ? 'اللون' : '',
               variant_values: [
                  {
                     value_ar: "",
                     value_en: checkTypeVariant(tag) ? '#dfdfdf' : ''
                  }
               ]
            }
         }
      })
      
      setFormData({...formData, variant: [...filter, ...update]})
   }

   const onSubmit = (e) =>{
      e.preventDefault()
      if((!formData?.category && isAdd) || formData?.variant?.length === 0 || formData.variant?.filter(res=> res.values?.length === 0)?.length > 0){
         toast.error('Complete All Phases')
         return
      }
      let data = {
         variant: formData?.variant?.map((variant) => {
            return{
               name_en: (variant.name_en === 'color' || variant.name_en === 'colour' || variant.name_en === 'coulor' || /color/.test(variant.name_en.toLowerCase())) ? 'color' : variant.name_en,
               name_ar: variant.name_ar,
               variant_values : variant.variant_values?.map(val=>{
                  return{
                     value_ar: (variant.name_en === 'color' || variant.name_en === 'colour' || variant.name_en === 'coulor' || /color/.test(variant.name_en.toLowerCase())) ? 'اللون' : val.value_ar,
                     value_en: val.value_en,
                  }
               })
            }
         })
      }
      if(isAdd) data['category_id']= formData?.category?.value

      if(isAdd){
         variantService.addVariant(data).then(res=> {
            if(res?.status === 201){
               toast.success('Variant Added Successfully')
               // setFormData({category: '', variant: []})
               navigate('/variant')
            }
         })
      } else {
         variantService.updateVariant(Number(variant_id), data)?.then(res => {
            if(res?.status === 200){
               toast.success('Variant Updated Successfully')
               // setFormData({category: '', variant: []})
               navigate('/variant')
            }
         })
      }
      
   }

   if(loading){
      return <Card className="p-4" style={{minHeight: '30rem'}}>
          <Loader />
      </Card>
  }
   return(
      <Card>
         <Card.Body>
            <form className="add-variant" onSubmit={onSubmit}>
            <div className="row">
               {!variant_id && <div className="col-lg-6 mb-2">
                  <div className="form-group mb-3">
                     <label className="text-label">{Translate[lang].category}</label>
                     <Select
                     value={formData.category}
                     name="category"
                     placeholder={Translate[lang].select}
                     options={categoriesOptions}
                     onChange={(e)=> {
                        setFormData({variant: [], category: e})
                        setTags([])
                     }}
                  />
                  </div>
               </div>}
               <div className="col-lg-12 mb-2">
                  <div className="form-group mb-3 tags">
                     <label className="text-label">{Translate[lang].variant}</label>
                     <div className="input-group">
                        <InputTags
                           style={{fontSize: '16px', borderRadius: lang==='ar' ? '0 8px 8px 0' : '8px 0 0 8px'}}
                           values={tags}
                           disabled={!isAdd}
                           placeholder={Translate[lang].variant}
                           onTags={(value) => setTags(value.values)}
                        />
                        <button
                           className="btn btn-secondary light create"
                           type="button"
                           style={{borderRadius: lang==='en' ? '0 8px 8px 0' : '8px 0 0 8px' }}
                           data-testid="button-clearAll"
                           disabled={!tags.length || !isAdd}
                           onClick={() => generateVariant()}
                        >
                           {Translate[lang].create}
                        </button>
                     </div>
                  </div>
               </div>

               {!!formData.variant?.length && formData.variant?.map((item, itemIndex)=>{
                  let typeVal = (item?.name_ar === 'اللون' || item?.name_ar === 'الألوان'|| item?.name_ar === 'الوان'|| item?.name_ar === 'ألوان' || item?.name_en === 'color' || item?.name_en === 'colour' || item?.name_en === 'coulor' || (item?.name_en.toLowerCase().indexOf('color') !== -1) )
                  return <Col md={12} className='mb-3' key={itemIndex}>
                     <Row style={{boxShadow: '0 0 2px #dedede', padding: '2rem 0'}}>
                        <Col lg={6} md={6} className='mb-3'>
                           <div className="form-group">
                              <label className="text-label">{lang==='en' ? Translate[lang].english_name : Translate[lang].arabic_name}</label>
                              <h3>{lang==='en' ? item?.name_en : item?.name_ar}</h3>
                           </div>
                        </Col>
                        <Col md={6} className='mb-3'>
                           <label>{lang==='en' ? Translate[lang].arabic_name : Translate[lang].english_name}</label>
                           <input
                              type="text"
                              name={lang==='en' ? "ar" : 'en'}
                              className="form-control"
                              placeholder={lang==='en' ? Translate[lang].arabic_name : Translate[lang].english_name}
                              required
                              // pattern="[\u0600-\u06FF\s]+"
                              disabled={!isAdd}
                              value={lang==='en' ? item?.name_ar : item?.name_en}
                              onChange={(e)=> {
                                 let update = formData.variant?.map((res, index)=>{
                                    if(index === itemIndex){
                                       if(lang === 'en'){
                                          return{
                                             ...res,
                                             name_ar: e.target.value
                                          }
                                       } else {
                                          return{
                                             ...res,
                                             name_en: e.target.value
                                          }
                                       }
                                       
                                    } else {
                                       return res
                                    }
                                 })
                                 setFormData({...formData, variant: update})
                              }}
                           />
                        </Col>
                        {!typeVal && <Col md={6} sm={6}>
                           <label className="text-label">{Translate[lang]?.types_by_english}</label>
                        </Col>}
                        {!typeVal && <Col md={6} sm={6}>
                           <label className="text-label">{Translate[lang]?.types_by_arabic}</label>
                        </Col>}
                        {item?.variant_values?.map((val,ind)=>{
                           return <>
                              <Col lg={typeVal ? 11 : 6} md={12} sm={5}>
                                 <div className='form-group'>
                                    <div className="input-group">
                                       <input
                                          type={typeVal ? "color" : 'text'}
                                          name="en"
                                          className="form-control"
                                          placeholder={Translate[lang]?.english_name}
                                          required
                                          disabled={!isAdd}
                                          // pattern='/^[A-Za-z0-9 ]+$/'
                                          value={val?.value_en}
                                          onChange={(e)=> {
                                             let update = formData.variant?.map((res, index)=>{
                                                if(index === itemIndex){
                                                   return{
                                                      ...res,
                                                      variant_values: res.variant_values?.map((valType, valTypeIndex)=>{
                                                         if(valTypeIndex === ind){
                                                            return {
                                                               ...valType,
                                                               value_en: e.target.value
                                                            }
                                                         } else {
                                                            return valType
                                                         }
                                                      })
                                                   }
                                                } else {
                                                   return res
                                                }
                                             })
                                             setFormData({...formData, variant: update})
                                          }}
                                       />
                                       {typeVal && <input
                                          type="text"
                                          name="en"
                                          className="form-control mx-2"
                                          disabled={true}
                                          value={val?.value_en}
                                       />}
                                    </div>
                                 </div>
                              </Col>
                              {!typeVal && <Col lg={5} md={12} sm={5}>
                                 <div className='form-group'>
                                    <div className="input-group">
                                       <input
                                          type="text"
                                          name="ar"
                                          className="form-control"
                                          placeholder={Translate[lang]?.arabic_name}
                                          required
                                          disabled={!isAdd}
                                          // pattern="[\u0600-\u06FF\s]+"
                                          value={val?.value_ar}
                                          onChange={(e)=> {
                                             let update = formData.variant?.map((res, index)=>{
                                                if(index === itemIndex){
                                                   return{
                                                      ...res,
                                                      variant_values: res.variant_values?.map((valType, valTypeIndex)=>{
                                                         if(valTypeIndex === ind){
                                                            return {
                                                               ...valType,
                                                               value_ar: e.target.value
                                                            }
                                                         } else {
                                                            return valType
                                                         }
                                                      })
                                                   }
                                                } else {
                                                   return res
                                                }
                                             })
                                             setFormData({...formData, variant: update})
                                          }}
                                       />
                                    </div>
                                 </div>
                              </Col>}
                              {(ind > 0 && isAdd) && <Col md={1} sm={1}>
                                 <button type='button' 
                                    style={{
                                       height: 'fit-content',
                                       padding: '8px 12px', backgroundColor: 'var(--danger)',
                                       color: '#fff', border: 'none', borderRadius: '8px'
                                    }}
                                    disabled={!isAdd}
                                    onClick={()=>{
                                       let update = formData.variant?.map((res, index)=>{
                                          if(index === itemIndex){
                                             let valuesUpdate = res.variant_values?.filter((_, valuInd)=> valuInd !== ind)
                                             return{
                                                ...res,
                                                variant_values: valuesUpdate
                                             }
                                          } else {
                                             return res
                                          }
                                       })
                                       setFormData({...formData, variant: update})
                                    }}
                                 >X</button>
                              </Col>}
                              {(ind === item?.variant_values?.length-1 && isAdd) && <Col md={12} sm={6} className='justify-content-end d-flex'>
                                 <button 
                                    className="border-0"
                                    style={{
                                       background:'none',
                                       fontSize: '15px',
                                       color: '#0909cc'
                                    }}
                                    type='button'
                                    onClick={()=>{
                                       let update = formData.variant?.map((res, index)=>{
                                          if(index === itemIndex){
                                             let valuesUpdate = res.variant_values
                                             valuesUpdate.push({
                                                value_ar: '',
                                                value_en: checkTypeVariant(item.name_en || item.name_ar) ? '#dedede' : '',
                                             })
                                             return{
                                                ...res,
                                                variant_values: valuesUpdate
                                             }
                                          } else {
                                             return res
                                          }
                                       })
                                       setFormData({...formData, variant: update})
                                    }}
                                 >
                                    {Translate[lang]?.add_new_value}
                                 </button>
                              </Col>}
                           </>
                        })}
                     </Row>
                  </Col>}
               )}
            </div>
            <div className="d-flex justify-content-between">
               <div></div>
               {isAdd && <div>
                  <Button variant="primary" type="submit">{Translate[lang]?.submit}</Button>
               </div>}
            </div>
            </form>
         </Card.Body>
      </Card>
    )
}
export default AddVariant;