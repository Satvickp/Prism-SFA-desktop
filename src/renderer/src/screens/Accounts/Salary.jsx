import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast, Card } from "react-bootstrap";
import OurSalary from "../../components/Accounts/OurSalary";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";

import {
  addNewSalary,
  deleteMemberSalary,
  getAllSalary,
  updateMemberSalary,
} from "../../api/expense/salary-api";

import {
    setSalary,
    addSalary,
    concatSalary,
    deleteSalary,
    updateSalary
} from '../../redux/features/salarySlice'


import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import ModalLoader from "../UIComponents/ModalLoader";
function Salary() {
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isMoreData, setIsMoreData] = useState(true);
  const [fetchMessage, setFetchMessage] = useState("");
  const Dispatch = useDispatch();

  const [salaryComponent, setSalaryComponent] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("");
  const [financialYear, setFinancialYear] = useState("");


  
  const [modalLoader, setModalLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addSalary: false,
  });
  const [length, setLength] = useState(0)
  const Cred = useSelector((state) => state.Cred);
  const Salary = useSelector((state) => state.Salary);


  async function Get() {
    setLoading(true);
    try {
      if (Salary.allSalary.length <= 0) {
        const resp = await getAllSalary(Cred.token, 0, Cred.sub);
        Dispatch(setSalary(resp));
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Salaries. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(false);
  }
  useEffect(() => {
    setPage(0);
    setLength(Salary.length);
    Get();
  }, []);

  async function Add() {
    if (
      !salaryComponent ||
      !value ||
      !currency ||
      !financialYear 
    ) {
      setIsModal(false);

      Swal.fire({
        title: "Incomplete Form",
        text: "Please Fill all the fields to continue",
      }).then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }

    setButtonLoader({
      ...buttonLoader,
      ...{ addSalary: true },
    });
    try {
      const payload = {
        salaryComponent: salaryComponent,
        value : value,
        currency : currency,
        financialYear : financialYear,
      };
      const resp = await addNewSalary(payload, Cred.token);
      Dispatch(addSalary(resp));
      setIsModal(false);

      setSalaryComponent("");
      setValue("");
      setCurrency("");
      setFinancialYear("");

    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went Wrong",
        text: "Please Try After Some Time",
      }).then((e) => setIsModal(true));
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ addSalary: false },
    });
  }

  async function Update(index, data) {
    try {
      const resp = await updateMemberSalary(data, Cred.token);
      Dispatch(updateSalary(data));
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update current Salary. Please try After Some Time",
        icon: "error",
      });
    }
  }

  async function Delete(id, index) {
    setModalLoader(true);
    try {
      const resp = await deleteMemberSalary(Cred.token, id);
      Dispatch(deleteSalary(id));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Delete Current Salary", "error");
    }
    setModalLoader(false);
  }

  async function onEndReach() {
    setLoadMore(true);
    try {
      const resp = await getAllSalary(Cred.token, page + 1, Cred.sub);
      setPage(page + 1);
      if (resp.length > 0) {
        Dispatch(concatSalary(resp));
      } else {
        setShowToast(true);
        setIsMoreData(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch More Salarys. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setLoadMore(false);
  }

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Members Salary"
            renderRight={() => {
              return (
                <div className="col-auto d-flex">
                  <Button
                    variant="primary"
                    onClick={async () => {
                      try {
                        setIsModal(true);
                      } catch (error) {
                        setIsModal(false);
                        Swal.fire(
                          "Something went wrong",
                          "Can't Fetch Necessary data"
                        );
                      } finally {
                        setButtonLoader({
                          ...buttonLoader,
                          ...{ getDropDowns: false },
                        });
                      }
                    }}
                    className="btn btn-primary"
                    disabled={buttonLoader.getDropDowns}
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
                    Add Salary
                  </Button>
                </div>
              );
            }}
          />
          <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
            {Salary.length > 0 ? (
              Salary.allSalary.map((data, index) => {
                return (
                  <div key={"skhd" + index} className="col">
                    <OurSalary
                      data={data}
                      Update={Update}
                      Delete={Delete}
                      index={index}
                    />
                  </div>
                );
              })
            ) : (
              <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                <p className="font-size: 18px; font-weight: bold;">
                  No More Salaries To Load.
                </p>
              </div>
            )}
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
              <Modal.Title className="fw-bold">{"Add Salary"}</Modal.Title>
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
              <button type="button" className="btn btn-secondary">
                Done
              </button>
              <Button
                variant="primary"
                onClick={() => {
                  Add();
                }}
                className="btn btn-danger color-fff"
              >
                {buttonLoader.addSalary && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Add
              </Button>
            </Modal.Footer>
          </Modal>

          <ModalLoader message={fetchMessage} show={modalLoader} />

          {
          Salary.totalPages &&
          Salary.totalPages - 1 >
            Salary.number && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onEndReach();
                  setLength(length - 10)
                }}
                style={{ width: "200px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p style={{ fontSize: 18, marginBottom: -2 }}>Load More</p>
                  {loadMore && (
                    <Spinner
                      animation="border"
                      size="sm"
                      style={{ marginLeft: "10px" }}
                    />
                  )}
                </div>
              </Button>
            </div>
          )}

          <div>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
              <Toast.Header>
                <strong className="mr-auto">No More Salaries to load</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}{" "}
    </>
  );
}

export default Salary;
