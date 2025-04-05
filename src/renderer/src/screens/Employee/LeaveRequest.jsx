import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { exportToExcel } from "../../helper/exportFunction";
import PageHeader from "../../components/common/PageHeader";
import { LeaveRequestData } from "../../components/Data/AppData";
import { useDispatch, useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  createLeave,
  getAllLeaves,
  getAllLeavesByManagerId,
  getAllLeavesByMemberId,
  getLeaveTypes,
  updateLeave,
  deleteLeave,
} from "../../api/member/member-leave-api";

import {
  setLeaveRequests,
  addLeaveRequests,
  deleteAllLeaveRequests,
  updateLeaveRequests,
  deleteLeaveRequests,
  concatLeaveRequests,
  setAllMyLeaveRequest,
  addMyLeaveRequest,
  updateMyLeaveRequests,
} from "../../redux/features/leaveRequestSlice";

import { setAllLeaveTypes } from "../../redux/features/dropdownFieldSlice";

import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import { getIDSFromExpense, mergeEmployeeNames } from "../../helper/array-sort";
import { getAllMemberProjection } from "../../api/member/member-api";
import { getDateFormat, getNumberOfDays } from "../../helper/date-functions";
import { useMemberHook } from "../../hooks/memberHook";
import { permissionIds } from "../../constants/constants";

function LeaveRequest() {
  const [page, setPage] = useState(0);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState();
  const [leaveId, setLeaveId] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [isHalfDay, setHalfDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [isEditModal, setIsEditModal] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEndDateOpen, setisEndDateOpen] = useState(false);
  const [isStartDateOpen, setisStartDateOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [approvedLeaveLoader, setApprovedLeaveLoader] = useState(false);
  const [addLeaveData, setAddLeaveData] = useState({});
  const [rejectLeaveLoader, setRejectLeaveLoader] = useState(false);
  const [addLeaveLoader, setAddLeaveLoader] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [remark, setRemark] = useState("");

  const [key, setKey] = useState("self");

  const Cred = useSelector((state) => state.Cred);
  const Member = useSelector((state) => state.Member);
  // const selectedLeave = useRef({});
  const [selectedLeave, setSelectedLeave] = useState({});

  const LeaveRequests = useSelector((state) => state.LeaveRequests);
  const allLeaveType = useSelector(
    (state) => state.DropDownsField.allLeaveTypes
  );
  const { memberPermissions } = useSelector((state) => state.Permission);
  const Dispatch = useDispatch();

  // const { isError, isLoading, get, getMembersArrayByArrayIds } =
  //   useMemberHook();

  // const allMemberArray = getMembersArrayByArrayIds();

  const { get } = useMemberHook();
  useEffect(() => {
    get();
  }, []);

  async function getCall() {
    setLoading(true);
    const resp = await getLeaveTypes(Cred.token);
    Dispatch(setAllLeaveTypes(resp));
    if (LeaveRequests.allLeaveRequests.length < 1) {
      await fetchAll();
    }
    // if (allLeaveType.length < 1) {
    //   await fetchAllLeaveTypes();
    // }
    setLoading(false);
  }

  const fetchAll = async () => {
    try {
      const resp = memberPermissions.some(
        (item) => item === permissionIds.SUPER_ADMIN
      )
        ? await getAllLeaves(Cred.token, 0, Cred.sub)
        : await getAllLeavesByManagerId(Cred.token, 0, Cred.sub);
      const memberIds = getIDSFromExpense(resp.data);
      // const memberName = await getAllMemberProjection(memberIds, Cred.token);
      // const Data = mergeEmployeeNames(resp.data, memberName);
      Dispatch(
        setLeaveRequests({
          paginationData: resp.paginationData,
          allLeaveRequests: resp.data,
        })
      );

      const response = await getAllLeavesByMemberId(Cred.token, 0, Cred.sub);
      Dispatch(setAllMyLeaveRequest(response.data));
    } catch (error) {
      Swal.fire("Error", "Something Went Wrong Can't Fetch Leave");
    }
  };

  useEffect(() => {
    // if (Member.allMembers.length <= 0) get();
    getCall();
  }, []);


  const acceptLeave = async (row) => {
    setApprovedLeaveLoader(true);
    try {
      console.log(row);
      const resp = await updateLeave(Cred.token, row?.id, { ...row, status: 1, remarks: remark });
      console.log(resp)
      Dispatch(updateLeaveRequests(resp));
      setIsEditModal(false);
      setRemark("");
      // selectedLeave.current = {};
      setSelectedLeave({});
    } catch (error) {
      setIsEditModal(false);
      console.log(error)
      Swal.fire("Error", "Something Went Wrong Can't Accept Leave");
    }
    setApprovedLeaveLoader(false);
  };
  const getStatusStyles = (status) => {
    if (status === 1) {
      return {
        backgroundColor: "green",
        color: "white",
        padding: 7,
      };
    } else {
      return {
        backgroundColor: "red",
        color: "white",
        padding: 7,
      };
    }
  };

  const rejectLeave = async (row) => {
    setRejectLeaveLoader(true);
    try {
      const resp = await updateLeave(Cred.token, row?.id , { ...row, status: 2, remarks: remark });
      Dispatch(updateLeaveRequests(resp));
      setIsDeleteModal(false);
      setRemark("");
      setSelectedLeave({});
    } catch (error) {
      setIsDeleteModal(false);
      console.log(error)
      Swal.fire("Error", "Something Went Wrong Can't Accept Leave");
    }
    setRejectLeaveLoader(false);
  };
  var MemberColumnT = "";
  MemberColumnT = [
    {
      name: "EMPLOYEE",
      selector: (row) =>
        row.firstName ? `${row?.firstName} ${row?.lastName}` : "NA",
      sortable: true,
    },
    {
      name: "LEAVE TYPE",
      selector: (row) => {
        const leaveType = allLeaveType.find((e, i) => e.id == row.leaveType);
        return leaveType ? leaveType.name : "No Leave Type";
      },
      sortable: true,
    },
    {
      name: "FROM",
      selector: (row) => row.startAt,
      sortable: true,
    },
    {
      name: "TO",
      selector: (row) => (row.halfDay ? row.startAt : row.endAt),
      sortable: true,
    },
    {
      name: "REASON",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "ACTION",
      selector: (row) => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.employeeId == Cred.sub && row.actionBy != Cred.sub ? (
            <p
              style={{
                marginTop: "1em",
                padding: "1px",
                ...getStatusStyles(row.status),
                backgroundColor:
                  row.status === 0 || !row.status
                    ? "orange"
                    : getStatusStyles(row.status).backgroundColor,
                fontSize: 13,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {row.status == 0 || !row.status
                ? "Pending"
                : row.status == 1
                ? "Accepted"
                : "Rejected"}
            </p>
          ) : row.status == 0 ? (
            <>
              {memberPermissions?.some(
                (item) =>
                  item == permissionIds.SUPER_ADMIN ||
                  item == permissionIds.REPORTING_MANAGER
              ) && (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      // acceptLeave(row);
                      setSelectedLeave(row)
                      setIsEditModal(true);
                    }}
                  >
                    <i className="icofont-check-circled text-success"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary deleterow"
                    onClick={() => {
                      setSelectedLeave(row)
                      // rejectLeave(row);
                      // selectedLeave.current = row;
                      setIsDeleteModal(true);
                    }}
                  >
                    <i className="icofont-close-circled text-danger"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <p
              style={{
                marginTop: "1em",
                padding: "1px",
                ...getStatusStyles(row.status),
                fontSize: 13,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {row.status === 1 ? "Accepted" : "Rejected"}
            </p>
          )}
        </div>
      ),
    },
  ];

  var SelfColumnT = "";
  SelfColumnT = [
    {
      name: "LEAVE TYPE",
      selector: (row) => {
        const leaveType = allLeaveType.find((e, i) => e.id == row.leaveType);
        return leaveType ? leaveType.name : "No Leave Type";
      },
      sortable: true,
    },
    {
      name: "FROM",
      selector: (row) => row.startAt,
      sortable: true,
    },
    {
      name: "TO",
      selector: (row) => (row.halfDay ? row.startAt : row.endAt),
      sortable: true,
    },
    {
      name: "REASON",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.employeeId == Cred.sub && row.actionBy != Cred.sub ? (
            <p
              style={{
                marginTop: "1em",
                padding: "1px",
                ...getStatusStyles(row.status),
                backgroundColor:
                  row.status === 0 || !row.status
                    ? "orange"
                    : getStatusStyles(row.status).backgroundColor,
                fontSize: 13,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {row.status == 0 || !row.status
                ? "Pending"
                : row.status == 1
                ? "Accepted"
                : "Rejected"}
            </p>
          ) : row.status == 0 ? (
            <></>
          ) : (
            <p
              style={{
                marginTop: "1em",
                padding: "1px",
                ...getStatusStyles(row.status),
                fontSize: 13,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {row.status === 0
                ? "Pending"
                : row.status === 1
                ? "Accepted"
                : "Rejected"}
            </p>
          )}
        </div>
      ),
    },
    {
      name: "ACTION",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setEditData(row);
              setIsModal(true);
              setAddLeaveData(row);
              setStartDate(row.startAt); // Set start date
              setEndDate(row.endAt);
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteData(row);
              handleIsModalDelete();
            }}
            className="btn btn-outline-secondary deleterow"
          >
            <i className="icofont-ui-delete text-danger"></i>
          </button>
        </div>
      ),
    },
  ];
  // console.log(editData);
  function handleIsModalDelete() {
    setIsModalDelete(!isModalDelete);
  }

  const handleDeleteLeave = async () => {
    try {
      handleIsModalDelete();
      await deleteLeave(Cred.token, deleteData?.id);
      Dispatch(deleteLeaveRequests(deleteData?.id));
      Swal.fire({
        title: "Leave Deleted",
        text: "This Leave is deleted successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.log("Error:: ", error);
      handleIsModalDelete();
      Swal.fire("Unable to delete this Leave", "", "error");
    }
  };

  const handlePageChange = async (NextPage) => {
    if (
      LeaveRequests.paginationData.totalPages - 1 ==
        LeaveRequests.paginationData.page ||
      LeaveRequests.paginationData.page >
        LeaveRequests.paginationData.totalPages
    ) {
      return;
    }
    setLoadMore(true);
    try {
      const resp = await getAllLeaves(
        Cred.token,
        LeaveRequests.paginationData.page + 1,
        Cred.sub
      );
      // const memberIds = getIDSFromExpense(resp.data);
      // const memberName = await getAllMemberProjection(memberIds, Cred.token);
      // const Data = mergeEmployeeNames(resp.data, memberName);
      Dispatch(
        concatLeaveRequests({
          allLeaveRequests: resp.data,
          paginationData: resp.paginationData,
        })
      );
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Fetch More Data");
    }
    setLoadMore(false);
  };
  function onHalfDay() {
    setAddLeaveData({
      ...addLeaveData,
      duration: !addLeaveData.halfDay ? "0.5" : "",
      halfDay: !addLeaveData.halfDay,
    });
    setEndDate("");
  }
  useEffect(() => {
    if (loading) return;
    const endAt = endDate ? new Date(endDate) : undefined;
    const startAt = startDate ? new Date(startDate) : undefined;
    if (endAt && startAt) {
      setAddLeaveData({
        ...addLeaveData,
        duration: getNumberOfDays(startAt, endAt),
      });
    }
    // if (
    //   addLeaveData.startAt
    //     ? new Date(addLeaveData.startAt)
    //     : "" instanceof Date && addLeaveData.endAt
    //     ? new Date(addLeaveData.endAt)
    //     : "" instanceof Date
    // ) {
    //   alert("ram");
    //   const duration = getNumberOfDays(
    //     addLeaveData.startAt,
    //     addLeaveData.endAt
    //   );

    //   setAddLeaveData({ ...addLeaveData, duration: duration.toString() });
    // }
  }, [endDate]);

  const customStyles = {
    headCells: {
      style: {
        padding: "15px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        padding: "1px 15px",
      },
    },
  };
  return (
    <>
      {loading ? (
        <Loading color={"black"} animation={"border"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Leave Request"
            renderRight={() => {
              return (
                <div className="col-auto d-flex w-sm-100 ">
                  {memberPermissions.some(
                    (item) =>
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER ||
                      item == permissionIds.CREATE_MANAGER
                  ) && (
                    <button
                      className="btn btn-dark btn-set-task w-sm-100"
                      onClick={async () => {
                        setIsModal(true);
                        if (allLeaveType.length > 0) return;
                        try {
                          const resp = await getLeaveTypes(Cred.token);
                          Dispatch(setAllLeaveTypes(resp));
                        } catch (error) {
                          setIsModal(false);
                          Swal.fire(
                            "Something went wrong",
                            "Can't Fetch Necessary Data",
                            "error"
                          );
                        }
                      }}
                    >
                      <i className="icofont-plus-circle me-2 fs-6"></i>Request
                      Leave
                    </button>
                  )}

                  {/* export to excel */}
                  {memberPermissions.some(
                    (item) =>
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER
                  ) && (
                    <button
                      className="btn btn-dark btn-set-task w-sm-100 mx-2"
                      onClick={async () => {
                        try {
                          let mainData = [];
                          LeaveRequests.allLeaveRequests.map((item, index) => {
                            mainData.push({
                              "EMPLOYEE NAME": item.employeeName,
                              "LEAVE TYPE":
                                item.leaveType === 1
                                  ? "Flexible leave"
                                  : item.leaveType === 2
                                  ? "Unpaid leave"
                                  : "Sick leave",
                              FROM: item.startAt,
                              TO: item.endAt,
                              REASON: item.reason,
                              ACTION:
                                item.status === 0
                                  ? "Pending"
                                  : item.status === 1
                                  ? "Approved"
                                  : "Rejected",
                            });
                          });
                          exportToExcel(mainData);
                        } catch (error) {
                          Swal.fire(
                            "Something went wrong",
                            "Can't Export Necessary Data",
                            "error"
                          );
                        }
                      }}
                    >
                      <i className="icofont-download-alt"></i>
                    </button>
                  )}
                </div>
              );
            }}
          />
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="self" title="My Leaves">
                  {LeaveRequests.allMyLeaveRequest.length <= 0 ? (
                    <h1>No leave to show</h1>
                  ) : (
                    <DataTable
                      title={LeaveRequestData.title}
                      columns={SelfColumnT}
                      data={LeaveRequests.allMyLeaveRequest}
                      defaultSortField="title"
                      // onChangePage={handlePageChange}
                      pagination
                      selectableRows={false}
                      //className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      // page
                      // paginationServer
                      progressComponent={
                        <Loading animation={"border"} color={"black"} />
                      }
                      // paginationTotalRows={
                      //   LeaveRequests.paginationData.totalElements
                      // }
                      // paginationComponentOptions={{
                      //   noRowsPerPage: true,
                      // }}
                      customStyles={customStyles}
                    />
                  )}
                </Tab>
                {Member.allMembers.length > 0 && (
                  <Tab eventKey="member" title="Member Leaves">
                    {LeaveRequests.allLeaveRequests.length <= 0 ? (
                      <h1>No leave to show</h1>
                    ) : (
                      <DataTable
                        title={LeaveRequestData.title}
                        columns={MemberColumnT}
                        data={LeaveRequests.allLeaveRequests}
                        defaultSortField="title"
                        // onChangePage={handlePageChange}
                        pagination
                        selectableRows={false}
                        //className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline pt-1"
                        highlightOnHover={true}
                        // page
                        // paginationServer
                        progressComponent={
                          <Loading animation={"border"} color={"black"} />
                        }
                        // paginationTotalRows={
                        //   LeaveRequests.paginationData.totalElements
                        // }
                        // paginationComponentOptions={{
                        //   noRowsPerPage: true,
                        // }}
                      />
                    )}
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>
          <Modal
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false);
              setEditData(null);
              setAddLeaveData({});
              setStartDate("");
              setEndDate("");
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                {editData ? "Edit" : "Add"} Leave
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Select Leave type</label>
                <select
                  value={addLeaveData.leaveType ? addLeaveData.leaveType : ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setAddLeaveData({
                      ...addLeaveData,
                      leaveType: selectedValue,
                    });
                  }}
                  className="form-select"
                >
                  <option value={""}>Select</option>
                  {allLeaveType.map((e, i) => {
                    return (
                      <option key={i} value={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="deadline-form">
                <form>
                  <div className="">
                    <div className="py-2 ">
                      <label htmlFor="datepickerdedass" className="form-label">
                        Leave Start Date
                      </label>
                      <input
                        min={getDateFormat(new Date())}
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setEndDate("");
                        }}
                        type="date"
                        className="form-control"
                        id="datepickerdedass"
                      />
                    </div>
                    <div
                      className={`py-3 ${addLeaveData.halfDay ? "d-none" : ""}`}
                    >
                      <label
                        htmlFor="datepickerdedoneddsd"
                        className="form-label"
                      >
                        Leave End Date
                      </label>
                      <input
                        min={getDateFormat(startDate ? startDate : new Date())}
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                        id="datepickerdedoneddsd"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => onHalfDay()}
                  id="flexCheckChecked"
                  checked={addLeaveData.halfDay}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  Half Day
                </label>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea78d"
                  className="form-label"
                >
                  Leave Duration
                </label>
                <p className="form-control" id="exampleFormControlTextarea78d">
                  {addLeaveData.duration ? addLeaveData.duration : "0"} day
                </p>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea78d"
                  className="form-label"
                >
                  Leave Reason
                </label>
                <textarea
                  value={addLeaveData.reason}
                  onChange={(e) => {
                    setAddLeaveData({
                      ...addLeaveData,
                      reason: e.target.value,
                    });
                  }}
                  className="form-control"
                  id="exampleFormControlTextarea78d"
                  rows="3"
                ></textarea>
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
                Done
              </button>
              <button
                onClick={async () => {
                  // console.log(addLeaveData);
                  if (
                    !addLeaveData.reason ||
                    !addLeaveData.leaveType ||
                    (addLeaveData.halfDay ? false : !endDate) ||
                    !startDate ||
                    addLeaveData.leaveType == "Select"
                    // false
                  ) {
                    setIsModal(false);
                    Swal.fire(
                      "Incomplete",
                      "Kindly Fill Each Details",
                      "warning"
                    ).finally(() => setIsModal(true));
                    return;
                  }
                  setAddLeaveLoader(true);

                  // console.log({
                  //   ...addLeaveData,
                  //   actionBy: Cred.reportingManager
                  //     ? Cred.reportingManager
                  //     : Cred.sub,
                  //   employeeId: Cred.sub,
                  //   status: 0,
                  //   remark: "",
                  //   startAt: startDate,
                  //   endAt: endDate,
                  // });
                  if (editData) {
                    try {
                      const resp = await updateLeave(Cred.token, editData.id, {
                        ...addLeaveData,
                        actionBy: Cred.reportingManager
                          ? Cred.reportingManager
                          : Cred.sub,
                        employeeId: Cred.sub,
                        status: 0,
                        remark: "",
                        startAt: startDate,
                        endAt: endDate,
                      });
                      Dispatch(updateMyLeaveRequests(resp));

                      setAddLeaveData({});
                      setEndDate("");
                      setStartDate("");
                      setIsModal(false);
                      Swal.fire(
                        "Successfully Updated",
                        "Leave request has been updated ",
                        "success"
                      );
                    } catch (error) {
                      setIsModal(false);
                      Swal.fire(
                        "Something Went Wrong",
                        "Can't Update Leave",
                        "error"
                      ).finally(() => setIsModal(true));
                    }
                    setAddLeaveLoader(false);
                  } else {
                    try {
                      const resp = await createLeave(Cred.token, {
                        ...addLeaveData,
                        actionBy: Cred.reportingManager
                          ? Cred.reportingManager
                          : Cred.sub,
                        employeeId: Cred.sub,
                        status: 0,
                        remark: "",
                        startAt: startDate,
                        endAt: endDate,
                      });

                      Dispatch(
                        addMyLeaveRequest({
                          ...resp,
                          employeeName: Cred.firstName + " " + Cred.lastName,
                        })
                      );

                      setAddLeaveData({});
                      setEndDate("");
                      setStartDate("");
                      setIsModal(false);
                      Swal.fire(
                        "Successfully Added",
                        "Leave request has been generated for you.",
                        "success"
                      );
                    } catch (error) {
                      setIsModal(false);
                      Swal.fire(
                        "Something Went Wrong",
                        "Can't Add Leave",
                        "error"
                      ).finally(() => setIsModal(true));
                    }
                    setAddLeaveLoader(false);
                  }
                }}
                type="button"
                className="btn btn-primary"
              >
                {addLeaveLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1 m-lg-10"
                  />
                )}
                Request
              </button>
            </Modal.Footer>
          </Modal>


          <Modal
            centered
            show={isEditModal}
            onHide={() => {
              setIsEditModal(false);
            }}
          >
            <Modal.Header closeButton>
              <h5 className="modal-title  fw-bold" id="dremovetaskLabel">
                {" "}
                Leave Approve
              </h5>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-simple-smile text-success display-2 text-center mt-2"></i>
              <div className="">
                <label htmlFor="depone" className="form-label">
                  Remark
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="depone"
                  placeholder="Remark"
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                  value={remark}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={async (e) => {
                  if (!remark) {
                    setIsEditModal(false);
                    Swal.fire(
                      "Incomplete",
                      "Kindly Enter Remark",
                      "warning"
                    ).finally(() => setIsEditModal(true));
                  }
                  await acceptLeave(selectedLeave);
                }}
                className="btn btn-primary"
              >
                {approvedLeaveLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Accept
              </button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isDeleteModal}
            onHide={() => {
              setIsDeleteModal(false);
            }}
          >
            <Modal.Header closeButton>
              <h5 className="modal-title  fw-bold" id="leaverejectLabel">
                {" "}
                Leave Reject
              </h5>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-sad text-danger display-2 text-center mt-2"></i>
              <div className="">
                <label htmlFor="depone" className="form-label">
                  Remark
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="depone"
                  placeholder="Remark"
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                  value={remark}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={async (e) => {
                  if (!remark) {
                    setIsDeleteModal(false);
                    Swal.fire(
                      "Incomplete",
                      "Kindly Enter Remark",
                      "warning"
                    ).finally(() => setIsDeleteModal(true));
                  }
                  await rejectLeave(selectedLeave);
                }}
                className="btn btn-primary"
              >
                {rejectLeaveLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Reject
              </button>
            </Modal.Footer>
          </Modal>
          
          <Modal
            show={isModalDelete}
            centered
            onHide={() => {
              setDeleteData(null);
              setIsModalDelete(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Leave</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">You can delete this Leave</p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleIsModalDelete}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="btn btn-danger color-fff"
                onClick={handleDeleteLeave}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default LeaveRequest;
