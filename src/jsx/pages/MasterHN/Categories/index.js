import React, { Fragment } from "react";
import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import CategoriesService from "../../../../services/CategoriesService";
import Loader from "../../../common/Loader";
import NoData from "../../../common/NoData";
import Pagination from "../../../common/Pagination/Pagination";
import { Translate } from "../../../Enums/Tranlate";
import AddCategoriesModal from "./AddCategoriesModal";
import CardItem from "./CardItem";
import './style.scss'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [item, setItem] = useState({})
    const [hasData, setHasData] = useState(0)
    const [search, setSearch] = useState(null)
    const [shouldUpdate, setShouldUpdate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isDeleted, setIsDeleted] =useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const lang = useSelector(state=> state.auth?.lang)
    const categoriesService = new CategoriesService()
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

  return (
    <Fragment>
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
          {<Button variant="primary" className='me-2 h-75' onClick={()=> { 
              setItem({})
              setAddModal(true) }}>
              {Translate[lang]?.add_categories}
          </Button>}
        </div>
        <div className="d-flex align-items-center mb-3 ">
          <Button variant={isDeleted ? 'secondary' : 'primary'} onClick={()=> setIsDeleted(false)}>
            {Translate[lang]?.active}
          </Button>
          <Button variant={!isDeleted ? 'secondary' : 'primary'} className='mx-2' onClick={()=> setIsDeleted(true)}>
            {Translate[lang]?.not_active}
          </Button>
        </div>
      <Row>
        <Col lg={12}>
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
                    {/* <th>
                      <strong>STATUS</strong>
                    </th> */}
                    <th></th>
                  </tr>
                </thead>

                <tbody className="table-body">
                    {categories?.map((item, index) =>{
                        return <CardItem 
                            index= {index}
                            key= {index}
                            item={item}
                            setItem={setItem}
                            setAddModal={setAddModal}
                            setShouldUpdate={setShouldUpdate}
                        />
                    })}
                </tbody>
              </Table>}
              {hasData === 0 && <NoData />}
              {/* <Pagination
                  setData={setCategories}
                  service={categoriesService}
                  shouldUpdate={shouldUpdate}
                  setHasData={setHasData}
                  isDeleted={isDeleted}
                  setLoading={setLoading}
                  search={search}
              /> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {addModal && 
        <AddCategoriesModal 
          item={item} 
          addModal={addModal} 
          setShouldUpdate={setShouldUpdate}
          setAddModal={()=> setAddModal(false)}
      />}
    </Fragment>
  );
};

export default Categories;
