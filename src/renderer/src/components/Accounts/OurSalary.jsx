import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import ModalLoader from "../../screens/UIComponents/ModalLoader";
import { useSelector } from "react-redux";
import { getMemberSalary } from "../../api/expense/salary-api";

function OurSalary(props) {
  const Data = props.data;
  // console.log(Data)

  const [salaryComponent, setSalaryComponent] = useState(Data.salaryComponent);
  const [value, setValue] = useState(Data.value);
  const [currency, setCurrency] = useState(Data.currency);
  const [financialYear, setFinancialYear] = useState(Data.financialYear);

  const [loading, setloading] = useState(false);
  const [delLoad, setDelLoad] = useState(false);
  const { index } = props;
  const Cred = useSelector((state) => state.Cred);
  const [isModal, setIsModal] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    updateSalary: false,
  });

  const Salary = useSelector((state) => state.Salary);

  return (
    <div className="card teacher-card">
      <div className="card-body  d-flex">
        <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
          <div className="about-info d-flex align-items-center mt-1 justify-content-center flex-column">
            {/* <h6 className="mb-3 fw-bold d-block fs-8 mt-2 border border-2 py-2 px-4 rounded border-gray">
            <b></b>{Data.productId}
            </h6> */}
            <h6 className="mb-3 fw-bold d-block fs-8 mt-2 border border-2 py-2 px-4 rounded border-gray">
              <b>Financial Year</b><br/>{Data.financialYear}
            </h6>
            <div
              className="btn-group mt-2"
              role="group"
              aria-label="Basic outlined example"
            >
              {/* edit button */}

              <button
                onClick={async () => {
                  setloading(true);

                  try {
                    const resp = await getMemberSalary(Cred.token, Data.id);

                    setSalaryComponent(Data.salaryComponent);
                    setValue(Data.value);
                    setCurrency(Data.currency);
                    setFinancialYear(Data.financialYear);

                    setIsModal(true);
                  } catch (error) {
                    setIsModal(false);
                    Swal.fire(
                      "Something went wrong",
                      "Can't Fetch Necessary data"
                    );
                  }
                  setloading(false);
                }}
                type="button"
                className="btn btn-outline-secondary m-2"
              >
                <i className="icofont-edit text-success fs-5"></i>
              </button>

              {/* delete button */}

              <button
                onClick={() => setIsModalDelete(true)}
                type="button"
                className="btn btn-outline-secondary m-2"
              >
                <i className="icofont-ui-delete text-danger fs-5"></i>
              </button>
            </div>

            <div
              className="btn-group mt-2"
              role="group"
              aria-label="Basic outlined example"
            >
              {/* view more button */}
              <button
                onClick={async () => {
                  setloading(true);
                  try {
                    
                    const resp = Salary.find((val) => val.id === Data.id);
                    if (resp) {
                        setSalaryComponent(Data.salaryComponent);
                        setValue(Data.value);
                        setCurrency(Data.currency);
                        setFinancialYear(Data.financialYear);
                        setIsView(true);
                    } else {
                      setIsView(false);
                      Swal.fire(
                        "Something went wrong",
                        "Can't Fetch Necessary data"
                      );
                    }
                  } catch (error) {
                    setIsView(false);
                    Swal.fire(
                      "Something went wrong",
                      "Can't Fetch Necessary data"
                    );
                  } finally {
                    setloading(false);
                  }
                }}
                type="button"
                className="btn btn-outline-secondary m-2"
              >
                View more
              </button>
            </div>
          </div>
        </div>
        <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
          <div className="d-flex justify-content-between flex-wrap">
          <h6 className="mb-0 mt-2  fw-bold d-block fs-6">
            <b>salaryComponent: </b>
            {Data.salaryComponent}
          </h6>
          </div>

          <div className="video-setting-icon mt-3 pt-3 border-top">
            <p>
              <b>value: </b>
              {Data.value}
            </p>
          </div>
          <div className="video-setting-icon mt-3 pt-3 border-top">
            <p>
              <b>currency: </b>
              {Data.currency}
            </p>
          </div>
          <div className="video-setting-icon mt-3 pt-3 border-top">
            <p>
              <b>financialYear: </b>
              {Data.financialYear}
            </p>
          </div>
        </div>
      </div>
      <Modal
        // size="xl"
        centered
        show={isModal}
        onHide={() => {
          setIsModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Member Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <div className="modal-body">
                <div className="deadline-form">
                  <form>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput257"
                        >
                          Salary Component*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={salaryComponent}
                          placeholder="Salary Component"
                          id="exampleFormControlInput257"
                          onChange={(e) => setSalaryComponent(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput277"
                          className="form-label"
                        >
                          Value*
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="form-control"
                          id="exampleFormControlInput277"
                          placeholder="Value"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput477"
                          className="form-label"
                        >
                          Currency*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput477"
                          placeholder="Currency"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput777"
                          className="form-label"
                        >
                          Financial Year*
                        </label>
                        <input
                          type="text"
                          value={financialYear}
                          onChange={(e) => setFinancialYear(e.target.value)}
                          className="form-control"
                          id="exampleFormControlInput777"
                          placeholder="Financial Year"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModal(false);
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              setIsModal(true);
              if (
                !salaryComponent ||
                !value ||
                !currency ||
                !financialYear
              ) {
                setIsModal(false);
                Swal.fire({
                  title: "Invalid Details",
                  text: "Make Sure You Filled Each Details With Correct Value",
                  timer: 2000,
                  icon: "warning",
                }).then((e) => setIsModal(true));
                return;
              }
              setButtonLoader({ ...buttonLoader, ...{ updateSalary: true } });

              await props.Update(index, {
                salaryComponent: salaryComponent,
                value : value,
                currency : currency,
                financialYear : financialYear,
                id: Data.id,
              });
              setIsModal(false);
              setButtonLoader({ ...buttonLoader, ...{ updateSalary: false } });
            }}
          >
            {buttonLoader.updateSalary && (
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
        size="xl"
        centered
        show={isView}
        onHide={() => {
          setIsView(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Members Salary Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="">
              <div className="mb-3 border-bottom">
                <p>
                  <b>salaryComponent : </b>
                  {salaryComponent}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <div className="border-bottom">
                <p>
                  <b>value : </b>
                  {value}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <div className="border-bottom">
                <p>
                  <b>currency : </b>
                  {currency}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <div className="border-bottom">
                <p>
                  <b>financialYear: </b>
                  {financialYear}
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={isModalDelete}
        centered
        onHide={() => {
          setIsModalDelete(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Member Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            You can delete this item Permanently
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModalDelete(false);
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            className="btn btn-danger color-fff"
            onClick={async () => {
              try {
                setDelLoad(true);
                setIsModalDelete(false);
                await props.Delete(Data.id);
                setDelLoad(false);
              } catch (error) {
                setIsModal(false);
                setDelLoad(false);
                setIsModalDelete(false);
                Swal.fire("Something went wrong", "Can't Fetch Necessary data");
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalLoader show={loading} message={"Fetching Details"} />
      <ModalLoader show={delLoad} message={"Deleting Member's Salary"} />
    </div>
  );
}

export default OurSalary;
