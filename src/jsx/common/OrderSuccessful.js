import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { Translate } from "../Enums/Tranlate";

const OrderSuccessful = () =>{
    const lang = useSelector(state=> state.auth?.lang)
    return<Card>
        <CardBody>
        <div className=''>
      <div className='container'>
        <div className='row justify-content-center h-100 align-items-center'>
          <div className='col-md-8'>
            <div className='form-input-content text-center error-page'>
              <i className='la la-check-circle error-text  text-success font-weight-bold'></i>
              <h4>
                <i className='fa fa-check' /> 
                {Translate[lang].ordered_successfully}
              </h4>
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
export default OrderSuccessful;