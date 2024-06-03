import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { Translate } from "../Enums/Tranlate";

const OrderFailed = () =>{
  const lang = useSelector(state=> state.auth?.lang)
    return<Card>
        <CardBody>
        <div className=''>
      <div className='container' style={{}}>
        <div className='row justify-content-center align-items-center'>
          <div className='col-md-8'>
            <div className='form-input-content text-center error-page'>
              <i className='la la-close error-text font-weight-bold'></i>
              <h4>
                <i className='fa fa-exclamation' /> 
                {Translate[lang].ordered_failed}
              </h4>
              <p>
              {Translate[lang].failed_msg}
              </p>
              <div className="mt-5">
                <Link className='btn btn-primary' to='/'>
                {Translate[lang].back_home}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
        </CardBody>
    </Card>
}
export default OrderFailed;