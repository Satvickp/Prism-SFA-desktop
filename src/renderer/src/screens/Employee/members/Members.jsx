import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Spinner, Tab, Tabs, Toast } from "react-bootstrap";
import PageHeader from "../../../components/common/PageHeader";
import {
  addMember,
  deleteMember,
  getAllDesignation,
  getAllMembers,
  updateMember,
  updatePassword,
  getPermissionOfAMember,
  updatePermissionOfAMember,
  uploadFile,
} from "../../../api/member/member-api";
import { ImCross } from "react-icons/im";

import {
  addMembers,
  updateMembers,
  deleteMembers,
  concatMembers,
} from "../../../redux/features/memberSlice";

import {
  setAllDivision,
  setAllDesignation,
  setAllState,
  setAllRegion,
  setAllCity,
} from "../../../redux/features/dropdownFieldSlice";

import {
  getCity,
  getDivision,
  getDropDowns,
  getEveryCity,
  getEveryState,
  getRegion,
  getState,
} from "../../../api/clients/clients-api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { emailValidator } from "../../../helper/emailValidator";
import { passwordValidator } from "../../../helper/passwordValidator";
import mobileValidator from "../../../helper/mobileValidator";
import lgAvatar3 from "../../../assets/images/lg/avatar3.jpg";
import Loading from "../../../components/UI/Loading";
import ModalLoader from "../../UIComponents/ModalLoader";
import OurMembers from "../../../components/Employees/OurMembers";
import { permissionEnum, permissionIds } from "../../../constants/constants";
import Select from "react-select";
import SingleDropdown from "../../../components/UI/SingleDropdown";
import { useMemberHook } from "../../../hooks/memberHook";
import useHierarchyData from "../../../hooks/hierarchyDataHook";
import DataTable from "react-data-table-component";
import { getDaysInMonth } from "../../../helper/date-functions";
import AttendanceIcon from "../../../components/Employees/AttendanceIcon";
import ExpenseTable from "../../Accounts/ExpenseTable";
import BeetOutlet from "../../Beet/BeetOutlet";
import OurFMCGClients from "../../../components/Clients/OurFMCGClients";
import { customStyles } from "../../../constants/customStyles";
function Members() {
  const [isModal, setIsModal] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  // const [employeeId, setEmployeeId] = useState("");
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(0);
  const Cred = useSelector((state) => state.Cred);
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const [modalLoader, setModalLoader] = useState(false);
  const [allReportingManager, setAllReportingManager] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [isMoreData, setIsMoreData] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [state, setState] = useState([]);
  const [region, setRegion] = useState(Cred.region);
  const [city, setCity] = useState([]);
  const [dropdownCities, setDropdownCities] = useState([]);
  const [division, setDivision] = useState([]);
  const [imgUploadKey, setImgUploadKey] = useState(null);
  const [dob, setDob] = useState("");

  const [basicValue, setBasicValue] = useState("");
  const [pfValue, setPFValue] = useState("");
  const [hraValue, setHRAValue] = useState("");
  const [esiValue, setESIValue] = useState("");
  const [cityDaValue, setExCityDAValue] = useState("");
  const [hqdaValue, setHqDaValue] = useState("");
  const [taValue, setTaValue] = useState("");

  const [permission, setPermission] = useState([]);
  const [buttonLoader, setButtonLoader] = useState({
    gettingDropDowns: false,
    addMember: false,
    updateMember: false,
    updatePassword: false,
    loadMoreMember: false,
  });
  const [reportingManager, setReportingManager] = useState("");
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [isOpenState, setIsOpenState] = useState(false);
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const Member = useSelector((state) => state.Member);
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const [isChecked, setIsChecked] = useState(false);
  const [input_text, setInput_text] = useState("Select All");
  const [showIcon, setShowIcon] = useState("none");
  const cityDropDownRef = useRef(null);
  const stateDropDownRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [showDone, setShowDone] = useState("none");
  const [passText, setPassText] = useState("password");
  const [key, setKey] = useState("member");
  const [currentMemberPage, setCurrentMemberPage] = useState([
    { name: `${Cred.firstName} ${Cred.lastName}`, id: Cred.id },
  ]);
  const [isOutletModal, setIsOutletModal] = useState(false);
  const [outletData, setOutletData] = useState([]);
  const [beetId, setBeetId] = useState(null);
  const [clientFmcgId, setClientFmcgId] = useState(null);
  const CLIENT_TYPE = window.localStorage.getItem("CLIENT_TYPE");
  const allLeaveType = useSelector(
    (state) => state.DropDownsField.allLeaveTypes
  );
  const [isDataFilled, setIsDataFilled] = useState(false);

  const { get, isLoading, isError } = useMemberHook();
  function getPageType() {
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Beats" : "Routes";
  }

  function getClientPageType() {
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Client" : "Doctor";
  }

  const { userId } = useParams();

  const {
    getHierarchyAttendance,
    getHierarchyBeat,
    getHierarchyClient,
    getHierarchyExpense,
    getHierarchyLeave,
    getHierarchyMember,
    hierarchyAttendanceData,
    hierarchyBeatsData,
    hierarchyClientsData,
    hierarchyExpenseData,
    hierarchyLeavesData,
    hierarchyMembersData,
  } = useHierarchyData();

  useEffect(() => {
    if (userId == Cred.sub) get();

    if (userId != Cred.sub) {
      if (key === "member") {
        getHierarchyMember(userId);
      } else if (key === "client") {
        getHierarchyClient(userId);
      } else if (key === "attendance") {
        getHierarchyAttendance(userId);
      } else if (key === "expense") {
        getHierarchyExpense(userId);
      } else if (key === "beat") {
        getHierarchyBeat(userId);
      } else if (key === "leaves") {
        getHierarchyLeave(userId);
      }
    }
  }, [userId, key]);

  async function getDropDownsValue() {
    if (!DropDownsField.allRegion.length > 0) {
      setFetchMessage("Fetching Region...");
      const regionArray = await getDropDowns(1, Cred.token);
      Dispatch(setAllRegion(regionArray));
    }

    if (!DropDownsField.allState.length > 0) {
      setFetchMessage("Fetching State...");
      const stateArray = await getDropDowns(2, Cred.token);
      Dispatch(setAllState(stateArray));
    }
    if (!DropDownsField.allCity.length > 0) {
      setFetchMessage("Fetching City...");
      const cityArray = await getDropDowns(3, Cred.token);
      Dispatch(setAllCity(cityArray));
    }
    if (!DropDownsField.allDivision.length > 0) {
      setFetchMessage("Fetching Division...");
      const divisionArray = await getDropDowns(4, Cred.token);
      Dispatch(setAllDivision(divisionArray));
    }
    if (!DropDownsField.allDesignation.length > 0) {
      setFetchMessage("Fetching Designation...");
      const DesignationArray = await getAllDesignation(Cred.token);
      Dispatch(setAllDesignation(DesignationArray.data));
    }
    setFetchMessage("");
  }

  async function actionOnNextBtn() {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    const mobileError = mobileValidator(mobile);
    if (mobileError) {
      setIsModal(false);
      Swal.fire("Invalid Mobile Number ", mobileError, "error").then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }
    if (
      !firstName ||
      !lastName ||
      !joiningDate ||
      !mobile ||
      !password ||
      !email ||
      !designation ||
      // !employeeId ||
      !region ||
      !division.length > 0 ||
      !state ||
      !city.length > 0 ||
      !dob ||
      !imgUploadKey ||
      !permission
    ) {
      setIsModal(false);
      Swal.fire(
        "Please fill the from ",
        "Make sure you fill each parameters",
        "error"
      ).then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }

    if (emailError) {
      setIsModal(false);
      Swal.fire("Invalid Email ", emailError, "error").then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }
    if (passwordError) {
      // setIsModal(false);
      Swal.fire("Invalid Password ", passwordError, "error").then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }
    setIsDataFilled(true);
  }

  // getTenantByReportingManagerId(Cred.token, 1);
  async function AddMember(browser) {
    browser.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !joiningDate ||
      // !employeeId ||
      !dob ||
      !email ||
      !mobile ||
      !designation ||
      !region ||
      !state ||
      !city ||
      !joiningDate
    ) {
      setIsModal(false);
      Swal.fire(
        "Please fill the from ",
        "Make sure you fill each parameters",
        "error"
      ).then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }

    setButtonLoader({
      ...buttonLoader,
      ...{ addMember: true },
    });
    try {
      const formData = new FormData();
      formData.append("file", imgUploadKey);
      const uploadFileKey = await uploadFile(Cred.token, formData);
      const data = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        designationId: Number(designation),
        email: email,
        mobile: Number(mobile),
        joiningDate: joiningDate,
        // employeeId: employeeId,
        password: password,
        region: Number(region),
        states: state.map((item) => ({ id: item.id })),
        cities: city.map((item) => {
          return { id: item.id };
        }),
        userRoleList: permission.map((item) => item.value),
        // userRoleList: permission.map((item) => {
        //   const result = permissionEnum.find((val) => val.label === item.value)
        //   return result.value
        // } ),
        divisions: division.map((item) => {
          return { id: item.value };
        }),
        reportingManager: reportingManager.id,
        uploadFileKey: uploadFileKey,
        ta: null,
        da: null,
        daExCity: null,
        salary: null,
        // ta: Number(taValue),
        // da: Number(hqdaValue),
        // daExCity: Number(cityDaValue),
        // salary: Number(basicValue),
      };
      const resp = await addMember(Cred.token, data);

      Dispatch(
        addMembers({
          ...data,
          id: parseInt(resp.id),
          cities: resp.cities.map((item, index) => ({
            id: resp.CityId[index],
            cityName: item,
          })),
          states: resp.stateName.map((item, index) => ({
            id: resp.stateId[index],
            stateName: item,
          })),
          divisions: resp.divisions.map((item, index) => ({
            id: resp.divisionId[index],
            divisionName: item,
          })),
        })
      );
      setFirstName("");
      setLastName("");
      setDesignation("");
      setEmail("");
      // setEmployeeId("");
      setJoiningDate("");
      setMobile("");
      setPassword("");
      setDob("");
      // setRegion("");
      setDivision("");
      setCity([]);
      setState([]);
      setDropdownCities([]);
      setReportingManager({});
      setImgUploadKey("");
      setDivision([]);
      setPermission([]);
      setBasicValue("");
      setTaValue("");
      setHqDaValue("");
      setExCityDAValue("");
    } catch (error) {
      Swal.fire("Something went wrong", "Please Try After Some Time", "error");
      console.log("Error ::", error);
    }
    setIsModal(false);
    setButtonLoader({
      ...buttonLoader,
      ...{ addMember: false },
    });
  }
  async function getAllDivision() {
    if (DropDownsField.allDivision.length <= 0) {
      const divisionArray = await getDivision(Cred.token);
      Dispatch(setAllDivision(divisionArray));
    }
  }

  // category is not being used
  // async function getAllCategory() {
  //   if (DropDownsField.allCategory.length <= 0) {
  //     const categoryArray = await getCategory(Cred.token);
  //     Dispatch(setAllCategory(categoryArray));
  //   }
  // }

  async function getAllRegion() {
    if (DropDownsField.allRegion.length <= 0) {
      const regionArray = await getRegion(Cred.token, Cred.sub);
      Dispatch(setAllRegion(regionArray));
    }
  }
  async function getAllState() {
    if (DropDownsField.allState.length <= 0) {
      const stateName = await getEveryState(Cred.token, 0, 500);
      Dispatch(setAllState(stateName));
    }
  }
  async function getAllCity() {
    if (DropDownsField.allCity.length <= 0) {
      const cityName = await getEveryCity(Cred.token, 0, 500);
      Dispatch(setAllCity(cityName));
    }
  }

  async function UpdateMember(data, index) {
    try {
      const resp = await updateMember(Cred.token, data);

      const dispatchData = {
        ...data,
        cities: resp.cities.map((item, index) => ({
          id: resp.CityId[index],
          cityName: item,
        })),
        states:
          resp?.stateName?.map((item, index) => ({
            id: resp.stateId[index],
            stateName: item,
          })) || [],
        divisions: resp.divisions.map((item, index) => ({
          id: resp.divisionId[index],
          divisionName: item,
        })),
      };
      Dispatch(updateMembers(dispatchData));

      return true;
    } catch (error) {
      setModalLoader(false);
      console.log("Error :: error while updating member", error);
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch Update Member. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
  }

  async function DeleteMember(index, id) {
    setModalLoader(true);
    try {
      const resp = await deleteMember(Cred.token, id);
      Dispatch(deleteMembers(id));
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Delete More Member. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setModalLoader(false);
  }

  async function onEndReach() {
    setLoadMore(true);
    try {
      const resp = await getAllMembers(
        Member.paginationData.number + 1,
        Cred.token,
        Cred.sub
      );
      if (resp.data.length > 0) {
        Dispatch(
          concatMembers({
            allMembers: resp.data,
            paginationData: resp.paginationData,
          })
        );
      } else {
        setShowToast(true);
        setIsMoreData(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch More Member. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setLoadMore(false);
  }

  async function UpdatePassword(id, password) {
    try {
      const payload = {
        id: id,
        password: password,
      };
      const resp = await updatePassword(Cred.token, payload);
      Swal.fire(
        "Successfully Changed",
        "Member Password has been updated",
        "success"
      );
    } catch (error) {
      Swal.fire("Something went wrong", "Can't Update Password", "error");
    }
  }
  async function fetchPermissionOfAMember(id) {
    try {
      const resp = await getPermissionOfAMember(id, Cred.token);
      setModalLoader(false);
      return resp;
    } catch (error) {
      Swal.fire(
        "Something Went Wrong",
        "Can't Fetch Permission of Member",
        "error"
      );
    }
  }
  async function UpdatePermissionOfAMember(payload) {
    try {
      const resp = await updatePermissionOfAMember(Cred.token, payload);
      Swal.fire(
        "Permission Updated",
        "Member Permission Has Been Updated",
        "success"
      );
    } catch (error) {
      Swal.fire("Something Went Wrong", "Please try After some time", "error");
    }
  }
  const toggleDropdownCity = () => {
    setIsOpenCity(!isOpenCity);
  };

  const toggleDropdownState = () => {
    setIsOpenState(!isOpenState);
    console.log("state :", state);
  };

  const handleDocumentClick = (e) => {
    if (
      cityDropDownRef.current &&
      !cityDropDownRef.current.contains(e.target)
    ) {
      setIsOpenCity(false);
    }
  };

  const handleStateDocumentClick = (e) => {
    if (
      stateDropDownRef.current &&
      !stateDropDownRef.current.contains(e.target)
    ) {
      setIsOpenState(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.body.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  function handleCurrentMemberName(value) {
    const check = currentMemberPage.some((item) => item.id == value.id);
    if (check) {
      return;
    }
    setCurrentMemberPage([...currentMemberPage, value]);
  }

  function handleHeaderNavHistorySlicing(index) {
    setCurrentMemberPage((prev) => {
      // let updatedPage = [...prev];
      // updatedPage.slice(0,index);
      return prev.slice(0, index + 1);
    });
  }

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
  // Get the number of days in the current month
  const monthObj = MonthsArray?.find((m) => m.id == currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  function getAttendanceStatus(attendanceArray, day) {
    const attendanceForDay = attendanceArray?.find((entry) => {
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
            <div style={{ whiteSpace: "nowrap" }}>{`${row?.memberName}`}</div>
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

      // Generate columns for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        columns.push({
          name: `${day}`,
          cell: (row) => {
            const status = getAttendanceStatus(row?.memberAttendance, day);

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
    [currentMonth]
  );

  const getStatusStyles = (status) => {
    if (status === 1) {
      return {
        backgroundColor: "green",
        color: "white",
        padding: 7,
      };
    } else if (status === 0) {
      return {
        backgroundColor: "orange",
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

  var MemberColumnT = "";
  MemberColumnT = [
    {
      name: "EMPLOYEE",
      selector: (row) => {
        const member = hierarchyMembersData.find(
          (item) => item.id === row.employeeId
        );
        return member ? `${member?.firstName} ${member?.lastName}` : "NA";
      },
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
  ];

  var ExpenseColumnT = "";
  ExpenseColumnT = [
    {
      name: "Spent At",
      selector: (row) => row.spentAt || "NA",
      sortable: true,
    },

    {
      name: "DATE",
      selector: (row) => row.date || "NA",
      sortable: true,
    },
    {
      name: "Amount (INR)",
      selector: (row) => (row.amount ? `₹ ${row.amount}` : "NA"),
      sortable: true,
    },
    {
      name: "Remark",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div>
          {" "}
          {/* <img className="avatar rounded-circle" src={row.image} alt=""></img> */}
          <span className="fw-bold ms-1">
            {row.remark ? row.remark : "No Remark"}
          </span>
        </div>
      ),
    },
    {
      name: "STATUS",
      selector: () => {},
      sortable: true,
      cell: (row) => {
        return (
          <div
            className="btn-group "
            role="group"
            aria-label="Basic outlined example"
          >
            <p
              style={{
                marginTop: "1em",
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
          </div>
        );
      },
    },
  ];

  function handleIsOutletModal(data) {
    setIsOutletModal(!isOutletModal);
    setOutletData(data?.outlets);
    setBeetId(data?.id);
    setClientFmcgId(data?.clientFmcgId);
  }
  // console.log(isDataFilled, "isDataFilled");
  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            handleHeaderNavHistorySlicing={handleHeaderNavHistorySlicing}
            headerNavHistory={currentMemberPage}
            headerTitle={"Employees"}
            renderRight={() => {
              return (
                <>
                  {MemberPermission?.some(
                    (item) =>
                      item == permissionIds.REPORTING_MANAGER ||
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.CREATE_MANAGER
                  ) && (
                    <div className="col-auto d-flex w-sm-100">
                      <div className="col-auto d-flex w-sm-100">
                        <Button
                          variant="primary"
                          className="me-2"
                          style={{ display: showDone }}
                          onClick={() => {
                            setShowDone("none");
                            setInput_text((prev) =>
                              prev === "Select All" ? "unSelect" : "Select All"
                            );
                            setIsChecked((prev) =>
                              prev === false ? true : false
                            );
                            setShowIcon(
                              input_text === "Select All" ? "block" : "none"
                            );
                          }}
                        >
                          Done
                        </Button>
                        <select
                          className="me-2"
                          style={{ display: showIcon, borderStyle: "none" }}
                          onClick={() => {
                            setShowDone("block");
                          }}
                        >
                          <option>Send Credentials</option>
                          <option>Set Status (Active/Inactive)</option>
                        </select>
                        <Button
                          variant="primary"
                          className="btn btn-dark btn-set-task w-sm-100 me-2"
                          onClick={() => {
                            setInput_text((prev) =>
                              prev === "Select All" ? "unSelect" : "Select All"
                            );
                            setIsChecked((prev) =>
                              prev === false ? true : false
                            );
                            setShowIcon(
                              input_text === "Select All" ? "block" : "none"
                            );
                          }}
                        >
                          {buttonLoader.gettingDropDowns ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-1"
                            />
                          ) : (
                            <i className="icofont-tick-boxed me-2 fs-6"></i>
                          )}
                          {input_text}
                        </Button>

                        <Button
                          variant="primary"
                          className="btn btn-dark btn-set-task w-sm-100 me-2"
                          onClick={async () => {
                            // setButtonLoader({
                            //   ...buttonLoader,
                            //   ...{ gettingDropDowns: true },
                            // });
                            try {
                              setIsModal(true);
                              if (!city) {
                                Dispatch(setAllCity([]));
                              }
                              if (!state) {
                              }
                              if (DropDownsField.allDesignation.length <= 0) {
                                const desg = await getAllDesignation(
                                  Cred.token
                                );
                                Dispatch(setAllDesignation(desg.data));
                              }

                              //change
                              await getAllRegion();
                              await getAllCity();
                              await getAllState();
                              await getAllDivision();
                            } catch (error) {
                              //change
                              setIsModal(false);
                              console.log("Error:", error);
                              Swal.fire(
                                "Something went wrong",
                                "Can't Fetch Necessary data"
                              );
                            }
                            // setButtonLoader({
                            //   ...buttonLoader,
                            //   ...{ gettingDropDowns: false },
                            // });
                          }}
                        >
                          {buttonLoader.gettingDropDowns ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              // aria-hidden="true"
                              className="me-1"
                            />
                          ) : (
                            <i className="icofont-plus-circle me-2 fs-6"></i>
                          )}
                          Add Employee
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            }}
          />

          {MemberPermission?.some(
            (item) =>
              item == permissionIds.SUPER_ADMIN ||
              item == permissionIds.REPORTING_MANAGER ||
              item == permissionIds.VIEW_MANAGER
          ) ? (
            Member.allMembers.length > 0 ? (
              userId == Cred.sub ? (
                <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
                  {Member.allMembers.map((data, i) => {
                    return (
                      <div className="col" key={data.mobile}>
                        <OurMembers
                          getDropDownsValue={getDropDownsValue}
                          data={data}
                          isMember={true}
                          checkedValue={isChecked}
                          allDesignation={DropDownsField.allDesignation}
                          UpdateMember={UpdateMember}
                          DeleteMember={DeleteMember}
                          UpdatePassword={UpdatePassword}
                          fetchPermissionOfAMember={fetchPermissionOfAMember}
                          UpdatePermissionOfAMember={UpdatePermissionOfAMember}
                          index={i}
                          handleCurrentMemberName={handleCurrentMemberName}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="member" title="Members">
                    <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
                      {hierarchyMembersData.length <= 0 ? (
                        <h1>No Member to show</h1>
                      ) : (
                        hierarchyMembersData.map((data, i) => {
                          return (
                            <div key={data.mobile} className="col">
                              <OurMembers
                                getDropDownsValue={getDropDownsValue}
                                data={data}
                                isMember={true}
                                checkedValue={isChecked}
                                allDesignation={DropDownsField.allDesignation}
                                fetchPermissionOfAMember={
                                  fetchPermissionOfAMember
                                }
                                UpdatePermissionOfAMember={
                                  UpdatePermissionOfAMember
                                }
                                index={i}
                                handleCurrentMemberName={
                                  handleCurrentMemberName
                                }
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="attendance" title="Attendance">
                    <>
                      {hierarchyAttendanceData?.length <= 0 ? (
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
                              data={hierarchyAttendanceData}
                              pagination
                              selectableRows={false}
                              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                              customStyles={customStyles}
                            />
                          </div>
                        </table>
                      )}
                    </>
                  </Tab>
                  <Tab eventKey="expense" title="Expense">
                    {hierarchyExpenseData.length <= 0 ? (
                      <h1>No expense to show</h1>
                    ) : (
                      <DataTable
                        title={"Leaves"}
                        columns={ExpenseColumnT}
                        data={hierarchyExpenseData}
                      />
                    )}
                  </Tab>
                  <Tab eventKey="beat" title="Beats">
                    {hierarchyBeatsData.length <= 0 ? (
                      <h1>No {getPageType()} to show</h1>
                    ) : (
                      <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-2 py-1 pb-4">
                        {hierarchyBeatsData?.map((Data, index) => (
                          <div className="col" key={index}>
                            <div className="card teacher-card">
                              <div className="card-body d-flex">
                                <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                                  <div className="about-info d-flex align-items-center mt-1 justify-content-center flex-column">
                                    <h6 className="mb-0 fw-bold d-block fs-6 mt-2">
                                      {Data.beet}
                                    </h6>
                                    <div
                                      className="btn-group mt-2 d-flex flex-column gap-2"
                                      role="group"
                                      aria-label="Basic outlined example"
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleIsOutletModal(Data)
                                        }
                                        className="btn btn-outline-secondary text-info d-flex gap-2 justify-content-center align-items-center"
                                      >
                                        <i className="icofont-info-circle text-info"></i>
                                        Outlets
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100"
                                  style={{ backgroundColor: "#dadada" }}
                                >
                                  <div className="video-setting-icon pt-3">
                                    <p>
                                      Address:{" "}
                                      <span className="fs-6 fw-bold">
                                        {Data.address}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="video-setting-icon mt-3 pt-3 border-top">
                                    <p>
                                      Postal Code:{" "}
                                      <span className="fs-6 fw-bold">
                                        {Data.postalCode}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="video-setting-icon mt-3 pt-3 border-top">
                                    <p>
                                      Number of Outlets:{" "}
                                      <span className="fs-6 fw-bold">
                                        {Data.outlets?.length}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Tab>
                  <Tab eventKey="client" title="Clients">
                    <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
                      {hierarchyClientsData.length > 0 ? (
                        hierarchyClientsData.map((data, i) => {
                          return (
                            <div key={"skhd" + i} className="col">
                              <OurFMCGClients
                                avatar={lgAvatar3}
                                data={data}
                                getDropDownsValue={getDropDownsValue}
                                index={i}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                          <p className="font-size: 18px; font-weight: bold;">
                            No More {getClientPageType()}'s To Load.
                          </p>
                        </div>
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="leaves" title="Leaves">
                    {hierarchyLeavesData.length <= 0 ? (
                      <h1>No Leaves to show</h1>
                    ) : (
                      <DataTable
                        title={"Leaves"}
                        columns={MemberColumnT}
                        data={hierarchyLeavesData}
                      />
                    )}
                  </Tab>
                </Tabs>
              )
            ) : (
              <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                <p className="font-size: 18px; font-weight: bold;">
                  No Members available
                </p>
              </div>
            )
          ) : (
            <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
              <p className="font-size: 18px; font-weight: bold;">
                Permission Required.
              </p>
            </div>
          )}

          <Modal
            size="xl"
            centered
            show={isOutletModal}
            onHide={handleIsOutletModal}
          >
            <BeetOutlet
              outlets={outletData}
              beetId={beetId}
              clientFmcgId={clientFmcgId}
              handleOutletViewModal={() => setIsOutletModal(!isOutletModal)}
              // handleGetUserLocation={handleGetUserLocation}
              // locationError={locationError}
              // longitude={longitude}
              // latitude={latitude}
            />
          </Modal>

          <Modal
            centered
            show={isModal}
            size="lg"
            onHide={() => {
              setIsModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add Employee</Modal.Title>
            </Modal.Header>
            {!isDataFilled ? (
              <Modal.Body>
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput877"
                      className="form-label"
                    >
                      Employee First Name*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      id="exampleFormControlInput877"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInertrput878"
                      className="form-label"
                    >
                      Employee Last Name*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      id="exampleFormControlInput878"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dobInput" className="form-label">
                      Dob Date*
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      id="dobInput"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dob" className="form-label">
                      Member Photo*
                    </label>
                    <input
                      type="file"
                      typeof="image"
                      className="form-control"
                      max={imgUploadKey}
                      maxLength={1}
                      onChange={(e) => {
                        const allowedExtensions = ["jpg", "jpeg", "png"];
                        if (e.target.files[0].size > 5242880) {
                          alert("File size is too big!");
                          e.target.value = "";
                        }
                        if (e.target.files && e.target.files[0]) {
                          const fileExtension = e.target.files[0].name
                            .split(".")
                            .pop()
                            .toLowerCase();
                          if (allowedExtensions.includes(fileExtension)) {
                            setImgUploadKey(e.target.files[0]);
                          } else {
                            setIsModal(false);
                            Swal.fire(
                              "Invalid file type",
                              "Only .png, .jpg, .jpeg file types are allowed",
                              "warning"
                            ).finally(() => {
                              setIsModal(true);
                            });
                          }
                        }
                      }}
                      // onChange={(e)=>handleFileChange(e)}
                      id="img"
                      name="file"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput2778"
                      className="form-label"
                    >
                      Joining Date*
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      id="exampleFormControlInput2778"
                    />
                  </div>
                  <div className="deadline-form">
                    <form>
                      <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                          <label className="form-label">Designation*</label>
                          <select
                            className="form-select"
                            value={designation}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setDesignation(selectedValue);
                            }}
                          >
                            {" "}
                            <option value="">Select a Designation</option>
                            {DropDownsField.allDesignation.map((value, i) => {
                              return (
                                <option value={value.id} key={value.id}>
                                  {value?.designationName} ({value.id})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="col-lg-6">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput585"
                          >
                            Permission*
                          </label>
                          <Select
                            inputId="exampleFormControlInput684"
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: "#eeeeee",
                                border: "none",
                              }),
                              placeholder: (baseStyles) => ({
                                ...baseStyles,
                                fontSize: "16px",
                                color: "black",
                              }),
                              multiValueLabel: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: "#4361ee",
                                color: "white",
                              }),
                              multiValueRemove: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: "#4361ee",
                                color: "white",
                              }),
                            }}
                            defaultValue={permission}
                            onChange={(e) => setPermission(e)}
                            options={
                              Array.isArray(MemberPermission) &&
                              MemberPermission.some(
                                (item) => item === permissionIds.SUPER_ADMIN
                              )
                                ? Array.isArray(permissionEnum)
                                  ? permissionEnum.map((item) => ({
                                      value: item.value,
                                      label: item.label.replace(/_/g, " "), // Safer replacement
                                    }))
                                  : []
                                : Array.isArray(MemberPermission)
                                ? MemberPermission.map((item) => ({
                                    value: item,
                                    label: item.replace(/_/g, " "),
                                  }))
                                : []
                            }
                            isMulti
                            placeholder="Select Permission"
                            noOptionsMessage={() => "Not found"}
                          />
                        </div>

                        <div className="col-lg-6">
                          <SingleDropdown
                            buttonLoader={buttonLoader.loadMoreMember}
                            title="Reporting Member"
                            data={reportingManager}
                            accessLabel={(item) =>
                              item.firstName + " " + item.lastName
                            }
                            dropdownData={
                              Array.isArray(Member.allMembers)
                                ? [
                                    {
                                      id: Cred.sub,
                                      firstName: Cred.firstName,
                                      lastName: `${Cred.lastName} (Self)`,
                                      cities: Cred.cities,
                                    },
                                    ...Member.allMembers,
                                  ]
                                : []
                            }
                            isPagination={
                              Member.paginationData.totalPages &&
                              Member.paginationData.totalPages - 1 >
                                Member.paginationData.number
                            }
                            loadMore={onEndReach}
                            handleChange={(item) => {
                              setReportingManager(item);
                            }}
                          />
                        </div>

                        {MemberPermission.some(
                          (item) => item === permissionIds.SUPER_ADMIN
                        ) ? (
                          <div className="col-lg-6">
                            <label
                              className="form-label"
                              htmlFor="exampleFormControlInput478"
                            >
                              Region*
                            </label>
                            <select
                              className="form-select"
                              id="exampleFormControlInput478"
                              value={region}
                              onChange={async (e) => {
                                try {
                                  setRegion("");
                                  setCity([]);
                                  setDropdownCities([]);
                                  setState([]);
                                  const selectedValue = e.target.value;
                                  setRegion(selectedValue);
                                  // await getAllState(selectedValue);
                                } catch (error) {
                                  Swal.fire(
                                    "Something went wrong",
                                    "Please Try After Some Time",
                                    "error"
                                  );
                                }
                              }}
                            >
                              <option value="">Select a region</option>
                              {DropDownsField.allRegion.map((value, i) => {
                                return (
                                  <option value={value.id} key={value.id}>
                                    {value.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        ) : (
                          <div className="col-lg-6">
                            <label
                              className="form-label"
                              htmlFor="exampleFormControlInput478"
                            >
                              Region*
                            </label>
                            <select
                              className="form-select"
                              id="exampleFormControlInput478"
                              value={region}
                              disabled="true"
                              onChange={async (e) => {
                                try {
                                  // setRegion("");
                                  setCity([]);
                                  setDropdownCities([]);
                                  setState("");
                                  const selectedValue = e.target.value;
                                  setRegion(selectedValue);
                                  await getAllState(selectedValue);
                                } catch (error) {
                                  Swal.fire(
                                    "Something went wrong",
                                    "Please Try After Some Time",
                                    "error"
                                  );
                                }
                              }}
                            >
                              <option value="">Select a region</option>
                              {DropDownsField.allRegion.map((value, i) => {
                                return (
                                  <option value={value.id} key={value.id}>
                                    {value.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}

                        <div className="row g-3 mb-3">
                          {/* state dropdown */}
                          <div className="col-lg-6">
                            <p className="form-label">Select State</p>
                            <div
                              className="custom-dropdown"
                              ref={stateDropDownRef}
                            >
                              <div
                                id="assignClient"
                                className="multiDropdown"
                                onClick={() => {
                                  if (!region) return;
                                  toggleDropdownState();
                                }}
                              >
                                <div className="multiDropdownSubHeader">
                                  {state.length > 0 ? (
                                    state.map((e, i) => (
                                      <p
                                        className="multiDropdownHeaderList"
                                        key={i}
                                      >
                                        {e.stateName}{" "}
                                        <ImCross
                                          onClick={() => {
                                            setState(
                                              state.filter((c) => c.id != e.id)
                                            );
                                            setCity(
                                              city.filter(
                                                (c) => c.stateId != e.id
                                              )
                                            );
                                            setDropdownCities(
                                              dropdownCities.filter(
                                                (c) => c.stateId !== e.id
                                              )
                                            );
                                            setIsOpenState(false);
                                          }}
                                          className="ml-2"
                                          size={8}
                                        />
                                      </p>
                                    ))
                                  ) : (
                                    <p className="multiSelectNotSelected">
                                      Select State
                                    </p>
                                  )}
                                </div>
                                <i className="icofont-caret-down me-2 fs-6"></i>
                              </div>
                              {isOpenState && (
                                <div className="dropdown-list">
                                  {MemberPermission.some(
                                    (item) => item === permissionIds.SUPER_ADMIN
                                  ) ? (
                                    DropDownsField.allState.length > 0 ? (
                                      DropDownsField.allState
                                        ?.filter(
                                          (item) =>
                                            item?.regionEntity?.id == region
                                        )
                                        ?.map((item, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              if (
                                                !state.some(
                                                  (e, i) => e.id == item.id
                                                )
                                              ) {
                                                setState([...state, item]);

                                                console.log(
                                                  "selected state :",
                                                  item
                                                );
                                              }
                                              setIsOpenState(false);
                                            }}
                                            className={`dropdown-item ${
                                              state.some(
                                                (e, i) => e.id == item.id
                                              )
                                                ? "selected"
                                                : ""
                                            }`}
                                          >
                                            {item.stateName}
                                          </div>
                                        ))
                                    ) : (
                                      <div
                                        onClick={() => {
                                          setIsOpenState(false);
                                        }}
                                        className={"dropdown-item"}
                                      >
                                        No State
                                      </div>
                                    )
                                  ) : Cred.states.length > 0 ? (
                                    Cred.states.map((item, index) => (
                                      <>
                                        <div
                                          key={item.id}
                                          onClick={() => {
                                            if (
                                              !state.some(
                                                (e, i) => e.id == item.id
                                              )
                                            ) {
                                              setState([...state, item]);
                                              let accCities =
                                                Cred.cities.filter(
                                                  (city) =>
                                                    city.stateId == item.id
                                                );
                                              setDropdownCities([
                                                ...accCities,
                                                ...dropdownCities,
                                              ]);
                                              console.log(
                                                "member city",
                                                Cred.cities
                                              );
                                              console.log("city", accCities);
                                            }
                                            setIsOpenState(false);
                                          }}
                                          className={`dropdown-item ${
                                            state.some(
                                              (e, i) => e.id == item.id
                                            )
                                              ? "selected"
                                              : ""
                                          }`}
                                        >
                                          {item.stateName}
                                        </div>
                                      </>
                                    ))
                                  ) : (
                                    <div
                                      onClick={() => {
                                        setIsOpenState(false);
                                      }}
                                      className={"dropdown-item"}
                                    >
                                      No State
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* city dropdown */}
                          <div className="col-lg-6">
                            <p className="form-label">Select City</p>
                            <div
                              className="custom-dropdown"
                              ref={cityDropDownRef}
                            >
                              <div
                                id="assignClient"
                                className="multiDropdown"
                                onClick={() => {
                                  if (state.length < 0) return;
                                  toggleDropdownCity();
                                }}
                              >
                                <div className="multiDropdownSubHeader">
                                  {city.length > 0 ? (
                                    city.map((e, i) => (
                                      <p className="multiDropdownHeaderList">
                                        {e.cityName}{" "}
                                        <ImCross
                                          onClick={() => {
                                            setCity(
                                              city.filter((c) => c.id != e.id)
                                            );
                                            setIsOpenCity(false);
                                          }}
                                          className="ml-2"
                                          size={8}
                                        />
                                      </p>
                                    ))
                                  ) : (
                                    <p className="multiSelectNotSelected">
                                      Select City
                                    </p>
                                  )}
                                </div>
                                <i className="icofont-caret-down me-2 fs-6"></i>
                              </div>
                              {isOpenCity && (
                                <div className="dropdown-list">
                                  {MemberPermission.some(
                                    (item) => item === permissionIds.SUPER_ADMIN
                                  ) ? (
                                    DropDownsField.allCity.length > 0 ? (
                                      DropDownsField.allCity
                                        .filter((val) =>
                                          state.some(
                                            (s) => s.id === val.stateId
                                          )
                                        ) // Filter cities based on selected states
                                        .map((item) => (
                                          <div
                                            key={item.id}
                                            onClick={() => {
                                              if (
                                                !city.some(
                                                  (e) => e.id === item.id
                                                )
                                              ) {
                                                setCity([...city, item]);
                                                console.log(
                                                  "selected City",
                                                  item
                                                );
                                              }
                                              setIsOpenCity(false);
                                            }}
                                            className={`dropdown-item ${
                                              city.some((e) => e.id === item.id)
                                                ? "selected"
                                                : ""
                                            }`}
                                          >
                                            {item.cityName}
                                          </div>
                                        ))
                                    ) : (
                                      <div
                                        onClick={() => setIsOpenCity(false)}
                                        className="dropdown-item"
                                      >
                                        No City
                                      </div>
                                    )
                                  ) : dropdownCities.length > 0 ? (
                                    dropdownCities.map((item, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          if (
                                            !city.some(
                                              (e, i) => e.id == item.id
                                            )
                                          ) {
                                            setCity([...city, item]);
                                          }
                                          setIsOpenCity(false);
                                        }}
                                        className={`dropdown-item ${
                                          city.some((e, i) => e.id == item.id)
                                            ? "selected"
                                            : ""
                                        }`}
                                      >
                                        {item.cityName}
                                      </div>
                                    ))
                                  ) : (
                                    <div
                                      onClick={() => {
                                        setIsOpenCity(false);
                                      }}
                                      className={"dropdown-item"}
                                    >
                                      No City
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <label
                              className="form-label"
                              htmlFor="exampleFormControlInput585"
                            >
                              Division*
                            </label>
                            <Select
                              inputId="exampleFormControlInput684"
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  backgroundColor: "#eeeeee",
                                  border: "none",
                                }),
                                placeholder: (baseStyles, state) => ({
                                  ...baseStyles,
                                  fontSize: "16",
                                  color: "black",
                                }),
                                multiValueLabel: (baseStyles, state) => ({
                                  ...baseStyles,
                                  backgroundColor: "#4361ee",
                                  color: "white",
                                }),
                                multiValueRemove: (baseStyles, state) => ({
                                  ...baseStyles,
                                  backgroundColor: "#4361ee",
                                  color: "white",
                                }),
                              }}
                              defaultValue={division}
                              onChange={(e) => {
                                setDivision(e);
                              }}
                              options={DropDownsField.allDivision.map(
                                (item) => {
                                  return {
                                    value: item.id,
                                    label: item.divisionName,
                                  };
                                }
                              )}
                              isMulti
                              placeholder="Select Division"
                              noOptionsMessage={() => "Not found"}
                            />
                          </div>

                          <div className="col-lg-6">
                            <label
                              htmlFor="exampleFormControlInput777"
                              className="form-label"
                            >
                              Email*
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleFormControlInput777"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email Id"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                          <label
                            htmlFor="exampleFormControlInput177"
                            className="form-label"
                          >
                            Mobile*
                          </label>
                          <input
                            maxLength={"10"}
                            minLength={"10"}
                            type="text"
                            className="form-control"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            id="exampleFormControlInput177"
                            placeholder="Mobile"
                          />
                        </div>
                        <div className="col-lg-6">
                          <label
                            htmlFor="exampleFormControlInput277"
                            className="form-label"
                          >
                            Password*
                          </label>
                          <div className="d-flex justify-content-between align-items-center">
                            <input
                              type={passText}
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              id="exampleFormControlInput277"
                              placeholder="Password"
                            />
                            <div
                              className="fs-4"
                              onClick={() =>
                                setPassText((prev) =>
                                  prev === "password" ? "text" : "password"
                                )
                              }
                            >
                              {passText === "password" ? (
                                <i className="icofont-eye-blocked"></i>
                              ) : (
                                <i className="icofont-eye"></i>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Modal.Body>
            ) : (
              <Modal.Body>
                <div className="modal-body">
                  <label
                    htmlFor="exampleFormControlInput877"
                    className="col-form-label-lg"
                  >
                    Salary Details
                  </label>
                  <hr className="custom-line" />

                  <div className="deadline-form">
                    <form>
                      {/* sallery detail */}
                      <div className="row align-items-center">
                        <div className="col">
                          <label
                            htmlFor="exampleFormControlInput877"
                            className="col-form-label-lg"
                          >
                            Earnings
                          </label>

                          <div className=" d-flex gap-4 align-items-center mb-3">
                            <label className="form-label ">Basic</label>
                            <input
                              type="number"
                              className="form-control"
                              value={basicValue}
                              onChange={(e) => setBasicValue(e.target.value)}
                              id="exampleFormControlInput277"
                              placeholder="Basic"
                            />
                          </div>
                          <div className=" d-flex gap-4 align-items-center">
                            <label
                              htmlFor="exampleFormControlInput177"
                              className="form-label"
                            >
                              HRA
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={hraValue}
                              onChange={(e) => setHRAValue(e.target.value)}
                              id="exampleFormControlInput177"
                              placeholder="HRA"
                            />
                          </div>
                        </div>
                        <div className="col">
                          <label
                            htmlFor="exampleFormControlInput877"
                            className="col-form-label-lg"
                          >
                            Deduction
                          </label>
                          <div className="d-flex gap-4 align-items-center mb-3">
                            <label
                              className="form-label"
                              htmlFor="exampleFormControlInput585"
                            >
                              PF(%)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={pfValue}
                              onChange={(e) => setPFValue(e.target.value)}
                              id="exampleFormControlInput277"
                              placeholder="12"
                            />
                          </div>
                          <div className=" d-flex gap-4 align-items-center">
                            <label
                              htmlFor="exampleFormControlInput277"
                              className="form-label"
                            >
                              ESI(%)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={esiValue}
                              onChange={(e) => setESIValue(e.target.value)}
                              id="exampleFormControlInput277"
                              placeholder="0.75"
                            />
                          </div>
                        </div>
                      </div>
                      {/* member section */}
                      <hr className="custom-line" />
                      <label
                        htmlFor="exampleFormControlInput877"
                        className="col-form-label-lg mb-2"
                      >
                        Member Expense
                      </label>
                      <div className=" d-flex gap-4 col-sm-12 align-items-center mb-3 bg-red-500">
                        <label className=" w-full bg-green-500 col-sm-2  ">
                          Ex-City DA
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={cityDaValue}
                          onChange={(e) => setExCityDAValue(e.target.value)}
                          id="exampleFormControlInput277"
                          placeholder="Ex-city DA"
                        />
                      </div>
                      <div className="col-sm-12 d-flex gap-4 align-items-center mb-3">
                        <label className="form-label col-sm-2 w-full">
                          HQ-DA
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={hqdaValue}
                          onChange={(e) => setHqDaValue(e.target.value)}
                          id="exampleFormControlInput277"
                          placeholder="HQ-DA"
                        />
                      </div>
                      <div className="row">
                        <div className="col-sm-12 d-flex gap-4 align-items-center">
                          <label className="form-label col-sm-2 w-full">
                            Travell Allowence
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={taValue}
                            onChange={(e) => setTaValue(e.target.value)}
                            id="exampleFormControlInput277"
                            placeholder="Travell Allowence"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Modal.Body>
            )}

            <Modal.Footer>
              {loading ? (
                <Spinner
                  className="spinner-center"
                  animation={"border"}
                  color={"dark"}
                  size={200}
                />
              ) : (
                <>
                  <div className="d-flex gap-2 align-items-center ">
                    {" "}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsDataFilled(false);
                        // setIsModal(false);
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={(e) => AddMember(e)}
                      className="btn btn-primary"
                    >
                      {buttonLoader.addMember && (
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
                    </button>
                  </div>
                  {/* {!isDataFilled ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => actionOnNextBtn()}
                    >
                      Next
                    </button>
                  ) : (
                    <div className="d-flex gap-2 align-items-center ">
                      {" "}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setIsDataFilled(false);
                          // setIsModal(false);
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={(e) => AddMember(e)}
                        className="btn btn-primary"
                      >
                        {buttonLoader.addMember && (
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
                      </button>
                    </div>
                  )} */}
                </>
              )}
            </Modal.Footer>
          </Modal>
          <ModalLoader message={fetchMessage} show={modalLoader} />
          {Member.paginationData.totalPages &&
          Member.paginationData.totalPages - 1 >
            Member.paginationData.number ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="primary"
                onClick={onEndReach}
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
          ) : (
            " "
          )}
          <div>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
              <Toast.Header>
                <strong className="mr-auto">No More Members to load</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}
    </>
  );
}
export default Members;
