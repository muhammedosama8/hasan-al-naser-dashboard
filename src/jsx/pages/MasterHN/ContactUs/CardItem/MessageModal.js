import React from 'react'
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types"
import { useSelector } from 'react-redux';
import { Translate } from '../../../../Enums/Tranlate';

function MessageModal(props) {
    const lang = useSelector(state=> state.auth.lang)

    return (
        <Modal show={props.open}  onHide={()=> props.onCloseModal(false)} className={`${lang}`}>
            <div className="modal-header border-0">
                <h5 className="modal-title mt-0" id="myModalLabel">
                    <i className='la la-envelope-open' style={{fontSize: '20px'}}></i> {Translate[lang].message}
                </h5>
                <button
                    type="button"
                    onClick={() => props.onCloseModal(false)}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body border-0">
                <p>
                    {props?.message}
                </p>
            </div>
            <div className="modal-footer border-0">
                <button
                    type="button"
                    onClick={() => props.onCloseModal(false)}
                    className="btn me-auto btn-secondary waves-effect waves-light"
                    data-dismiss="modal"
                >
                    {Translate[lang].cancel}
            </button>
            </div>
        </Modal>
    )
}

MessageModal.propTypes = {
    open: PropTypes.bool,
    onCloseModal: PropTypes.func,
    message: PropTypes.object
};

export default MessageModal
