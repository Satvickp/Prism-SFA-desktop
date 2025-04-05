import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { emailValidator } from "../../helper/emailValidator";
import mobileValidator from "../../helper/mobileValidator";
import Swal from "sweetalert2";
import ModalLoader from "../../screens/UIComponents/ModalLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClient,
  getCity,
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
import { deleteClientsFMCG } from "../../redux/features/clientFMCGSlice";
function StockistAction(props) {
  const Data = props.data;
  const isDoctor = props.isDoctor;
  const [showDetails, setShowDetails] = useState(false);
  const [clientFirstName, setClientFirstName] = useState(Data?.clientFirstName);
  const [clientLastName, setClientLastName] = useState(Data?.clientLastName);
  const [clientCode, setClientCode] = useState(Data?.clientCode);
  const [firmName, setFirmName] = useState(Data?.firmName);
  const [mobile, setMobile] = useState(Data?.mobile);
  const [address, setAddress] = useState(Data?.address);
  const [topUpBalance, setTopUpBalance] = useState(Data?.topUpBalance);
  const [email, setEmail] = useState(Data?.email);
  const [state, setState] = useState(Data?.state);
  const [permission, setPermission] = useState(Data?.userRoleList);
  const [password, setPassword] = useState(Data?.password);
  const [region, setRegion] = useState(Data?.region);
  const [city, setCity] = useState(Data?.city);
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
  const handleEditButtonClick = async () => {
    setloading(true);
    try {
      const resp = await getClientDetails(Cred.token, Data.clientCode);
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

      await getDropDownsValue();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Something went wrong", "Can't fetch necessary data");
    } finally {
      setloading(false);
    }
  };

  const handleUpdateClient = async () => {
    const emailError = emailValidator(email);
    const mobileError = mobileValidator(mobile ? mobile : "");

    // Handle invalid email
    if (email && emailError) {
      setIsModal(false);
      Swal.fire("Invalid Email", emailError, "error").then((e) => {
        if (e.isConfirmed) setIsModal(true);
      });
      return;
    }

    // Handle invalid mobile number
    if (mobile && mobileError) {
      setIsModal(false);
      Swal.fire("Invalid Mobile Number", mobileError, "error").then((e) => {
        if (e.isConfirmed) setIsModal(true);
      });
      return;
    }

    // Handle missing required fields
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
        text: "Make sure all fields are filled correctly.",
        timer: 2000,
        icon: "warning",
      }).then(() => setIsModal(true));
      return;
    }

    // Start loading
    setButtonLoader({ ...buttonLoader, updateClient: true });

    const dataObject = {
      clientFirstName,
      clientLastName,
      address,
      email,
      mobile: mobile || "",
      region,
      state,
      city,
      clientCode,
      firmName,
      topUpBalance,
      userRoleList: permission?.map((item) => item.value),
    };

    try {
      // Make API call to update client data
      await props.UpdateClient(props.index, dataObject, Data.id);
    } catch (error) {
      console.error("Error updating client:", error);
      Swal.fire(
        "Something went wrong",
        "Unable to update client data",
        "error"
      );
    } finally {
      // Reset state after API call
      setIsModal(false);
      setButtonLoader({ ...buttonLoader, updateClient: false });
    }
  };
  const handleUpdateBalance = async () => {
    // Validate if the balance is valid
    if (topUpBalance <= 0) {
      setIsBalanceModal(false);
      Swal.fire("Warning", "Invalid Balance Amount", "error").then((e) => {
        if (e.isConfirmed) {
          setIsBalanceModal(true);
        }
      });
      return;
    }
    // Check for empty balance value
    if (!topUpBalance) {
      setIsBalanceModal(false);
      Swal.fire({
        title: "Empty Balance Amount",
        text: "Please enter a valid Amount value.",
        timer: 2000,
        icon: "warning",
      }).then(() => setIsBalanceModal(true));
      return;
    }
    // Prepare data to update
    const dataObject = {
      clientFirstName,
      clientLastName,
      address,
      email,
      mobile: mobile || "",
      region,
      state,
      city,
      firmName,
      clientCode,
      topUpBalance,
      userRoleList: permission?.map((item) => item),
    };

    try {
      await props.UpdateClient(props.index, dataObject, Data.id, true);
      setIsBalanceModal(false);
    } catch (error) {
      console.error("Error updating client:", error);
      Swal.fire("Error", "Unable to update client data", "error");
    }
  };

  const handleDeleteButtonClick = async () => {
    setloading(true);
    try {
      const resp = await deleteClient(Cred.token, Data.id);
      if (resp >= 200 && resp < 300) {
        Dispatch(deleteClientsFMCG(Data.id));
        Swal.fire({
          title: "Successfull",
          text: "Deleted Successfully",
          timer: 2000,
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Something went wrong", "Can't Delete data");
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="d-flex align-items-center gap-2 mt-2">
        <div className="d-flex flex-column align-items-stretch">
          <div className="d-flex gap-2">
            {(memberPermissions.some(
              (item) => item == permissionIds.SUPER_ADMIN
            ) ||
              userId == Cred.sub) && (
              <button
                onClick={handleEditButtonClick}
                type="button"
                className="btn btn-outline-secondary w-100"
              >
                <i className="icofont-edit text-success"></i>
              </button>
            )}

            {/* <button
              onClick={() => setShowDetails(true)}
              type="button"
              className="btn btn-outline-secondary w-100"
            >
              <i className="icofont-eye fs-6"></i>
            </button> */}

            {memberPermissions.some(
              (item) => item == permissionIds.SUPER_ADMIN
            ) && (
              <button
                onClick={handleDeleteButtonClick}
                type="button"
                className="btn btn-outline-secondary w-100"
              >
                <i className="icofont-bin text-danger"></i>
              </button>
            )}
          </div>
          {userId == Cred.sub && (
            <button
              className="btn btn-success mt-2 w-80"
              onClick={handleisBalanceModal}
            >
              <span style={{ fontSize: "10px" }}>Update Balance</span>
            </button>
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
            <span className="text-success">
              {`₹ ${topUpBalance ? Number(topUpBalance).toFixed(2) : "0.00"}`}
            </span>
          </div>
        </Modal.Body>
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
          <Button variant="primary" onClick={handleUpdateBalance}>
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
                            return item
                              ? {
                                  value: item,
                                  label: item,
                                }
                              : "";
                          }) || []
                        }
                        onChange={(e) => {
                          console.log(e);
                          setPermission(e);
                        }}
                        options={
                          permission?.map((item) => {
                            return {
                              value: item,
                              label: item,
                            };
                          }) || []
                        }
                        isMulti
                        placeholder="Select Permission"
                        noOptionsMessage={() => "Not found"}
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
          <Button variant="primary" onClick={handleUpdateClient}>
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

export default StockistAction;
