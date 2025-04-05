import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { Form } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { DCRreportingManagers as getDcr, getAllDcr } from "../../api/dcr/dcr-api";
import { concatDcr } from "../../redux/features/dcrSlice";
import { getDateFormat, getTimeFormat } from "../../helper/date-functions";
import DataTable from "react-data-table-component";

function OurDcr(props) {
  const Data = props.data;

  const [flag, setFlag] = useState({
    dcrLoading : false,
    isFilterOpen : false,
    isApply : false,
    isModal : false,
    loadMore : false
  })
  const Cred = useSelector((state) => state.Cred);
  const [allDcrData, setAllDcrData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  // const [date, setDate] = useState("");
  const Dispatch = useDispatch();

  const Dcr = useSelector((state) => state.Dcr);


  async function getMemberAllDcr(id) {
    setFlag({...flag, dcrLoading : true})
    try {
      const resp = await getAllDcr(
        Cred.token,
        id,
        new Date().toISOString().split("T")[0]
      );
      setAllDcrData(resp.dcrGet);
    setFlag({...flag, dcrLoading : false, isModal : true})

    } catch (error) {
    setFlag({...flag, dcrLoading : false})

      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Member Dcr. Please try After Some Time",
        icon: "error",
      });
    }
  }

  var columnT = "";
  columnT = [
    {
      name: "Employee Name",
      selector: (row) => row.members.firstName + " " + row.members.lastName,
      sortable: false,
      style: {
        backgroundColor: "#b6e8e3",
        position: "sticky",
        top: "0",
        left: "0",
        zIndex: "2",
      },
    },
    {
      name: " Date ",
      selector: (row) => getDateFormat(new Date(row.dcrDate)),
      sortable: true,
    },
    {
      name: "Cities",
      selector: (row) => row.cities.cityName,
      sortable: false,
    },
    {
      name: "Work Type",
      selector: (row) => (row.workType ? row.workType : "Not working"),
      sortable: true,
      style: {
        backgroundColor: "#87CEFA",
      },
    },
    {
      name: "Work With",
      selector: (row) =>
        Array.isArray(row.checkInLocation) &&
        row.workType &&
        row.checkInLocation.length > 0
          ? row.workWith.map((item) => item.firstName + " " + item.lastName)
          : "self working",
      sortable: true,
      style: {
        backgroundColor: "#6699b8",
      },
    },
    {
      name: "Check-in time",
      selector: (row) =>
        Array.isArray(row.checkInLocation) &&
        row.checkInLocation.length > 0 &&
        row.checkInLocation.find((item) => item.startDay && !item.endDay)
          ? getTimeFormat(new Date(row.checkInLocation[0].checkInTime))
          : "NA",
      sortable: false,
      style: {
        backgroundColor: "#90EE90",
      },
    },
    {
      name: "First Call Time",
      selector: (row) =>
        Array.isArray(row.checkInLocation) &&
        row.checkInLocation.length > 0 &&
        row.checkInLocation.find((item) => !item.startDay && !item.endDay)
          ? getTimeFormat(new Date(row.checkInLocation[1].checkInTime))
          : "NA",
      sortable: false,
      style: {
        backgroundColor: "#67ab67",
      },
    },
    {
      name: "Last Call Time",
      selector: (row) => {
        if (
          Array.isArray(row.checkInLocation) &&
          row.checkInLocation.length > 0 &&
          row.checkInLocation.find((item) => !item.startDay && !item.endDay)
        ) {
          let len = row.checkInLocation.length;
          return len > 2 ? getTimeFormat(new Date(row.checkInLocation[len - 2].checkInTime)) : row.checkInLocation[len-1];
        } else {
          return "NA";
        }
      },
      style: {
        backgroundColor: "#90EE90",
      },
      sortable: false,
    },
    {
      name: "Check-out time",
      selector: (row) => {
        if (
          Array.isArray(row.checkInLocation) &&
          row.checkInLocation.length > 0 &&
          row.checkInLocation.find((item) => item.endDay && !item.startDay)
        ) {
          let len = row.checkInLocation.length;
          return getTimeFormat(new Date(row.checkInLocation[len - 1].checkInTime))
        } else {
          return "NA";
        }
      },

      sortable: false,
      style: {
        backgroundColor: "#67ab67",
      },
    },
    {
      name: "Day Start Location",
      selector: (row) => {
        if (
          Array.isArray(row.checkInLocation) &&
          row.checkInLocation.length > 0 &&
          row.checkInLocation.find((item) => item.startDay && !item.endDay)
        ) {
          return row.checkInLocation[0].formattedAddress;
        } else {
          return "NA";
        }
      },
      style: {
        backgroundColor: "#eaba81",
      },
      sortable: false,
    },
    {
      name: "Day End Location",
      selector: (row) => {
        if (
          Array.isArray(row.checkInLocation) &&
          row.checkInLocation.length > 0 &&
          row.checkInLocation.find((item) => !item.startDay && item.endDay)
        ) {
          let len = row.checkInLocation.length;
          return row.checkInLocation[len - 1].formattedAddress;
        } else {
          return "NA";
        }
      },
      sortable: false,
      style: {
        backgroundColor: "#C19A6B",
      },
    },
    {
      name: "KM Status",
      selector: (row) => (row.distance ? row.distance : "0"),
      sortable: false,
      style: {
        backgroundColor: "#eaba81",
      },
    },
    {
      name: "Non-Visited Doctors",
      selector: (row) => (row.drNotMet ? row.drNotMet : "NA"),
      sortable: false,
    },
    {
      name: "Listed Doctor",
      selector: (row) => (row.noDoctorListed ? row.noDoctorListed : "NA"),
      sortable: false,
    },
    {
      name: "Non-Listed Doctor",
      selector: (row) => (row.noDoctorNonListed ? row.noDoctorNonListed : "NA"),
      sortable: false,
    },
    {
      name: "Listed Party",
      selector: (row) => (row.noPartyListed ? row.noPartyListed : "NA"),
      sortable: false,
    },
    {
      name: "Non-Listed Party",
      selector: (row) => (row.noPartyNonListed ? row.noPartyNonListed : "NA"),
      sortable: false,
    },
    {
      name: "Calls Left",
      selector: (row) => (row.noReminderCall ? row.noReminderCall : "NA"),
      sortable: false,
    },
    {
      name: "Total Call",
      selector: (row) => (row.totalCall ? row.totalCall : "0"),
      sortable: false,
    },
    {
      name: "Vehicle Type",
      selector: (row) => (row.vehicleType ? row.vehicleType : "NA"),
      sortable: false,
    },
    {
      name: "POB Status",
      selector: (row) =>
        row.pob === null ? (
          <span className="fs-6 text-danger">Not Recieved</span>
        ) : row.pob ? (
          <span className="fs-6 text-success">Recieved</span>
        ) : (
          <span className="fs-5 text-warning">Pending</span>
        ),
      sortable: false,
      style: {
        backgroundColor: "#CCCCFF",
      },
    },
    {
      name: "Total POB",
      selector: (row) => (row.totalPOB ? row.totalPOB : ""),
      sortable: false,
      style: {
        backgroundColor: "#8989ac",
      },
    },
    {
      name: "Night Stay Status",
      selector: (row) =>
        row.nightStayStatus ? (
          <span className="text-success fs-5">
            <i className="icofont-check-circled"></i>
          </span>
        ) : (
          <span className="text-danger fs-5">
            <i className="icofont-close-circled "></i>
          </span>
        ),
      sortable: false,
      style: {
        backgroundColor: "#E5E4E2",
      },
    },
    {
      name: "Night Stay Location",
      selector: (row) => (row.nightStayStatus ? row.nightStayLocation : ""),
      sortable: false,
      style: {
        backgroundColor: "#c4c3c3",
      },
    },
    {
      name: "All Checkin Locations",
      selector: (row) => (
        <button onClick={() => getMemberAllDcr(row.id)}>
          {flag.dcrLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
            />
          ) : (
            "View"
          )}
        </button>
      ),
    },
    {
      name: "Remarks",
      selector: (row) => (row.remarks === null ? "NA" : row.remarks),
      sortable: false,
    },
  ];

  const handlePageChange = async (NextPage) => {
    if (
      Dcr.paginationData.totalPages - 1 == Dcr.paginationData.number ||
      Dcr.paginationData.number > Dcr.paginationData.totalPages
    ) {
      return;
    }
    setFlag({...flag, loadMore : true})
    try {
      const resp = await getDcr(
        Cred.token,
        Dcr.paginationData.number + 1,
        Cred.sub
      );
      const valueObject = {
        paginationData: resp.paginationData,
        allDcr: resp.data,
      };
      Dispatch(concatDcr(valueObject));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Fetch More Data");
    }
    setFlag({...flag, loadMore: false})
  };

  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <div className="col-sm-12">
        <DataTable
            id="Data_table"
            columns={columnT.map((column) => ({
              ...column,
              width: `${column.name.length * 10 + 40}px`,
              wrap: true,
              position: "relative",
            }))}
            title={Dcr.id}
            data={Data}
            defaultSortField="title"
            onChangePage={handlePageChange}
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            paginationTotalRows={Dcr.paginationData.totalElements}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            />
          {/* <Button
            variant="primary"
            className="btn btn-danger color-fff"
            onClick={() => {
              setisFilterOpen(true);
            }}
          >Apply Filters
          </Button>
          {
            filteredData.length > 0 ? 
            <DataTable
            id="Data_table"
            columns={columnT.map((column) => ({
              ...column,
              width: `${column.name.length * 10 + 40}px`,
              wrap: true,
              position: "relative",
            }))}
            title={Dcr.id}
            // columns={columnT}
            data={filteredData}
            defaultSortField="title"
            onChangePage={handlePageChange}
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            paginationTotalRows={Dcr.paginationData.totalElements}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            /> : 
            <DataTable
            id="Data_table"
            columns={columnT.map((column) => ({
              ...column,
              width: `${column.name.length * 10 + 40}px`,
              wrap: true,
              position: "relative",
            }))}
            title={Dcr.id}
            // columns={columnT}
            data={Data}
            defaultSortField="title"
            onChangePage={handlePageChange}
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            paginationTotalRows={Dcr.paginationData.totalElements}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            />
          } */}
            </div>
      </div>
      <Modal
        size="xl"
        centered
        show={flag.isModal}
        onHide={() => {
          setFlag({...flag, isModal : false})
          setAllDcrData([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">DCR Location List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="deadline-form">
            <form>
              <div className="row g-3 mb-3">
                <div className="col-3">
                  <label
                    htmlFor="exampleFormControlInput888"
                    className="form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Client Name
                  </label>
                </div>
                <div className="col-4">
                  <label
                    htmlFor="exampleFormControlInput878"
                    className="form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Time
                  </label>
                </div>
                <div className="col-5">
                  <label
                    htmlFor="exampleFormControlInput878"
                    className="form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Locations
                  </label>
                </div>
              </div>
              {Array.isArray(allDcrData) &&
                allDcrData.length > 0 &&
                allDcrData.map((data, i) =>
                  data.checkInLocation.map((item, index) => (
                    <div className="row g-3 mb-3" key={index}>
                      <div className="col-3">
                        <label
                          htmlFor="exampleFormControlInput888"
                          className="form-label"
                        >
                          {item.clientId ? item.clientId : "NA"}
                        </label>
                      </div>
                      <div className="col-4">
                        <label
                          htmlFor="exampleFormControlInput878"
                          className="form-label"
                        >
                          {item.checkInTime ? getTimeFormat(new Date(item.checkInTime)) : "NA"}
                        </label>
                      </div>
                      <div className="col-5">
                        <label
                          htmlFor="exampleFormControlInput878"
                          className="form-label"
                        >
                          {item.formattedAddress ? item.formattedAddress : "NA"}
                        </label>
                      </div>
                    </div>
                  ))
                )}
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal
        size="xl"
        centered
        show={isFilterOpen}
        onHide={() => {
          setisFilterOpen(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Apply Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="deadline-form">
            <form>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput878"
                    className="form-label"
                  >
                    Date
                  </label>
                  <Form.Select
                    onChange={(e) => {
                      setDate(e.target.value)
                    }}
                    aria-label="Date"
                  >
                    <option value="">Select date</option>
                    { Dcr.allDcr.length > 0 && Dcr.allDcr.map((item, index) => 
                          <option key={index} value={item.dcrDate}>{item.dcrDate}</option>
                  )}
                  </Form.Select>
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
              setisFilterOpen(false);
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            className="btn btn-danger color-fff"
            onClick={() => {
              setIsApply(true);
              const resp = Dcr.allDcr.filter((item) => item.dcrDate === date)
              setFilteredData(resp)
              setIsApply(false);
            }}
          >
            {isApply ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            ) : (
              "Apply"
            )}
          </Button>
        </Modal.Footer>
      </Modal> */}
      </div>
  );
}

export default OurDcr;
