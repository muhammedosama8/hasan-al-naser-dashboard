import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import NoData from "../../common/NoData";
import Pagination from "../../common/Pagination/Pagination";
import { Translate } from "../../Enums/Tranlate";
import CardItem from "./CardItem";

const Products = () =>{
    const tabs = ['Preumium Products', 'High Pressure']
    const [selectTab, setSelectTab] = useState('Preumium Products')
    const [products, setProducts] =useState([])
    const [hasData, setHasData] =useState(0)
    const [search, setSearch] =useState(null)
    const [loading, setLoading] =useState(false)
    const [indexEdit, setIndexEdit] = useState(null)
    const [ shouldUpdate, setShouldUpdate] = useState(false)
    const navigate = useNavigate()
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    // const productsService = new ProductsService()

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
              style={{position: 'absolute',zIndex:'1', right: lang === 'en' && '16px', left: lang === 'ar' && '16px', top: '50%', transform: 'translate(0, -50%)'}}
            ></div>
          </div>
          {<Button variant="primary" className='me-2 h-75' onClick={()=> navigate('/home/products/add-products')}>
              {Translate[lang]?.add} {Translate[lang]?.products}
          </Button>}
        </div>
        
        <div style={{width: 'max-content'}}>
            <div className="py-4">
            <div className="tabs-div">
            {tabs?.map((tab,index) => {
              return <p
              key={index}
              className='mb-0'
              style={{
                color: tab === selectTab ? "var(--primary)" : "#7E7E7E",
                borderBottom: tab === selectTab ? "2px solid" : "none",
              }}
              onClick={() => setSelectTab(tab)}
            >
              {tab}
              </p>
            })}
          </div>
            </div>
        </div>

        <Card>
            <Card.Body className={`${hasData === 0 && 'text-center'} `}>
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
                      <strong>{Translate[lang]?.image}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.name}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang]?.type}</strong>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((item, index)=>{
                    return <CardItem 
                    key= {index}
                    index= {index}
                    item={item}
                    setShouldUpdate={setShouldUpdate}
                    setIndexEdit={setIndexEdit}
                    indexEdit={indexEdit}
                    />
                  })}
                </tbody>
              </Table>}
              {hasData === 0 && <NoData />}
              {/* <Pagination
                  setData={setProducts}
                  service={productsService}
                  shouldUpdate={shouldUpdate}
                  setHasData={setHasData}
                  // isDeleted={isDeleted}
                  setLoading={setLoading}
                  type={'normal'}
                  search={search}
                /> */}
            </Card.Body>
          </Card>
        </>
    )
}
export default Products;