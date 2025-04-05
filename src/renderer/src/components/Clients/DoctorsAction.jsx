import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { emailValidator } from "../../helper/emailValidator";
import mobileValidator from "../../helper/mobileValidator";
import Swal from "sweetalert2";
import ModalLoader from "../../screens/UIComponents/ModalLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  addDoctorsAvailability,
  deleteDoctorsAvailability,
  getCity,
  getState,
} from "../../api/clients/clientfmcg-api";
import Select from "react-select";
import dayjs from "dayjs";
import {
  setAllCity,
  setAllState,
} from "../../redux/features/dropdownFieldSlice";
import { constants, permissionIds } from "../../constants/constants";
import { useParams } from "react-router-dom";
import { useGeocodeWithAutocomplete } from "../../hooks/useGoogleMapHook";
import { useBeetApiHook } from "../../hooks/beetHook";
import DataTable from "react-data-table-component";
import { getTimeFormat } from "../../helper/date-functions";
import { getCurrentCoordinates } from "../../helper/getCurrentCoordinates";
import { data } from "browserslist";
import TimePicker from "./TimePicker";
function DoctorsAction(props) {
  const Data = props.data;
  const apiKey = constants.google_map_api_key;
  const [clientFirstName, setClientFirstName] = useState(Data?.name);
  const [gender, setGender] = useState(Data?.gender);
  const [mobile, setMobile] = useState(Data?.mobileNumber);
  const [otherMobileNumber, setOtherMobileNumber] = useState(
    Data?.otherMobileNumber
  );
  const [doctorClass, setDoctorClass] = useState(Data?.doctorClass);
  const [clinicPinCode, setClinicPinCode] = useState(Data?.clinicPinCode);
  const [hobbies, setHobbies] = useState(Data?.hobbies || null);
  const [actualAddress, setActualAddress] = useState(Data?.actualAddress);
  const [socialNetworkingAddress, setSocialNetworkingAddress] = useState(
    Data?.socialNetworkingAddress
  );
  const { content } = useSelector((state) => state.Beets);
  const [email, setEmail] = useState(Data?.email);
  const [productList, setProductList] = useState(
    Data?.productList?.map((item) => ({
      value: item.productId,
      label: `${item.name} - (${item.sku})`,
    })) || []
  );
  const [degree, setDegree] = useState(Data?.degree);
  const [monthlyVisit, setMonthlyVisit] = useState(Data?.monthlyVisit);
  const [age, setAge] = useState(Data?.age);
  const [memberId, setMemberId] = useState(2);
  const [address, setAddress] = useState(Data?.address);
  const [dob, setDob] = useState(Data?.dob);
  const [cityType, setCityType] = useState(Data?.cityType);
  const [dom, setDom] = useState(Data?.dom);
  const [practiceSince, setPracticeSince] = useState(Data?.practiceSince);
  const [specialization, setSpecialization] = useState(Data?.specialization);
  const [city, setCity] = useState(Data?.city);
  const [beet, setBeet] = useState(Data?.beet?.id);
  const [region, setRegion] = useState(0);
  const [state, setState] = useState(0);
  // const [latitude, setLatitude] = useState(Data?.latitude);
  // const [longitude, setLongitude] = useState(Data?.longitude);
  const [clinicName, setClinicName] = useState(Data?.clinicName);
  const [prescribe, setPrescribe] = useState(Data?.prescribe);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setloading] = useState(false);
  const DropDownsField = useSelector((state) => state.DropDownsField);
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);
  const Products = useSelector((state) => state.Products.content);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isModalAvailabilityUpdate, setIsModalAvailabilityUpdate] =
    useState(false);
  const Dispatch = useDispatch();
  const { userId } = useParams();
  const [buttonLoader, setButtonLoader] = useState({
    updateDoctors: false,
  });
  const [daysAvailabilityList, setDaysAvailabilityList] = useState({
    dayOfWeek: "",
    visitInTime: "",
    visitOutTime: "",
    availabilityId: null,
  });

  const [WEEK_DAYS, setWEEK_DAYS] = useState([
    { label: "MONDAY", value: "MONDAY"},
    { label: "TUESDAY", value: "TUESDAY"},
    { label: "WEDNESDAY", value: "WEDNESDAY"},
    { label: "THURSDAY", value: "THURSDAY"},
    { label: "FRIDAY", value: "FRIDAY"},
    { label: "SATURDAY", value: "SATURDAY"},
    { label: "SUNDAY", value: "SUNDAY"},
  ]);

  const [daysAvailabilityData, setDaysAvailabilityData] = useState(Data?.doctorAvailabilityResList);
  //Pagination Variables
  const [size, setSize] = useState(5000);
  //Get All Beets details when Page is Loaded
  const { GetAllBeets } = useBeetApiHook(0, size);
  const {
    query,
    setQuery,
    suggestions,
    fetchCoordinates,
    latitude,
    longitude,
    isLoading,
    error,
    fetchSuggestions,
  } = useGeocodeWithAutocomplete(apiKey);
  const cityTypeOptions = [
    { value: "HEAD_OFFICE", label: "Head Office" },
    { value: "EX_CITY", label: "Ex City" },
  ];
  async function getAllState(regionId) {
    // Dispatch(setAllState([]));
    const stateArray = await getState(Cred.token, regionId);
    Dispatch(setAllState(stateArray));
  }
  async function getAllCity(stateId) {
    Dispatch(setAllCity([]));
    const cityArray = await getCity(Cred.token, stateId);
    Dispatch(setAllCity(cityArray));
  }
  const formattedDob = dayjs(dob).format("YYYY-MM-DD");
  const formatedDateOfMarriage = dayjs(dom).format("YYYY-MM-DD");
  const formatedPracticeSince = dayjs(practiceSince).format("YYYY-MM-DD");
  // Handle update doctor function
  const handleUpdateDoctor = async () => {
    const emailError = emailValidator(email);
    const mobileError = mobileValidator(mobile || "");
    if (email && emailError) {
      setIsModal(false);
      Swal.fire("Invalid Email", emailError, "error").then((e) => {
        if (e.isConfirmed) setIsModal(true);
      });
      return;
    }
    if (mobile && mobileError) {
      setIsModal(false);
      Swal.fire("Invalid Mobile Number", mobileError, "error").then((e) => {
        if (e.isConfirmed) setIsModal(true);
      });
      return;
    }
    if (!clientFirstName || !address || !email || !mobile) {
      setIsModal(false);
      console.log(clientFirstName, address, email, mobile);
      Swal.fire({
        title: "Invalid Details",
        text: "Make sure you filled each detail with the correct value",
        timer: 2000,
        icon: "warning",
      }).then(() => setIsModal(true));
      return;
    }
    setButtonLoader((prev) => ({ ...prev, updateDoctors: true }));
    const coordinates = await getCurrentCoordinates();
    const data_object = {
      name: clientFirstName,
      gender,
      mobileNumber: mobile || "",
      otherMobileNumber: otherMobileNumber || null,
      doctorClass: doctorClass || "",
      clinicPinCode: clinicPinCode || "",
      hobbies: hobbies || null,
      socialNetworkingAddress: socialNetworkingAddress || "",
      email,
      degree: degree || null,
      monthlyVisit: monthlyVisit || "",
      productList: productList.map((item) => item.value),
      createDoctorAvailabilityList: [],
      deleteDoctorAvailabilityList: [],
      updateDoctorAvailabilityList: [],
      age: age || "",
      // memberId: Data?.memberId,
      address: address || "",
      dob: dob || "",
      dom: dom || "",
      practiceSince: practiceSince || "",
      specialization: specialization || "",
      latitude: Data?.latitude !== "" ? Data?.latitude : coordinates.latitude,
      longitude:
        Data?.longitude !== "" ? Data?.longitude : coordinates.longitude,
      clinicName: clinicName || "",
      prescribe: prescribe || "",
    };

    await props.UpdateDoctors(props.index, data_object, Data.id);

    setIsModal(false);
    setButtonLoader((prev) => ({ ...prev, updateDoctors: false }));
  };

  const handleButtonClick = async () => {
    setloading(true);
    try {
      setIsModal(true);
      // You can add any data-fetching or necessary logic here
    } catch (error) {
      setIsModal(false);
      console.error("Error:", error);
      Swal.fire("Something went wrong", "Can't Fetch Necessary data");
    } finally {
      setloading(false);
    }
  };

  const handleDeleteButtonClick = async () => {
    setIsModalDelete(true);
  };

  useEffect(() => {
    GetAllBeets();
  }, []);

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
            onClick={async () => {
              try {
                const resp = await deleteDoctorsAvailability(
                  Cred.token,
                  row.id
                );
                if (resp >= 200 && resp < 300) {
                  let newData = daysAvailabilityData.filter(
                    (item) =>
                      item.dayOfWeek !== row.dayOfWeek ||
                      item.visitInTime !== row.visitInTime ||
                      item.visitOutTime !== row.visitOutTime
                  );
                  setDaysAvailabilityData(newData);
                  setWEEK_DAYS([
                    ...new Set([
                      ...WEEK_DAYS,
                      // { label: `${row.dayOfWeek}`, value: `${row.dayOfWeek}` },
                    ]),
                  ]);
                }
              } catch (error) {
                console.log("Error deleting this Day :", error);
                Swal.fire({
                  title: "Error",
                  text: "unable to delete this available day",
                  icon: "error",
                  timer: 2000,
                });
              }
            }}
            className="btn btn-outline-secondary deleterow"
          >
            <i className="icofont-ui-delete text-danger"></i>
          </button>
        </div>
      ),
    },
  ];

  const doctorsProductsDataColumn = [
    {
      name: "",
      sortable: true,
      cell: (row) => (
        <img
          alt="product-image"
          src={row?.imageUrl || ""}
          height="20px"
          width="20px"
        />
      ),
    },
    {
      name: "NAME",
      selector: (row) => (
        <span className="text-wrap">{row?.name || "N/A"}</span>
      ),
      sortable: true,
    },
    {
      name: "SKU",
      selector: (row) => <span className="text-wrap">{row?.sku || "N/A"}</span>,
      sortable: true,
    },
    {
      name: "UNIT",
      selector: (row) => (
        <span className="text-wrap">{row?.unitOfMeasurement || "N/A"}</span>
      ),
      sortable: true,
    },
    {
      name: "CODE",
      selector: (row) => (
        <span className="text-wrap">{row?.productCode || "N/A"}</span>
      ),
      sortable: true,
    },
  ];

  return (
    <div>
      <div
        className="btn-group mt-2"
        role="group"
        aria-label="Basic outlined example"
        style={{ display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        {(memberPermissions.some(
          (item) => item == permissionIds.SUPER_ADMIN
          // item == permissionIds.REPORTING_MANAGER ||
          // item == permissionIds.EDIT_MANAGER
        ) ||
          userId == Cred.sub) && (
          <button
            onClick={handleButtonClick}
            type="button"
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </button>
        )}
        {memberPermissions.some(
          (item) => item == permissionIds.SUPER_ADMIN
        ) && (
          <button
            onClick={handleDeleteButtonClick}
            type="button"
            className="btn btn-outline-secondary"
          >
            <i className="icofont-bin text-danger"></i>
          </button>
        )}
        <button
          onClick={() => setShowDetails(true)}
          type="button"
          className="btn btn-outline-secondary"
        >
          <i className="icofont-eye fs-6"></i>
        </button>
        {props.CLIENT_TYPE !== "CLIENT_FMCG" && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setIsModalAvailabilityUpdate(true)}
          >
            <i className="icofont-list fs-6"></i>
          </button>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        size="lg"
        centered
        show={showDetails}
        onHide={() => {
          setShowDetails(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{Data.name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Client Name :</span>
            <span>{Data?.name || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Email :</span>
            <span>{Data?.email || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Mobile Number:</span>
            <span>{Data?.mobileNumber || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Gender:</span>
            <span>{Data?.gender || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Clinic PinCode :</span>
            <span>{Data?.clinicPinCode || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Address :</span>
            <span>{Data?.actualAddress || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">City :</span>
            <span>{Data?.beet?.city || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">State :</span>
            <span>{Data?.beet?.state || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Doctor Class :</span>
            <span>{Data?.doctorClass || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Hobbies :</span>
            <span>{Data?.hobbies || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Social Networking Address :</span>
            <span>{Data?.socialNetworkingAddress || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Degree :</span>
            <span>{Data?.degree || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Monthly Visit :</span>
            <span>{Data?.monthlyVisit || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Age :</span>
            <span>{Data?.age || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Date of Birth (DOB) :</span>
            <span>
              {Data?.dob ? dayjs(Data?.dob).format("MM/DD/YYYY") : "NA"}
            </span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Date of Marriage (DOM) :</span>
            <span>
              {Data?.dom ? dayjs(Data?.dom).format("MM/DD/YYYY") : "NA"}
            </span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Practice Since :</span>
            <span>
              {Data?.practiceSince
                ? dayjs(Data?.practiceSince).format("MM/DD/YYYY")
                : "NA"}
            </span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Specialization :</span>
            <span>{Data?.specialization || "NA"}</span>
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Clinic Name :</span>
            <span>{Data?.clinicName || "NA"}</span>
          </div>
          <div className="fs-6">
            <p className="fw-bold">Doctor Availability :</p>
            {Data?.doctorAvailabilityResList &&
              Data?.doctorAvailabilityResList.length > 0 && (
                <DataTable
                  title={"Days Availability"}
                  columns={daysAvailabilityDataColumn}
                  data={Data?.doctorAvailabilityResList || []}
                  dense
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  noDataComponent={
                    <div>
                      No data available. Please add Doctor's Available Days
                    </div>
                  }
                />
              )}
          </div>
          <div className="fs-6">
            <p className="fw-bold">Doctor's Products :</p>
            {Data?.productList && Data?.productList.length > 0 && (
              <DataTable
                title={"Products"}
                columns={doctorsProductsDataColumn}
                data={Data?.productList || []}
                dense
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
                noDataComponent={
                  <div>No data available. Please add Doctor's Product</div>
                }
              />
            )}
          </div>
          <div className="fs-6 d-flex gap-2">
            <span className="fw-bold">Prescribe :</span>
            <span>{Data?.prescribe ? "True" : "False"}</span>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal
        size="xl"
        centered
        show={isModal}
        onHide={() => {
          setIsModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Doctor</Modal.Title>
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
                  Doctor's Name*
                </label>
                <input
                  type="text"
                  value={clientFirstName}
                  className="form-control"
                  id="exampleFormControlInput877"
                  onChange={(e) => setClientFirstName(e.target.value)}
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
              {/* Phone */}
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

            {/* Address */}
            <div className="row mb-3">
              <label className="form-label" htmlFor="addressInput">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  // setQuery(e.target.value);
                  // fetchSuggestions(e.target.value);
                  setAddress(e.target.value);
                }}
                placeholder="Enter Address"
                className="w-full p-2 border rounded"
              />
              {/* 
              {suggestions?.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full mt-1 shadow-lg rounded">
                  {suggestions.map((address, index) => (
                    <li
                      key={index}
                      onClick={() => fetchCoordinates(address)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {address}
                    </li>
                  ))}
                </ul>
              )} */}
            </div>

            <div className="row mb-3">
              <div className="col-lg-6">
                <label
                  className="form-label"
                  htmlFor="exampleFormControlInput578"
                >
                  Beet*
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlInput578"
                  value={beet}
                  onChange={(e) => setBeet(e.target.value)}
                  disabled={!content || content?.length === 0}
                >
                  <option value="">Select a Beet</option>
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
                  options={Products.map((item) => ({
                    value: item.productId,
                    label: `${item.name} - (${item.sku})`,
                  }))}
                  value={productList}
                  onChange={(e) => setProductList(e)}
                />
              </div>
              <div className="col-lg-6">
                <label
                  htmlFor="exampleFormControlInput777"
                  className="form-label"
                >
                  Other MobileNumber
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
                <label className="form-label">Doctor Class</label>
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
                <label className="form-label">Clinic Pin Code</label>
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
                <label className="form-label">Hobbies</label>
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
                <label className="form-label">Social Networking Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={socialNetworkingAddress}
                  onChange={(e) => setSocialNetworkingAddress(e.target.value)}
                  placeholder="Enter Social Media Link"
                />
              </div>
            </div>
            <div className="row mb-3">
              {/* Degree */}
              <div className="col-lg-6">
                <label className="form-label">Degree</label>
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
                <label className="form-label">Specialization</label>
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
                <label className="form-label">Monthly Visit</label>
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
                <label className="form-label">Date of Birth (DOB)</label>
                <input
                  type="date"
                  className="form-control"
                  value={formattedDob}
                  placeholder="Enter Date OF Birth"
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              {/* Marriage */}
              <div className="col-lg-6">
                <label className="form-label">Date of Marriage (DOM)</label>
                <input
                  type="date"
                  className="form-control"
                  value={formatedDateOfMarriage}
                  placeholder="Enter Marriage Date"
                  onChange={(e) => setDom(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6 ">
                <label className="form-label">Practice Since</label>
                <input
                  type="date"
                  placeholder="Practice Since"
                  className="form-control"
                  value={formatedPracticeSince}
                  onChange={(e) => setPracticeSince(e.target.value)}
                />
              </div>
              {/* Age */}
              <div className="col-md-6 ">
                <label className="form-label">Age</label>
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

            {/* Address */}
            <div className="deadline-form">
              <form>
                <div className="row g-3 mb-3">
                  {/* <div className="col-lg-6">
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
                      {DropDownsField?.allRegion.map((value, i) => {
                        return (
                          <option value={value.id} key={value.id}>
                            {value.name}
                          </option>
                        );
                      })}
                    </select>
                  </div> */}
                  {/* <div className="col-lg-6">
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
                  </div> */}
                </div>
                <div className="row mb-2">
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
                  {/* <div className="col-lg-6">
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
                      {Cred.cities.map((value, i) => {
                        return (
                          <option value={value.id} key={value.id}>
                            {value.cityName}
                          </option>
                        );
                      })}
                    </select>
                  </div> */}
                </div>
              </form>
            </div>
            <div>
              <div className="mb-3 form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={prescribe}
                  onChange={(e) => setPrescribe(e.target.checked)}
                />
                <label className="form-check-label fs-14">Can Prescribe</label>
              </div>
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
          <Button variant="primary" onClick={handleUpdateDoctor}>
            {buttonLoader.updateDoctors && (
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

      {/* Update Availability Modal */}
      <Modal
        size="xl"
        centered
        show={isModalAvailabilityUpdate}
        onHide={() => {
          setIsModalAvailabilityUpdate(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            Update Doctor's Availability
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            {/* Doctor's availability */}
            <div className="col-lg-12 mb-3">
              <div className="row align-items-center">
                <div className="col-lg-3">
                  <label className="form-label me-2">Days Availability*</label>
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
                    {WEEK_DAYS?.map((data, i) => {
                      const doctorDaysList = daysAvailabilityData?.map(
                        (item) => item.dayOfWeek
                      );
                      if (!doctorDaysList?.includes(data.value))
                        return (
                          <option value={data?.value} key={i}>
                            {data?.label}
                          </option>
                        );
                    })}
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
                      onClick={async () => {
                        try {
                          const resp = addDoctorsAvailability(Cred.token, Data.id, [{
                            dayOfWeek: daysAvailabilityList.dayOfWeek,
                            visitInTime: daysAvailabilityList.visitInTime,
                            visitOutTime: daysAvailabilityList.visitOutTime,
                            availabilityId: null
                          }]);

                          if (resp >= 200 && resp < 300) {
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
                          }
                        } catch (error) {
                          console.log("Error adding available day:", error);
                          Swal.fire({
                            title: "Error",
                            text: "Error while adding new day",
                            icon: "error",
                            timer: 2000,
                          });
                        }
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              Swal.fire({
                title: "Success",
                text: "Availability Updated Successfully",
                icon: "success",
              });
              setIsModalAvailabilityUpdate(false);
            }}
          >
            {buttonLoader.updateDoctors && (
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

{/* Delete modal */}
      <Modal
        show={isModalDelete}
        centered
        onHide={() => {
          setIsModalDelete(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            You can only delete this Doctor Permanently
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
          <Button
            variant="primary"
            className="btn btn-danger color-fff"
            onClick={() => {
              props.DeleteDoctors(Data.id);
              setIsModalDelete(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalLoader show={loading} message={"Fetching Details"} />
    </div>
  );
}

export default DoctorsAction;
