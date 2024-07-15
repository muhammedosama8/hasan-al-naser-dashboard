import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardItem from "./CardItem";
import { Translate } from "../../../Enums/Tranlate";
import Loader from "../../../common/Loader";
import NoData from "../../../common/NoData";
import Pagination from "../../../common/Pagination/Pagination";
import PromoCodeService from "../../../../services/PromoCodeService";

const PromCodes = () =>{
    const [promCodes, setPromCodes] =useState([])
    const [search, setSearch] =useState(null)
    const [hasData, setHasData] = useState(null)
    const [loading, setLoading] =useState(false)
    const [shouldUpdate, setShouldUpdate] = useState(false)
    const navigate = useNavigate()
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const promoCodeService = new PromoCodeService()

    return(
        <>
          <div className="d-flex justify-content-between mb-3 align-items-center">
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
            {isExist('masterHN') && <Button variant="primary" className='me-2 h-75' onClick={()=> navigate('/promo-codes/add-promo-codes')}>
            {Translate[lang]?.add} {Translate[lang]?.prom_codes}
          </Button>}
          </div>
        <Card>
            <Card.Body className={`${hasData === 0 ? 'text-center' :''}`}>
            {loading && <div style={{height: '300px'}}>
                <Loader />
              </div>}
              {(hasData === 1 && !loading) && <Table responsive>
                <thead>
                  <tr className='text-center'>
                    <th>
                      <strong>I.D</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.name}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.amount}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.type}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.start_date}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.end_date}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.max_usage}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.count_usage}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.status}</strong>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {promCodes?.map((item, index)=>{
                    return <CardItem 
                    key= {index}
                    index= {index}
                    item={item}
                    setShouldUpdate={setShouldUpdate}
                    />
                  })}
                </tbody>
              </Table>}

              {hasData === 0 && <NoData />}
              <Pagination
                  setData={setPromCodes}
                  service={promoCodeService}
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
export default PromCodes;