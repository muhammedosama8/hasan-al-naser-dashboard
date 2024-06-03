import { Button, Card } from "react-bootstrap"
import {AvField, AvForm} from "availity-reactstrap-validation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Translate } from "../../Enums/Tranlate";
import PixelService from "../../../services/PixelService";
import { toast } from "react-toastify";

const Pixel = () => {
    const [formData, setFormData] = useState({
        snap_chat_pixel: "",
        meta_pixel: "",
        google_analytics: "",
  })
  const [loading, setLoading] = useState(false)
  const lang = useSelector((state) => state.auth?.lang);
  const Auth = useSelector(state=> state.auth?.auth)
  const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
  const pixelService = new PixelService()

  useEffect(()=>{
    setLoading(true)
    pixelService.getList().then(res=>{
        if(res?.status === 200){
            if(res?.data?.data){
                setFormData({...res?.data?.data})
            }
        }
        setLoading(false)
    }).catch(()=> setLoading(false))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    function removeScriptTags(inputString) {
        var cleanedString = inputString.replace('<script>', '');
        var cleanedString2 = cleanedString.replace('</script>', '');
    
        return cleanedString2;
    }

    let data = {}

    if(!!formData?.snap_chat_pixel) data["snap_chat_pixel"] = removeScriptTags(formData?.snap_chat_pixel)
    if(!!formData?.meta_pixel) data["meta_pixel"] = removeScriptTags(formData?.meta_pixel)
    if(!!formData?.google_analytics) data["google_analytics"] = removeScriptTags(formData?.google_analytics)

    setLoading(true)
    pixelService.create(data).then(res=>{
        if(res?.status === 201){
            toast.success("Added Successfully.")
        }
        setLoading(false)
    }).catch(()=> setLoading(false))
  }

  return <>
    <Card>
        <Card.Body>
        <AvForm onValidSubmit={handleSubmit}>
         <div className="row">
            <div className="col-md-12 col-sm-12 mb-3">
              <label>Snapchat Pixel</label>
               <textarea
                  value={formData?.snap_chat_pixel}
                  className='d-block w-75'
                  style={{
                    height: '200px', maxHeight: '200px',
                    borderColor: '#dedede',

                    borderRadius: '5px', padding: '8px'
                  }}
                  errorMessage="Please enter a valid description"
                  validate={{
                    required: {
                      value:true,
                      errorMessage: Translate[lang].field_required
                    },
                  }}
                  placeholder={Translate[lang]?.description}
                  onChange={(e)=> setFormData({...formData, snap_chat_pixel: e.target.value})}
				        />
            </div>
            <div className="col-md-12 col-sm-12 mb-3">
              <label>Meta Pixel</label>
               <textarea
                  value={formData?.meta_pixel}
                  className='d-block w-75'
                  style={{
                    height: '200px', maxHeight: '200px',
                    borderColor: '#dedede',
                    borderRadius: '5px', padding: '8px'
                  }}
                  errorMessage="Please enter a valid description"
                  validate={{
                    required: {
                      value:true,
                      errorMessage: Translate[lang].field_required
                    },
                  }}
                  placeholder={Translate[lang]?.description}
                  onChange={(e)=> setFormData({...formData, meta_pixel: e.target.value})}
				        />
            </div>
            <div className="col-md-12 col-sm-12 mb-3">
              <label>Google Anlaytics</label>
               <textarea
                  value={formData?.google_analytics}
                  className='d-block w-75'
                  style={{
                    height: '200px', maxHeight: '200px',
                    borderColor: '#dedede',
                    borderRadius: '5px', padding: '8px'
                  }}
                  errorMessage="Please enter a valid description"
                  validate={{
                    required: {
                      value:true,
                      errorMessage: Translate[lang].field_required
                    },
                  }}
                  placeholder={Translate[lang]?.description}
                  onChange={(e)=> setFormData({...formData, google_analytics: e.target.value})}
				        />
            </div>
         </div>
        {isExist('seo_pixel') && <div className="d-flex justify-content-between mt-2">
            <Button variant="primary" type="submit" disabled={loading}>{Translate[lang]?.submit}</Button>
         </div>}
         </AvForm>
      </Card.Body>
    </Card>
    </>
}
export default Pixel