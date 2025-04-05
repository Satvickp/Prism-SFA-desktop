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
} from "../../api/clients/clientfmcg-api";
import {
  setAllCategory,
  setAllCity,
  setAllDivision,
  setAllRegion,
  setAllState,
} from "../../redux/features/dropdownFieldSlice";
import Select from "react-select";
import { permissionIds } from "../../constants/constants";
import { useParams } from "react-router-dom";
import { CLIENT_PERMISSIONS } from "../../constants/enums";
function OurFMCGClients(props) {
  const Data = props.data;
  const isDoctor = props.isDoctor;
  // console.log(Data)
  const [showDetails, setShowDetails] = useState(false);
  const [clientFirstName, setClientFirstName] = useState(Data.clientFirstName);
  const [clientLastName, setClientLastName] = useState(Data.clientLastName);
  const [clientCode, setClientCode] = useState(Data.clientCode);
  const [firmName, setFirmName] = useState(Data.firmName);
  const [mobile, setMobile] = useState(Data.mobile);
  const [address, setAddress] = useState(Data.address);
  const [topUpBalance, setTopUpBalance] = useState(Data.topUpBalance);
  const [email, setEmail] = useState(Data.email);
  const [state, setState] = useState(Data.state);
  const [permission, setPermission] = useState(Data.userRoleList);
  const [password, setPassword] = useState(Data.password);

  const [region, setRegion] = useState(Data.region);
  const [city, setCity] = useState(Data.city);
  const [loading, setloading] = useState(false);
  const { isMember, avatar } = props;
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const [isModal, setIsModal] = useState(false);
  const Dispatch = useDispatch();
  const { userId } = useParams();
  const [buttonLoader, setButtonLoader] = useState({
    updateClient: false,
  });
  const [isBalanceModal, setIsBalanceModal] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);

  async function getAllDivision() {
    if (DropDownsField.allDivision.length <= 0) {
      const divisionArray = await getDivision(Cred.token);
      Dispatch(setAllDivision(divisionArray));
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

  function handleisBalanceModal() {
    setIsBalanceModal(!isBalanceModal);
  }

  function handleIsPermissionModal() {
    setIsPermissionModal(!isPermissionModal)
  }
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
              {memberPermissions.some(
                (item) =>
                  item == permissionIds.SUPER_ADMIN ||
                  item == permissionIds.REPORTING_MANAGER ||
                  item == permissionIds.EDIT_MANAGER
              ) &&
                userId == Cred.sub &&
                (!isDoctor ? (
                  <button
                    onClick={async () => {
                      setloading(true);

                      try {
                        const resp = await getClientDetails(
                          Cred.token,
                          Data.clientCode
                        );
                        setClientFirstName(resp.clientFirstName);
                        setClientLastName(resp.clientLastName);
                        setEmail(resp.email);
                        setMobile(resp.mobile);
                        setFirmName(resp.firmName);
                        setAddress(resp.address);
                        setPassword(resp.password);
                        setTopUpBalance(resp.topUpBalance);
                        resp.userRoleList
                          ? setPermission([...resp.userRoleList])
                          : setPermission([]);
                        setClientCode(resp.clientCode);
                        setIsModal(true);
                        setloading(false);
                        const dropdownvalue = await getDropDownsValue();
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
                ) : (
                  <button
                    onClick={async () => {
                      setloading(true);

                      try {
                        // const resp = await getClientDetails(
                        //   Cred.token,
                        //   Data.clientCode
                        // );
                        // setClientFirstName(resp.clientFirstName);
                        // setClientLastName(resp.clientLastName);
                        // setEmail(resp.email);
                        // setMobile(resp.mobile);
                        // setFirmName(resp.firmName);
                        // setAddress(resp.address);
                        // setPassword(resp.password);
                        // setTopUpBalance(resp.topUpBalance);
                        // resp.userRoleList
                        //   ? setPermission([...resp.userRoleList])
                        //   : setPermission([]);
                        // setClientCode(resp.clientCode);
                        setIsModal(true);
                        setloading(false);
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
                ))}
              <button
                onClick={() => setShowDetails(true)}
                type="button"
                className="btn btn-outline-secondary"
              >
                <i className="icofont-eye fs-6"></i>
              </button>
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
          {!isDoctor && (
            <>
              <div className="video-setting-icon mt-3 pt-3 border-top text-success">
                <p>
                  Balance :{" "}
                  {Data.topUpBalance
                    ? `₹ ${Number(Data.topUpBalance).toFixed(2)}`
                    : "NA"}
                </p>
              </div>
              {userId == Cred.sub && (
                <div className="video-setting-icon mt-3 pt-3 border-top gap-2 d-flex flex-wrap">
                  <Button className="bg-success me-2" onClick={handleisBalanceModal}>
                    Update Balance
                  </Button>
                  <Button className="" onClick={handleIsPermissionModal}>
                    Update Permission
                  </Button>
                </div>
              )}
            </>
          )}
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
            {`${Data.clientFirstName} ${Data.clientLastName}'s `} Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Client Name :</span>
            <span>{`${clientFirstName} ${clientLastName}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Client Code :</span>
            <span>{`${clientCode}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Firm Name :</span>
            <span>{`${Data?.firmName || "NA"}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Email :</span>
            <span>{`${email}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Address :</span>
            <span>{`${address}`}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Current Balance :</span>
            <span className="text-success">{`₹ ${topUpBalance?.toFixed(
              2
            )}`}</span>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="md"
        centered
        show={isPermissionModal}
        onHide={handleIsPermissionModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{`Update ${clientFirstName} ${clientLastName}'s Permissions`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="fs-5 fw-bold">
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
                defaultValue={permission.map((item) => ({label: item, value: item}))}
                // values={permission}
                onChange={(e) => {
                  console.log("e", e)
                  setPermission(e.map((item) => item.value));
                }}
                options={CLIENT_PERMISSIONS}
                // options={
                //   permission?.map((item) => {
                //     return {
                //       value: item,
                //       label: item,
                //     };
                //   }) || []
                // }
                isMulti
                placeholder="Select Permission"
                noOptionsMessage={() => "Not found"}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleIsPermissionModal}
          >
            Done
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              const data_object = {
                clientFirstName: clientFirstName,
                clientLastName: clientLastName,
                address: address,
                email: email,
                mobile: mobile ? mobile : "",
                region: region,
                state: state,
                city: city,
                firmName: firmName,
                clientCode: clientCode,
                topUpBalance: topUpBalance,
                userRoleList: permission?.map((item) => item),
              };
              await props.UpdateClient(props.index, data_object, Data.id, true);
              setIsPermissionModal(false);
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

      <Modal
        size="md"
        centered
        show={isBalanceModal}
        onHide={handleisBalanceModal}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{`Update ${clientFirstName} ${clientLastName}'s Balance`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="fs-5 fw-bold">
            Current Balance:
            {"  "}
            <span className="text-success">{`₹ ${topUpBalance}`}</span>
          </div>
          <div className="modal-body">
            <div className="deadline-form">
              <form>
                <div className="row g-3 mb-3">
                  <div className="col-lg-12">
                    <label className="form-label">New Balance Amount (₹)</label>
                    <input
                      placeholder="Top Up Balance"
                      className="form-control"
                      type="number"
                      required
                      aria-required
                      value={topUpBalance}
                      onChange={(e) => setTopUpBalance(e.target.value)}
                    />
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
            onClick={handleisBalanceModal}
          >
            Done
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              if (topUpBalance <= 0) {
                setIsBalanceModal(false);
                Swal.fire("Warning", "Invalid Balance Amount", "error").then(
                  (e) => {
                    if (e.isConfirmed) {
                      setIsBalanceModal(true);
                    }
                  }
                );
                return;
              }
              if (!topUpBalance) {
                setIsBalanceModal(false);
                Swal.fire({
                  title: "Empty Balance Amount",
                  text: "Make Sure to enter valid Amount value",
                  timer: 2000,
                  icon: "warning",
                }).then((e) => setIsBalanceModal(true));
                return;
              }
              const data_object = {
                clientFirstName: clientFirstName,
                clientLastName: clientLastName,
                address: address,
                email: email,
                mobile: mobile ? mobile : "",
                region: region,
                state: state,
                city: city,
                firmName: firmName,
                clientCode: clientCode,
                topUpBalance: topUpBalance,
                userRoleList: permission?.map((item) => item),
              };
              await props.UpdateClient(props.index, data_object, Data.id, true);
              setIsBalanceModal(false);
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
                      disabled="true"
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
                      disabled="true"
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
                      {Cred.cities.map((value, i) => {
                        return (
                          <option value={value.id} key={value.id}>
                            {value.cityName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {!isDoctor && (
                  <div className="row g-3 mb-3">
                    <div className="col-lg-6">
                      <label className="form-label">Firm Name*</label>
                      <input
                        placeholder="Firm Name"
                        className="form-control"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                      />
                    </div>
                    {/* <div className="col-lg-6">
                    <label className="form-label">Client Code*</label>
                    <input
                      placeholder="Client Code"
                      className="form-control"
                      value={clientCode}
                      onChange={(e) => setClientCode(e.target.value)}
                    />
                  </div> */}

                    {/* <div className="col-lg-6">
                    <label className="form-label">Password*</label>
                    <input
                      placeholder="Top Up Balance"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div> */}

                    <div className="col-lg-6">
                      <label className="form-label">Top Up Balance*</label>
                      <input
                        placeholder="Top Up Balance"
                        className="form-control"
                        value={topUpBalance}
                        onChange={(e) => setTopUpBalance(e.target.value)}
                      />
                    </div>
                  </div>
                )}
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
                !address ||
                !email ||
                !mobile ||
                !region ||
                !state ||
                !city
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

              const data_object = {
                clientFirstName: clientFirstName,
                clientLastName: clientLastName,
                address: address,
                email: email,
                mobile: mobile ? mobile : "",
                region: region,
                state: state,
                city: city,
                clientCode: clientCode,
                firmName: firmName,
                // password: password,
                // password: "Test@123",
                topUpBalance: topUpBalance,
                userRoleList: permission?.map((item) => item),
                // userRoleList: [ "Create_Manager", "Edit_Manager", "Delete_Manager", "Manager", "View_Manager" ],
              };

              await props.UpdateClient(props.index, data_object, Data.id);
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

export default OurFMCGClients;
