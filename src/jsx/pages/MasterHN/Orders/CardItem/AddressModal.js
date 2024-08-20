import { Button, Modal } from "react-bootstrap"
import { Translate } from "../../../../Enums/Tranlate";
import { useSelector } from "react-redux";
import '../style.scss'

const AddressModal = ({modal, setModal, item})=>{
    const lang = useSelector(state=> state.auth.lang)

    return(
        <Modal className="fade address-model" show={modal} onHide={setModal}>
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
                <div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].address}:</label>
                    <p>{item.addressName}</p>
                </div>
                <div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].governorate}:</label>
                    <p>{lang === 'en' ? item.governorate?.name_en : item.governorate?.name_ar}</p>
                </div>
                <div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].area}:</label>
                    <p>{lang === 'en' ? item.area?.name_en : item.area?.name_ar}</p>
                </div>
                <div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].avenue}:</label>
                    <p>{item.avenue}</p>
                </div>
                <div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].block}:</label>
                    <p>{item.block}</p>
                </div>
                {item?.floorNumber &&<div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].floor_number}:</label>
                    <p>{item.floorNumber}</p>
                </div>}
                {item?.houseNumber &&<div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].house_number}:</label>
                    <p>{item.houseNumber}</p>
                </div>}
                {item?.street &&<div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].street}:</label>
                    <p>{item.street}</p>
                </div>}
                {item?.officeNumber &&<div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].officeNumber}:</label>
                    <p>{item.officeNumber}</p>
                </div>}
                {item?.otherInstructions &&<div className="d-flex mb-2 align-items-center" style={{gap: '16px'}}>
                    <label>{Translate[lang].other_instructions}:</label>
                    <p>{item.otherInstructions}</p>
                </div>}
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=> setModal(false)} variant="danger light">
                {Translate[lang].cancel}
            </Button>
            </Modal.Footer>
        </Modal>)
}

export default AddressModal;