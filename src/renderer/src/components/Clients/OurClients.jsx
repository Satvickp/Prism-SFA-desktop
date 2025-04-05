import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { emailValidator } from "../../helper/emailValidator";
import mobileValidator from "../../helper/mobileValidator";
import Swal from "sweetalert2";
import ModalLoader from "../../screens/UIComponents/ModalLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategory,
  getCity,
  getCityByCityId,
  getCityById,
  getClientDetails,
  getDivision,
  getRegion,
  getRegionById,
  getState,
  getStateById,
} from "../../api/clients/clients-api";
import {
  setAllCategory,
  setAllCity,
  setAllDivision,
  setAllRegion,
  setAllState,
} from "../../redux/features/dropdownFieldSlice";
import Select from "react-select";
import { permissionIds } from "../../constants/constants";
function OurClients(props) {
  const Data = props.data;
  // console.log(Data)
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState(Data.clientLastName);
  const [clientCode, setClientCode] = useState(Data.clientCode);
  const [mobile, setMobile] = useState(Data.mobile);
  const [practiceSince, setPracticeSince] = useState(Data.practiceSince);
  const [address, setAddress] = useState(Data.address);
  const [gender, setGender] = useState(Data.gender);
  const [category, setCategory] = useState(Data.category);
  const [dob, setDob] = useState(Data.dob);
  const [dom, setDom] = useState(Data.dom);
  const [topUpBalance, setTopUpBalance] = useState(Data.topUpBalance);
  const [email, setEmail] = useState(Data.email);
  const [clinicName, setClinicName] = useState(Data.clinicName);
  const [hospitalName, setHospitalName] = useState(Data.hospitalName);
  const [state, setState] = useState(Data.state);
  const [permission, setPermission] = useState(Data.userRoleList);
  const [password, setPassword] = useState(Data.password);

  const [region, setRegion] = useState(Data.region);
  const [city, setCity] = useState(Data.city);
  const [division, setDivision] = useState(Data.division);
  const [daysAvailability, setDaysAvailability] = useState(
    Data.daysAvailability
  );
  const [loading, setloading] = useState(false);
  const { isMember, avatar } = props;
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const [isModal, setIsModal] = useState(false);
  const Dispatch = useDispatch();
  const [buttonLoader, setButtonLoader] = useState({
    updateClient: false,
  });
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
  async function getDropDownsValue() {
    Dispatch(setAllCity([]));
    Dispatch(setAllState([]));
    await Promise.all([
      getAllDivision(),
      //  getAllCategory(),
      getAllRegion(),
      getAllState(Data.region),
      getAllCity(Data.state),
    ]);
    // await getCall();
  }

  async function getCall() {
    let region = null;
    let city = null;
    let state = null;

    const fetchedRegion = Data.region
      ? await getRegionById(Cred.token, Data.region)
      : null;

    const fetchedState = Data.state
      ? await getStateById(Cred.token, Data.state)
      : null;

    const fetchedCity = Data.city
      ? await getCityByCityId(Cred.token, Data.city)
      : null;

    if (fetchedRegion) {
      // Dispatch(setAllState(fetchedRegion.regionName));
      // region = Data.regionName;
      region = fetchedRegion.regionName;
    }

    if (fetchedState) {
      // Dispatch(setAllCity(fetchedState._embedded.cities));
      // state = Data.stateName;
      state = fetchedState.stateName;
    }

    if (fetchedCity) {
      // city = Data.cityName;
      city = fetchedCity.cityName;
    }

    setRegion(Data.region);
    setCity(Data.city);
    setState(Data.state);
  }

  const options = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  return (
    <div className="card teacher-card">
      <div className="card-body  d-flex">
        <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
          <img
            src={avatar}
            alt=""
            className="avatar xl rounded-circle img-thumbnail shadow-sm"
          />
          <div className="about-info d-flex align-items-center mt-1 justify-content-center flex-column">
            <h6 className="mb-0 fw-bold d-block fs-6 mt-2">
              {Data.clientCode}
            </h6>
            <div
              className="btn-group mt-2"
              role="group"
              aria-label="Basic outlined example"
            >
              {(memberPermissions.some(
                (item) => 
                  item == permissionIds.SUPER_ADMIN ||
                 item == permissionIds.REPORTING_MANAGER ||
                 item == permissionIds.EDIT_MANAGER
              )) && (
                <button
                  onClick={async () => {
                    setloading(true);

                    try {
                      const resp = await getClientDetails(
                        Cred.token,
                        Data.clientCode
                      );
                      // console.log(resp)
                      setClientFirstName(resp.clientFirstName);
                      setClientLastName(resp.clientLastName);
                      setHospitalName(resp.hospitalName);
                      setGender(resp.gender);
                      setEmail(resp.email);
                      setMobile(resp.mobile);
                      setAddress(resp.address);
                      setPassword(resp.password);
                      setCategory(resp.category);
                      setTopUpBalance(resp.topUpBalance);
                      setDob(resp.dob);
                      setDom(resp.dom);
                      setPermission([...resp.userRoleList]);
                      setDaysAvailability([...resp.daysAvailability]);
                      setPracticeSince(resp.practiceSince);
                      setClinicName(resp.clinicName);
                      setClientCode(resp.clientCode);
                      setIsModal(true);
                      setloading(false);
                      const dropdownvalue = await getDropDownsValue();
                      // console.log("daysAvailability when called userapi", daysAvailability)
                    } catch (error) {
                      setIsModal(false);
                      console.log("error ::", error);
                      Swal.fire(
                        "Something went wrong",
                        "Can't Fetch Necessary data"
                      );
                    }
                    setloading(false);
                  }}
                  type="button"
                  className="btn btn-outline-secondary"
                >
                  <i className="icofont-edit text-success"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
          {Data.clientFirstName && Data.clientLastName ? (
            <h6 className="mb-0 mt-2  fw-bold d-block fs-6">
              {Data.clientFirstName} {Data.clientLastName}
            </h6>
          ) : (
            "Client Name not available"
          )}
          {Data.email && (
            <div className="video-setting-icon mt-3 pt-3 border-top">
              <p>{Data.email ? Data.email : "Email not available"}</p>
            </div>
          )}
          <div className="video-setting-icon mt-3 pt-3 border-top">
            <p>{Data.mobile ? Data.mobile : "Contact not available"}</p>
          </div>
          <div className="video-setting-icon mt-3 pt-3 border-top text-success">
            <p>
              Balance : {Data.topUpBalance ? `₹ ${Data.topUpBalance}` : "NA"}
            </p>
          </div>
          <div className="video-setting-icon mt-3 pt-3 border-top">
            <p>{Data.gender ? Data.gender : "Gender not available"}</p>
          </div>
          <div className="video-setting-icon mt-3 pt-3 border-top">
            <p>
              {Data.daysAvailability
                ? Data.daysAvailability.join(", ")
                : "Days not available"}
            </p>
          </div>
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
          <Modal.Title className="fw-bold">Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="mb-3">
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
            <div className="mb-3">
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
            <div className="mb-3">
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

            <div className="deadline-form">
              <form>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      placeholder="Address"
                      onChange={(e) => setAddress(e.target.value)}
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
                      Region
                    </label>
                    <select
                      className="form-select"
                      id="exampleFormControlInput478"
                      value={region}
                      onChange={async (e) => {
                        try {
                          setRegion("");
                          const selectedValue = e.target.value;
                          console.log("selectedRegion:", selectedValue);
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
                      State
                    </label>
                    <select
                      className="form-select"
                      id="exampleFormControlInput578"
                      value={state}
                      onChange={async (e) => {
                        try {
                          setCity("");
                          const selectedValue = e.target.value;
                          console.log("selectedState:", selectedValue);
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
                      City
                    </label>
                    <select
                      className="form-select"
                      id="cityInput"
                      value={city}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        console.log("selecteCity:", selectedValue);
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
                    <label className="form-label">DOB</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Practice Since</label>
                    <input
                      type="date"
                      className="form-control"
                      value={practiceSince}
                      onChange={(e) => setPracticeSince(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">DOM</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dom}
                      onChange={(e) => setDom(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Clinic Name</label>
                    <input
                      className="form-control"
                      placeholder="Enter Clinic Name"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label className="form-label">Client Code*</label>
                    <input
                      placeholder="Client Code"
                      className="form-control"
                      value={clientCode}
                      onChange={(e) => setClientCode(e.target.value)}
                    />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label">Password*</label>
                    <input
                      placeholder="Top Up Balance"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label">Top Up Balance*</label>
                    <input
                      placeholder="Top Up Balance"
                      className="form-control"
                      value={topUpBalance}
                      onChange={(e) => setTopUpBalance(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
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
                      defaultValue={
                        permission?.map((item) => {
                          return {
                            value: item,
                            label: item.split("_").join(" "),
                          };
                        }) || []
                      }
                      onChange={(e) => {
                        setPermission(e);
                      }}
                      options={
                        permission?.map((item) => {
                          return {
                            value: item,
                            label: item.split("_").join(" "),
                          };
                        }) || []
                      }
                      isMulti
                      placeholder="Select Permission"
                      noOptionsMessage={() => "Not found"}
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
                      defaultValue={daysAvailability?.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      onChange={(e) => {
                        const daysArray = e.map((item) => item.value);
                        // console.log(daysArray)
                        setDaysAvailability(daysArray);
                      }}
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModal(false);
            }}
          >
            Done
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              const emailError = emailValidator(email);
              const mobileError = mobileValidator(mobile ? mobile : "");
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

                  Swal.fire(
                    "Invalid Mobile Number ",
                    mobileError,
                    "error"
                  ).then((e) => {
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
                !gender
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

              setButtonLoader({ ...buttonLoader, ...{ updateClient: true } });

              // console.log("before days availability update", daysAvailability)
              const data_object = {
                clientFirstName: clientFirstName,
                clientLastName: clientLastName,
                clientCode: clientCode,
                mobile: mobile ? mobile : "",
                email: email,
                dob: dob ? dob : "",
                dom: dom ? dom : "",
                practiceSince: practiceSince ? practiceSince : "",
                topUpBalance: topUpBalance,
                address: address,
                clinicName: clinicName,
                hospitalName: hospitalName,
                gender: gender,
                region: region,
                category: category ? category.id : "",
                state: state,
                city: city,
                division: division ? division.id : "",
                id: Data.id,
                daysAvailability:
                  daysAvailability.length > 0 ? daysAvailability : "",
                userRoleList: permission.map((item) => item.value),
              };

              // console.log(data_object)
              await props.UpdateClient(props.index, data_object);
              setIsModal(false);
              setButtonLoader({ ...buttonLoader, ...{ updateClient: false } });
            }}
          >
            {buttonLoader.updateClient && (
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
      <ModalLoader show={loading} message={"Fetching Details"} />
    </div>
  );
}

export default OurClients;
