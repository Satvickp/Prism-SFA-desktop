import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import ModalLoader from "../../screens/UIComponents/ModalLoader";
import { useSelector, useDispatch } from "react-redux";

import { getStatus, getStatusDetails } from "../../api/status/status-api";

import { concatStatus } from "../../redux/features/statusSlice";

import DataTable from "react-data-table-component";

function OurStatus(props) {
  const Data = props.data;
  // const Data = props.map((data, index) => data );

  // console.log(Data)

  const [reportId, setReportId] = useState(Data.allStatus.reportID);
  const [repName, setRepName] = useState(Data.allStatus.representativeName);
  const [customerName, setCustomerName] = useState(Data.allStatus.customerName);
  const [date, setDate] = useState(Data.allStatus.date);
  const [productName, setProductName] = useState(Data.allStatus.productName);
  const [quantitySold, setQuantitySold] = useState(Data.allStatus.quantitySold);
  const [revenue, setRevenue] = useState(Data.allStatus.revenue);
  const [feedback, setFeedback] = useState(Data.allStatus.feedback);
  const [presRecieved, setPresRecieved] = useState(
    Data.allStatus.prescriptionReceived
  );
  const [followMeetDate, setFollowMeetDate] = useState(
    Data.allStatus.followUpMeetingDate
  );
  const [salesRegion, setSalesRegion] = useState(Data.allStatus.salesRegion);
  const [invcNumber, setInvcNumber] = useState(Data.allStatus.invoiceNumber);

  const [loading, setloading] = useState(false);
  const [delLoad, setDelLoad] = useState(false);
  const { index } = props;
  const Cred = useSelector((state) => state.Cred);
  const [isModal, setIsModal] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [authority, setAuthority] = useState(false);
  const [DATAID, setDATAID] = useState("");

  const [buttonLoader, setButtonLoader] = useState({
    updateStatus: false,
  });

  const Dispatch = useDispatch();

  const Status = useSelector((state) => state.Status);

  // console.log(Status)

  var columnT = "";
  columnT = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Member Name",
      selector: (row) => row.representativeName,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantitySold,
      sortable: false,
    },
    {
      name: "Revenue",
      selector: (row) => row.revenue,
      sortable: true,
    },
    {
      name: "Report ID",
      selector: (row) => row.reportID,
      sortable: true,
    },
    {
      name: "Sales Region",
      selector: (row) => row.salesRegion,
      sortable: true,
    },
    {
      name: "Follow up Meet Date",
      selector: (row) => row.followUpMeetingDate,
      sortable: true,
    },
    {
      name: "POB",
      selector: (row) =>
        row.prescriptionReceived ? (
          <span className="text-success fs-5">
            <i className="icofont-check-circled"></i>
          </span>
        ) : (
          <span className="text-danger fs-5">
            <i className="icofont-close-circled "></i>
          </span>
        ),
      sortable: true,
    },
    {
      name: "Feedack",
      selector: (row) => row.feedback,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => (
        <div
          className="btn-group mt-2"
          role="group"
          aria-label="Basic outlined example"
        >
          {/* edit button */}

          <button
            onClick={async () => {
              setloading(true);
              setDATAID(row.id);
              try {
                const resp = await getStatusDetails(Cred.token, row.id);

                // console.log(resp)

                setReportId(resp.reportID);
                setRepName(resp.representativeName);
                setCustomerName(resp.customerName);
                setDate(resp.date);
                setProductName(resp.productName);
                setQuantitySold(resp.quantitySold);
                setRevenue(resp.revenue);
                setFeedback(resp.feedback);
                setPresRecieved(resp.prescriptionReceived);
                setFollowMeetDate(resp.followUpMeetingDate);
                setSalesRegion(resp.salesRegion);
                setInvcNumber(resp.invoiceNumber);
                setIsModal(true);
              } catch (error) {
                setIsModal(false);
                Swal.fire("Something went wrong", "Can't Fetch Necessary data");
              }
              setloading(false);
            }}
            type="button"
            className="btn btn-outline-secondary "
          >
            <i className="icofont-edit text-success fs-5"></i>
          </button>

          {/* delete button */}

          <button
            onClick={() => {
              setDATAID(row.id);
              setIsModalDelete(true);
            }}
            type="button"
            className="btn btn-outline-secondary "
          >
            <i className="icofont-ui-delete text-danger fs-5"></i>
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  const handlePageChange = async (NextPage) => {
    if (
      Status.paginationData.totalPages - 1 == Status.paginationData.number ||
      Status.paginationData.number > Status.paginationData.totalPages
    ) {
      return;
    }
    setLoadMore(true);
    try {
      const resp = await getStatus(
        Cred.token,
        Status.paginationData.number + 1,
        Cred.sub
      );
      const valueObject = {
        paginationData: resp.paginationData,
        allStatus: resp.data,
      };
      Dispatch(concatStatus(valueObject));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Fetch More Data");
    }
    setLoadMore(false);
  };

  const handleRowSelect = async () => {
    alert("working row selected");
  };

  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <DataTable
            id="Data_table"
            title={Status.allStatus.id}
            columns={columnT}
            data={Status.allStatus}
            defaultSortField="title"
            onChangePage={handlePageChange}
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            paginationTotalRows={Status.paginationData.totalElements}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            // customStyles={customStyles}
          />
        </div>
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
          <Modal.Title className="fw-bold">Edit Status</Modal.Title>
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModal(false);
              setDATAID("");
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              setIsModal(true);
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
                  title: "Invalid Details",
                  text: "Make Sure You Filled Each Details With Correct Value",
                  timer: 2000,
                  icon: "warning",
                }).then((e) => setIsModal(true));
                return;
              }
              setButtonLoader({
                ...buttonLoader,
                ...{ updateStatus: true },
              });

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
                id: DATAID,
              };

              console.log("payload of ourstatus", payload);

              await props.Update(index, payload);
              setIsModal(false);
              setDATAID("");
              setButtonLoader({
                ...buttonLoader,
                ...{ updateStatus: false },
              });
            }}
          >
            {buttonLoader.updateStatus && (
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
        show={isModalDelete}
        centered
        onHide={() => {
          setIsModalDelete(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Status</Modal.Title>
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
                await props.Delete(DATAID);
                setDelLoad(false);
                setDATAID("");
              } catch (error) {
                setIsModal(false);
                setDelLoad(false);
                setDATAID("");
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
      <ModalLoader show={delLoad} message={"Deleting Status"} />
    </div>
  );
}

export default OurStatus;
