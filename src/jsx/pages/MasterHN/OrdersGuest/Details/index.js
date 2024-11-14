import { useEffect, useState } from "react";
import { Card, Table ,Badge} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Translate } from "../../../../Enums/Tranlate";

const OrderGuestDetails = () => {
    const [formData, setFormData] = useState({})
    const history = useLocation();
    const lang = useSelector(state=> state.auth.lang)

  useEffect(()=>{
    setFormData(history.state)
  },[])

  return <>
  <Card>
    <Card.Body>
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
                    <strong>{Translate[lang]?.variant}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.dynamic_variant}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.price}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.amount}</strong>
                  </th>
                  <th>
                    <strong>{Translate[lang]?.total_price}</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData?.sub_carts?.map((cart, index)=>{
                    return <tr key={index} className="text-center">
                        <td>{cart.id}</td>
                        <td>{lang === 'en' ? cart.product.name_en : cart.product.name_ar}</td>
                        <td>{!!cart.product.variant?.length ? cart.product.variant?.map(res=> {
                          return <Badge 
                          className="mb-2 py-2"
                            key={res?.id} 
                            variant="primary light"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff'
                            }}>
                              {lang === 'en' ? res?.variant?.name_en : res?.variant?.name_ar}: {res?.variant?.name_en ==='color' ? <span style={{
                                height: '24px', width: '24px', 
                                background: res?.variant_value?.value_en, 
                                border: '1px solid #fff',
                                display: 'inline-block', margin: '0 4px'
                              }}></span> : lang === 'en' ? res?.variant_value?.value_en : res?.variant_value?.value_ar}
                            </Badge>
                        }) : '-'}</td>
                        <td>{!!cart.dynamic_variant_carts?.length ? cart.dynamic_variant_carts?.map(res=> {
                          return <Badge 
                          className="mb-2 py-2"
                            key={res?.id} 
                            variant="secondary"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff'
                            }}>
                              {lang === 'en' ? res?.dynamic_variant?.name_en : res?.dynamic_variant?.name_ar}: {res?.amount} * {res?.dynamic_variant?.price?.toFixed(3)}
                            </Badge>
                        }) : '-'}</td>
                        <td>{cart.price?.toFixed(3)}</td>
                        <td>{cart.amount}</td>
                        <td>
                        {!!cart.dynamic_variant_carts?.length ? 
                        <span className='mb-3 text-primary'>
                          {((cart?.amount*cart?.price) + cart.dynamic_variant_carts?.map(res=> res?.amount*res?.dynamic_variant?.price).reduce((accumulator, currentValue) => {
                              return accumulator + currentValue;
                          }, 0)).toFixed(3)}
                        </span> :
                        <span className='mb-3 text-primary'>{(cart?.amount*cart?.price).toFixed(3)}</span>}
                        {Translate[lang].kwd}
                        </td>
                    </tr>
                })}
              </tbody>
            </Table>
    </Card.Body>
  </Card>
    
  </>;
};
export default OrderGuestDetails;
