import { useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import ContactusService from "../../../services/ContactusService";
import Loader from "../../common/Loader";
import NoData from "../../common/NoData";
import Pagination from "../../common/Pagination/Pagination";
import { Translate } from "../../Enums/Tranlate";
import CardItem from "./CardItem";

const ContactUs = () => {
  const [data, setData] = useState([]);
  const [hasData, setHasData] = useState(0);
  const [status, setStatus] = useState('open');
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const lang = useSelector((state) => state?.auth.lang);
  const contactusService = new ContactusService();

  return (
    <>
      <Card className="d-flex mb-3 p-3 justify-content-between">
      <div className="d-flex align-items-center">
          <Button variant={status==='open' ? 'primary' : 'secondary'} onClick={()=> setStatus("open")}>
            {Translate[lang].open}
          </Button>
          <Button variant={status==='closed' ? 'primary' : 'secondary'} className='mx-2' onClick={()=> setStatus("closed")}>
          {Translate[lang].close}
          </Button>
        </div>
      </Card>

      <Card>
        <Card.Body className={`${hasData === 0 && "text-center"} `}>
          {loading && (
            <div style={{ height: "300px" }}>
              <Loader />
            </div>
          )}
          {hasData === 1 && !loading && (
            <Table responsive>
              <thead>
                <tr className="text-center">
                  <th>
                    <strong>I.D</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.name}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.email}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.phone}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.message}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.status}</strong>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <CardItem
                      key={index}
                      index={index}
                      item={item}
                      setShouldUpdate={setShouldUpdate}
                    />
                  );
                })}
              </tbody>
            </Table>
          )}

          {hasData === 0 && <NoData />}

          {/* <Pagination
            setData={setData}
            service={contactusService}
            shouldUpdate={shouldUpdate}
            setHasData={setHasData}
            setLoading={setLoading}
            status={status}
          /> */}
        </Card.Body>
      </Card>
    </>
  );
};
export default ContactUs;
