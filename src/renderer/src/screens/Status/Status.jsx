
import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast, Card } from "react-bootstrap";
import OurStatus from "../../components/Status/OurStatus";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";



import {
  getStatus,
  addNewStatus,
  updateCurrentStatus,
  deleteCurrentStatus
} from '../../api/status/status-api'

import {
  setClients,
  concatClients,
} from "../../redux/features/clientSlice";

import { setMembers, concatMembers } from "../../redux/features/memberSlice";

import {
  setStatus,
  addStatus,
  concatStatus,
  deleteStatus,
  updateStatus,
  deleteAllStatus
} from '../../redux/features/statusSlice'

import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import ModalLoader from "../UIComponents/ModalLoader";
import { region } from "caniuse-lite";

import {
  getAllMemberProjection,
  getAllMembers,
} from "../../api/member/member-api";


import {
  getAllClientProjection,
  getAllClients,
} from "../../api/clients/clients-api";

import {
  getIDFromSchedules,
  getInProgressSchedules,
  mergeEmployeeNamesStatus,
} from "../../helper/array-sort";

function Status() {

  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isMoreData, setIsMoreData] = useState(true);
  const [fetchMessage, setFetchMessage] = useState("");
  const Dispatch = useDispatch();

  const [reportId, setReportId] = useState("");
  const [repName , setRepName ] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState(new Date());
  const [productName, setProductName] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [revenue, setRevenue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [presRecieved, setPresRecieved] = useState("");
  const [followMeetDate, setFollowMeetDate] = useState("");
  const [salesRegion, setSalesRegion] = useState("");
  const [invcNumber, setInvcNumber] = useState("");

  const [modalLoader, setModalLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    addStatus: false,
  });

  const [clicked, setClicked] = useState(false)
  const [length, setLength] = useState(0);
  
  const Cred = useSelector((state) => state.Cred);
  // const Status = useSelector((state) => state.Status);
  const Status = useSelector((state) => state.Status);
  // console.log(Status)
  

  const [selectedClient, setSelectedClient] = useState({});
  const [selectedMember, setSelectedMember] = useState({});
  const [isOpenMember, setIsOpenMember] = useState(false);
  const [isOpenClient, setIsOpenClient] = useState(false);

  const Member = useSelector((state) => state.Member);
  const Client = useSelector((state) => state.Client);

  // console.log(Status);

  async function getAll() {
    setLoading(true);
    try {
      if (Status.allStatus.length <= 0) {
        const resp = await getStatus(Cred.token, 0, Cred.sub);
        // const Ids = getIDFromSchedules(resp.data);
        // const employeeName = await getAllMemberProjection(
        //   Ids.memberId,
        //   Cred.token
        // );
        // const clientName = await getAllClientProjection(
        //   Ids.clientId,
        //   Cred.token
        // );
        // const newStatusArray = mergeEmployeeNamesStatus(
        //   resp.data,
        //   employeeName
        // );
        // Dispatch(
        //   setStatus({
        //     allStatus: newStatusArray,
        //     paginationData: resp.paginationData,
        //   })
        // );
        // console.log(resp)
          // payload: resp,
        Dispatch(setStatus({
          paginationData: resp.paginationData,
          allStatus: resp.data,
        }));
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Status. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(false);
  }
  // useEffect(() => {
  //   setPage(0);
  //   setLength(Status.length);
  //   getAll();
  // }, []);

  async function Add() {
    if (
      !repName ||
      !customerName ||
      !productName ||
      !quantitySold ||
      !date ||
      !revenue ||
      !reportId ||
      !salesRegion
    ) {
      setIsModal(false);

      Swal.fire({
        title: "Incomplete Form",
        text: "Please Fill all necessary the fields to continue",
      }).then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }

    setButtonLoader({
      ...buttonLoader,
      ...{ addStatus: true },
    });
    try {
      const payload = {
        reportID: reportId,
        representativeName: repName,
        customerName: customerName,
        date: date,
        productName: productName,
        quantitySold: quantitySold,
        revenue: revenue,
        feedback: feedback,
        prescriptionReceived: presRecieved,
        followUpMeetingDate: followMeetDate,
        salesRegion: salesRegion,
        invoiceNumber: invcNumber,
      };
      
      // console.log(payload)
      const resp = await addNewStatus(payload, Cred.token);
      // console.log(resp)
      Dispatch(addStatus(resp));

      setIsModal(false);
      setReportId("");
      setRepName("");
      setCustomerName("");
      setDate("");
      setProductName("");
      setQuantitySold("");
      setRevenue("");
      setFeedback("");
      setPresRecieved("");
      setFollowMeetDate("");
      setSalesRegion("");
      setInvcNumber("");
    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went Wrong",
        text: "Please Try After Some Time",
      }).then((e) => setIsModal(true));
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ addStatus: false },
    });
  }

  async function Update(index, data) {
    try {
      const resp = await updateCurrentStatus(data, Cred.token);
      Dispatch(updateStatus(data));
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update current Sale. Please try After Some Time",
        icon: "error",
      });
    }
  }

  async function Delete(id, index) {
    setModalLoader(true);
    try {
      const resp = await deleteCurrentStatus(Cred.token, id);
      Dispatch(deleteStatus(id));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Delete Status", "error");
    }
    setModalLoader(false);
  }



  // const toggleDropdownMember = () => {
  //   setIsOpenMember(!isOpenMember);
  // };
  // const toggleDropdownClient = () => {
  //   setIsOpenClient(!isOpenClient);
  // };

  // async function onEndReachMember() {
  //   setButtonLoader({
  //     ...buttonLoader,
  //     ...{ loadMoreMember: true },
  //   });
  //   try {
  //     const resp = await getAllMembers(
  //       Member.paginationData.number + 1,
  //       Cred.token,
  //       Cred.sub
  //     );
  //     Dispatch(
  //       concatMembers({
  //         allMembers: resp.data,
  //         paginationData: resp.paginationData,
  //       })
  //     );
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Something went wrong",
  //       text: "Can't Fetch More Member. Please Try After Some Time.",
  //       icon: "error",
  //       timer: 2000,
  //     });
  //   }
  //   setButtonLoader({
  //     ...buttonLoader,
  //     ...{ loadMoreMember: false },
  //   });
  // }

  // async function onEndReachClient() {
  //   setButtonLoader({
  //     ...buttonLoader,
  //     ...{ loadMoreClient: true },
  //   });
  //   try {
  //     const resp = await getAllClients(
  //       Cred.token,
  //       Client.paginationData.number + 1,
  //       Cred.sub
  //     );
  //     Dispatch(
  //       concatClients({
  //         allClients: resp.data,
  //         paginationData: resp.paginationData,
  //       })
  //     );
  //   } catch (error) {
  //     setIsModal(false);
  //     Swal.fire({
  //       title: "Something went wrong",
  //       text: "Can't Fetch More Member. Please Try After Some Time.",
  //       icon: "error",
  //       timer: 2000,
  //     });
  //   }
  //   setButtonLoader({
  //     ...buttonLoader,
  //     ...{ loadMoreClient: false },
  //   });
  // }

  // async function getMember() {
  //   if (Member.allMembers.length <= 0) {
  //     const Arrays = await getAllMembers(0, Cred.token, Cred.sub);
  //     Dispatch(
  //       setMembers({
  //         allMembers: Arrays.data,
  //         paginationData: Arrays.paginationData,
  //       })
  //     );
  //   }
  // }
  // async function getClient() {
  //   if (Client.allClients.length <= 0) {
  //     const resp = await getAllClients(Cred.token, 0, Cred.sub);
  //     Dispatch(
  //       setClients({
  //         allClients: resp.data,
  //         paginationData: resp.paginationData,
  //       })
  //     );
  //   }
  // }


  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Daily Status Report"
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
                        });
                        setClicked(false)
                      }
                    }}
                    className="btn btn-primary"
                    disabled={buttonLoader.clicked}
                  >
                    {buttonLoader.clicked ? (
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
                    Add Status
                  </Button>
                </div>
              );
            }}
          />
          <div className="row clearfix g-3">
            {Status.allStatus.length > 0 ? (
                  <div className="col-sm-12">
                    <OurStatus
                      data={Status}
                      Update={Update}
                      Delete={Delete}
                    />
                  </div>
              ) : (
              <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                <p className="font-size: 18px; font-weight: bold;">
                  No Status To Load.
                </p>
              </div>
            )}
          </div>
          <Modal
          size="xl"
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                {"Add Status"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="deadline-form">
                <form>
                  <div className="row g-3 mb-3">
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput888"
                        className="form-label"
                      >
                        Member Name *
                      </label>
                      <input
                        type="text"
                        value={repName}
                        className="form-control"
                        id="exampleFormControlInput888"
                        onChange={(e) => setRepName(e.target.value)}
                        placeholder="Member Name"
                      />
                    </div>
                    {/* <div className="col-sm-12">
                      <p className="form-label">Member Name *</p>
                      <div className="custom-dropdown">
                        <div
                          id="assignMember"
                          className="dropdown-header"
                          onClick={toggleDropdownMember}
                        >
                          {selectedMember.id
                            ? selectedMember.firstName + selectedMember.lastName
                            : "Select Member"}{" "}
                          <i className="icofont-caret-down me-2 fs-6"></i>
                        </div>
                        {isOpenMember && (
                          <div className="dropdown-list">
                            {Member.allMembers.map((item, index) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setSelectedMember(item);
                                  setIsOpenMember(false);
                                }}
                                className={"dropdown-item"}
                              >
                                {item.firstName + item.lastName}
                              </div>
                            ))}
                            {Member.paginationData.totalPages &&
                              Member.paginationData.totalPages - 1 >
                                Member.paginationData.number && (
                                <button
                                  className="load-more-button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onEndReachMember();
                                  }}
                                >
                                  {buttonLoader.loadMoreMember && (
                                    <Spinner
                                      as="span"
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden="true"
                                      className="me-1"
                                    />
                                  )}{" "}
                                  Load More
                                </button>
                              )}
                          </div>
                        )}
                      </div>
                    </div> */}
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput878"
                        className="form-label"
                      >
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        className="form-control"
                        id="exampleFormControlInput878"
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Client Name"
                      />
                    </div> 
                    {/* <div className="col-sm-12">
                    <p className="form-label">Client Name *</p>
                    <div className="custom-dropdown">
                      <div
                        id="assignClient"
                        className="dropdown-header"
                        onClick={toggleDropdownClient}
                      >
                        {selectedClient.id
                          ? selectedClient.clientFirstName +
                            " " +
                            selectedClient.clientLastName
                          : "Select Client"}
                        <i className="icofont-caret-down me-2 fs-6"></i>
                      </div>
                      {isOpenClient && (
                        <div className="dropdown-list">
                          {Client.allClients.map((item, index) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedClient(item);
                                setIsOpenClient(false);
                              }}
                              className={"dropdown-item"}
                            >
                              {item.clientFirstName} {item.clientLastName}{" "}
                              {" (" + item.clientCode + ")"}
                            </div>
                          ))}
                          {Client.paginationData.totalPages &&
                            Client.paginationData.totalPages - 1 >
                              Client.paginationData.number && (
                              <button
                                className="load-more-button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onEndReachClient();
                                }}
                              >
                                {buttonLoader.loadMoreClient && (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-1"
                                  />
                                )}{" "}
                                Load More
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  </div> */}
                    <div className="col-lg-6">
                      <label
                        className="form-label"
                        htmlFor="exampleFormControlInput257"
                      >
                        Product Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={productName}
                        placeholder="Product Name"
                        id="exampleFormControlInput257"
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput277"
                        className="form-label"
                      >
                       Quantity Sold *
                      </label>
                      <input
                        type="text"
                        value={quantitySold}
                        onChange={(e) => setQuantitySold(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput277"
                        placeholder="Quantity Sold"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="exampleFormControlInput477"
                        placeholder="Date"
                        value={date}
                        // defaultValue={new Date().toISOString().substr(0, 10)}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput777"
                        className="form-label"
                      >
                      Revenue *
                      </label>
                      <input
                        type="text"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput777"
                        placeholder="Revenue"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput778"
                        className="form-label"
                      >
                      Follow Up Meeting Date 
                      </label>
                      <input
                        type="date"
                        value={followMeetDate}
                        onChange={(e) => setFollowMeetDate(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput778"
                        placeholder="Follow up Meeting Date"
                      />
                    </div>
                    <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput277"
                          className="form-label"
                        >
                          POB (Prescription Received) *
                        </label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={presRecieved === true}
                            onChange={() => setPresRecieved(true)}
                            value={true}
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                          Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={presRecieved === false}
                            onChange={() => setPresRecieved(false)}
                            value={false}
                            id="flexCheckDefault1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault1"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput780"
                        className="form-label"
                      >
                      Sales Region *
                      </label>
                      <input
                        type="text"
                        value={salesRegion}
                        onChange={(e) => setSalesRegion(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput780"
                        placeholder="Sales Region"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput783"
                        className="form-label"
                      >
                      Report ID *
                      </label>
                      <input
                        type="text"
                        value={reportId}
                        onChange={(e) => setReportId(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput783"
                        placeholder="Report ID"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput785"
                        className="form-label"
                      >
                      Invoice Number
                      </label>
                      <input
                        type="text"
                        value={invcNumber}
                        onChange={(e) => setInvcNumber(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput785"
                        placeholder="Invoice Number"
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput782"
                        className="form-label"
                      >
                      Feedback
                      </label>
                      <input
                        type="text"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput782"
                        placeholder="Feedback"
                      />
                    </div>
                  </div>
                </form>
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
                {buttonLoader.addStatus && (
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
          

          <div>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
              <Toast.Header>
                <strong className="mr-auto">No More Status to load</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}{" "}
    </>
  );
}

export default Status;

