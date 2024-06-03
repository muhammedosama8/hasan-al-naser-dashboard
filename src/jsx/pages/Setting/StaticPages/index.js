import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Translate } from "../../../Enums/Tranlate";
import './style.scss'
const pages = [
    { name: 'About',type: 'about',label: 'about', path:'/pages/about' },
    { name: 'Privacy',type: 'Privacy', label: 'privacy', path:'/pages/privacy' },
    { name: 'FAQs',type: 'faqs', label: 'faqs', path:'/pages/faqs' }
]
const StaticPages = () =>{
    const navigate= useNavigate()
    const lang = useSelector(state=> state.auth.lang)
    return<>
    <Card>
        <Card.Body>
            <Row className="py-5">
                {pages?.map((page,index)=>{
                    return <Col key={index} md={4} className={index !== pages.length-1 ? 'col-sm-6 h-100' : 'col-sm-12 h-100'}>
                        <Card className="pages-card m-0" onClick={()=> navigate(page.path, {state: page.type})}>
                            <h1 className="m-0">{Translate[lang][page.label]}</h1>
                        </Card>
                    </Col>
                })}
            </Row>
        </Card.Body>
    </Card>
    </>
}
export default StaticPages;