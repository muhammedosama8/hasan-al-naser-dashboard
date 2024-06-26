import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SocialMediaService from "../../../../services/SocialMediaService";
import Loader from "../../../common/Loader";
import { SocialMediaLinks } from "../../../Enums/SocialMedia";
import { Translate } from "../../../Enums/Tranlate";

const MasterSocialMedia = ()=>{
    const [links, setLinks] = useState({})
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    // const [selectedSocial, setSelectedSocial] = useState([])
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const socialMediaService = new SocialMediaService()
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

    useEffect(()=>{
        setLoadingData(true)
        socialMediaService?.getList()?.then(res=>{
            if(res?.status === 200 && res?.data?.data){
                setLinks({...res.data?.data})
                setIsAdd(false)
            } else{
                let values={}
                SocialMediaLinks?.map(link=> values[link.value]= '')
                setLinks({...values})
                setIsAdd(true)
            }
            setLoadingData(false)
        })
    },[])

    const inputHandler =(e)=>{
        setLinks({...links,[e.target.name]: e.target.value})
    }

    const onSubmit = (e)=> {
        e.preventDefault()
        // const result = areAllValuesFilled(links);
        // if(result) return
        // if(!links.facebook && !links.instagram && !links.snapchat && !links.tiktok
        //     && !links.twitter && !links.whatsapp){
        //         toast.error('Enter Value')
        //         return
        // }
        let data = {}
        if(!!links.snapchat) data['snapchat'] = links.snapchat
        if(!!links.facebook) data['facebook'] = links.facebook
        if(!!links.instagram) data['instagram'] = links.instagram
        if(!!links.whatsapp) data['whatsapp'] = links.whatsapp
        if(!!links.twitter) data['twitter'] = links.twitter
        if(!!links.gmail) data['gmail'] = links.gmail
        if(!!links.address) data['address'] = links.address
        // if(!!links.play_store) data['play_store'] = links.play_store
        // if(!!links.app_store) data['app_store'] = links.app_store
        if(!!links.call_us) data['call_us'] = links.call_us
        if(!!links.time_to) data['time_to'] = links.time_to
        if(!!links.time_from) data['time_from'] = links.time_from
        if(!!links.tiktok) data['tiktok'] = links.tiktok

        setLoading(true)
        socialMediaService?.create(data)?.then(res=>{
            if(res.status === 201){
                toast?.success('Added Social Links Successfully')
                setIsAdd(false)
            }
            setLoading(false)
        }).catch(error=> {
            toast.error(error)
            setLoading(false)
        })
    }

    if(loadingData){
        return <Card className="py-5" style={{height: '300px'}}>
            <Card.Body>
                <Loader />
            </Card.Body>
      </Card>
    }

    return(<>
    <Card>
        <Card.Body className="position-relative">
            <form onSubmit={onSubmit}>
                <Row className="mb-3">
                    {SocialMediaLinks?.map((link, index)=>{
                        if(link.value === "time_from" || link.value === "time_to"){
                            return <Col md={3} className='mb-3' key={index}>
                                <label className="text-label">
                                    {Translate[lang][link.value]}
                                </label>
                                <input
                                    type="time"
                                    name={link.value}
                                    disabled={!isAdd}
                                    style={{
                                        background: !isAdd ? 'rgb(238 238 238)' : '#fff'
                                    }}
                                    required
                                    className="form-control"
                                    placeholder={Translate[lang][link.value]}
                                    value={links[link?.value]}
                                    onChange={(e)=> inputHandler(e)}
                                />
                            </Col>
                        } else {
                            return <Col md={6} className='mb-3' key={index}>
                                <label className="text-label">{Translate[lang][link.value]}</label>
                                <input
                                    type="text"
                                    name={link.value}
                                    disabled={!isAdd}
                                    style={{
                                        background: !isAdd ? 'rgb(238 238 238)' : '#fff'
                                    }}
                                    // required
                                    className="form-control"
                                    placeholder={Translate[lang][link.value]}
                                    value={links[link?.value]}
                                    onChange={(e)=> inputHandler(e)}
                                />
                            </Col>
                        }
                    })}
                </Row>
                {isExist('home') && <div className="d-flex justify-content-end">
                    {isAdd && <Button variant="primary" type="submit" disabled={loading}>
                        {Translate[lang].submit}
                    </Button>}
                    {!isAdd && <Button variant="primary" type="button" onClick={()=> setIsAdd(true)}>
                        {Translate[lang].edit}
                    </Button>}
                </div>}
            </form>
        </Card.Body>
    </Card>
    </>)
}
export default MasterSocialMedia;