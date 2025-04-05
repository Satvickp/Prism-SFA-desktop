import React, { useState } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "../../components/UI/Loading";
import PageHeader from "../../components/common/PageHeader";
import ModalLoader from "../UIComponents/ModalLoader";
import { useCodeConfigurationHook } from "../../hooks/codeConfigurationMasterHook";

function CodeConfigMaster() {
  const [isModal, setIsModal] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalInvoice, setIsModalInvoice] = useState(false);
  const [isModalEditInvoice, setIsModalEditInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");

  const [code, setCode] = useState("");
  const [codeType, setCodeType] = useState("");

  const {
    addEmployeeCode,
    addInvoiceNumber,
    updateInvoiceNumber,
    updateEmployeeCode,
  } = useCodeConfigurationHook();
  const CodeConfig = useSelector((state) => state.CodeConfig);
  const { employeeCodeMaster, invoiceNumberMaster } = CodeConfig;

  const [modalLoader, setModalLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
  });

  function handleIsModalEdit() {
    setCode(employeeCodeMaster?.code);
    setCodeType(employeeCodeMaster?.preOrPost);
    setIsModalEdit(!isModalEdit);
  }

  function handleIsModal() {
    setIsModal(!isModal);
  }

  function handleIsModalEditInvoice() {
    setCode(invoiceNumberMaster?.code);
    setCodeType(invoiceNumberMaster?.preOrPost);
    setIsModalEditInvoice(!isModalEditInvoice);
  }

  function handleIsModalInvoice() {
    setIsModalInvoice(!isModalInvoice);
  }

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Code Configuration Master"
            renderRight={() => (
              <div className="col-auto d-flex gap-1">
                <Button
                  variant={employeeCodeMaster?.code ? "primary" : "secondary"}
                  onClick={() => {
                    handleIsModal();
                    setCode("");
                    setCodeType("");
                  }}
                  disabled={employeeCodeMaster?.code}
                >
                  {buttonLoader.getDropDowns ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                  ) : (
                    <i className="icofont-plus-circle me-2 fs-6"></i>
                  )}
                  Create Employee Code
                </Button>
                <Button
                  variant={invoiceNumberMaster?.code ? "primary" : "secondary"}
                  onClick={() => {
                    handleIsModalInvoice();
                    setCode("");
                    setCodeType("");
                  }}
                  disabled={invoiceNumberMaster?.code}
                >
                  {buttonLoader.getDropDowns ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                  ) : (
                    <i className="icofont-plus-circle me-2 fs-6"></i>
                  )}
                  Create Invoice Code
                </Button>
              </div>
            )}
          />
          <div className="row g-3 py-1 pb-4">
            {employeeCodeMaster || invoiceNumberMaster ? (
              <div className="row clearfix g-3">
                {employeeCodeMaster && (
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title fs-4 fw-bold">
                          Employee Code
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-4">
                          <p className="mb-0">
                            Company Employee Code:{" "}
                            <Badge bg="info" className="fs-6">
                              {employeeCodeMaster.code}
                            </Badge>
                          </p>

                          <p className="mb-0 ms-4">
                            Company Employee Type:{" "}
                            <Badge bg="info" className="fs-6">
                              {employeeCodeMaster.preOrPost}
                            </Badge>
                          </p>

                          <button
                            onClick={handleIsModalEdit}
                            type="button"
                            className="btn btn-outline-secondary ms-4"
                          >
                            <i className="icofont-edit text-success"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {invoiceNumberMaster && (
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title fs-4 fw-bold">
                          Invoice Number
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-4">
                          <p className="mb-0">
                            Invoice Number Code:{" "}
                            <Badge bg="info" className="fs-6">
                              {invoiceNumberMaster.code}
                            </Badge>
                          </p>

                          <p className="mb-0 ms-4">
                            Invoice Number Type:{" "}
                            <Badge bg="info" className="fs-6">
                              {invoiceNumberMaster.preOrPost}
                            </Badge>
                          </p>

                          <button
                            onClick={handleIsModalEditInvoice}
                            type="button"
                            className="btn btn-outline-secondary ms-4"
                          >
                            <i className="icofont-edit text-success"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info text-center">
                No Employee Code or Invoice Number To Load.
              </div>
            )}
          </div>

          <Modal centered show={isModal} onHide={() => setIsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                Create Employee Code
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Employee Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee Code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Code Type</label>
                <select
                  className="form-control"
                  placeholder="Code Type"
                  onChange={(e) => setCodeType(e.target.value)}
                  value={codeType}
                >
                  <option value="">selected code type</option>
                  <option value="Pre">Pre</option>
                  <option value="Post">Post</option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addEmployeeCode(
                    { code: code, preOrPost: codeType },
                    handleIsModal
                  );
                }}
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Create
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isModalEdit}
            onHide={() => setIsModalEdit(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Employee Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Employee Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee Code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Code Type</label>
                <select
                  className="form-control"
                  placeholder="Code Type"
                  onChange={(e) => setCodeType(e.target.value)}
                  value={codeType}
                >
                  <option value="">selected code type</option>
                  <option value="Pre">Pre</option>
                  <option value="Post">Post</option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  updateEmployeeCode(
                    { code: code, preOrPost: codeType },
                    handleIsModalEdit
                  )
                }
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Update
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isModalInvoice}
            onHide={() => setIsModalInvoice(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Create Invoice Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Invoice Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Invoice Code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Code Type</label>
                <select
                  className="form-control"
                  placeholder="Code Type"
                  onChange={(e) => setCodeType(e.target.value)}
                  value={codeType}
                >
                  <option value="">selected code type</option>
                  <option value="Pre">Pre</option>
                  <option value="Post">Post</option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setIsModalInvoice(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addInvoiceNumber(
                    { code: code, preOrPost: codeType },
                    handleIsModalInvoice
                  );
                }}
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Create
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isModalEditInvoice}
            onHide={() => setIsModalEditInvoice(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Invoice Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Invoice Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Invoice Code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Code Type</label>
                <select
                  className="form-control"
                  placeholder="Code Type"
                  onChange={(e) => setCodeType(e.target.value)}
                  value={codeType}
                >
                  <option value="">selected code type</option>
                  <option value="Pre">Pre</option>
                  <option value="Post">Post</option>
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setIsModalEditInvoice(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  updateEmployeeCode(
                    { code: code, preOrPost: codeType },
                    handleIsModalEditInvoice
                  )
                }
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Update
              </Button>
            </Modal.Footer>
          </Modal>

          <ModalLoader message={fetchMessage} show={modalLoader} />
        </div>
      )}
    </>
  );
}

export default CodeConfigMaster;
