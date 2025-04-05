import React, { useEffect, useState } from "react";
import { Button, Dropdown, Modal, Spinner, Toast } from "react-bootstrap";
import OurClients from "../../components/Clients/OurClients";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {
  addClient,
  deleteClient,
  getAllClients,
  getDropDowns,
  updateClient,
  getCategory,
  getCity,
  getState,
  getRegion,
  getDivision,
  getAllClientsByReportingManager,
} from "../../api/clients/clients-api";

import {
  setAllDivision,
  setAllDesignation,
  setAllState,
  setAllRegion,
  setAllCity,
  setAllCategory,
  setAllLeaveTypes,
  setAllExpenseTypes,
} from "../../redux/features/dropdownFieldSlice";

import {
  setClients,
  addClients,
  deleteAllClients,
  updateClients,
  deleteClients,
  concatClients,
} from "../../redux/features/clientSlice";

import lgAvatar3 from "../../assets/images/lg/avatar3.jpg";

import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import ModalLoader from "../UIComponents/ModalLoader";
import { emailValidator } from "../../helper/emailValidator";
import mobileValidator from "../../helper/mobileValidator";
import { CLIENT_PERMISSIONS } from "../../constants/enums";
import { permissionIds } from "../../constants/constants";

function Clients() {
  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const Dispatch = useDispatch();
  const Cred = useSelector((state) => state.Cred);
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [topUpBalance, setTopUpBalance] = useState(0);
  const [practiceSince, setPracticeSince] = useState("");
  const [address, setAddress] = useState("");
  const [isMoreData, setIsMoreData] = useState(true);
  const [permission, setPermission] = useState([]);
  const [fetchMessage, setFetchMessage] = useState("");
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const [clientCode, setClientCode] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState(0);
  const [dob, setDob] = useState("");
  const [dom, setDom] = useState("");
  const [clinicName, setClinicName] = useState("");
  // changes
  const [timeAvailable, setTimeAvailable] = useState("");

  const [selectedDays, setSelectedDays] = useState([]);

  const options = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
  ];

  const [hospitalName, setHospitalName] = useState("");
  const [state, setState] = useState("");
  const [region, setRegion] = useState(Cred.region);
  const [city, setCity] = useState("");
  const [division, setDivision] = useState("");
  const [modalLoader, setModalLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addClient: false,
  });
  const Client = useSelector((state) => state.Client);
  const { memberPermissions } = useSelector((state) => state.Permission);

  async function get() {
    setLoading(true);
    try {
      if (Client.allClients.length <= 0) {
        const resp = memberPermissions.some(
          (item) => item === permissionIds.SUPER_ADMIN
        )
          ? await getAllClients(Cred.token, 0, Cred.sub)
          : await getAllClientsByReportingManager(Cred.token, 0, Cred.sub);
        Dispatch(
          setClients({
            allClients: resp.data,
            paginationData: resp.paginationData,
          })
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Clients. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(false);
  }
  useEffect(() => {
    setPage(0);
    get();
  }, []);

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
    if (!DropDownsField.allCategory.length > 0) {
      setFetchMessage("Fetching Category...");
      const categoryArray = await getCategory(Cred.token);
      Dispatch(setAllCategory(categoryArray));
    }
    setFetchMessage("");
  }
  async function UpdateClient(index, data) {
    try {
      // console.log("Client: ", data)
      const resp = await updateClient(data, Cred.token);
      if (resp) {
        Dispatch(updateClients(data));
        Swal.fire({
          title: "Success",
          text: "Client updated Successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update Clients. Please try After Some Time",
        icon: "error",
      });
      console.log("Error ::", error);
    }
  }

  async function AddClient() {
    const emailError = emailValidator(email);
    const mobileError = mobileValidator(mobile);
    if (email) {
      if (emailError) {
        setIsModal(false);
        Swal.fire("Invalid Email ", emailError, "error").then((e) => {
          if (e.isConfirmed) {
            setIsModal(true);
          }
        });
        return;
      }
    }
    if (mobile) {
      if (mobileError) {
        setIsModal(false);

        Swal.fire("Invalid Mobile Number ", mobileError, "error").then((e) => {
          if (e.isConfirmed) {
            setIsModal(true);
          }
        });
        return;
      }
    }

    if (
      !clientFirstName ||
      !clientLastName ||
      !clientCode ||
      !gender ||
      !password
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
      ...{ addClient: true },
    });
    try {
      const daysAvailability = selectedDays.map((e) => e.label);
      const payload = {
        clientFirstName: clientFirstName,
        clientLastName: clientLastName,
        clientCode: clientCode,
        topUpBalance: topUpBalance,
        mobile: Number(mobile),
        email: email,
        dob: dob,
        dom: dom,
        practiceSince: practiceSince,
        address: address,
        clinicName: clinicName,
        timeAvailability: timeAvailable,
        hospitalName: hospitalName,
        gender: gender,
        password: password,
        region: Number(region),
        category: category,
        state: Number(state),
        city: Number(city),
        division: Number(division),
        daysAvailability: daysAvailability,
        userRoleList: permission.map((item) => item.value),
        memberId: Cred.sub,
      };
      const resp = await addClient(payload, Cred.token);
      Dispatch(addClients(resp));
      setIsModal(false);
      setClientFirstName("");
      setClientLastName("");
      setClientCode("");
      setMobile("");
      setEmail("");
      setDob(null);
      setDom(null);
      setPracticeSince(null);
      setAddress("");
      setClinicName("");
      setTimeAvailable("");
      setPassword("");
      setSelectedDays([]);
      setPermission([]);
      setHospitalName("");
      setGender("");
      setRegion("");
      setCategory("");
      setState("");
      setCity("");
      setDivision("");
    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went Wrong",
        text: "Please Try After Some Time",
      }).then((e) => setIsModal(true));
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ addClient: false },
    });
  }

  async function DeleteClient(id, index) {
    setModalLoader(true);
    try {
      const resp = await deleteClient(Cred.token, id);
      Dispatch(deleteClients(id));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Delete Employee", "error");
    }
    setModalLoader(false);
  }

  async function onEndReach() {
    setLoadMore(true);
    try {
      const resp = await getAllClients(Cred.token, page + 1, Cred.sub);
      setPage(page + 1);
      if (resp.length > 0) {
        Dispatch(concatClients(resp));
      } else {
        setShowToast(true);
        setIsMoreData(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "Can't Fetch More Member. Please Try After Some Time.",
        icon: "error",
        timer: 2000,
      });
    }
    setLoadMore(false);
  }

  async function getAllDivision() {
    if (DropDownsField.allDivision.length <= 0) {
      const divisionArray = await getDivision(Cred.token);
      Dispatch(setAllDivision(divisionArray));
    }
  }

  async function getAllCategory() {
    if (DropDownsField.allCategory.length <= 0) {
      const categoryArray = await getCategory(Cred.token);
      Dispatch(setAllCategory(categoryArray));
    }
  }

  async function getAllRegion() {
    if (DropDownsField.allRegion.length <= 0) {
      const regionArray = await getRegion(Cred.token);
      Dispatch(setAllRegion(regionArray));
    }
  }
  async function getAllState(regionId) {
    Dispatch(setAllState([]));
    const stateArray = await getState(Cred.token, regionId);
    Dispatch(setAllState(stateArray));
  }
  async function getAllCity(stateId) {
    Dispatch(setAllCity([]));
    const cityArray = await getCity(Cred.token, stateId);
    Dispatch(setAllCity(cityArray));
  }

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Clients"
            renderRight={() => {
              return (
                <div className="col-auto d-flex">
                  {memberPermissions.some(
                    (item) =>
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER ||
                      item == permissionIds.CREATE_MANAGER
                  ) && (
                    <Button
                      variant="primary"
                      onClick={async () => {
                        // setButtonLoader({
                        //   ...buttonLoader,
                        //   ...{ getDropDowns: true },
                        // });

                        try {
                          setIsModal(true);
                          Dispatch(setAllCity([]));
                          Dispatch(setAllState([]));
                          await getAllRegion();
                          await getAllDivision();
                          // await getAllCategory();
                        } catch (error) {
                          setIsModal(false);
                          Swal.fire(
                            "Something went wrong",
                            "Can't Fetch Necessary data"
                          );
                        }
                        // setButtonLoader({
                        //   ...buttonLoader,
                        //   ...{ getDropDowns: false },
                        // });
                      }}
                      className="btn btn-primary"
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
                      Add Client
                    </Button>
                  )}
                </div>
              );
            }}
          />
          <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
            {Client.allClients.length > 0 ? (
              Client.allClients.map((data, i) => {
                return (
                  <div key={"skhd" + i} className="col">
                    <OurClients
                      avatar={lgAvatar3}
                      data={data}
                      UpdateClient={UpdateClient}
                      DeleteClient={DeleteClient}
                      getDropDownsValue={getDropDownsValue}
                      index={i}
                    />
                  </div>
                );
              })
            ) : (
              <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                <p className="font-size: 18px; font-weight: bold;">
                  No More Client's To Load.
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
              <Modal.Title className="fw-bold">{"Add Client"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-body">
                <div className="mb-3 row">
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput877"
                      className="form-label"
                    >
                      Client First Name*
                    </label>
                    <input
                      type="text"
                      value={clientFirstName}
                      className="form-control"
                      id="exampleFormControlInput877"
                      onChange={(e) => setClientFirstName(e.target.value)}
                      placeholder="Client First Name"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput878"
                      className="form-label"
                    >
                      Client Last Name*
                    </label>
                    <input
                      type="text"
                      value={clientLastName}
                      className="form-control"
                      id="exampleFormControlInput878"
                      onChange={(e) => setClientLastName(e.target.value)}
                      placeholder="Client Last Name"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    htmlFor="exampleFormControlInput978"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput978"
                    value={address}
                    placeholder="Address"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="deadline-form">
                  <form>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput977"
                          className="form-label"
                        >
                          Hospital Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput977"
                          value={hospitalName}
                          placeholder="Hospital Name"
                          onChange={(e) => setHospitalName(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput277"
                          className="form-label"
                        >
                          Gender*
                        </label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={gender === "Male"}
                            onChange={() => setGender("Male")}
                            value="Male"
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            Male
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={gender === "Female"}
                            onChange={() => setGender("Female")}
                            value="Female"
                            id="flexCheckDefault1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault1"
                          >
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput477"
                          className="form-label"
                        >
                          Email ID
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="exampleFormControlInput477"
                          placeholder="Enter Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleFormControlInput777"
                          className="form-label"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="form-control"
                          id="exampleFormControlInput777"
                          maxLength={10}
                          placeholder="Enter Phone"
                        />
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
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

                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput578"
                        >
                          State*
                        </label>
                        <select
                          className="form-select"
                          id="exampleFormControlInput578"
                          value={state}
                          onChange={async (e) => {
                            try {
                              setCity("");
                              const selectedValue = e.target.value;
                              setState(selectedValue);
                              await getAllCity(selectedValue);
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
                          {DropDownsField.allState.map((value, i) => {
                            return (
                              <option value={value.id} key={value.id}>
                                {value.stateName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label className="form-label" htmlFor="cityInput">
                          City*
                        </label>
                        <select
                          className="form-select"
                          id="cityInput"
                          value={city}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setCity(selectedValue);
                          }}
                        >
                          <option value="">Select a City</option>
                          {DropDownsField.allCity.map((value, i) => {
                            return (
                              <option value={value.id} key={value.id}>
                                {value.cityName}
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
                          Division
                        </label>
                        <select
                          className="form-select"
                          id="exampleFormControlInput585"
                          value={division}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setDivision(selectedValue);
                          }}
                        >
                          <option value="">Select a Division</option>
                          {DropDownsField.allDivision.map((value, i) => {
                            return (
                              <option value={value.id} key={value.id}>
                                {value.divisionName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput666"
                        >
                          DOB
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="exampleFormControlInput666"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput676"
                        >
                          Practice Since
                        </label>
                        <input
                          type="date"
                          id="exampleFormControlInput676"
                          className="form-control"
                          value={practiceSince}
                          onChange={(e) => setPracticeSince(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput679"
                        >
                          DOM
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="exampleFormControlInput679"
                          value={dom}
                          onChange={(e) => setDom(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput680"
                        >
                          Clinic Name
                        </label>
                        <input
                          className="form-control"
                          id="exampleFormControlInput680"
                          placeholder="Enter Clinic Name"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput681"
                        >
                          Client Code*
                        </label>
                        <input
                          placeholder="Client Code"
                          className="form-control"
                          id="exampleFormControlInput681"
                          value={clientCode}
                          onChange={(e) => setClientCode(e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput681"
                        >
                          Top Up Balance*
                        </label>
                        <input
                          placeholder="Enter amount in INR"
                          className="form-control"
                          id="exampleFormControlInput681"
                          value={topUpBalance}
                          onChange={(e) => setTopUpBalance(e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput681"
                        >
                          Password*
                        </label>
                        <input
                          placeholder="Enter client password"
                          className="form-control"
                          id="exampleFormControlInput681"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput682"
                        >
                          Category
                        </label>
                        <select
                          className="form-select"
                          id="exampleFormControlInput682"
                          value={category}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setCategory(selectedValue);
                          }}
                        >
                          <option value="">Select a Category</option>
                          {DropDownsField.allCategory.map((value, i) => {
                            return (
                              <option value={value.id} key={value.id}>
                                {value.categoryName} ({value.id})
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
                          defaultValue={permission}
                          onChange={(e) => {
                            setPermission(e);
                          }}
                          options={CLIENT_PERMISSIONS}
                          isMulti
                          placeholder="Select Permission"
                          noOptionsMessage={() => "Not found"}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput683"
                        >
                          Time availability
                        </label>
                        {/* <div className="col-lg-6">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput683"
                          >
                            From
                          </label>
                          <input
                            type="time"
                            className="form-control"
                            id="exampleFormControlInput683"
                            placeholder="From"
                            value={timeAvailable}
                            onChange={(e) => setTimeAvailable(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput683"
                          >
                            To
                          </label>
                          <input
                            type="time"
                            className="form-control"
                            id="exampleFormControlInput683"
                            placeholder="To"
                            value={timeAvailable}
                            onChange={(e) => setTimeAvailable(e.target.value)}
                          />
                        </div> */}
                        <input
                          type="text"
                          className="form-control"
                          id="exampleFormControlInput683"
                          placeholder="To"
                          value={timeAvailable}
                          onChange={(e) => setTimeAvailable(e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label
                          className="form-label"
                          htmlFor="exampleFormControlInput684"
                        >
                          Days availability*
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
                          defaultValue={selectedDays}
                          onChange={(e) => setSelectedDays(e)}
                          options={options}
                          isMulti
                          placeholder="Select Available days"
                          noOptionsMessage={() => "Not found"}
                        />

                        {/* <option value="">Select Days</option>
                          {daysArray.map((value, i) => (
                            <option key={i}>{value.value}</option>
                          ))}
                        </select> */}
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
                  AddClient();
                }}
                className="btn btn-danger color-fff"
              >
                {buttonLoader.addClient && (
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
          <Modal
            show={isModalDelete}
            centered
            onHide={() => {
              setIsModalDelete(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Project</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                You can only delete this item Permanently
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
              <Button variant="primary" className="btn btn-danger color-fff">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
          <ModalLoader message={fetchMessage} show={modalLoader} />

          {Client.totalPages && Client.totalPages - 1 > Client.number && (
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
                <strong className="mr-auto">No More Client's to load</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}{" "}
    </>
  );
}

export default Clients;
