import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import DesignService from "../../../services/DesignService";
import Loader from "../../common/Loader";
import NoData from "../../common/NoData";
import { Translate } from "../../Enums/Tranlate";
import AddModal from "./AddModal";
import CardItem from "./CardItem";

const Design = () => {
  const [data, setData] = useState([]);
  const [hasData, setHasData] = useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const lang = useSelector((state) => state?.auth.lang);
  const designService = new DesignService();
  const Auth = useSelector(state=> state.auth?.auth)
  const isExist = (data)=> Auth?.admin?.admin_roles?.includes(data)

  useEffect(() => {
    setLoading(true);

    designService?.getList().then((res) => {
      if (res?.status === 200) {
        setData([...res.data?.data]);
        if (res.data?.data?.length > 0) {
          setHasData(1);
        } else {
          setHasData(0);
        }
      }
      setLoading(false);
    }).catch(()=> setLoading(false));
  }, [shouldUpdate]);

  return (
    <>
    <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between p-3 align-items-center">
          <div className="input-group w-50">
          </div>
          {isExist('design') && <Button
              variant="primary"
              className="me-2 h-75"
              onClick={() => setAddModal(true)}
            >
              <i className="la la-plus mx-1"></i>
              {Translate[lang]?.add} {Translate[lang]?.design}
            </Button>}
        </Card.Body>
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
                    <strong>{Translate[lang]?.image}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.title}</strong>
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
        </Card.Body>
      </Card>

      {addModal && <AddModal modal={addModal} setShouldUpdate={setShouldUpdate} setModal={()=>setAddModal(false)} />}
    </>
  );
};
export default Design;
