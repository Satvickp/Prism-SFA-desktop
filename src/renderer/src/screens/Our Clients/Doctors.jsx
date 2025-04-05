import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spinner, Toast } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";

import {
  addDoctors,
  deleteDoctors,
  getAllClientsByReportingManager,
  getAllDoctors,
  getAllDoctorsByMemberId,
  getCategory,
  getCity,
  getDivision,
  getDropDowns,
  getRegion,
  getState,
  updateDoctors,
  updateDoctorsAvailability,
} from "../../api/clients/clientfmcg-api";
import {
  setAllCategory,
  setAllCity,
  setAllDivision,
  setAllRegion,
  setAllState,
} from "../../redux/features/dropdownFieldSlice";
import {
  addDoctorsData,
  concatClientsFMCG,
  deleteDoctor,
  setAllDoctors,
  updateDoctorsData,
} from "../../redux/features/clientFMCGSlice";

import DataTable from "react-data-table-component";
import Select from 'react-select'
import Swal from "sweetalert2";
import DoctorsAction from "../../components/Clients/DoctorsAction";
import Loading from "../../components/UI/Loading";
import { constants, permissionIds } from "../../constants/constants";
import { customStyles } from "../../constants/customStyles";
import { emailValidator } from "../../helper/emailValidator";
import mobileValidator from "../../helper/mobileValidator";
import ModalLoader from "../UIComponents/ModalLoader";
import { useBeetApiHook } from "../../hooks/beetHook";
// import { useGeocodeWithAutocomplete } from "../../hooks/useGoogleMapHook";
import { getCurrentCoordinates } from "../../helper/getCurrentCoordinates";
import { getTimeFormat } from "../../helper/date-functions";
import TimePicker from "../../components/Clients/TimePicker";
import { useProductHook } from "../../hooks/productsHook";
// import {
//   GoogleMap,
//   Marker,
//   useLoadScript,
//   // Autocomplete,
// } from "@react-google-maps/api";
// const apiKey = constants.google_map_api_key;
function Doctors() {
  const Cred = useSelector((state) => state.Cred);
  const Client = useSelector((state) => state.ClientFMCG);
  const Products = useSelector((state) => state.Products.content)
  const CLIENT_TYPE = window.localStorage.getItem("CLIENT_TYPE");
  const { memberPermissions } = useSelector((state) => state.Permission);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const Dispatch = useDispatch();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [mobile, setMobile] = useState("");
  const [otherMobileNumber, setOtherMobileNumber] = useState("");
  const [doctorClass, setDoctorClass] = useState("");
  const [clinicPinCode, setClinicPinCode] = useState("");
  const [hobbies, setHobbies] = useState("");
  // const [actualAddress, setActualAddress] = useState("");
  const [socialNetworkingAddress, setSocialNetworkingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [daysAvailabilityList, setDaysAvailabilityList] = useState({
    dayOfWeek: "",
    visitInTime: "",
    visitOutTime: "",
  });

  const [daysAvailabilityData, setDaysAvailabilityData] = useState([]);
  const [monthlyVisit, setMonthlyVisit] = useState(0);
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [dom, setDom] = useState("");
  const [practiceSince, setPracticeSince] = useState("");
  const [age, setAge] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [city, setCity] = useState(0);
  const [productList, setProductList] = useState([]);
  const [beet, setBeet] = useState(0);
  const [region, setRegion] = useState(Cred.region);
  const [state, setState] = useState(0);
  const [clinicName, setClinicName] = useState("");
  const [prescribe, setPrescribe] = useState(false);
  // const [cityType, setCityType] = useState("");
  //additional states
  const [fetchMessage, setFetchMessage] = useState("");
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const [modalLoader, setModalLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addDoctors: false,
  });
  const { content } = useSelector((state) => state.Beets);
  const [isMoreData, setIsMoreData] = useState(true);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [WEEK_DAYS, setWEEK_DAYS] = useState([
    { label: "MONDAY", value: "MONDAY" },
    { label: "TUESDAY", value: "TUESDAY" },
    { label: "WEDNESDAY", value: "WEDNESDAY" },
    { label: "THURSDAY", value: "THURSDAY" },
    { label: "FRIDAY", value: "FRIDAY" },
    { label: "SATURDAY", value: "SATURDAY" },
    { label: "SUNDAY", value: "SUNDAY" },
  ]);

  //Pagination Variables
  const [size, setSize] = useState(5000);
  //Get All Beets details when Page is Loaded
  const { GetAllBeets } = useBeetApiHook(0, size);

  const {
    getAllProduct
  } = useProductHook()
  // const {
  //   query,
  //   setQuery,
  //   suggestions,
  //   fetchCoordinates,
  //   // latitude,
  //   // longitude,
  //   isLoading,
  //   error,
  //   fetchSuggestions,
  //   reverseGeocode,
  // } = useGeocodeWithAutocomplete(apiKey);
  // const libraries = ["places"];
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: apiKey,
  //   libraries,
  // });
  // const autocompleteRef = useRef(null);
  // const handleMapClick = (event) => {
  //   const clickedLat = event.latLng.lat();
  //   const clickedLng = event.latLng.lng();
  //   reverseGeocode(clickedLat, clickedLng);
  // };

  // const handleAutocompleteLoad = (autocomplete) => {
  //   autocompleteRef.current = autocomplete;
  // };
  // const handlePlaceChanged = () => {
  //   const place = autocompleteRef.current.getPlace();
  //   if (place && place.formatted_address) {
  //     fetchCoordinates(place.formatted_address);
  //   }
  // };
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
      // if (Client?.allDoctors?.length <= 0) {
        const resp = memberPermissions.some(
          (item) => item === permissionIds.SUPER_ADMIN
        )
          ? await getAllDoctors(Cred.token, 0, Cred.sub)
          : await getAllDoctorsByMemberId(Cred.token, 0, Cred.sub);
        
          if(Client.selectedBeet){
            Dispatch(
              setAllDoctors({
                allDoctors: resp?.data.filter((item) => item.beet.id === Client.selectedBeet),
                paginationData: resp?.data.length,
              })
            );
          }else{
            Dispatch(
              setAllDoctors({
                allDoctors: resp?.data,
                paginationData: resp?.paginationData,
              })
            );
          // }
        }
        
    } catch (error) {
      console.log("Error:: Cannot get Doctors! ::", error);
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
    getAllProduct();
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

  async function UpdateDoctors(data, id) {
    try {
      const resp = await updateDoctors(data, Cred.token, id);
      if (resp.status >= 200 && resp.status < 300) {
        Dispatch(updateDoctorsData({ ...resp.data, id: id }));
        Swal.fire({
          title: "Success",
          text: `Doctors Updated Successfully!`,
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

  const resetForm = () => {
    setName("");
    setGender("");
    setMobile("");
    setOtherMobileNumber("");
    setDoctorClass("");
    setClinicPinCode("");
    setHobbies("");
    // setActualAddress("");
    setSocialNetworkingAddress("");
    setEmail("");
    setDegree("");
    setMonthlyVisit(0);
    setAddress("");
    setDob("");
    setDom("");
    setPracticeSince("");
    setAge("");
    setSpecialization("");
    setCity("");
    setProductList([]);
    setBeet("");
    setRegion("");
    setState("");
    // setQuery("");
    setClinicName("");
    setPrescribe(false);
    // setCityType("");
  };

  async function AddDoctor() {
    const emailError = emailValidator(email);
    const mobileError = mobileValidator(mobile);
    if (
      !address ||
      !email ||
      !mobile ||
      !dob ||
      // !dom ||
      !daysAvailabilityList ||
      !degree ||
      !monthlyVisit ||
      !specialization ||
      !age ||
      !doctorClass ||
      !clinicPinCode ||
      !hobbies ||
      !socialNetworkingAddress ||
      !otherMobileNumber ||
      !practiceSince
    ) {
      setIsModal(false);
      Swal.fire({
        title: "Error During Add Doctors",
        text: "Please all the fields are required",
      }).then((e) => {
        if (e.isConfirmed) {
          setIsModal(true);
        }
      });
      return;
    }
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
    if (!name) {
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
    if (!Cred?.token) {
      setIsModal(false);
      Swal.fire("Authentication Error", "Please login again", "error");
      return;
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ addDoctors: true },
    });
    try {
      const coordinates = await getCurrentCoordinates();

      const payload = {
        name: name,
        gender: gender || null,
        mobileNumber: Number(mobile),
        otherMobileNumber: Number(otherMobileNumber) || null,
        doctorClass: doctorClass || null,
        clinicPinCode: clinicPinCode || null,
        hobbies: hobbies,
        actualAddress: address,
        socialNetworkingAddress: socialNetworkingAddress,
        email: email,
        degree: degree || null,
        monthlyVisit: Number(monthlyVisit),
        // productList: productList,
        doctorAvailabilityReqList: daysAvailabilityData,
        age: `${age}` || "",
        memberId: Cred.sub,
        address: address,
        dob: dob || null,
        dom: dom || null,
        practiceSince: practiceSince,
        specialization: specialization,
        city: Number(city),
        beet: Number(beet),
        // region: Number(region),
        // state: Number(state),
        latitude: `${coordinates.latitude}`,
        longitude: `${coordinates.longitude}`,
        clinicName: clinicName,
        prescribe: prescribe,
        productList: productList.map((item) => (item.value))
        // cityType: cityType,
      };
      console.log("payload", payload);
      console.log(latitude, "latitude");
      const resp = await addDoctors(payload, Cred?.token);
      if (resp) {
        Dispatch(addDoctorsData(resp));
        Swal.fire({
          title: "Success",
          text: `Doctors Added Successfully!`,
          icon: "success",
        });
        setIsModal(false);
        resetForm();
      }
    } catch (error) {
      setIsModal(false);
      Swal.fire({
        title: "Something went Wrong",
        text: "Please Try After Some Time",
      }).then((e) => setIsModal(true));
    }
    setButtonLoader({
      ...buttonLoader,
      ...{ addDoctors: false },
    });
  }

  async function DeleteDoctors(id) {
    setModalLoader(true);
    try {
      const resp = await deleteDoctors(Cred.token, id);
      if(resp >= 200 && resp < 300){
        Dispatch(deleteDoctor(id));
        Swal.fire({
          title: "Successfully",
          text: "Doctor Delete Successfully",
          icon: "success",
          timer: 2000
        })
      }
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Delete Doctor", "error");
    }
    setModalLoader(false);
  }

  async function onEndReach() {
    setLoadMore(true);
    try {
      const resp = await getAllDoctors(Cred.token, page + 1, Cred.sub);
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
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Client" : "Doctor";
  }

  const columnsT = [
    {
      name: "Name",
      selector: (row) => row.name || "N/A",
      sortable: true,
      cell: (row) => (
        <span>{row.name ? `${row.name} (${row.gender})` : "N/A"}</span>
      ),
    },
    {
      name: "Clinic Name",
      selector: (row) => row.clinicName || "N/A",
      sortable: true,
      cell: (row) => <span>{row.clinicName || "NA"}</span>,
    },
    {
      name: "Address",
      selector: (row) => row.actualAddress || "N/A",
      sortable: true,
      cell: (row) => <span>{row.actualAddress || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">Days Available</span>,
      selector: (row) => row.doctorAvailabilityResList || "N/A",
      sortable: true,
      cell: (row) => (
        <span>
          {row.doctorAvailabilityResList
            ? row.doctorAvailabilityResList
                .map((item) => item.dayOfWeek)
                .join(" ,")
            : "NA"}
        </span>
      ),
    },
    {
      name: " Email",
      selector: (row) => row.email || "N/A",
      sortable: true,
      cell: (row) => <span>{row.email || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">Mobile Number</span>,
      selector: (row) => row.mobileNumber || "N/A",
      sortable: true,
      cell: (row) => <span>{row.mobileNumber || "NA"}</span>,
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div className="">
          <DoctorsAction
            CLIENT_TYPE={CLIENT_TYPE}
            data={row}
            UpdateDoctors={UpdateDoctors}
            DeleteDoctors={DeleteDoctors}
            getDropDownsValue={getDropDownsValue}
          />
        </div>
      ),
    },
  ];

  const daysAvailabilityDataColumn = [
    {
      name: "DAY",
      selector: (row) => row.dayOfWeek || "N/A",
      sortable: true,
      cell: (row) => <span>{row.dayOfWeek ? `${row.dayOfWeek}` : "N/A"}</span>,
    },
    {
      name: "VISIT IN TIME",
      selector: (row) => row.visitInTime || "N/A",
      sortable: true,
      cell: (row) => (
        <span>{row.visitInTime ? getTimeFormat(row.visitInTime) : "NA"}</span>
      ),
    },
    {
      name: "VISIT OUT TIME",
      selector: (row) => row.visitOutTime || "N/A",
      sortable: true,
      cell: (row) => (
        <span>{row.visitOutTime ? getTimeFormat(row.visitOutTime) : "NA"}</span>
      ),
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div className="btn-group" role="group" aria-label="Basic actions">
          <button
            type="button"
            onClick={() => {
              let newData = daysAvailabilityData.filter(
                (item) =>
                  item.dayOfWeek !== row.dayOfWeek ||
                  item.visitInTime !== row.visitInTime ||
                  item.visitOutTime !== row.visitOutTime
              );
              setDaysAvailabilityData(newData);
              setWEEK_DAYS([
                ...WEEK_DAYS,
                { label: `${row.dayOfWeek}`, value: `${row.dayOfWeek}` },
              ]);
            }}
            className="btn btn-outline-secondary deleterow"
          >
            <i className="icofont-ui-delete text-danger"></i>
          </button>
        </div>
      ),
    },
  ];

  const handleAddDoctorClick = async () => {
    try {
      setIsModal(true);
      Dispatch(setAllCity([]));
      Dispatch(setAllState([]));

      await getAllRegion();
      await getAllDivision();

      if (Cred.region) {
        await getAllState(Cred.region);
      }
    } catch (error) {
      setIsModal(false);
      console.error("Error:", error);
      Swal.fire("Something went wrong", "Can't fetch necessary data");
    }
  };

  useEffect(() => {
    GetAllBeets();
  }, []);
  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle={
              CLIENT_TYPE === "CLIENT_FMCG" ? "Clients (FMCG)" : "Doctors"
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
                      onClick={handleAddDoctorClick}
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
                      Add {CLIENT_TYPE === "CLIENT_FMCG" ? "Client" : "Doctor"}
                    </Button>
                   {/* )} */}
                </div>
              );
            }}
          />
          {CLIENT_TYPE === "CLIENT_FMCG" ? (
            <div className="">
              {Client.allDoctors.length > 0 ? (
                <div>
                  <DataTable
                    columns={columnsT}
                    title="City Master"
                    data={Client?.allDoctors}
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
          ) : (
            <div>
              {Client.allDoctors.length > 0 ? (
                <div>
                  <DataTable
                    columns={columnsT}
                    title="City Master"
                    data={Client?.allDoctors}
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
              <Modal.Title className="fw-bold">{`Add ${getPageType()}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-body">
                <div className="mb-3 row">
                  {/* Name */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput877"
                      className="form-label"
                    >
                      {getPageType()}'s Name*
                    </label>
                    <input
                      type="text"
                      value={name}
                      className="form-control"
                      id="exampleFormControlInput877"
                      onChange={(e) => setName(e.target.value)}
                      placeholder={`Select Name`}
                    />
                  </div>
                  {/* Gender */}
                  <div className=" col-lg-6">
                    <label
                      className="form-label"
                      htmlFor="exampleFormControlInput978"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  {/* Email */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput477"
                      className="form-label"
                    >
                      Email ID*
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
                  {/* Phone */}
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput777"
                      className="form-label"
                    >
                      Phone*
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
                {/* Address */}
                <div className="row mb-3 w-100">
                  <label className="form-label" htmlFor="addressInput">
                    Address*
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      // setQuery(e.target.value);
                      // fetchSuggestions(e.target.value);
                    }}
                    placeholder="Enter Address"
                    className="form-control w-100"
                  />

                  {/* <Autocomplete
                    onLoad={handleAutocompleteLoad}
                    onPlaceChanged={handlePlaceChanged}
                    className="w-100"
                  >
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                      }}
                      placeholder="Enter Address"
                      className="form-control w-100"
                    />
                  </Autocomplete> */}

                  {/* Suggestions dropdown */}
                  {/* {suggestions?.length > 0 && (
                    <ul className="absolute z-20 bg-white border w-full mt-1 shadow-lg rounded">
                      {suggestions.map((address, index) => (
                        <div
                          key={index}
                          onClick={() => fetchCoordinates(address)}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {address}
                        </div>
                      ))}
                    </ul>
                  )} */}

                  {/* <div className="my-3">
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "300px",
                      }}
                      center={{
                        lat: latitude || 37.7749,
                        lng: longitude || -122.4194,
                      }}
                      zoom={14}
                      onClick={handleMapClick}
                    >
                      {latitude && longitude && (
                        <Marker position={{ lat: latitude, lng: longitude }} />
                      )}
                    </GoogleMap>
                  </div> */}
                </div>

                <div className="col-lg-12 mb-3">
                  <div className="row align-items-center">
                    <div className="col-lg-3">
                      <label className="form-label me-2">
                        Days Availability*
                      </label>
                    </div>

                    <div className="col-lg-12"></div>

                    <div className="col-lg-5 mb-3">
                      <label className="form-label me-2">Select Days</label>
                      <select
                        className="form-select"
                        value={daysAvailabilityList.dayOfWeek}
                        onChange={(e) => {
                          setDaysAvailabilityList((prev) => ({
                            ...prev,
                            dayOfWeek: e.target.value,
                          }));
                        }}
                      >
                        <option value="">Select available Days</option>
                        {WEEK_DAYS?.map((data, i) => (
                          <option value={data.value} key={i}>
                            {data.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-lg-3 mb-3">
                      <label className="form-label me-2">Visit In Time</label>
                      <TimePicker
                        value={daysAvailabilityList.visitInTime}
                        setValue={(val) =>
                          setDaysAvailabilityList((prev) => ({
                            ...prev,
                            visitInTime: val,
                          }))
                        }
                      />
                    </div>

                    <div className="col-lg-3 mb-3">
                      <label className="form-label me-2">Visit Out Time</label>
                      <TimePicker
                        value={daysAvailabilityList.visitOutTime}
                        setValue={(val) =>
                          setDaysAvailabilityList((prev) => ({
                            ...prev,
                            visitOutTime: val,
                          }))
                        }
                      />
                    </div>

                    <div className="col-lg-1 mt-2">
                      {daysAvailabilityList.dayOfWeek && (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setDaysAvailabilityData((prev) => [
                              {
                                dayOfWeek: daysAvailabilityList.dayOfWeek,
                                visitInTime: daysAvailabilityList.visitInTime,
                                visitOutTime: daysAvailabilityList.visitOutTime,
                              },
                              ...prev,
                            ]);

                            let newPUBLIC_TRANSPORT = WEEK_DAYS.filter(
                              (item) =>
                                item.value !== daysAvailabilityList.dayOfWeek
                            );
                            setWEEK_DAYS(newPUBLIC_TRANSPORT);

                            setDaysAvailabilityList({
                              dayOfWeek: "",
                              visitInTime: "",
                              visitOutTime: "",
                            });
                          }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                    <DataTable
                      title={"Days Availability"}
                      columns={daysAvailabilityDataColumn}
                      data={daysAvailabilityData}
                      dense
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      noDataComponent={
                        <div>
                          No data available. Please add Doctor's Available Days
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* beat */}
                  <div className="col-lg-6">
                    <label
                      className="form-label"
                      htmlFor="exampleFormControlInput578"
                    >
                      {getPageType() === "Client" ? "Beat" : "Route"}*
                    </label>
                    <select
                      className="form-select"
                      id="exampleFormControlInput578"
                      value={beet}
                      onChange={(e) => setBeet(e.target.value)}
                      disabled={!content || content?.length === 0}
                    >
                      <option value="">
                        Select a {getPageType() === "Client" ? "Beat" : "Route"}
                      </option>
                      {content?.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.beet}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* products */}
                  <div className="col-lg-6">
                    <label
                      className="form-label"
                      htmlFor="exampleFormControlInput578"
                    >
                      Products *
                    </label>
                    <Select 
                    isMulti
                    options={Products.map((item) => ({value: item.productId, label: `${item.name} - (${item.sku})`}))}
                    value={productList}
                    onChange={(e) => setProductList(e)}
                     />
                  </div>

                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput777"
                      className="form-label"
                    >
                      Other MobileNumber*
                    </label>
                    <input
                      type="text"
                      value={otherMobileNumber}
                      onChange={(e) => setOtherMobileNumber(e.target.value)}
                      className="form-control"
                      id="exampleFormControlInput777"
                      maxLength={10}
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  {/* Doctors Class */}
                  <div className="col-md-6 ">
                    <label className="form-label">Doctor Class*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={doctorClass}
                      onChange={(e) => setDoctorClass(e.target.value)}
                      placeholder="Enter Doctor Class"
                      required
                    />
                  </div>
                  {/* CLinic PinCode */}
                  <div className="col-md-6 ">
                    <label className="form-label">Clinic Pin Code*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={clinicPinCode}
                      onChange={(e) => setClinicPinCode(e.target.value)}
                      placeholder="Enter Clinic Pin Code"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Hobbies*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder="Enter Hobbies"
                    />
                  </div>

                  {/* Social Networking Address */}
                  <div className="col-md-6">
                    <label className="form-label">
                      Social Networking Address*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={socialNetworkingAddress}
                      onChange={(e) =>
                        setSocialNetworkingAddress(e.target.value)
                      }
                      placeholder="Enter Social Media Link"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  {/* Degree */}
                  <div className="col-lg-6">
                    <label className="form-label">Degree*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={degree}
                      placeholder="Enter Degree"
                      onChange={(e) => setDegree(e.target.value)}
                    />
                  </div>
                  {/* specialization */}
                  <div className="col-lg-6">
                    <label className="form-label">Specialization*</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Specialization"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Monthly Visit */}
                  <div className="col-lg-6">
                    <label className="form-label">Monthly Visit*</label>
                    <input
                      type="number"
                      className="form-control"
                      value={monthlyVisit}
                      onChange={(e) => setMonthlyVisit(e.target.value)}
                      placeholder="Enter monthly visit"
                    />
                  </div>
                  {/* Clinic Name */}
                  <div className="col-lg-6 ">
                    <label className="form-label">Clinic Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={clinicName}
                      placeholder="Enter Clinic Name"
                      onChange={(e) => setClinicName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* DOB */}
                  <div className="col-lg-6 ">
                    <label className="form-label">Date of Birth (DOB)*</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dob}
                      placeholder="Enter Date OF Birth"
                      onChange={(e) => {
                        setDob(e.target.value);
                        let birthDate = new Date(e.target.value);
                        let currentDate = new Date();
                        let age =
                          currentDate.getFullYear() - birthDate.getFullYear();
                        let birthMonth = birthDate.getMonth();
                        let birthDay = birthDate.getDate();
                        let currentMonth = currentDate.getMonth();
                        let currentDay = currentDate.getDate();

                        if (
                          currentMonth < birthMonth ||
                          (currentMonth === birthMonth && currentDay < birthDay)
                        ) {
                          age--;
                        }
                        setAge(age);
                      }}
                      required
                    />
                  </div>
                  {/* Marriage */}
                  <div className="col-lg-6">
                    <label className="form-label">Date of Marriage (DOM)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dom}
                      placeholder="Enter Marriage Date"
                      onChange={(e) => setDom(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 ">
                    <label className="form-label">Practice Since*</label>
                    <input
                      type="date"
                      placeholder="Practice Since"
                      className="form-control"
                      value={practiceSince}
                      onChange={(e) => setPracticeSince(e.target.value)}
                    />
                  </div>
                  {/* Age */}
                  <div className="col-md-6 ">
                    <label className="form-label">Age*</label>
                    <input
                      type="number"
                      className="form-control"
                      value={age}
                      placeholder="Enter age"
                      onChange={(e) => setAge(e.target.value)}
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="deadline-form">
                  <form>
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
                            value={region?.id || region}
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

                      {memberPermissions.some(
                        (item) => item === permissionIds.SUPER_ADMIN
                      ) ? (
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
                            value={state?.id}
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
                          {cityTypeOptions?.map((value, i) => {
                            return (
                              <option value={value.value} key={i}>
                                {value.label}
                              </option>
                            );
                          })}
                        </select>
                      </div> */}

                      {memberPermissions.includes(permissionIds.SUPER_ADMIN) ? (
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
                      ) : (
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
                            {Cred.cities.map((value, i) => {
                              return (
                                <option value={value.id} key={value.id}>
                                  {value.cityName}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                <div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={prescribe}
                      onChange={(e) => setPrescribe(e.target.checked)}
                    />
                    <label className="form-check-label">Can Prescribe</label>
                  </div>
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
                  AddDoctor();
                }}
                className="btn btn-danger color-fff"
              >
                {buttonLoader.addDoctors && (
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

export default Doctors;
