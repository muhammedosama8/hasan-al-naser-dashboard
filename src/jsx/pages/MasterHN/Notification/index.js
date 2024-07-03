import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardItem from "./CardItem";
import { Translate } from "../../../Enums/Tranlate";
import Loader from "../../../common/Loader";
import NoData from "../../../common/NoData";
import Pagination from "../../../common/Pagination/Pagination";

const Notification = ()=>{
    const [notification, setNotification] = useState([])
    const [hasData, setHasData] = useState(0)
    const [shouldUpdate, setShouldUpdate] = useState(false)
    const Auth = useSelector(state=> state.auth?.auth)
    const [loading, setLoading] =useState(false)
    const lang = useSelector(state=> state.auth?.lang)
    const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)
    const navigate = useNavigate()
    // const notificationService = new NotificationService()

    return(
        <>
        <div className="d-flex mb-3 justify-content-end">
            {isExist('masterHN') && <Button 
                variant='primary'
                onClick={()=>{
                    navigate('add-notification')
                }}>
                {Translate[lang].add} {Translate[lang].notification}
            </Button>}
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
                      <strong>{Translate[lang].title}</strong>
                    </th>
                    <th>
                      <strong>{Translate[lang].message}</strong>
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody className="table-body">
                    {notification?.map((item, index) =>{
                        return <CardItem
                            index= {index}
                            key= {index}
                            item={item}
                            setShouldUpdate={setShouldUpdate}
                        />
                    })}
                </tbody>
              </Table>}
              {(hasData === 0 && !loading) && <NoData />}
              {/* <Pagination
                  setData={setNotification}
                  // service={notificationService}
                  shouldUpdate={shouldUpdate}
                  setHasData={setHasData}
                  setLoading={setLoading}
              /> */}
            </Card.Body>
        </Card>
        </>
    )
}

export default Notification;