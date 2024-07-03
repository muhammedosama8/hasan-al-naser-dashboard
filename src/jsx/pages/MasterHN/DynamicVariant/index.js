import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardItem from "./CardItem";
import './style.scss'
import { Translate } from "../../../Enums/Tranlate";
import Loader from "../../../common/Loader";
import NoData from "../../../common/NoData";
import Pagination from "../../../common/Pagination/Pagination";
import DynamicVariantService from "../../../../services/MHDynamicVariantService";

const DynamicVariant = () =>{
    const [dynamicVariant, setDynamicVariant] = useState([])
    const [search, setSearch] = useState(null)
    const [hasData, setHasData] =useState(0)
    const [shouldUpdate, setShouldUpdate] =useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] =useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const dynamicVariantService = new DynamicVariantService()


    return(
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 ">
          <div className="input-group w-50">
            <input 
                type="text" 
                style={{borderRadius: '8px',
                color: 'initial',
                padding: '18px 33px 18px 16px'}}
                className="form-control"
                placeholder={`${Translate[lang]?.search_by} I.D, ${Translate[lang]?.name}`}
                value={search}
                onChange={e=> setSearch(e.target.value)} 
            />
            <div className="flaticon-381-search-2"
              style={{position: 'absolute',zIndex:'99', right: lang === 'en' && '16px', left: lang === 'ar' && '16px', top: '50%', transform: 'translate(0, -50%)'}}
            ></div>
          </div>
            {isExist('masterHN') && <Button variant="primary" className='me-2 h-75' onClick={()=> navigate('/dynamic-variant/add-dynamic-variant')}>
            {Translate[lang]?.add} {Translate[lang]?.dynamic_variant}
          </Button>}
          </div>
        <Card>
            <Card.Body className={`${hasData === 0 && 'text-center'} `}>
            {loading && <div style={{height: '300px'}}>
                <Loader />
              </div>}
              {(hasData === 1 && !loading) && <Table responsive>
                <thead>
                  <tr>
                    <th>
                      <strong>I.D</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.category}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.dynamic_variant}</strong>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dynamicVariant?.map((item, index)=>{
                    return <CardItem 
                    key= {index}
                    index= {index}
                    item={item}
                    setShouldUpdate={setShouldUpdate}
                    />
                  })}
                </tbody>
              </Table>}

              {(hasData === 0 && !loading) && <NoData />}

              <Pagination
                  setData={setDynamicVariant}
                  service={dynamicVariantService}
                  shouldUpdate={shouldUpdate}
                  setHasData={setHasData}
                  setLoading={setLoading}
                  search={search}
                />
            </Card.Body>
          </Card>
        </>
    )
}
export default DynamicVariant;
