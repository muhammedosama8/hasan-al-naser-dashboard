import { Button, Card } from "react-bootstrap";
import { AvForm} from "availity-reactstrap-validation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Translate } from "../../Enums/Tranlate";
import Loader from "../../common/Loader";
import uploadImg from "../../../images/upload-img.png";
import BaseService from "../../../services/BaseService";
import { toast } from "react-toastify";
import MarketingService from "../../../services/MarketingService";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'draft-js/dist/Draft.css';
const Marketing = () => {
  const [formData, setFormData] = useState({
        description: EditorState.createEmpty(),
        services: [
            {title: "Design", description: EditorState.createEmpty()},
            {title: "Marketing", description: EditorState.createEmpty()},
            {title: "Developing", description: EditorState.createEmpty()},
            {title: "Services Description", description: EditorState.createEmpty()},
        ],
        video: { src: "", loading: false }
  })
  const [loading, setLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const lang = useSelector((state) => state.auth?.lang);
  const marketingService = new MarketingService()
  const Auth = useSelector(state=> state.auth?.auth)
  const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

  useEffect(()=>{
    let bannerDescription = marketingService?.getBanners()
    let services = marketingService?.getServices()
    let video = marketingService?.getVideo()

    Promise.all([bannerDescription, services, video]).then(res=>{
      let data = {}
      if(res[0]?.status === 200){
        data['description'] = EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(res[0]?.data?.data?.description)));
      }

      if(res[1]?.status === 200){
        data['services'] = res[1]?.data?.data?.map(item=>{
          return {
            title: item?.title,
            description: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(item?.description))),
          }
        })
      }

      if(res[2]?.status === 200){
        data['video'] =  { src: res[2]?.data?.data?.video, loading: false}
      }

      setFormData({...formData, ...data})
    }).catch(error => {
      console.log(error);
    });
  }, [])

  const fileHandler = (e) => {
    if(e.target.files?.length === 0){
      return
    }
    let filesAll = e.target.files;
    const filesData = Object.values(filesAll);

    setFormData({ ...formData, video: { src: "", loading: true } });

    new BaseService().postUpload(filesData[0]).then((res) => {
      if (res?.data?.status) {
        setFormData({ 
          ...formData, 
          video: {src: res.data.url, loading: false}
        });
      }
    });
  };

  const onSubmit = (e) =>{
    e.preventDefault();

    if(!formData?.services[0]?.description || 
      !formData?.services[1]?.description ||
      !formData?.services[2]?.description){
      toast.error('Descriptions required')
      return
    }
    setServicesLoading(true);
    let data = {
      service: formData?.services?.map(ser=>{
        return{
          ...ser,
          description: draftToHtml(convertToRaw(ser?.description.getCurrentContent()))
        }
      })
    };

    marketingService.createServices(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Services Added Successfully");
      }
      setLoading(false);
    }).catch(()=> setLoading(false));
  }

  const handleBanner = (e) =>{
    e.preventDefault();

    setLoading(true);
    let data = {
      description: draftToHtml(convertToRaw(formData?.description.getCurrentContent()))
    };

    marketingService.createBanners(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Banner Description Added Successfully");
      }
      setLoading(false);
    }).catch(()=> setLoading(false));
  }

  const handleVideo = (e) =>{
    e.preventDefault();

    setVideoLoading(true);
    let data = {
      video: formData?.video?.src
    };

    marketingService.createVideo(data)?.then((res) => {
      if (res?.status === 201) {
        toast.success("Video Added Successfully");
      }
      setVideoLoading(false);
    }).catch(()=> setVideoLoading(false));
  }

  const handleAbout = (e) =>{
  //   e.preventDefault();

  //   setAboutLoading(true);
  //   let data = {
  //     description: formData?.about?.description,
  //     image: formData?.about?.img?.src
  //   };

  //   aboutService.create(data)?.then((res) => {
  //     if (res?.status === 201) {
  //       toast.success("About Data Added Successfully");
  //     }
  //     setAboutLoading(false);
  //   }).catch(()=> setAboutLoading(false));
  }

  return <>
    <Card>
        <Card.Body>
        <AvForm onValidSubmit={handleBanner}>
         <div className="row">
             <h3>{Translate[lang]?.banner}</h3>
            <div className="col-lg-12 col-sm-12 mb-3">
              <label>{Translate[lang]?.description}</label>
              <Editor
                      editorState ={formData?.description}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName w-50"
                      editorClassName="editorClassName"
                      onEditorStateChange={(e) => {
                        setFormData({...formData, description: e})
                      }}
              />
            </div>
         </div>
        {isExist('marketing') &&  <div className="d-flex justify-content-between mt-2">
            <Button variant="primary" type="submit" disabled={loading}>{Translate[lang]?.submit}</Button>
         </div>}
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
                return <div className={`${index === 3 ? 'col-md-12 col-sm-12' : 'col-lg-4 col-sm-12'} mb-3`}>
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
              </div>
              })}
              {/* <div className="col-lg-12 col-sm-12 mb-3">
              <label>{Translate[lang]?.services} {Translate[lang]?.description}</label>
               <textarea
                  value={formData?.banner_description}
                  className='d-block w-75'
                  style={{
                    height: '200px',
                    maxHeight: '200px',
                    borderColor: '#dedede',
                    borderRadius: '5px',
                    padding: '8px'
                  }}
                  required
                  errorMessage="Please enter a valid description"
                  validate={{
                    required: {
                      value:true,
                      errorMessage: Translate[lang].field_required
                    },
                  }}
                  placeholder={Translate[lang]?.description}
                  onChange={(e)=> setFormData({...formData, banner_description: e.target.value})}
				        />
            </div> */}
            </div>
         </div>
         {isExist('marketing') && <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={servicesLoading}>{Translate[lang]?.submit}</Button>
         </div>}
         </AvForm>
      </Card.Body>
    </Card>

    <Card>
      <Card.Body>
        <AvForm onValidSubmit={handleVideo}>
         <div className="mt-3">
            <h3>{Translate[lang]?.video}</h3>
            <div className="row mt-4">
              <div className="col-lg-12 col-sm-12 mb-3">
                  <div className="image-placeholder" style={{maxWidth: '100%'}}>
                      <div className="avatar-edit w-100 h-100">
                        <input
                          type="file"
                          className="w-100 h-100 d-block cursor-pointer"
                          style={{opacity: '0'}}
                          accept="video/*"
                          onChange={(e) => fileHandler(e)}
                          id={`imageUpload`}
                        />
                      </div>

                      <div className="avatar-preview w-100 h-25rem" style={{height: "25rem !important"}}>
                        <div id={`imagePreview`}>
                            {(!formData?.video.src && formData?.video.loading)  && <Loader></Loader>}
                            {!formData?.video.loading && <img
                              id={`saveImageFile`}
                              src={uploadImg}
                              alt="icon"
                              style={{
                                width: "60px",
                                height: "60px",
                              }}
                            />}
                        </div>
                    </div>
                  </div>
                  <div>
                    {!!formData?.video?.src && <video controls className="w-100">
                      <source src={formData?.video?.src} type="video/webm" />
                      <source src={formData?.video?.src} type="video/mp4" />
                    </video>}
                  </div>
            </div>
         </div>
         </div>

         {isExist('marketing') && <div className="d-flex justify-content-between mt-4">
            <Button variant="primary" type="submit" disabled={videoLoading}>{Translate[lang]?.submit}</Button>
         </div>}
         </AvForm>
      </Card.Body>
    </Card>
    </>
}
export default Marketing;