import { Button, Card } from "react-bootstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Translate } from "../../../Enums/Tranlate";
import Loader from "../../../common/Loader";
import uploadImg from "../../../../images/upload-img.png";
import "./style.scss";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import ClientsService from "../../../../services/ClientsService";
import BaseService from "../../../../services/BaseService";
import { toast } from "react-toastify";
import PartnersService from "../../../../services/PartnersService";
import HomeTextService from "../../../../services/HomeTextService";
import AboutService from "../../../../services/AboutService";
import ServicesService from "../../../../services/ServicesService";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'draft-js/dist/Draft.css';

const Page = () => {
  const homeTextService = new HomeTextService()
  const clientsService = new ClientsService()
  const partnersService = new PartnersService()
  const aboutService = new AboutService()
  const servicesService = new ServicesService()
  const [formData, setFormData] = useState({
        banner_title: "",
        about: {
            description: EditorState.createEmpty(),
            img: { src: "", loading: false }
        },
        services: [
            {title: "Branding and Identity Design", description: EditorState.createEmpty(), service_text: [""]},
            {title: "Website Design and Development", description: EditorState.createEmpty(), service_text: [""]},
            {title: "Advertising and Marketing Campaigns", description: EditorState.createEmpty(), service_text: [""]},
        ],
        our_clients: [
            { src: "", loading: false },
            { src: "", loading: false },
            { src: "", loading: false },
            { src: "", loading: false },
            { src: "", loading: false },
        ],
        our_partners: [
            { src: "", loading: false },
            { src: "", loading: false },
            { src: "", loading: false },
            { src: "", loading: false },
            { src: "", loading: false },
        ]
  })
  const [loading, setLoading] = useState(false)
  const [clientsLoading, setClientsLoading] = useState(false)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [aboutLoading, setAboutLoading] = useState(false)
  const lang = useSelector((state) => state.auth?.lang);

  useEffect(()=>{
    let bannerTitle = homeTextService?.getList()
    let clients = clientsService?.getList()
    let partners = partnersService?.getList()
    let about = aboutService?.getList()
    let services = servicesService?.getList()

    Promise.all([bannerTitle, clients, partners, about, services]).then(res=>{
      let data = {}
      if(res[0]?.status === 200){
        data['banner_title'] = res[0]?.data?.data?.title;
      }

      if(res[1]?.status === 200){
        data['our_clients'] = Array.from({ length: 5 }, (_, index) => {
          let arr = res[1]?.data?.data;
          if(arr[index]){
            return {id: arr[index]?.id, src: arr[index]?.image, loading: false }
          } else {
            return { src: "", loading: false }
          }
        })
      }

      if(res[2]?.status === 200){
        data['our_partners'] = Array.from({ length: 5 }, (_, index) => {
          let arr = res[2]?.data?.data;
          if(arr[index]){
            return {id: arr[index]?.id, src: arr[index]?.image, loading: false }
          } else {
            return { src: "", loading: false }
          }
        })
      }
      if(res[3]?.status === 200){
        data['about'] = {
          description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(res[3]?.data?.data?.description))),
          img: {src: res[3]?.data?.data?.image, loading: false}
        }
      }
      if(res[4]?.status === 200){
        data['services'] = res[4]?.data?.data?.map(item=>{
          return {
            title: item?.title,
            description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(item?.description))),
            service_text: item?.service_texts?.length === 0 ? [""] : item?.service_texts?.map(txt=> txt?.text)
          }
        })
      }
      setFormData({...formData, ...data})
    }).catch(error => {
      console.log(error);
    });
  }, [])

  const fileHandler = (e, index, type) => {
    if(e.target.files?.length === 0){
      return
    }
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);
    if(type === "clients"){
      let update = formData?.our_clients?.map((data, ind)=> {
        if(ind === index){
          return {src: "", loading: true}
        } else{
           return data
        }
      })
      setFormData({ ...formData,  our_clients: update });
    } else if(type === "partners"){
      let update = formData?.our_partners?.map((data, ind)=> {
        if(ind === index){
          return {src: "", loading: true}
        } else{
           return data
        }
      })
      setFormData({  ...formData, our_partners: update });
    } else {
      setFormData({ 
        ...formData, 
        about: {...formData.about, img: {src: "", loading: true}}
      });
    }
    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        if(type === "clients"){
          let update = formData?.our_clients?.map((data, ind)=> {
            if(ind === index){
              return {src: res.data.url, loading: false}
            } else{
               return data
            }
          })
          setFormData({ 
            ...formData, 
            our_clients: update
          });
        } else if(type === "partners"){
          let update = formData?.our_partners?.map((data, ind)=> {
            if(ind === index){
              return {src: res.data.url, loading: false}
            } else{
               return data
            }
          })
          setFormData({ 
            ...formData, 
            our_partners: update 
          });
        } else {
          setFormData({ 
            ...formData, 
            about: {...formData.about, img: {src: res.data.url, loading: false}}
          });
        }
      }
    });
  };

  const onSubmit = (e) =>{
    e.preventDefault();

    setLoading(true);
    let data = {
      service: formData?.services?.map(ser=>{
        return{
          ...ser,
          description: draftToHtml(convertToRaw(ser?.description.getCurrentContent()))
        }
      })
    };

    servicesService.create(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Services Added Successfully");
      }
      setLoading(false);
    }).catch(()=> setLoading(false));
  }

  const handleHomeText = (e) =>{
    e.preventDefault();

    setLoading(true);
    let data = {
      title: formData.banner_title
    };

    homeTextService.create(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Banner Title Added Successfully");
      }
      setLoading(false);
    }).catch(()=> setLoading(false));
  }

  const handleClients = (e) =>{
    e.preventDefault();

    setClientsLoading(true);
    let data = {
      images: formData?.our_clients?.filter(res=> !!res.src)?.map(res=> res?.src)
    };

    clientsService.create(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Clients Added Successfully");
      }
      setClientsLoading(false);
    }).catch(()=> setClientsLoading(false));
  }

  const deleteClientImg = (id) =>{  
    setClientsLoading(true);

    clientsService.remove(id)?.then((res) => {
      if (res?.status === 200) {
        toast.success("Image Removed Successfully");
        let update = formData?.our_clients?.map((data, ind)=> {
          if(data.id === id){
            return {src: "", loading: false}
          } else{
             return data
          }
        })
        setFormData({ ...formData,  our_clients: update });
      }
      setClientsLoading(false);
    }).catch(()=> setClientsLoading(false));
  }
  const deletePartnerImg = (id) =>{  
    setPartnersLoading(true);

    partnersService.remove(id)?.then((res) => {
      if (res?.status === 200) {
        toast.success("Image Removed Successfully");
        let update = formData?.our_partners?.map((data, ind)=> {
          if(data.id === id){
            return {src: "", loading: false}
          } else{
             return data
          }
        })
        setFormData({ ...formData,  our_partners: update });
      }
      setPartnersLoading(false);
    }).catch(()=> setPartnersLoading(false));
  }

  const handlePartners = (e) =>{
    e.preventDefault();

    setPartnersLoading(true);
    let data = {
      images: formData?.our_partners?.filter(res=> !!res.src)?.map(res=> res?.src)
    };

    partnersService.create(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Partners Added Successfully");
      }
      setPartnersLoading(false);
    }).catch(()=> setPartnersLoading(false));
  }

  const handleAbout = (e) =>{
    e.preventDefault();

    setAboutLoading(true);
    let data = {
      description: draftToHtml(convertToRaw(formData?.about?.description.getCurrentContent())),
      image: formData?.about?.img?.src
    };

    aboutService.create(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("About Data Added Successfully");
      }
      setAboutLoading(false);
    }).catch(()=> setAboutLoading(false));
  }

  return <>
    <Card>
        <Card.Body>
        <AvForm onValidSubmit={handleHomeText}>
         <div className="row">
             <h3>{Translate[lang]?.banner}</h3>
            <div className="col-lg-12 col-sm-12 mb-3">
               <AvField
                  label ={Translate[lang]?.title}
                  name ='title'
                  type='text'
                  value={formData?.banner_title}
                  errorMessage="Please enter a valid Title"
                  validate={{
                    required: {
                      value:true,
                      errorMessage: Translate[lang].field_required
                    },
                  }}
                  placeholder={Translate[lang]?.title}
                  onChange={(e)=> setFormData({...formData, banner_title: e.target.value})}
				        />
            </div>
         </div>
         <div className="d-flex justify-content-between mt-2">
            <Button variant="primary" type="submit" disabled={loading}>{Translate[lang]?.submit}</Button>
         </div>
         </AvForm>
      </Card.Body>
    </Card>

    <Card>
        <Card.Body>
        <AvForm onValidSubmit={handleAbout}>
         <div>
            <h3>{Translate[lang]?.about}</h3>
            <div className="row mt-3">
                <div className="col-lg-6 col-sm-12 mb-3">
                    <label className="d-block">{Translate[lang]?.description}</label>
                    <Editor
                      editorState ={formData?.about?.description}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={(e) => {
                        setFormData({...formData, about: {...formData?.about, description: e}})
                      }}
                    />
                    {/* <textarea
                        name ='about_title'
                        value={formData?.about?.description}
                        required
                        className="w-100"
                        placeholder={Translate[lang]?.description}
                        onChange={(e)=> {
                          setFormData({...formData, about: {...formData?.about, description: e.target.value}})
                        }}
                        style={{
                            minHeight: '400px', padding: '8px',
                            border: '1px solid #dedede', borderRadius: '5px'
                        }}
                    /> */}
                </div>
                <div className="col-lg-6 col-sm-12 mb-3">
                    <label className="d-block">{Translate[lang]?.image}</label>
                    <div className="image-placeholder" style={{maxWidth: '100%'}}>
                  <div className="avatar-edit w-100 h-100">
                    <input
                      type="file"
                      className="w-100 h-100 d-block cursor-pointer"
                      style={{opacity: '0'}}
                      onChange={(e) => {
                        fileHandler(e);
                      }}
                      id={`imageUpload`}
                    />
                    {/* <label htmlFor={`imageUpload`} name=""></label> */}
                  </div>
                  {formData?.about?.img.src && (
                    <button
                      className="delete-img"
                      type="button"
                      style={{
                        left: lang === 'ar' ? '-13px' : "auto",
                        right: lang === 'en' ? '-13px' : "auto",
                      }}
                    //   onClick={() => deleteBannar(index, data.id)}
                    >
                      <i className="la la-trash text-danger"></i>
                    </button>
                  )}
                  <div className="avatar-preview w-100" style={{height: "400px"}}>
                    <div>
                    {!!formData?.about?.img.src && (
                          <div id={`imagePreview`}>
                            <img
                              id={`saveImageFile`}
                              src={formData?.about?.img?.src}
                              alt="icon"
                            />
                          </div>
                        )}
                      {(!formData?.about?.img.src && formData?.about?.img.loading)  && <Loader></Loader>}
                      {!formData?.about?.img?.src && !formData?.about?.img.loading && (
                        <img
                          id={`saveImageFile`}
                          src={uploadImg}
                          alt="icon"
                          style={{
                            width: "80px",
                            height: "80px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                </div>
            </div>
         </div>
         <div className="d-flex justify-content-between mt-2">
            <Button variant="primary" type="submit" disabled={aboutLoading}>{Translate[lang]?.submit}</Button>
         </div>
         </AvForm>
      </Card.Body>
    </Card>
  
    <Card>
        <Card.Body>
        <AvForm onValidSubmit={onSubmit}>
         <div className="mt-3">
            <h3>{Translate[lang]?.services}</h3>
            <div className="row mt-4">
              {formData?.services?.map((service, index)=>{
                return <div key={index} className="col-lg-4 col-sm-12 mb-3">
                  <label className="mb-3">{service?.title}</label>
                  <Editor
                      editorState ={service?.description}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={(e) => {
                        let update = formData?.services?.map((res, ind)=>{
                          if(index === ind){
                            return {
                              ...res,
                              description: e
                            }
                          } else {
                            return res
                          }
                        })
                        setFormData({...formData, services: update})
                  }}
                  />
                  {/*<textarea
                      name ='description'
                      value={service?.description}
                      required
                      className="w-100"
                      placeholder={Translate[lang]?.description}
                      onChange={(e)=> {
                        let update = formData?.services?.map((res, ind)=>{
                          if(index === ind){
                            return {
                              ...res,
                              description: e.target.value
                            }
                          } else {
                            return res
                          }
                        })
                        setFormData({...formData, services: update})
                      }}
                      style={{
                          minHeight: '250px', padding: '8px',
                          border: '1px solid #dedede', borderRadius: '5px'
                      }}
                    />*/}
                  
                  <label className="mt-3">Servicrs List</label>
                  {service?.service_text?.map((item, i)=>{
                    return <AvField
                    name ={`service_text${i}`}
                    type='text'
                    key={i}
                    value={item}
                    errorMessage="Please enter a valid Title"
                    placeholder={Translate[lang]?.title}
                    onChange={(e)=>{
                      let update = formData?.services?.map((res, ind)=>{
                        if(index === ind){
                          res.service_text[i]= e.target.value
                          return {
                            ...res,
                          }
                        } else {
                          return res
                        }
                      })
                      setFormData({...formData, services: update})
                    }}
                  />
                  })}
                  <Button 
                    variant="secondary"
                    onClick={()=> {
                      let update = formData?.services?.map((res, ind)=>{
                        if(index === ind){
                          return {
                            ...res,
                            service_text: [...res.service_text, ""]
                          }
                        } else {
                          return res
                        }
                      })
                      setFormData({...formData, services: update})
                    }}
                  >
                    {Translate[lang].add_new_value}
                  </Button>
              </div>
              })}
            </div>
         </div>
         <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={loading}>{Translate[lang]?.submit}</Button>
         </div>
         </AvForm>
      </Card.Body>
    </Card>

    <Card>
      <Card.Body>
        <AvForm onValidSubmit={handleClients}>
         <div className="our-clients mt-3">
            <h3>{Translate[lang]?.our_clients}</h3>
            <div className="row mt-4">
                {formData?.our_clients?.map((client, index)=> {
                    return <div className="col-lg-2 col-sm-4 mb-3" key={index}>
                    <div className="image-placeholder">
                      <div className="avatar-edit w-100 h-100">
                        <input
                          type="file"
                          className="w-100 h-100 d-block cursor-pointer"
                          style={{opacity: '0'}}
                          onChange={(e) => fileHandler(e, index, 'clients')}
                          id={`imageUpload${index}`}
                        />
                        {/* <label htmlFor={`imageUpload${index}`} name=""></label> */}
                      </div>
                      {!!client?.id && <button
                        className="delete-img"
                        type="button"
                        style={{
                          left: lang === 'ar' ? '-13px' : "auto",
                          right: lang === 'en' ? '-13px' : "auto",
                        }}
                        onClick={() => deleteClientImg(client?.id)}
                      >
                        <i className="la la-trash"></i>
                      </button>}
                      <div className="avatar-preview">
                        {!!client.src ? (
                          <div id={`imagePreview${index}`}>
                            <img
                              id={`saveImageFile${index}`}
                              src={client?.src}
                              alt="icon"
                            />
                          </div>
                        ) : (
                          <div id={`imagePreview${index}`}>
                            {(!client.src && client.loading)  && <Loader></Loader>}
                            {(!client?.src && !client.loading) && (
                              <img
                                id={`saveImageFile${index}`}
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
                <div className="col-lg-2 col-sm-4 d-flex" style={{
                    alignItems: "center", justifyContent: "center"
                }}>
                    <div className="add-client">
                        <i className="la la-plus cursor-pointer" onClick={()=>{
                            setFormData({...formData, our_clients: [...formData.our_clients, { src: "", loading: false }]})
                        }}></i>
                    </div>
                </div>
            </div>
         </div>

         <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={clientsLoading}>{Translate[lang]?.submit}</Button>
         </div>
         </AvForm>
      </Card.Body>
    </Card>

    <Card>
      <Card.Body>
        <AvForm onValidSubmit={handlePartners}>
         <div className="our-clients mt-3">
            <h3>{Translate[lang]?.our_partners}</h3>
            <div className="row mt-4">
                {formData?.our_partners?.map((partner, index)=> {
                    return <div className="col-lg-2 col-sm-4 mb-3" key={index}>
                    <div className="image-placeholder">
                      <div className="avatar-edit w-100 h-100">
                        <input
                          type="file"
                          className="w-100 h-100 d-block cursor-pointer"
                          style={{opacity: '0'}}
                          onChange={(e) => fileHandler(e, index, "partners")}
                          id={`imageUpload-${index}`}
                        />
                        {/* <label htmlFor={`imageUpload-${index}`} name=""></label> */}
                      </div>
                      {!!partner?.id && <button
                        className="delete-img"
                        type="button"
                        style={{
                          left: lang === 'ar' ? '-13px' : "auto",
                          right: lang === 'en' ? '-13px' : "auto",
                        }}
                        onClick={() => deletePartnerImg(partner?.id)}
                      >
                        <i className="la la-trash"></i>
                      </button>}
                      <div className="avatar-preview">
                        {!!partner.src ? (
                          <div id={`imagePreview-${index}`}>
                            <img
                              id={`saveImageFile-${index}`}
                              src={partner?.src}
                              alt="icon"
                            />
                          </div>
                        ) : (
                          <div id={`imagePreview-${index}`}>
                            {(!partner.src && partner.loading)  && <Loader></Loader>}
                            {!partner?.src && (
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
                })}
                <div className="col-lg-2 col-sm-4 d-flex" style={{
                    alignItems: "center", justifyContent: "center"
                }}>
                    <div className="add-client">
                        <i className="la la-plus cursor-pointer" onClick={()=>{
                            setFormData({...formData, our_partners: [...formData.our_partners, { src: "", loading: false }]})
                        }}></i>
                    </div>
                </div>
            </div>
         </div>
    
         <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={partnersLoading}>{Translate[lang]?.submit}</Button>
         </div>
        </AvForm>
      </Card.Body>
    </Card>
    </>
}
export default Page;