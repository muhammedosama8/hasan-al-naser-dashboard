import { Button, Card } from "react-bootstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Translate } from "../../Enums/Tranlate";
import Loader from "../../common/Loader";
import uploadImg from "../../../images/upload-img.png";
import BaseService from "../../../services/BaseService";
import { toast } from "react-toastify";
import './style.scss'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'draft-js/dist/Draft.css';
import HomeService from "../../../services/HomeService";
import BannerService from "../../../services/BannerService";

const HomePage = () => {
  const [formData, setFormData] = useState({
    banners: [
      { src: "", title: "", catalog: '', description: "", tags: ["", "", "", "", "", ""], loading: false },
    ],
    collection: {
      description: EditorState.createEmpty(),
      images: [
        { src: "", loading: false },
        { src: "", loading: false },
        { src: "", loading: false },
        { src: "", loading: false },
      ]
    },
    barcode: {src: "", loading: false},
  })
  const [collectionLoading, setCollectionLoading] = useState(false)
  const [bannersLoading, setBannersLoading] = useState(false)
  const [editBanners, setEditBanners] = useState(false)
  const [barcodeLoading, setBarcodeLoading] = useState(false)
  const lang = useSelector((state) => state.auth?.lang);
  const homeService = new HomeService()
  const bannerService = new BannerService()
  const Auth = useSelector(state=> state.auth?.auth)
  const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

  useEffect(()=>{
    let banners = bannerService?.getList()
    let collection = homeService?.getCollection()
    let barcode = homeService?.getBarcode()
    // let images = brandingService?.getImages()

    Promise.all([banners, collection, barcode]).then(res=>{
      let data = {}
      if(res[0]?.status === 200){
        const banners = res[0]?.data?.data?.map(banner=>{
          return {
            ...banner,
            src: banner?.image,
            tags: banner?.tags?.map(tag=> tag?.name)
          }
        });

        if(banners?.length > 0) data['banners']= [...banners]
      }

      if(res[1]?.status === 200){
        if(res[1]?.data?.data?.Collection_images?.length > 0 || res[1]?.data?.data?.description) data['collection'] = {
          images: res[1]?.data.data?.Collection_images?.map(img=>{
            return{
              src: img.url,
              loading: false
            }
          }),    
          description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(res[1]?.data?.data?.description)))
        }
      }

      if(res[2]?.status === 200){
        data['barcode'] = {src: res[2]?.data?.data?.url, loading: false}
      }

      // if(res[3]?.status === 200){
      //   data['our_partners'] = Array.from({ length: 9 }, (_, index) => {
      //     let arr = res[3]?.data?.data;
      //     if(arr[index]){
      //       return {id: arr[index]?.id, src: arr[index]?.image, loading: false }
      //     } else {
      //       return { src: "", loading: false }
      //     }
      //   })
      // }

      setFormData({...formData, ...data})
    }).catch(error => {
      console.log(error);
    })
  }, [])

  const fileHandler = (e, index, type) => {
    if(e.target.files?.length === 0){
      return
    }
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);
    if(type === "collection"){
      let update = formData?.collection?.images?.map((data, ind)=> {
        if(ind === index){
          return {src: "", loading: true}
        } else{
           return data
        }
      })
      setFormData({ ...formData,  collection: {...formData.collection, images: update} });
    } else if(type === "banners"){
      let update = formData?.banners?.map((data, ind)=> {
        if(ind === index){
          return {...data, loading: true}
        } else{
           return data
        }
      })
      setFormData({ ...formData,  banners: update });
    } else if(type === "barcode"){
      setFormData({  ...formData, barcode: {src: '', loading: true} });
    }
    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        if(type === "collection"){
          let update = formData?.collection?.images?.map((data, ind)=> {
            if(ind === index){
              return {src: res.data.url, loading: false}
            } else{
               return data
            }
          })
          setFormData({ 
            ...formData, 
            collection: {...formData.collection, images: update}
          });
        } else if(type === "banners"){
          let update = formData?.banners?.map((data, ind)=> {
            if(ind === index){
              return {...data, src: res.data.url, loading: false}
            } else{
               return data
            }
          })
          setFormData({ ...formData,  banners: update });
        } else if(type === "barcode"){
          setFormData({ 
            ...formData, 
            barcode: {src: res.data.url, loading: false} 
          });
        }
      }
    });
  };

  const catalogHandler = (e, index) => {
    if(e.target.files?.length === 0){
      return
    }
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);
    let update = formData?.banners?.map((data, ind)=> {
      if(ind === index){
        return {...data, loading: true}
      } else{
         return data
      }
    })
    setFormData({ ...formData,  banners: update });
    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        let update = formData?.banners?.map((data, ind)=> {
          if(ind === index){
            return {...data, catalog: res.data.url, loading: false}
          } else{
             return data
          }
        })
        setFormData({ 
          ...formData, 
          banners: update
        });
      }
    });
  };

  const handleCollection = (e) =>{
    e.preventDefault();

    setCollectionLoading(true);
    let data = {
      images: formData?.collection?.images?.filter(res=> !!res?.src)?.map(res=> res?.src),
      description: draftToHtml(convertToRaw(formData?.collection?.description.getCurrentContent()))
    };

    homeService.createCollection(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Collection Added Successfully");
      }
      setCollectionLoading(false);
    }).catch(()=> setCollectionLoading(false));
  }

  const handleBanners = (e) =>{
    e.preventDefault();

    setBannersLoading(true);
    let data = {
      banners: formData?.banners?.filter(res=> !!res.src)?.map(res=> {
        return {
          tags: res.tags?.filter(res => !!res),
          catalog: res.catalog,
          description: res.description,
          title: res.title,
          image: res.src
        }
      })
    };

    if(editBanners){
      homeService.update(data)?.then((res) => {
        if (res?.status === 200) {
          toast.success("Banners Updated Successfully");
        }
        setBannersLoading(false);
      }).catch(()=> setBannersLoading(false));
    } else {
      bannerService.create(data)?.then((res) => {
        if (res?.status === 201) {
          toast.success("Banners Added Successfully");
        }
        setBannersLoading(false);
      }).catch(()=> setBannersLoading(false));
    }
  }

  const handleBarcode = (e) =>{
    e.preventDefault();

    setBarcodeLoading(true);
    let data = {
      url: formData?.barcode?.src
    };

    homeService.createBarcode(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Barcode Added Successfully");
      }
      setBarcodeLoading(false);
    }).catch(()=> setBarcodeLoading(false));
  }

  const deleteBannerImg = (index) => {
    let update = formData?.banners?.map((info, ind)=>{
      if(ind === index){
        return {
          ...info,
          src: "",
        }
      } else{
        return { ...info }
      }
    })
    setFormData({...formData, banners: update})
  }

  const deleteBannerCatalog = (index) => {
    let update = formData?.banners?.map((info, ind)=>{
      if(ind === index){
        return {
          ...info,
          catalog: ""
        }
      } else{
        return { ...info }
      }
    })
    setFormData({...formData, banners: update})
  }


  const deleteImg = (index) => {
    let update = formData?.collection?.images?.map((info, ind)=>{
      if(index === ind){
        return {loading: false, src: "" }
      } else{
        return { ...info }
      }
    })
    setFormData({...formData, collection: {...formData.collection, images: update}})
  }

  return <div className="home">
    <Card>
      <Card.Body>
        <AvForm onValidSubmit={handleBanners}>
         <div className="banners mt-3">
            <h3>{Translate[lang]?.banners}</h3>
            <div className="mt-4">
                {formData?.banners?.map((banner, index)=> {
                    return <div className="row" key={index}> 
                      <div className="col-lg-12 col-sm-12 mb-3">
                        <div className="image-placeholder">
                          <div className="avatar-edit w-100 h-100">
                            <input
                              type="file"
                              className="w-100 h-100 d-block cursor-pointer"
                              style={{opacity: '0'}}
                              onChange={(e) => fileHandler(e, index, "banners")}
                              id={`imageUpload-${index}`}
                            />
                          </div>
                          <button
                        className="delete-img"
                        type="button"
                        style={{
                          left: lang === 'ar' ? '-13px' : "auto",
                          right: lang === 'en' ? '-13px' : "auto",
                        }}
                        onClick={() => deleteBannerImg(index)}
                      >
                        <i className="la la-trash text-danger"></i>
                      </button>
                          <div className="avatar-preview h-25rem">
                            {!!banner.src ? (
                              <div id={`imagePreview-${index}`}>
                                <img
                                  id={`saveImageFile-${index}`}
                                  src={banner?.src}
                                  alt="icon"
                                />
                              </div>
                            ) : (
                              <div id={`imagePreview-${index}`}>
                                {(!banner.src && banner.loading)  && <Loader></Loader>}
                                {(!banner?.src && !banner.loading) && (
                                  <img
                                    id={`saveImageFile-${index}`}
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
                      <div className="col-lg-12 col-sm-12 mb-3">
                        <AvField
                          label ={Translate[lang]?.title}
                          name ='title'
                          type='text'
                          value={banner?.title}
                          errorMessage="Please enter a valid Title"
                          placeholder={Translate[lang]?.title}
                          onChange={(e)=> {
                            let data = e.target.value
                            let update = formData?.banners?.map((info, ind)=>{
                              if(ind === index){
                                return {
                                  ...info,
                                  title: data
                                }
                              } else{
                                return { ...info }
                              }
                            })
                            setFormData({...formData, banners: update})
                          }}
                        />
                      </div>
                      <div className="col-lg-12 col-sm-12 mb-3">
                        <AvField
                          label ={Translate[lang]?.description}
                          name ='description'
                          type='textarea'
                          className='mb-5'
                          value={banner?.description}
                          errorMessage="Please enter a valid Description"
                          placeholder={Translate[lang]?.description}
                          onChange={(e)=> {
                            let data = e.target.value
                            let update = formData?.banners?.map((info, ind)=>{
                              if(ind === index){
                                return {
                                  ...info,
                                  description: data
                                }
                              } else{
                                return { ...info }
                              }
                            })
                            setFormData({...formData, banners: update})
                          }}
                        />
                      </div>
                      <div className="col-lg-3 col-sm-3 mb-3">
                        <label>{Translate[lang].catalog}</label>
                        <div className="image-placeholder">
                          <div className="avatar-edit w-100 h-100">
                            <input
                              type="file"
                              className="w-100 h-100 d-block cursor-pointer"
                              accept=".pdf"
                              style={{opacity: '0'}}
                              onChange={(e) => catalogHandler(e, index)}
                              id={`imageUpload-${index}`}
                            />
                          </div>
                          <button
                        className="delete-img"
                        type="button"
                        style={{
                          left: lang === 'ar' ? '-13px' : "auto",
                          right: lang === 'en' ? '-13px' : "auto",
                        }}
                        onClick={() => deleteBannerCatalog(index)}
                      >
                        <i className="la la-trash text-danger"></i>
                      </button>
                          <div className="avatar-preview banner h-10rem">
                            {!!banner.catalog ? (
                              <div id={`imagePreview-${index}`}>
                                <i className="la la-file-pdf" style={{fontSize: '8rem'}}></i>
                              </div>
                            ) : (
                              <div id={`imagePreview-${index}`}>
                                {(!banner.catalog && banner.loading)  && <Loader></Loader>}
                                {!banner?.catalog && (
                                  <img
                                    id={`saveImageFile-${index}`}
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
                      <div className="col-lg-12 col-sm-12 mb-3">{Translate[lang]?.tags}:</div>
                      {banner?.tags?.map((tag, ind) =>{
                        return <div className="col-lg-3 col-sm-6 mb-3" key={ind}>
                        <AvField
                          label={`${Translate[lang]?.tag} ${ind+1} :`}
                          name ={`tag${ind}`}
                          type='text'
                          value={tag}
                          placeholder={Translate[lang]?.tag}
                          onChange={(e)=> {
                            let data = e.target.value
                            let update = formData?.banners?.map((ban,i)=>{
                              if(index === i){
                                return {
                                  ...ban,
                                  tags: ban.tags?.map((tag, inde)=>{
                                    if(ind === inde){
                                      return data
                                    } else{
                                      return tag
                                    }
                                  })
                                }
                              } else {
                                return ban
                              }
                            })
                            setFormData({...formData, banners: update})
                          }}
                        />
                      </div>
                      })}
                      {banner.tags?.length < 6 && 
                        <div className="col-lg-3 col-sm-6 " style={{display: 'contents'}}>
                          <Button  style={{height: 'fit-content', margin: 'auto 12px'}} variant="secondary" onClick={()=>{
                            let update = formData.banners?.map((res,ind)=>{
                              if(ind === index){
                                return {
                                  ...res,
                                  tags: [...res.tags, ""]
                                }
                              } else {
                                return res
                              }
                            })
                            setFormData({...formData, banners: update})
                          }}>
                            + {Translate[lang].add} {Translate[lang].tags}
                          </Button>
                        </div>}
                      <hr/>
                  </div>
                })}
                <div className="col-lg-12 col-sm-12 d-flex" style={{
                    alignItems: "center", justifyContent: "center"
                }}>
                    <div className="add-client">
                        <i className="la la-plus cursor-pointer" onClick={()=>{
                            setFormData({...formData, banners: [...formData.banners, { src: "", title: "",catalog: '', description: "", tags: ["", "", "", "", "", ""], loading: false }]})
                        }}></i>
                    </div>
                </div>
            </div>
         </div>
    
         {isExist('home') && <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={bannersLoading}>{Translate[lang]?.submit}</Button>
         </div>}
        </AvForm>
      </Card.Body>
    </Card>

    <Card>
        <Card.Body>
        <AvForm onValidSubmit={handleCollection}>
         <div className="row branding-description">
             <h3>{Translate[lang]?.collection}</h3>
            <div className="col-lg-12 col-sm-12 mb-3">
              <label>{Translate[lang]?.description}</label>
              <Editor
                editorState ={formData?.collection.description}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => {
                  setFormData({...formData, collection: {...formData.collection, description: e}})
                }}
              />

            </div>
            <div className="col-lg-12 col-sm-12 mb-1">
              <label>{Translate[lang]?.images}</label>
            </div>
            {formData?.collection?.images?.map((img, index)=> {
                    return <div className="col-lg-3 col-sm-4 mb-3" key={index}>
                    <div className="image-placeholder w-100">
                      <div className="avatar-edit w-100 h-100">
                        <input
                          type="file"
                          className="w-100 h-100 d-block cursor-pointer"
                          style={{opacity: '0'}}
                          onChange={(e) => fileHandler(e, index, "collection")}
                          id={`imageUpload-${index}`}
                        />
                      </div>
                      {!!img?.src && <button
                        className="delete-img"
                        type="button"
                        style={{
                          left: lang === 'ar' ? '-13px' : "auto",
                          right: lang === 'en' ? '-13px' : "auto",
                        }}
                        onClick={() => deleteImg(index)}
                      >
                        <i className="la la-trash text-danger"></i>
                      </button>}
                      <div className="avatar-preview h-10rem w-100">
                        {!!img.src ? (
                          <div>
                            <img
                              src={img?.src}
                              alt="icon"
                            />
                          </div>
                        ) : (
                          <div>
                            {(!img.src && img.loading)  && <Loader></Loader>}
                            {(!img?.src && !img.loading) && (
                              <img
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
                })}
         </div>
         <div className="d-flex justify-content-between mt-2">
            <Button variant="primary" type="submit" disabled={collectionLoading}>{Translate[lang]?.submit}</Button>
         </div>
         </AvForm>
      </Card.Body>
    </Card>

    <Card>
      <Card.Body>
        <AvForm onValidSubmit={handleBarcode}>
         <div className="our-clients">
            <h3>{Translate[lang]?.barcode}</h3>
            <div className="row">
              <div className="col-lg-2 col-sm-4">
                    <div className="image-placeholder">
                      <div className="avatar-edit w-100 h-100">
                        <input
                          type="file"
                          className="w-100 h-100 d-block cursor-pointer"
                          style={{opacity: '0'}}
                          onChange={(e) => fileHandler(e, 0, "barcode")}
                        />
                      </div>
                      {!!formData.barcode?.src && <button
                        className="delete-img"
                        type="button"
                        style={{
                          left: lang === 'ar' ? '-13px' : "auto",
                          right: lang === 'en' ? '-13px' : "auto",
                        }}
                        onClick={() => {
                          setFormData({...formData, barcode: {...formData.barcode, src: ''}})
                        }}
                      >
                        <i className="la la-trash text-danger"></i>
                      </button>}
                      <div className="avatar-preview">
                        {!!formData.barcode?.src ? (
                          <div>
                            <img
                              src={formData.barcode?.src}
                              alt="icon"
                            />
                          </div>
                        ) : (
                          <div>
                            {(!formData.barcode?.src && formData.barcode?.loading)  && <Loader></Loader>}
                            {(!formData.barcode?.src && !formData.barcode?.loading) && (
                              <img
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
            </div>
         </div>
    
         {isExist('home') &&<div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={barcodeLoading}>{Translate[lang]?.submit}</Button>
         </div>}
        </AvForm>
      </Card.Body>
    </Card>
    </div>
}
export default HomePage;