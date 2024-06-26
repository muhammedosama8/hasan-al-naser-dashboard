import { Button, Modal } from "react-bootstrap"
import { Translate } from "../../../../Enums/Tranlate";
import { useSelector } from "react-redux";

const AddressModal = ({modal, setModal, item})=>{
    const lang = useSelector(state=> state.auth.lang)

    return(
        <Modal className="fade" show={modal} onHide={setModal}>
            <Modal.Header>
            <Modal.Title>{Translate[lang].address}</Modal.Title>
            <Button
                variant=""
                className="close"
                onClick={()=> setModal(false)}
                >
                <span>&times;</span>
            </Button>
            </Modal.Header>
            <Modal.Body>
                <p>{Translate[lang].address}: {item.addressName}</p>
                <div className="d-flex">
                    <p className="w-50">{Translate[lang].avenue}: {item.avenue}</p>
                    <p className="w-50">{Translate[lang].block}: {item.block}</p>
                </div>
                <div className="d-flex">
                    {item?.floorNumber && <p className="w-50">{Translate[lang].floor_number}: {item.floorNumber}</p>}
                    {item?.houseNumber && <p className="w-50">{Translate[lang].house_number}: {item.houseNumber}</p>}
                    {item?.street && <p className="w-50">{Translate[lang].street}: {item.street}</p>}
                    {item?.officeNumber && <p className="w-50">{Translate[lang].officeNumber}: {item.officeNumber}</p>}
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=> setModal(false)} variant="danger light">
                {Translate[lang].cancel}
            </Button>
            </Modal.Footer>
        </Modal>)
}

export default AddressModal;