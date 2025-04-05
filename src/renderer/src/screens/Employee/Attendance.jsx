import React, { useCallback, useEffect, useState } from "react";
import { Modal, Dropdown, Tab, Tabs } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAttendance,
  getAllAttendanceByReportingManagerId,
  getMemberAttendance,
  getMemberAttendanceById,
  apiGetAllAttendanceByMonthAndYear,
} from "../../api/attendance/attendance-api";
import {
  removeAllAttendance,
  setAttendance,
  setMyAttendance,
  removeMyAttendance,
} from "../../redux/features/attendanceSlice";
import "./index.css";
import Swal from "sweetalert2";
import Loading from "../../components/UI/Loading";
import DataTable from "react-data-table-component";
import { getDaysInMonth } from "../../helper/date-functions";
import AsyncSelect from "react-select/async";
import { deleteAllMembers, setMembers } from "../../redux/features/memberSlice";
import { getAllMembers } from "../../api/member/member-api";
import { permissionIds } from "../../constants/constants";
import { useMemberHook } from "../../hooks/memberHook";
import AttendanceIcon from "../../components/Employees/AttendanceIcon";
import { defaultThemes } from "react-data-table-component";

function Attendance() {
  const Cred = useSelector((state) => state.Cred);
  const Attendance = useSelector((state) => state.Attendance);
  const myAttendance = useSelector((state) => state.Attendance.myAttendance);
  const Member = useSelector((state) => state.Member.allMembers);
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const [key, setKey] = useState("self");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [myCurrentYear, setMyCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [myCurrentMonth, setMyCurrentMonth] = useState(
    new Date().getMonth() + 1
  );
  const [loading, setLoading] = useState(false);
  const [yearData, setYearData] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const Dispatch = useDispatch();

  const { get } = useMemberHook();

  const filterMember = (inputValue) => {
    return Member.filter(
      (i) =>
        i.firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
        i.lastName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = async (inputValue) => {
    const value = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterMember(inputValue));
      }, 1000);
    });
    let options = value.map((item) => ({
      label: `${item.firstName} ${item.lastName} (${item.employeeId})`,
      value: {
        firstName: item.firstName,
        lastName: item.lastName,
        employeeId: item.id,
      },
    }));
    return options;
  };

  const MonthsArray = [
    { id: 1, month: "January", days: 31 },
    { id: 2, month: "February", days: 28 },
    { id: 3, month: "March", days: 31 },
    { id: 4, month: "April", days: 30 },
    { id: 5, month: "May", days: 31 },
    { id: 6, month: "June", days: 30 },
    { id: 7, month: "July", days: 31 },
    { id: 8, month: "August", days: 31 },
    { id: 9, month: "September", days: 30 },
    { id: 10, month: "October", days: 31 },
    { id: 11, month: "November", days: 30 },
    { id: 12, month: "December", days: 31 },
  ];

  const currentDate = new Date();

  //get years Dropdown Data

  function generateYearData() {
    const myYearData = [];
    let nowYear = new Date().getFullYear();

    for (let i = nowYear; i > nowYear - 5; i--) {
      myYearData.push(i);
    }
    setYearData(myYearData);
  }

  // Function to determine attendance status for a given day
  function getAttendanceStatus(attendanceArray, day) {
    const attendanceForDay = attendanceArray.find((entry) => {
      return Number(entry.checkInDay) === day;
    });

    const today = currentDate.getDate();
    const isFutureDay = day > today;

    if (attendanceForDay) {
      return (
        <AttendanceIcon
          attendanceForDay={{ isPresent: true, ...(attendanceForDay ?? {}) }}
        />
      );
    } else if (day < today) {
      return (
        <AttendanceIcon
          attendanceForDay={{ isPresent: false, ...(attendanceForDay ?? {}) }}
        />
      );
    } else if (isFutureDay) {
      return "-"; // Future day
    }
  }
  // Organize attendance data
  function organiseAttendance(response) {
    let myArray = [];

    response.forEach((item) => {
      let result = myArray.find((val) => val.id === item.memberId);
      const checkInDay = item?.checkIn?.split("T")[0].split("-")[2] || null;
      const checkOutDay = item?.checkOut?.split("T")[0].split("-")[2] || null;
      const memberName = `${item.firstName ? item.firstName : ""} ${
        item.lastName ? item.lastName : ""
      }`;

      const attendanceEntry = {
        checkInDay,
        checkOutDay,
        memberName,
        checkInTime: item.checkIn,
        checkOutTime: item.checkOut,
      };

      if (result) {
        result.memberAttendance.push(attendanceEntry);
      } else {
        let newMember = {
          id: item.memberId,
          memberName,
          data: item,
          memberAttendance: [attendanceEntry],
        };
        myArray.push(newMember);
      }
    });

    return myArray;
  }

  function transformData(inputData) {
    // Group data by memberId
    const groupedData = inputData.reduce((acc, item) => {
      if (!acc[item.memberId]) {
        acc[item.memberId] = [];
      }

      acc[item.memberId].push(item);
      return acc;
    }, {});
    return Object.values(groupedData).flat();
  }

  const getEmployeeAttendance = async (value = selectedMember?.value) => {
    const month = Number(currentMonth);
    const year = Number(currentYear);

    try {
      if (value) {
        const firstname = value.firstName;
        const lastName = value.lastName;
        const memberId = value.employeeId;
        Dispatch(removeAllAttendance());
        const resp = await getMemberAttendance(
          Cred.token,
          firstname,
          lastName,
          Cred.sub,
          month,
          year
          // memberId,
        );
        const result = organiseAttendance(resp.content);
        Dispatch(setAttendance({ ...resp, content: result }));
        generateYearData();
      } else {
        Dispatch(removeAllAttendance());
        const resp = MemberPermission.some(
          (item) => item === permissionIds.SUPER_ADMIN
        )
          ? await apiGetAllAttendanceByMonthAndYear(Cred.token, month, year, 0)
          : //  await getAllAttendance(Cred.token, Cred.sub, month, year)
            await getAllAttendanceByReportingManagerId(
              Cred.token,
              Cred.sub,
              month,
              year
            );
        const groupedData = transformData(resp.content);
        const result = organiseAttendance(groupedData);
        Dispatch(setAttendance({ ...resp, content: result }));
        generateYearData();
      }
    } catch (error) {
      console.log("Error fetching attendance :", error);
      if (yearData) {
        Swal.fire({
          title: "No Attendance Found",
          text: "Please Select Another Time period",
          icon: "info",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire(
          "Something Went Wrong",
          "Please Try After Some Time",
          "error"
        );
      }
    }
  };

  const getMyAttendance = async (value = Cred) => {
    const month = Number(myCurrentMonth);
    const year = Number(myCurrentYear);

    try {
      if (value) {
        Dispatch(removeMyAttendance());
        const resp = await getMemberAttendanceById(
          Cred.token,
          Cred.sub,
          month,
          year
        );

        const result = organiseAttendance(resp);
        Dispatch(setMyAttendance(result));
        generateYearData();
      }
      // else {
      //   Dispatch(removeAllAttendance());
      //   const resp = await getAllAttendance(Cred.token, Cred.sub, month, year);
      //   const result = organiseAttendance(resp.content);
      //   Dispatch(setAttendance({ ...resp, content: result }));
      //   generateYearData();
      // }
    } catch (error) {
      console.log("Error fetching attendance :", error);
      if (yearData) {
        Swal.fire(
          "No Attendance Found",
          "Please Select Another Time period",
          "info"
        );
      } else {
        Swal.fire(
          "Something Went Wrong",
          "Please Try After Some Time",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    getMyAttendance();
  }, [myCurrentMonth, myCurrentYear]);

  useEffect(() => {
    getEmployeeAttendance();
  }, [currentMonth, currentYear, selectedMember]);

  const generateTableColumns = useCallback(
    (isMyAttendance = false) => {
      let columns = [];

      // Add Member Name column
      if (!isMyAttendance) {
        columns.push({
          name: (
            <span
              className="text-wrap "
              style={{
                width: "100px",
              }}
            >
              Member Name
            </span>
          ),

          selector: (row) => (
            <span className={"text-wrap"}>
              {row.memberName ? row.memberName : "NA"}
            </span>
          ),

          sortable: true,

          cell: (row) => (
            <div style={{ whiteSpace: "nowrap" }}>{row.memberName}</div>
          ),
          style: {
            backgroundColor: "#b6e8e3",
            position: "sticky",
            top: "0",
            left: "0",
            zIndex: "2",
          },
        });
      }

      // Get the number of days in the current month
      const monthObj = MonthsArray.find((m) => m.id == currentMonth);
      const daysInMonth = getDaysInMonth(currentMonth);

      // Generate columns for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        columns.push({
          name: `${day}`,
          cell: (row) => {
            const status = getAttendanceStatus(row.memberAttendance, day);

            return (
              <span
                style={{
                  color:
                    status === "Marked"
                      ? "green"
                      : status === "Absent"
                      ? "red"
                      : "black",
                  display: "block",
                  textAlign: "center",
                  marginLeft: "-7px",
                }}
              >
                {status}
              </span>
            );
          },
        });
      }

      return columns;
    },
    [currentMonth, myCurrentMonth, currentYear, myCurrentYear, selectedMember]
  );

  const columnT = generateTableColumns();

  // async function get() {
  //   if (
  //     MemberPermission.some(
  //       (item) =>
  //         item == permissionIds.MANAGER && item == permissionIds.VIEW_MANAGER
  //     )
  //   ) {
  //     try {
  //       if (Member.length <= 0) {
  //         Dispatch(deleteAllMembers());
  //         const MembersArrays = await getAllMembers(0, Cred.token, Cred.sub);
  //         if (MembersArrays.data.length >= 0) {
  //           Dispatch(
  //             setMembers({
  //               allMembers: MembersArrays.data,
  //               paginationData: MembersArrays.paginationData,
  //             })
  //           );
  //         } else {
  //         }
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         title: "Something went wrong!",
  //         text: "Can't Fetch Employees. Please try After Some Time",
  //         icon: "error",
  //       });
  //       console.log("error: ", error);
  //     }
  //   }
  // }
  useEffect(() => {
    generateYearData();
    if (Member.length <= 0) {
      get();
    }
  }, []);

  const customStyles = {
    headCells: {
      style: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        overflow: "visible",
        textAlign: "left",
        minWidth: "150px",
        maxWidth: "300px",
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
        position: "sticky",
        left: 0,
      },
    },

    cells: {
      style: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        overflow: "visible",
        minWidth: "150px",
        maxWidth: "200px",
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
      },
    },
    tableWrapper: {
      style: {
        overflowX: "auto", // Ensure horizontal scroll if content overflows the table width
      },
    },
  };

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl ">
          <PageHeader
            headerTitle="Attendance"
            renderRight={() => {
              return (
                <div className="col-auto d-flex">
                  {key === "self" ? (
                    <form>
                      <div className="m-3 row">
                        <div className="col-lg-6">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput478"
                          >
                            Filter by Year
                          </label>
                          <select
                            className="form-select"
                            id="exampleFormControlInput478"
                            value={myCurrentYear}
                            onChange={(e) => setMyCurrentYear(e.target.value)}
                          >
                            <option value="">Select a Year</option>
                            {yearData.map((value, i) => {
                              return (
                                <option value={value} key={i}>
                                  {value}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="col-lg-6">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput578"
                          >
                            Filter by Month
                          </label>
                          <select
                            className="form-select"
                            id="exampleFormControlInput578"
                            value={
                              MonthsArray.find(
                                (item) => item.id === myCurrentMonth
                              )?.month
                            }
                            onChange={async (e) =>
                              setMyCurrentMonth(e.target.value)
                            }
                          >
                            <option value="">Select Month</option>
                            {MonthsArray.map((value, i) => {
                              return (
                                <option value={value.id} key={i}>
                                  {value.month}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <form>
                      <div className="m-3 row ">
                        <div className="col-lg-4" style={{ zIndex: 10 }}>
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput478"
                          >
                            Search by name
                          </label>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={promiseOptions}
                            value={selectedMember}
                            onChange={(e) => {
                              setSelectedMember(e);
                              console.log(e);
                            }}
                          />
                        </div>
                        <div className="col-lg-4">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput478"
                          >
                            Filter by Year
                          </label>
                          <select
                            className="form-select"
                            id="exampleFormControlInput478"
                            value={currentYear}
                            onChange={(e) => setCurrentYear(e.target.value)}
                          >
                            <option value="">Select a Year</option>
                            {yearData.map((value, i) => {
                              return (
                                <option value={value} key={i}>
                                  {value}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="col-lg-4">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput578"
                          >
                            Filter by Month
                          </label>
                          <select
                            className="form-select"
                            id="exampleFormControlInput578"
                            value={
                              MonthsArray.find(
                                (item) => item.id === currentMonth
                              )?.month
                            }
                            onChange={async (e) =>
                              setCurrentMonth(e.target.value)
                            }
                          >
                            <option value="">Select Month</option>
                            {MonthsArray.map((value, i) => {
                              return (
                                <option value={value.id} key={i}>
                                  {value.month}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              );
            }}
          />

          <div className="row clearfix g-3">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="self" title="My Attendance">
                <>
                  <div className="modal-body">
                    <div className="deadline-form">
                      {/* <button
                        className="btn btn-primary ms-4"
                        onClick={() => {
                          setSelectedMember(null);
                          getEmployeeAttendance();
                        }}
                      >
                        View All Attendance
                      </button> */}
                    </div>
                  </div>
                  {myAttendance?.length <= 0 ? (
                    <h2>No Attendance to show</h2>
                  ) : (
                    <table>
                      <div
                        className="col-sm-10"
                        style={{
                          display: "inline-grid",
                          minWidth: "fit-content",
                        }}
                      >
                        {myAttendance?.length > 0 ? (
                          <DataTable
                            id="Data_table"
                            columns={generateTableColumns(true).map(
                              (column) => ({
                                ...column,
                                width: `${column.name.length * 10 + 30}px`,
                                wrap: true,
                                position: "relative",
                              })
                            )}
                            title={"Attendance"}
                            data={myAttendance}
                            pagination
                            selectableRows={false}
                            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                            highlightOnHover={true}
                            responsive
                          />
                        ) : (
                          <h1>No Attendance Marked</h1>
                        )}
                      </div>
                    </table>
                  )}
                </>
              </Tab>
              {Member?.length > 0 && (
                <Tab eventKey="member" title="Member Attendance">
                  <>
                    <div className="modal-body">
                      <div className="deadline-form ">
                        {/* <button
                          className="btn btn-primary ms-4"
                          onClick={() => {
                            setSelectedMember(null);
                            getEmployeeAttendance();
                          }}
                        >
                          View All Attendance
                        </button> */}
                      </div>
                    </div>
                    {Attendance?.content?.length <= 0 ? (
                      <h2>No Attendance to show</h2>
                    ) : (
                      <table>
                        <div
                          className="col-sm-10 "
                          style={{
                            display: "inline-grid",
                            minWidth: "fit-content",
                          }}
                        >
                          {Attendance?.content?.length > 0 ? (
                            <DataTable
                              id="Data_table"
                              columns={generateTableColumns(false).map(
                                (column) => ({
                                  ...column,
                                  width: `${column.name.length * 10 + 30}px`,
                                  wrap: true,
                                  position: "relative",
                                })
                              )}
                              title={"Attendance"}
                              data={Attendance.content}
                              pagination
                              selectableRows={false}
                              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                              highlightOnHover={true}
                              paginationServer
                              paginationTotalRows={Attendance.totalElements}
                              customStyles={customStyles}
                            />
                          ) : (
                            <h1>No Attendance Marked</h1>
                          )}
                        </div>
                      </table>
                    )}
                  </>
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}

export default Attendance;
