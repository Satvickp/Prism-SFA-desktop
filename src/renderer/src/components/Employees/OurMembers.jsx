import React, { useEffect, useState, useRef } from "react";
import lgAvatar3 from "../../assets/images/lg/avatar3.jpg";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { emailValidator } from "../../helper/emailValidator";
import Swal from "sweetalert2";
import mobileValidator from "../../helper/mobileValidator";
import { passwordValidator } from "../../helper/passwordValidator";
import ModalLoader from "../../screens/UIComponents/ModalLoader";

import {
  setAllCity,
  setAllDivision,
  setAllDesignation,
  setAllRegion,
  setAllState,
} from "../../redux/features/dropdownFieldSlice";
import {
  getCity,
  getDivision,
  getEveryCity,
  getEveryState,
  getRegion,
  getRegionById,
  getState,
  getStateById,
} from "../../api/clients/clients-api";
import {
  getAllDesignation,
  getAllReportingMembers,
} from "../../api/member/member-api";
import {
  memberPermissions,
  membersAllPermissions,
  permissionEnum,
  permissionIds,
} from "../../constants/constants";
import MultiDropdown from "../UI/MultiDropdown";
import SingleDropdown from "../UI/SingleDropdown";
import { useNavigate, useParams } from "react-router-dom";
import useHierarchyData from "../../hooks/hierarchyDataHook";
import Sample from "../../screens/Employee/Sample";
import MemberPermissionUpdate from "../../screens/Master/Assignpermission/MemberPermissionUpdate";
import { ImCross } from "react-icons/im";
function formatedDate(value) {
  var value = new Date(value);
  const date = value.getDate();
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  return `${date}-${month}-${year}`;
}

function OurMembers(props) {
  const isMember = props.isMember;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Data = props.data;
  // console.log(props.UpdateMember);
  const [isModal, setIsModal] = useState(false);
  const Member = useSelector((state) => state.Member);
  const Cred = useSelector((state) => state.Cred);
  const [firstName, setFirstName] = useState(Data.firstName);
  const [lastName, setLastName] = useState(Data.lastName);
  const [email, setEmail] = useState(Data.email);
  const [mobile, setMobile] = useState(Data.mobile);
  const [joiningDate, setJoiningDate] = useState(Data.joiningDate);
  const [designation, setDesignation] = useState(Data.designation);
  const [employeeId, setEmployeeId] = useState(Data.employeeId);
  const [dob, setDob] = useState(Data.dob);
  const [states, setStates] = useState(Data.states);
  const [region, setRegion] = useState(Data.region);
  const [cities, setCities] = useState([...Data.cities]);
  const [uploadFileKey, setUploadFileKey] = useState(Data.uploadFileKey);
  const [userRoleList, setUserRoleList] = useState(Data.userRoleList);
  // console.log("cities", cities)
  // console.log('Data.cities', Data.cities)
  // const cityDropRef = useRef(null);
  // const stateDropRef = useRef(null);
  const [newPassword, setNewPassword] = useState("");
  const [memberPermission, setMemberPermission] = useState([]);
  const [division, setDivision] = useState(Data.divisions);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allReportingManager, setAllReportingManager] = useState([]);
  const [reportingManager, setReportingManager] = useState(
    Data.reportingManager
  );
  const [myManager, setMyManager] = useState(
    `${Cred.firstName} ${Cred.lastName}`
  );
  const [isPassModal, setIsPassModal] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    assignPermission: false,
    updatePermission: false,
    updateMember: false,
    updatePassword: false,
  });
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const DropdownMembers = useSelector((state) => state.Member);
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const setInitialValue = (setStateFunction, initialValue) => {
    setStateFunction(initialValue);
  };
  const checkedValue = props.checkedValue;
  const [isChecked, setIsChecked] = useState(checkedValue);
  const [passText, setPassText] = useState("password");
  const [stateName, setStateName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isPermissionShowModal, setIsPermissionShowModal] = useState(false);
  const [dropdownCities, setDropdownCities] = useState(Cred.cities);
  
  useEffect(() => {
    setIsChecked(checkedValue);
    // getAllStates(Data.state);
  }, [checkedValue]);

  function handleChange() {
    setIsChecked((prev) => (prev === false ? true : false));
  }

  async function onPasswordChange() {
    if (newPassword === confirmPassword) {
      const passError = passwordValidator(confirmPassword);
      if (passError) {
        setIsPassModal(false);
        Swal.fire({
          title: "Invalid Password",
          text: passError,
          timer: 2000,
          icon: "warning",
        }).then((e) => setIsPassModal(true));
        return;
      } else {
        setButtonLoader({ ...buttonLoader, ...{ updatePassword: true } });
        await props.UpdatePassword(Data.id, confirmPassword);
        setNewPassword("");
        setConfirmPassword("");
        setButtonLoader({ ...buttonLoader, ...{ updatePassword: false } });
        setIsPassModal(false);
      }
    } else {
      setIsPassModal(false);
      Swal.fire(
        "Invalid Entry",
        "Make Sure both password are same",
        "warning"
      ).then((e) => {
        if (e.isConfirmed) {
          setIsPassModal(true);
        }
      });
    }
  }
  async function onDelete() {
    if (!Data.id) {
      setIsModal(false);
      Swal.fire("Can't Fetch Data", "Can't Fetch Member data");
      return;
    }
    Swal.fire({
      title: "Are You Sure ?",
      text: "You are about to delete an member. if yes please press yes",
      confirmButtonText: "yes",
      denyButtonText: "no",
      showCancelButton: true,
    }).then(async (e) => {
      if (e.isConfirmed) {
        await props.DeleteMember(props.index, props.data.id);
      }
    });
  }

  async function getReportingMember(state, cities, region) {
    // console.log(state, cities, region)
    try {
      const resp = await getAllReportingMembers(
        Cred.token,
        state,
        cities,
        region,
        Cred.sub
      );
      setAllReportingManager(resp);
      // console.log(resp);
    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Reporting Manager. Please try After Some Time",
        icon: "error",
      });
    }
  }

  async function onUpdate() {
    const emailError = emailValidator(email);
    const mobileError = mobileValidator(mobile);
    if (emailError) {
      setIsModal(false);

      Swal.fire({
        title: "Invalid Email",
        text: emailError,
        timer: 2000,
        icon: "warning",
      }).then((e) => setIsModal(true));
      return;
    }
    if (mobileError) {
      setIsModal(false);
      Swal.fire({
        title: "Invalid Mobile",
        text: mobileError,
        timer: 2000,
        icon: "warning",
      }).then((e) => setIsModal(true));
      return;
    }
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !joiningDate ||
      !designation ||
      // !employeeId ||
      !dob ||
      !region ||
      !states ||
      !cities.length > 0
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

    const data = {
      firstName: firstName,
      lastName: lastName,
      designationId: designation,
      email: email,
      mobile: mobile,
      joiningDate: joiningDate,
      employeeId: employeeId,
      id: Data.id,
      dob: dob,
      region: Number(region) || Number(Data.region), // in case region is not selected or region is null send default region id
      states: states.map((item) => ({ id: item.id })),
      cities: cities.map((item) => ({ id: item.id })),
      divisions: division.map((item) => {
        return { id: item.id };
      }),
      reportingManager: reportingManager,
      uploadFileKey: uploadFileKey,
      userRoleList: userRoleList,
      ta: null,
      da: null,
      daExCity: null,
      salary: null,
    };
    console.log(data);
    // console.log("data" , data)
    setButtonLoader({ ...buttonLoader, ...{ updateMember: true } });
    try {
      const resp = await props.UpdateMember(data, props.index);
      setButtonLoader({ ...buttonLoader, ...{ updateMember: false } });
      // setIsModal(false);
      // if (resp?.status >= 200 && resp?.status < 300) {
      setIsModal(false);
      if (resp) {
        Swal.fire({
          title: "Update Successfull",
          text: "Employee details updated Successfully",
          icon: "success",
        });
        return;
      }
      // }
    } catch (error) {
      console.log("Error ::", error);
      setIsModal(false);
      Swal.fire({
        title: "Something went wrong!",
        text: "Invalid Employee details",
        icon: "warn",
        timer: 2000,
      }).then((e) => setIsModal(true));
    }
  }

  async function getAllDivision() {
    if (DropDownsField.allDivision.length <= 0) {
      const divisionArray = await getDivision(Cred.token);
      Dispatch(setAllDivision(divisionArray));
      if (division instanceof Array) {
        const nDivison = division.map((item) => {
          return { value: item.id };
        });
      } else {
        setDivision([]);
      }
    }
  }

  async function getAllRegion() {
    if (DropDownsField.allRegion.length <= 0) {
      const regionArray = await getRegion(Cred.token);
      Dispatch(setAllRegion(regionArray));
    }
  }

  async function getAllStates() {
    if (DropDownsField.allState.length <= 0) {
      const stateName = await getEveryState(Cred.token, 0, 500);
      Dispatch(setAllState(stateName));
    }
  }

  async function getAllCities() {
    if (DropDownsField.allCity.length <= 0) {
      const cityName = await getEveryCity(Cred.token, 0, 500);
      Dispatch(setAllCity(cityName));
    }
  }

  async function getDropDownsValue() {
    Dispatch(setAllCity([]));
    Dispatch(setAllState([]));
    await Promise.all([
      getAllDivision(),
      getAllRegion(),
      getAllCities(),
      getAllStates(),
    ]);
    await getCall();
  }

  // console.log(Data)

  async function getCall() {
    if (!DropDownsField.allDesignation.length > 0) {
      const desg = await getAllDesignation(Cred.token);
      Dispatch(setAllDesignation(desg.data));
    }
    let region = null;
    const fetchedRegion = Data.region
      ? await getRegionById(Cred.token, Data.region)
      : null;

    if (fetchedRegion) {
      region = fetchedRegion;
    }

    setRegion(region);
    setCities(Data.cities);
    setStates(Data.states);

    if (Data?.states?.length && Cred?.cities?.length) {
      let statesIds = new Set(Data.states.map((e) => e.id)); // Using Set for faster lookup and removing duplicacy
      let dropdownFilteredCities = Cred.cities.filter((item) => statesIds.has(item.stateId));
      setDropdownCities(dropdownFilteredCities);
  }
  
    console.log(cities);
    console.log(states);
  }

  const { getHierarchyMember, hierarchyMembersData } = useHierarchyData();
  const cityDropDownRef = useRef(null);
  const stateDropDownRef = useRef(null);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [isOpenState, setIsOpenState] = useState(false);

  const toggleDropdownCity = () => {
    setIsOpenCity(!isOpenCity);
  };

  const toggleDropdownState = () => {
    setIsOpenState(!isOpenState);
    console.log("states :", states);
  };

  return (
    <>
      <div className="card teacher-card">
        <div className="card-body d-flex">
          <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
            <img
              src={
                Data.uploadFileKey
                  ? `https://prismsfa-bucket.s3.ap-south-1.amazonaws.com/${Data.uploadFileKey}`
                  : lgAvatar3
              }
              alt=""
              className="avatar xl rounded-circle img-thumbnail shadow-sm"
            />
            <div className="about-info d-flex align-items-center mt-1 justify-content-center flex-column">
              <h6 className="mb-0 fw-bold d-block fs-6 mt-2">
                {Data.employeeId}
              </h6>
            </div>
            <div
              className="btn-group mt-2"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                onClick={() => setShowDetails(true)}
                type="button"
                className="btn btn-outline-secondary"
              >
                <i className="icofont-eye fs-6"></i>
              </button>
              {MemberPermission?.some(
                (item) =>
                  item == permissionIds.SUPER_ADMIN ||
                  item == permissionIds.REPORTING_MANAGER ||
                  item == permissionIds.EDIT_MANAGER
              ) &&
                userId == Cred.sub && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        if (!Data.id) {
                          setIsModal(false);
                          Swal.fire(
                            "Can't Fetch Data",
                            "Can't Fetch Member data"
                          );
                          return;
                        }
                        setIsModal(true);
                        setloading(false);
                        await getDropDownsValue();
                      } catch (error) {
                        console.log(error);
                        setIsModal(false);
                        Swal.fire(
                          "Something went wrong",
                          "Can't Fetch Necessary data"
                        );
                      }
                    }}
                    className="btn btn-outline-secondary"
                  >
                    <i className="icofont-edit text-success"></i>
                  </button>
                )}
              {MemberPermission?.some(
                (item) =>
                  item == permissionIds.SUPER_ADMIN ||
                  item == permissionIds.REPORTING_MANAGER ||
                  item == permissionIds.DELETE_MANAGER
              ) &&
                userId == Cred.sub && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="btn btn-outline-secondary"
                  >
                    <i className="icofont-ui-delete text-danger"></i>
                  </button>
                )}{" "}
            </div>
          </div>

          <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
            <div
              className="d-flex flex-row flex-wrap justify-content-between"
              style={{ cursor: "default" }}
              onClick={async () => {
                try {
                  const resp = await getHierarchyMember(Data.id);
                  navigate(`/member/${Data.id}`);
                  props.handleCurrentMemberName({
                    name: `${Data.firstName} ${Data.lastName}`,
                    id: Data.id,
                  });
                } catch (error) {
                  throw new Error(error);
                }
              }}
            >
              <span
                className="light-info-bg py-1 px-2 rounded-1 d-inline-block fw-bold mb-0 mt-1"
                style={{ cursor: "default" }}
              >
                {Data?.firstName?.toUpperCase() +
                  " " +
                  Data?.lastName?.toUpperCase()}
              </span>
              {Data.divisions.map((item, index) => (
                <span
                  key={index}
                  className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1"
                >
                  {item.divisionName}
                </span>
              ))}

              {MemberPermission.some(
                (item) =>
                  item.code == permissionIds.SUPER_ADMIN ||
                  item.code == permissionIds.REPORTING_MANAGER
              ) && (
                <div className="form-check">
                  <input
                    className="form-check-input"
                    style={{
                      border: "1px",
                      borderStyle: "solid",
                      borderColor: "#333",
                    }}
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div
              className="video-setting-icon mt-3 pt-3 border-top"
              style={{ cursor: "default" }}
              onClick={async () => {
                try {
                  const resp = await getHierarchyMember(Data.id);
                  navigate(`/member/${Data.id}`);
                  props.handleCurrentMemberName({
                    name: `${Data.firstName} ${Data.lastName}`,
                    id: Data.id,
                  });
                } catch (error) {
                  throw new Error(error);
                }
              }}
            >
              <p>Joining Date : {Data.joiningDate}</p>

              <p>Mobile : {Data.mobile}</p>

              <p>Email : {Data.email}</p>
              <p>
                State :{" "}
                {Data?.states?.length > 0
                  ? Data.states.map((item) => item.stateName).join(", ")
                  : ""}
              </p>
              <p>
                City :{" "}
                {Data?.cities?.length > 0
                  ? Data.cities.map((item) => item.cityName).join(", ")
                  : ""}
              </p>
              {/* <span className="d-flex gap-2 flex-wrap">
                Cities :{" "}
                {Data?.cities?.length > 1
                  ? Data?.cities?.map((item, index) => (
                      <span className="tex" key={index}>
                        {item?.cityName},{" "}
                      </span>
                    ))
                  : Data?.cities?.map((item, index) => (
                      <span key={index}>{item?.cityName}</span>
                    ))}
              </span> */}
            </div>

            {MemberPermission?.some(
              (item) =>
                item == permissionIds.SUPER_ADMIN ||
                item == permissionIds.REPORTING_MANAGER ||
                item == permissionIds.EDIT_MANAGER
            ) &&
              userId == Cred.sub && (
                <div>
                  <Button
                    variant="primary"
                    className="btn btn-dark btn-sm mt-1 me-2 z-50"
                    onClick={() =>
                      setIsPermissionShowModal(!isPermissionShowModal)
                    }
                  >
                    {buttonLoader.assignPermission ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                    ) : (
                      <i className="icofont-plus-circle me-2 fs-6  "></i>
                    )}
                    Assign Permission
                  </Button>
                  <Button
                    variant="primary"
                    className="btn btn-dark btn-sm mt-1 me-2 z-50"
                    onClick={() => {
                      navigate(`/sample/${Data.id}`);
                    }}
                  >
                    <i className=" "></i>
                    Sample Inventory
                  </Button>
                </div>
              )}

            {/* <Button
              variant="primary"
              className="btn btn-dark btn-sm mt-1 me-2"
              onClick={onAssignPermission}
            >
              {buttonLoader.assignPermission ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
              ) : (
                <i className="icofont-database-add me-2 fs-6"></i>
              )}
              View Members
            </Button> */}
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        centered
        show={showDetails}
        onHide={() => {
          setShowDetails(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {`${Data.firstName} ${Data.lastName}'s `} Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Member Name :</span>
            <span>{`${firstName} ${lastName}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Employee Id :</span>
            <span>{`${employeeId}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Mobile :</span>
            <span>{`${Data?.mobile || "NA"}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Email :</span>
            <span>{`${email}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Date of Birth :</span>
            <span>{`${dob}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Joining Date :</span>
            <span className="text-success">{`${joiningDate}`}</span>
          </div>
        </Modal.Body>
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
          <Modal.Title className="fw-bold">Edit Employee</Modal.Title>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <Button
              onClick={() => {
                setIsModal(false);
                setIsPassModal(true);
              }}
              variant="primary"
            >
              Update Password
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="firstNameInput" className="form-label">
                Employee First Name*
              </label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstNameInput"
                placeholder="First Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastNameInput" className="form-label">
                Employee Last Name*
              </label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastNameInput"
                placeholder="Last Name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="joiningDateInput" className="form-label">
                Joining Date*
              </label>
              <input
                type="date"
                className="form-control"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                id="joiningDateInput"
              />
            </div>
            {/* <div className="mb-3">
              <label htmlFor="employeeIdInput" className="form-label">
                Employee Id*
              </label>
              <input
                type="text"
                className="form-control"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                id="employeeIdInput"
                placeholder="ID"
              />
            </div> */}
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
            <div className="deadline-form">
              <form>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label htmlFor="emailInput" className="form-label">
                      Email*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="emailInput"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Id"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor="mobileInput" className="form-label">
                      Mobile Number*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobileInput"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Mobile Number"
                    />
                  </div>
                </div>
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
                      {DropDownsField?.allDesignation?.map((value, i) => {
                        return (
                          <option value={value.id} key={value.id}>
                            {value.designationName} ({value.id})
                          </option>
                        );
                      })}
                    </select>
                  </div>

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
                      value={region?.id || region}
                      disabled={
                        MemberPermission.some(
                          (item) => item === permissionIds.SUPER_ADMIN
                        )
                          ? false
                          : true
                      }
                      onChange={async (e) => {
                        try {
                          setRegion("");
                          const selectedValue = e.target.value;
                          setRegion(selectedValue);
                          console.log("selected region", selectedValue);
                          // await getAllState(selectedValue);
                          setCities([]);
                          setStates([]);
                          setDropdownCities([]);
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
                      {DropDownsField?.allRegion?.map((value, i) => {
                        return (
                          <option value={value.id} key={value.id}>
                            {value.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* <div className="col-lg-6">
                    <label
                      className="form-label"
                      htmlFor="exampleFormControlInput578"
                    >
                      State*
                    </label>
                    <select
                      className="form-select"
                      id="exampleFormControlInput578"
                      value={state?.id}
                      disabled="true"
                      onChange={async (e) => {
                        try {
                          setCities([]);
                          const selectedValue = e.target.value;
                          setState(selectedValue);
                          console.log("selected state", selectedValue);
                          await getAllCities(selectedValue);
                        } catch (error) {
                          Swal.fire(
                            "Something went wrong",
                            "Please Try After Some Time",
                            "error"
                          );
                        }
                      }}
                    >
                      <option value="">Select a State</option>
                      {DropDownsField?.allState?.map((value, i) => {
                        return (
                          <option value={value.id} key={value.id}>
                            {value.stateName}
                          </option>
                        );
                      })}
                    </select>
                  </div> */}

                  {/* <MultiDropdown
                    isPagination={false}
                    checkingField="stateName"
                    title="States"
                    data={states}
                    dropdownRef={stateDropRef}
                    dropdownData={
                      MemberPermission.some(
                        (item) => item === permissionIds.SUPER_ADMIN
                      )
                        ? DropDownsField.allState.length > 0
                          ? DropDownsField.allState.filter(
                              (item) => item?.regionEntity?.id == region
                            )
                          : []
                        : Cred.states.length > 0
                        ? Cred.states
                        : []
                    }
                    handleChange={(data) => {
                      setStates(data);
                    }}
                  /> */}

                  {/* state dropdown */}
                  <div className="col-lg-6">
                    <p className="form-label">Select State</p>
                    <div className="custom-dropdown" ref={stateDropDownRef}>
                      <div
                        id="assignClient"
                        className="multiDropdown"
                        onClick={() => {
                          if (!region) return;
                          toggleDropdownState();
                          console.log("region", region);
                        }}
                      >
                        <div className="multiDropdownSubHeader">
                          {states?.length > 0 ? (
                            states.map((e, i) => (
                              <p className="multiDropdownHeaderList">
                                {e.stateName}{" "}
                                <ImCross
                                  onClick={() => {
                                    setStates(
                                      states.filter((c) => c.id != e.id)
                                    );
                                    setCities(
                                      cities.filter((c) => c.stateId != e.id)
                                    );
                                    setDropdownCities(
                                      cities.filter((c) => c.stateId != e.id)
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
                                    item?.regionEntity?.id ==
                                    (region?.id || region)
                                )
                                ?.map((item, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      if (
                                        !states.some((e, i) => e.id == item.id)
                                      ) {
                                        setStates([...states, item]);
                                      }
                                      setIsOpenState(false);
                                    }}
                                    className={`dropdown-item ${
                                      states.some((e, i) => e.id == item.id)
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
                                      !states.some((e, i) => e.id == item.id)
                                    ) {
                                      setStates([...states, item]);
                                      let accCities =
                                                Cred.cities.filter(
                                                  (city) =>
                                                    city.stateId == item.id
                                                );
                                      setDropdownCities([
                                        ...accCities,
                                        ...dropdownCities,
                                      ]);
                                    }
                                    setIsOpenState(false);
                                  }}
                                  className={`dropdown-item ${
                                    states.some((e, i) => e.id == item.id)
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

                  {/* city deropdown */}

                  <div className="col-lg-6">
                    <p className="form-label">Select City</p>
                    <div className="custom-dropdown" ref={cityDropDownRef}>
                      <div
                        id="assignClient"
                        className="multiDropdown"
                        onClick={() => {
                          if (states.length < 0) return;
                          toggleDropdownCity();
                        }}
                      >
                        <div className="multiDropdownSubHeader">
                          {cities.length > 0 ? (
                            cities.map((e, i) => (
                              <p className="multiDropdownHeaderList">
                                {e.cityName}{" "}
                                <ImCross
                                  onClick={() => {
                                    setCities(
                                      cities.filter((c) => c.id != e.id)
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
                                  states.some((s) => s.id === val.stateId)
                                ) // Filter cities based on selected states
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      if (
                                        !cities.some((e) => e.id === item.id)
                                      ) {
                                        setCities([...cities, item]);
                                      }
                                      setIsOpenCity(false);
                                    }}
                                    className={`dropdown-item ${
                                      cities.some((e) => e.id === item.id)
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
                                  if (!cities.some((e, i) => e.id == item.id)) {
                                    setCities([...cities, item]);
                                  }
                                  setIsOpenCity(false);
                                }}
                                className={`dropdown-item ${
                                  cities.some((e, i) => e.id == item.id)
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

                  {/* <MultiDropdown
                    isPagination={false}
                    title="Cities"
                    checkingField="cityName"
                    data={cities}
                    dropdownRef={cityDropRef}
                    dropdownData={
                      MemberPermission?.some((item) => item === permissionIds.SUPER_ADMIN) ?  
                      (DropDownsField.allCity.length > 0 ? DropDownsField.allCity.filter((val) =>
                        states.some(
                          (s) => s.id === val.stateId
                        )
                      ) : []) :
                      (Cred.cities.length > 0 ? Cred.cities : []) 
                    }
                    
                    handleChange={(data) => {
                      setCities(data);
                    }}
                  /> */}

                  <div className="col-sm-6">
                    <label
                      htmlFor="exampleFormControlInput878"
                      className="form-label"
                    >
                      Reporting Manager
                    </label>
                    {!states || !region || !cities > 0 ? (
                      <div
                        className="form-control"
                        onClick={() => {
                          setIsModal(false);
                          Swal.fire(
                            "Please Select All Available Dropdowns",
                            "Like States, Cities, Division etc"
                          ).then((e) => setIsModal(true));
                        }}
                      >
                        {" "}
                        <label className="form-label">Reporting Manager</label>
                      </div>
                    ) : (
                      <select
                        id="exampleFormControlInput878"
                        className="form-select"
                        // value={`${Cred.firstName} ${Cred.lastName}`}
                        value={reportingManager}
                        onChange={(e) => {
                          // console.log(reportingManager)
                          const selectedValue = e.target.value;
                          setReportingManager(selectedValue);
                          // console.log(reportingManager);
                        }}
                      >
                        <option value={Cred.sub}>
                          {Cred.firstName} {Cred.lastName}
                        </option>

                        {DropdownMembers?.allMembers?.map((value, i) => {
                          return (
                            <option value={value.id} key={value.id}>
                              {value.firstName} {value.lastName}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>

                  <div className="col-sm-6">
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
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setInitialValue(setFirstName, Data.firstName || "");
                setInitialValue(setLastName, Data.lastName || "");
                setInitialValue(setEmail, Data.email || "");
                setInitialValue(setMobile, Data.mobile || "");
                setInitialValue(setJoiningDate, Data.joiningDate || "");
                setInitialValue(setDesignation, Data.designation || "");
                // setInitialValue(setEmployeeId, Data.employeeId || "");
                setInitialValue(setDob, Data.dob || "");
                setInitialValue(setStates, Data.states || "");
                setInitialValue(setRegion, Data.region || "");
                setInitialValue(setCities, Data.cities || "");
                setInitialValue(setNewPassword, "");
                setInitialValue(setMemberPermission, []);
                setInitialValue(setDivision, Data.division || "");
                setInitialValue(setUploadFileKey, Data.uploadFileKey || "");
                setInitialValue(setConfirmPassword, "");
                setInitialValue(setUserRoleList, Data.userRoleList || []);
                setIsModal(false);
              }}
            >
              Cancel
            </button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  onUpdate();
                } catch (error) {}
              }}
            >
              {buttonLoader.updateMember && (
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
          </>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isPassModal}
        centered
        size="lg"
        onHide={() => {
          setIsPassModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="firstNameInput" className="form-label">
              New Password
            </label>
            <div className="d-flex justify-content-between align-items-center">
              <input
                type={passText}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="firstNameInput"
                placeholder="New Password"
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
                  <i class="icofont-eye-blocked"></i>
                ) : (
                  <i class="icofont-eye"></i>
                )}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="lastNameInput" className="form-label">
              Confirm Password
            </label>
            <input
              type={passText}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="lastNameInput"
              placeholder="Confirm Password"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => onPasswordChange()}>
            {buttonLoader.updatePassword && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            )}
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isPermissionShowModal}
        centered
        size="lg"
        onHide={() => {
          setIsPermissionShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Assign Permission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MemberPermissionUpdate
            selectedMember={Data}
            isModal={isPermissionShowModal}
            handleIsModal={() =>
              setIsPermissionShowModal(!isPermissionShowModal)
            }
          />
        </Modal.Body>
      </Modal>
      <ModalLoader show={loading} message={"Fetching Details"} />
    </>
  );
}

export default OurMembers;
