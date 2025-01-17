import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const CardItem = ({item, index,setShouldUpdate}) =>{
    const [status, setStatus] = useState(null)

    useEffect(()=>{
        setStatus(item.isBlocked)
    },[item])
    
    return(
        <tr key={index} className='text-center'>
                    <td>
                      <strong>{item.id}</strong>
                    </td>
                    <td>
                      {item?.username ? <p className="mb-0"
                        style={{fontWeight: '800'}}>
                        {item.username} 
                      </p> : '-'}
                    </td>
                    <td>
                      {item.email || '-'}
                    </td>
                    <td>
                      {/* {item?.user_phones?.filter(res=> !!res.is_default)[0]?.country_code}{item?.user_phones?.filter(res=> !!res.is_default)[0]?.phone || '-'} */}
                      {item?.country_code} {item?.phone || '-'}
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`custom-switch${index}`}
                        checked={!status}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`isDeleted${index}`}
                        checked={item.isDeleted}
                      />
                    </td>
                  </tr>
    )
}
export default CardItem;