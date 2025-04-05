import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast } from "react-bootstrap";
import OurFMCGClients from "../../components/Clients/OurFMCGClients";
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
} from "../../api/clients/clientfmcg-api";

import {
  setAllDivision,
  setAllState,
  setAllRegion,
  setAllCity,
  setAllCategory,
} from "../../redux/features/dropdownFieldSlice";

import {
  setClientsFMCG,
  addClientsFMCG,
  updateClientsFMCG,
  deleteClientsFMCG,
  concatClientsFMCG,
} from "../../redux/features/clientFMCGSlice";
import lgAvatar3 from "../../assets/images/lg/avatar3.jpg";
import Loading from "../../components/UI/Loading";
import Swal from "sweetalert2";
import ModalLoader from "../UIComponents/ModalLoader";
import { emailValidator } from "../../helper/emailValidator";
import mobileValidator from "../../helper/mobileValidator";
import { CLIENT_PERMISSIONS } from "../../constants/enums";
import { constants, permissionIds } from "../../constants/constants";
import DataTable from "react-data-table-component";
import { customStyles } from "../../constants/customStyles";
import StockistAction from "../../components/Clients/StockistAction";
function PharmaStockist() {
  const Cred = useSelector((state) => state.Cred);
  const Client = useSelector((state) => state.ClientFMCG);
  const CLIENT_TYPE = window.localStorage.getItem("CLIENT_TYPE");
  const { memberPermissions } = useSelector((state) => state.Permission);
  //for open action modal for delete and update
  const [isModal, setIsModal] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const Dispatch = useDispatch();
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [topUpBalance, setTopUpBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [isMoreData, setIsMoreData] = useState(true);
  const [permission, setPermission] = useState([]);
  const [fetchMessage, setFetchMessage] = useState("");
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const [clientCode, setClientCode] = useState("");
  const [cityType, setCityType] = useState("");
  const [state, setState] = useState(Cred.state);
  const [region, setRegion] = useState(Cred.region);
  const [city, setCity] = useState("");
  const [firmName, setFirmName] = useState("");
  const [modalLoader, setModalLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lattitude, setLattitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addClient: false,
  });
  const apiKey = constants.google_map_api_key;
  const cityTypeOptions = [
    { value: "HEAD_OFFICE", label: "Head Office" },
    { value: "EX_CITY", label: "Ex City" },
  ];
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
          setClientsFMCG({
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
  async function UpdateClient(index, data, id, isBalance = false) {
    try {
      const resp = await updateClient(data, Cred.token, id);
      if (resp) {
        Dispatch(updateClientsFMCG({ ...data, id: id }));
        if (isBalance) {
          Swal.fire({
            title: "Success",
            text: `${data.clientFirstName} ${data.clientLastName}'s Balance Updated Successfully!`,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Success",
            text: "Client updated Successfully!",
            icon: "success",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update Clients. Please try After Some Time",
        icon: "error",
      });
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

    if (!clientFirstName || !clientLastName) {
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
    if (isDoctor) {
      if (!clientCode || !password) {
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
    }

    setButtonLoader({
      ...buttonLoader,
      ...{ addClient: true },
    });
    try {
      const payload = {
        clientFirstName: clientFirstName,
        clientLastName: clientLastName,
        address: address,
        email: email,
        mobile: Number(mobile),
        region: Number(region),
        state: Number(state),
        city: Number(city),
        clientCode: clientCode,
        password: password || "Test@123",
        topUpBalance: Number(topUpBalance) || 0,
        firmName: firmName,
        userRoleList:
          Array.isArray(permission) && permission.length > 0
            ? permission.map((item) => item.value)
            : [5],
        memberId: Cred.sub,
        // cityType: cityType,
        latitude: `${lattitude}`,
        longitude: `${longitude}`,
      };
      const resp = await addClient(payload, Cred.token);
      Dispatch(addClientsFMCG(resp));
      setIsModal(false);
      setClientFirstName("");
      setClientLastName("");
      setAddress("");
      setEmail("");
      setMobile("");
      setRegion("");
      setState("");
      setCity("");
      setClientCode("");
      setFirmName("");
      setPassword("");
      setTopUpBalance(null);
      setPermission([]);
      setCityType("");
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
      Dispatch(deleteClientsFMCG(id));
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
        Dispatch(concatClientsFMCG(resp));
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

  function getPageType() {
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Clients (FMCG)" : "Stockist";
  }
  const columnsT = [
    {
      name: " Client Code",
      selector: (row) => row.clientCode || "N/A",
      sortable: true,
      cell: (row) => <span>{row.clientCode || "N/A"}</span>,
      width:"120px"
    },
    {
      name: "Name",
      selector: (row) => row.clientFirstName || "N/A",
      sortable: true,
      cell: (row) => (
        <span>{`${row.clientFirstName} ${row.clientLastName}` || "NA"}</span>
      ),
      width:"150px"
    },
    {
      name: " Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
      cell: (row) => <span>{row.email || "NA"}</span>,
    },
    {
      name: " Mobile No.",
      selector: (row) => row.mobile || "N/A",
      sortable: true,
      cell: (row) => <span>{row.mobile || "NA"}</span>,
      width:"120px"
    },
    {
      name: "Firm Name",
      selector: (row) => row.firmName || "N/A",
      sortable: true,
      cell: (row) => <span>{row.firmName || "NA"}</span>,
      width:"120px"
    },
    {
      name: "Address",
      selector: (row) => row.address || "N/A",
      sortable: true,
      cell: (row) => <span>{row.address || "NA"}</span>,
    },
    {
      name: "Balance",
      selector: (row) => row.topUpBalance || "N/A",
      sortable: true,
      cell: (row) => <span>{row.topUpBalance ? `₹ ${row.topUpBalance}` : "NA"}</span>,
      width:"100px"
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div className="">
          <StockistAction
            data={row}
            UpdateClient={UpdateClient}
            DeleteClient={DeleteClient}
            getDropDownsValue={getDropDownsValue}
          />
        </div>
      ),
      width:"250px"
    },
  ];
  useEffect(() => {
    if (address.trim()) {
      const fetchCoordinates = async () => {
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${apiKey}`;

          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            setLattitude(location.lat);
            setLongitude(location.lng);
          } else {
            setLattitude(null);
            setLongitude(null);
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
          setLattitude(null);
          setLongitude(null);
        }
      };

      fetchCoordinates();
    } else {
      setLattitude(null);
      setLongitude(null);
    }
  }, [address]);
  const handleAddClientOrStockist = async () => {
    try {
      setIsModal(true);
      // Dispatch(setAllRegion([]));
      Dispatch(setAllCity([]));
      Dispatch(setAllState([]));
      // Fetch required data
      await getAllRegion();
      await getAllDivision();

      if (Cred.region) {
        await getAllState(Cred.region);
      }
    } catch (error) {
      setIsModal(false);
      Swal.fire("Something went wrong", "Can't Fetch Necessary data", "error");
    }
  };
  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle={
              <div className="d-flex gap-3 align-items-center ">
                {" "}
                {CLIENT_TYPE === "CLIENT_FMCG" ? "Clients" : "Stockist"}
              </div>
            }
            renderRight={() => {
              return (
                <div className="col-auto d-flex">
                  {/* {memberPermissions.some(
                    (item) =>
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER ||
                      item == permissionIds.CREATE_MANAGER
                  ) && ( */}
                    <Button
                      variant="primary"
                      onClick={handleAddClientOrStockist} // Attach the function
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
                      Add
                      {CLIENT_TYPE === "CLIENT_FMCG"
                        ? " Clients (FMCG)"
                        : " Stockist"}
                    </Button>
                  {/* )} */}
                </div>
              );
            }}
          />

          {CLIENT_TYPE === "CLIENT_FMCG" ? (
            <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
              {Client.allClients.length > 0 ? (
                Client.allClients.map((data, i) => {
                  return (
                    <div key={"skhd" + i} className="col">
                      <OurFMCGClients
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
                    No More {getPageType()}'s To Load.
                  </p>
                </div>
              )}
            </div>
          ) : (
            //add table instead of card for showing stockist data
            <div className="">
              {Client.allClients?.length > 0 ? (
                <div>
                  <DataTable
                    columns={columnsT}
                    title="City Master"
                    data={Client.allClients}
                    defaultSortField="title"
                    pagination={true}
                    selectableRows={false}
                    highlightOnHover
                    dense
                    customStyles={customStyles}
                  />
                </div>
              ) : (
                <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                  <p className="font-size: 18px; font-weight: bold;">
                    No More {getPageType()}'s To Load.
                  </p>
                </div>
              )}
            </div>
          )}

          <Modal
            size="xl"
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{`Add Stockist`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-body">
                <div className="mb-3 row">
                  <div className="col-lg-6 mb-3">
                    <label
                      htmlFor="exampleFormControlInput877"
                      className="form-label"
                    >
                      {getPageType()} First Name*
                    </label>
                    <input
                      type="text"
                      value={clientFirstName}
                      className="form-control"
                      id="exampleFormControlInput877"
                      onChange={(e) => setClientFirstName(e.target.value)}
                      placeholder={`First Name`}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput878"
                      className="form-label"
                    >
                      {getPageType()} Last Name*
                    </label>
                    <input
                      type="text"
                      value={clientLastName}
                      className="form-control"
                      id="exampleFormControlInput878"
                      onChange={(e) => setClientLastName(e.target.value)}
                      placeholder="Last Name"
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
                      {Cred.region &&
                      !memberPermissions.includes(permissionIds.SUPER_ADMIN) ? (
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
                      )}

                      {memberPermissions.some(item => item === permissionIds.SUPER_ADMIN) ? (
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
                      ) : (
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
                            {Cred.states.map((value, i) => {
                              return (
                                <option value={value.id} key={value.id}>
                                  {value.stateName}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="row g-3 mb-3">
                      {/* <div className="col-lg-6">
                        <label className="form-label" htmlFor="cityInput">
                          City Type*
                        </label>
                        <select
                          className="form-select"
                          id="cityType"
                          value={cityType}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setCityType(selectedValue);
                          }}
                        >
                          <option value="">Select a City Type</option>
                          {cityTypeOptions.map((value, i) => {
                            return (
                              <option value={value.value} key={i}>
                                {value.label}
                              </option>
                            );
                          })}
                        </select>
                      </div> */}

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
                          {memberPermissions.some(
                            (item) => item === permissionIds.SUPER_ADMIN
                          )
                            ? DropDownsField.allCity.map((value, i) => {
                                return (
                                  <option value={value.id} key={value.id}>
                                    {value.cityName}
                                  </option>
                                );
                              })
                            : Cred.cities.map((value, i) => {
                                return (
                                  <option value={value.id} key={value.id}>
                                    {value.cityName}
                                  </option>
                                );
                              })}
                        </select>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-lg-6">
                          <label
                            className="form-label"
                            htmlFor="exampleFormControlInput681"
                          >
                            Firm Name*
                          </label>
                          <input
                            placeholder="Firm Name"
                            className="form-control"
                            id="exampleFormControlInput681"
                            value={firmName}
                            onChange={(e) => setFirmName(e.target.value)}
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
                onClick={() => {}}
              >
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
              <Modal.Title className="fw-bold">Delete Client</Modal.Title>
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

export default PharmaStockist;
