import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const ModalLoader = ({ show ,message}) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body style={{ background: 'transparent', textAlign: 'center' }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: '10px', fontSize: '18px', color: '#333' ,marginBottom:-10}}>{message?message:"Please wait..."}</p>
      </Modal.Body>
    </Modal>
  );
};

export default ModalLoader;
