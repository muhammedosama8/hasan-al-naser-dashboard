import { Button, Card, Col, Row } from "react-bootstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'draft-js/dist/Draft.css';
import '../style.scss'
import StaticPagesServices from "../../../../../services/StaticPagesService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Translate } from "../../../../Enums/Tranlate";
import Loader from "../../../../common/Loader";

const Static = () =>{
    const [formData, setFormData] =useState([
        {
            title_en:'',
            title_ar:'',
            description_ar: EditorState.createEmpty(),
            description_en: EditorState.createEmpty(),
        }
    ])
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    // const [isEdit, setIsEdit] = useState()
    const [loading, setLoading] = useState()
    const [submitLoading, setSubmitLoading] = useState(false)
    const staticPagesServices = new StaticPagesServices()

    const changeInput = (e,name,index) =>{
        let update = formData.map((item,ind)=>{
            if(index === ind){
                return{
                    ...item,
                    [name]: e.target.value
                }
            } else{
                return item
            }
        })
        setFormData(update)
    }

    useEffect(()=>{
        let params = {type: window.location.pathname.split('/')[2] === 'privacy' ? 'Privacy' : window.location.pathname.split('/')[2]}
        setLoading(true)
        staticPagesServices.getList(params).then(res=>{
            if(res?.status === 200){
                if(res.data.data?.length === 0){
                    // setIsEdit(false)
                } else {
                    let data = res.data.data?.map(item =>{
                        return{
                            title_en: item.title_en,
                            title_ar: item.title_ar,
                            description_ar: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(item.description_ar))),
                            description_en: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(item.description_en))),
                        }
                    })
                    // setIsEdit(true)
                    setFormData(data)
                }
            }
            setLoading(false)
        })
    },[])
    const submit = () =>{
        let data ={
            type: window.location.pathname.split('/')[2],
            static_page: formData.map(res=>{
                let en = draftToHtml(convertToRaw(res.description_en.getCurrentContent()))
                let ar = draftToHtml(convertToRaw(res.description_ar.getCurrentContent()))
                return{
                    ...res,
                    description_en: en,
                    description_ar: ar
                }
            })
        }
        setSubmitLoading(true)
        staticPagesServices.create(data).then(res=>{
            if(res?.status === 201){
                toast.success("Update Data Successfullly")
                // setIsEdit(true)
            }
            setSubmitLoading(false)
        })
    }

    if(loading){
        return <Card className="py-5" style={{height: '300px'}}>
            <Card.Body>
                <Loader />
            </Card.Body>
      </Card>
    }

    return<>
    <Card>
        <Card.Body>
        <AvForm onValidSubmit={submit}>
            {formData?.map((item, index)=>{
                return <Row className="mb-5 position-relative" key={index}>
                    {index > 0 && <button className="delete border-0"  type="button" onClick={()=>{
                        let update = formData.filter((_,ind) => ind !== index)
                        setFormData(update)
                    }}>
                        <i className="la la-times"></i>
                    </button>}
                <Col md={6} className="form-group mb-2">
					<AvField
						label ={Translate[lang].english_title}
						name ={`title_en${index}`}
						type="text" 
						value={item.title_en}
                        // disabled={isEdit}
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
						placeholder={Translate[lang].english_title}
						onChange={(e) => changeInput(e,'title_en',index)}
					/>
				</Col>
                <Col md={6} className="form-group mb-2">
					<AvField
						label ={Translate[lang].arabic_title}
					    name ={`title_ar${index}`}
						type="text" 
                        // disabled={isEdit}
						value={item.title_ar}
						validate={{
							required: {
								value:true,
								errorMessage: Translate[lang].field_required
							},
						}}
						placeholder={Translate[lang].arabic_title}
						onChange={(e) => changeInput(e,'title_ar',index)}
					/>
				</Col>
                <Col md={6} className="form-group mb-2">
                    <label className="d-block">{Translate[lang].english_description}</label>
                    <div className="editorField">
                        <Editor
                            // editorState ={editorState}
                            editorState ={item.description_en}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={(e) => {
                                // if(isEdit){
                                //     return
                                // }
                                let update = formData.map((item,ind)=>{
                                    if(index === ind){
                                        return{
                                            ...item,
                                            description_en: e
                                        }
                                    } else{
                                        return item
                                    }
                                })
                                setFormData(update)
                            }}
                        />
                    </div>
				</Col>
                <Col md={6} className="form-group mb-2">
                    <label className="d-block">{Translate[lang].arabic_description}</label>
                    <div className="editorField">
                        <Editor
                            // editorState ={editorState}
                            editorState ={item.description_ar}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={(e) => {
                                // if(isEdit){
                                //     return
                                // }
                                let update = formData.map((item,ind)=>{
                                    if(index === ind){
                                        return{
                                            ...item,
                                            description_ar: e
                                        }
                                    } else{
                                        return item
                                    }
                                })
                                setFormData(update)
                            }}
                        />
                    </div>
				</Col>
            </Row>
            })}
            
            {isExist('static_pages') && <div className="d-flex justify-content-between">
                <Button 
                    // disabled={isEdit}
                    variant="secondary" 
                    onClick={()=>{
                    setFormData([...formData, {
                        title_en:'',
                        title_ar:'',
                        description_ar: EditorState.createEmpty(),
                        description_en: EditorState.createEmpty(),
                    }])
                }}>
                    {Translate[lang].add_new_value}
                </Button>
                <Button variant="primary" disabled={submitLoading} type="submit">
                    {Translate[lang].submit}
                </Button>
                {/* {isEdit && <Button variant="primary" type="button" onClick={()=>setIsEdit(false)}>
                    {Translate[lang].edit}
                </Button>} */}
            </div>}
        </AvForm>
        </Card.Body>
    </Card>
    </>
}
export default Static;