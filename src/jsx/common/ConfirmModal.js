import React from 'react'
import { Modal } from "react-bootstrap";
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { useSelector } from 'react-redux';
import { Translate } from '../Enums/Tranlate';

function ConfirmModal(props) {
    const lang = useSelector(state=> state.auth.lang)

    return (
        <Modal show={props.open}  onHide={props.onCloseModal} >
            <ModalHeader >
                <h5 className="modal-title mt-0" id="myModalLabel">
                    {props.title}
                </h5>
                <button
                    type="button"
                    onClick={props.onCloseModal}
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>
            <div className="modal-body border-0">
                <p>
                   {props.body}
                </p>
            </div>
            <div className="modal-footer border-0">
                <button
                    type="button"
                    onClick={props.onCloseModal}
                    className="btn me-auto btn-secondary waves-effect waves-light"
                    data-dismiss="modal"
                >
                    {Translate[lang].cancel}
            </button>
                <button
                    onClick={props.submitButton}
                    type="button"
                    className="btn btn-primary waves-effect"
                >
                    {props.button}
            </button>
            </div>
        </Modal>
    )
}

export default ConfirmModal
