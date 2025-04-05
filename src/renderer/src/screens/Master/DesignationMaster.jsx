import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Loading from "../../components/UI/Loading";
import PageHeader from "../../components/common/PageHeader";
import ModalLoader from "../UIComponents/ModalLoader";
import { useDesignationMasterHook } from "../../hooks/designationMasterHook";
import { customStyles } from "../../constants/customStyles";
import Swal from "sweetalert2";

function DesignationMaster() {
  const Cred = useSelector((state) => state.Cred);
  const DesignationData = useSelector(
    (state) => state.DesignationMaster.allDesignationMaster
  );
  const currentParentId = useSelector(
    (state) => state.DesignationMaster.currentParentId
  );

  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bikeSelected, setBikeSelected] = useState(false);
  const [carSelected, setCarSelected] = useState(false);
  const [publicSelected, setPublicSelected] = useState(false);

  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [fetchMessage, setFetchMessage] = useState("");

  const [designationNames, setDesignationNames] = useState("");
  const [designationInput, setDesignationInput] = useState(""); // Temporary input value

  const [travelAllowance, setTravelAllowance] = useState({
    car: 0,
    bike: 0,
  });

  const [publicTransport, setPublicTransport] = useState({
    transport: "",
    type: "",
    allowance: 0,
  });

  const [publicTransportData, setPublicTransportData] = useState([]);

  const [dailyAllowanceEXCityAmount, setDailyAllowanceEXCityAmount] =
    useState(0);
  const [dailyAllowanceHQCityAmount, setDailyAllowanceHQCityAmount] =
    useState(0);
  const [
    dailyAllowanceOutStationAmount,
    setDailyAllowanceOutStationCityAmount,
  ] = useState(0);
  // const [travelAllowanceOutStationAmount, setTravelAllowanceOutStationCityAmount] =
  //   useState(0);

  const [PUBLIC_TRANSPORT, setPUBLIC_TRANSPORT] = useState([
    { label: "Bus", value: "Bus" },
    { label: "Train", value: "Train" },
    { label: "Flight", value: "Flight" },
  ]);

  const PUBLIC_TRANSPORT_TYPE = [
    {
      id: 1,
      parent: "BUS",
      children: [
        { label: "AC", value: "AC" },
        { label: "NON AC", value: "NON_AC" },
        { label: "SLEEPER", value: "SLEEPER" },
        { label: "SEATER", value: "SEATER" },
      ],
    },
    {
      id: 2,
      parent: "TRAIN",
      children: [
        { label: "FIRST AC", value: "FIRST_AC" },
        { label: "SECOND AC", value: "SECOND_AC" },
        { label: "THIRD AC", value: "THIRD_AC" },
        { label: "CHAIR CAR", value: "CHAIR_CAR" },
        { label: "SLEEPER", value: "SLEEPER" },
        { label: "SECOND SLEEPER", value: "SECOND_SLEEPER" },
        { label: "GENERAL", value: "GENERAL" },
      ],
    },
    {
      id: 3,
      parent: "FLIGHT",
      children: [
        { label: "ECONOMY", value: "ECONOMY" },
        { label: "BUSINESS", value: "BUSINESS" },
        { label: "FIRST CLASS", value: "FIRST_CLASS" },
        { label: "EXECUTIVE", value: "EXECUTIVE" },
        { label: "PREMIUM ECONOMY", value: "PREMIUM_ECONOMY" },
      ],
    },
  ];

  const DAILY_ALLOWANCE_TYPE = [
    { value: "EX_CITY_DA", label: "EX City" },
    { value: "HEAD_OFFICE_DA", label: "Head Office" },
  ];

  const [addedDesignations, setAddedDesignations] = useState([]);

  const {
    addDesignationMaster,
    deleteDesignationMaster,
    getAllDesignationMaster,
    updateDesignationMaster,
  } = useDesignationMasterHook();

  const [modalLoader, setModalLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
  });

  function handleIsModalDelete() {
    setIsModalDelete(!isModalDelete);
  }

  function handleIsModalEdit() {
    setIsModalEdit(!isModalEdit);
  }

  function handleIsModal() {
    setDesignationNames();
    setIsModal(!isModal);
  }

  // const handleAddDesignation = () => {
  //   if (
  //     designationInput.trim() !== "" &&
  //     !designationNames.includes(designationInput)
  //   ) {
  //     setDesignationNames([...designationNames, designationInput]);
  //     setDesignationInput(""); // Reset input field
  //   }
  // };

  // const handleRemoveDesignation = (nameToRemove) => {
  //   setDesignationNames(
  //     designationNames.filter((name) => name !== nameToRemove)
  //   );
  // };

  // const transportTableColumn = [
  //   {
  //     name: <span className="text-wrap">TRANSPORT</span>,
  //     selector: (row) => row?.transport || "NA",
  //     sortable: true,
  //     cell: (row) => <span>{row?.transport || "NA"}</span>,
  //   },
  //   {
  //     name: <span className="text-wrap">TRANSPORT TYPE</span>,
  //     selector: (row) => row?.transportType || "NA",
  //     sortable: true,
  //     cell: (row) => <span>{row?.transportType || "NA"}</span>,
  //   },
  //   {
  //     name: <span className="text-wrap">ALLOWANCE (₹/km)</span>,
  //     selector: (row) => row?.travelAllowance || "NA",
  //     sortable: true,
  //     cell: (row) => (
  //       <span>{row?.travelAllowance ? `₹ ${row.travelAllowance}` : "NA"}</span>
  //     ),
  //   },
  //   {
  //     name: "",
  //     cell: (row) => (
  //       <div className="btn-group" role="group" aria-label="Basic actions">
  //         <button
  //           type="button"
  //           onClick={() => {
  //             let newData = publicTransportData.filter(
  //               (item) =>
  //                 item.transport !== row.transport ||
  //                 item.transportType !== row.transportType ||
  //                 item.travelAllowance !== row.travelAllowance
  //             );
  //             setPublicTransportData(newData);
  //             setPUBLIC_TRANSPORT((prev) => [
  //               ...prev,
  //               { label: `${row.transport}`, value: `${row.transport}` },
  //             ]);
  //           }}
  //           className="btn btn-outline-secondary deleterow"
  //         >
  //           <i className="icofont-ui-delete text-danger"></i>
  //         </button>
  //       </div>
  //     ),
  //   },
  // ];

  const columnsT = [
    {
      name: <span className="text-wrap">DESIGNATION NAME</span>,
      sortable: false,
      cell: (row) => <span>{row.designationName || "NA"}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">GRADE LEVEL</span>,
      sortable: true,
      cell: (row) => <span>{row.level || "NA"}</span>,
      width: "80px",
    },
    {
      name: <span className="text-wrap">TRANSPORT ALLOWED</span>,
      sortable: true,
      cell: (row) => (
        <span>{row.modeOfTransportAllowed.join(", ") || "NA"}</span>
      ),
    },
    {
      name: <span className="text-wrap">TA BIKE (₹)</span>,
      sortable: true,
      cell: (row) => <span>{row.taBike ? `₹ ${row.taBike}` : "NA"}</span>,
    },
    {
      name: <span className="text-wrap">TA CAR (₹)</span>,
      sortable: true,
      cell: (row) => <span>{row.taCar ? `₹ ${row.taCar}` : "NA"}</span>,
    },
    // {
    //   name: <span className="text-wrap">TA BUS (₹)</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.taBus ? `₹ ${row.taBus}` : "NA"}</span>,
    // },
    // {
    //   name: <span className="text-wrap">BUS LEVEL</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.busLevel || "NA"}</span>,
    // },
    // {
    //   name: <span className="text-wrap">TA TRAIN (₹)</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.taTrain ? `₹ ${row.taTrain}` : "NA"}</span>,
    // },
    // {
    //   name: <span className="text-wrap">TRAIN LEVEL</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.trainLevel || "NA"}</span>,
    // },
    // {
    //   name: <span className="text-wrap">TA FLIGHT (₹)</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.taFlight ? `₹ ${row.taFlight}` : "NA"}</span>,
    // },
    // {
    //   name: <span className="text-wrap">FLIGHT LEVEL</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.flightLevel || "NA"}</span>,
    // },
    {
      name: <span className="text-wrap">DA HEADQUATER (₹)</span>,
      sortable: true,
      cell: (row) => <span>{row.daHq ? `₹ ${row.daHq}` : "NA"}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">DA EX-CITY (₹)</span>,
      sortable: true,
      cell: (row) => <span>{row.daEx ? `₹ ${row.daEx}` : "NA"}</span>,
    },
    // {
    //   name: <span className="text-wrap">TA OUTSTATION (₹)</span>,
    //   sortable: true,
    //   cell: (row) => <span>{row.taOutStation ? `₹ ${row.taOutStation}` : "NA"}</span>,
    //    width: "120px"
    // },
    {
      name: <span className="text-wrap">DA OUTSTATION (₹)</span>,
      sortable: true,
      cell: (row) => (
        <span>{row.daOutStation ? `₹ ${row.daOutStation}` : "NA"}</span>
      ),
      width: "120px",
    },
    // {
    //   name: "STATUS",
    //   cell: (row) => (
    //     <div className="btn-group" role="group" aria-label="Basic actions">
    //       <button
    //         type="button"
    //         className="btn btn-outline-secondary"
    //         onClick={() => {
    //           console.log(row);
    //           setEditData(row);
    //           handleIsModalEdit();
    //         }}
    //       >
    //         <i className="icofont-edit text-success"></i>
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Designation Master"
            renderRight={() => (
              <div className="col-auto d-flex">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleIsModal();
                    setPUBLIC_TRANSPORT([
                      { label: "Bus", value: "Bus" },
                      { label: "Train", value: "Train" },
                      { label: "Flight", value: "Flight" },
                    ]);
                    setPublicTransportData([]);
                  }}
                  disabled={buttonLoader.getDropDowns}
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
                  Create Designation
                </Button>
              </div>
            )}
          />
          <div className="row g-3 py-1 pb-4">
            {DesignationData?.length > 0 ? (
              <div className="row clearfix g-3">
                <div className="card">
                  <div className="card-body">
                    <DataTable
                      columns={columnsT}
                      title="Designation Master"
                      data={DesignationData}
                      defaultSortField="title"
                      pagination={false}
                      selectableRows={false}
                      highlightOnHover
                      dense
                      customStyles={customStyles}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info text-center">
                No More Designation To Load.
              </div>
            )}
          </div>

          <Modal
            centered
            show={isModal}
            onHide={() => setIsModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Create Designation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  {/* Designation Name */}
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      Designation Name
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add Designation Name"
                      onChange={(e) => {
                        setDesignationNames(e.target.value);
                      }}
                      value={designationNames}
                    />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">
                      DA Amount (Out-Station)
                      <span className="text-danger">*</span> (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Grade Level"
                      onChange={(e) =>
                        setDailyAllowanceOutStationCityAmount(e.target.value)
                      }
                      value={dailyAllowanceOutStationAmount}
                    />
                  </div>
                  {/* <div className="col-lg-12 mb-3">
                    <label className="form-label">
                      Designation Name <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add Designation Name"
                        value={designationInput}
                        onChange={(e) => setDesignationInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDesignation();
                          }
                        }}
                      />
                      <button
                        className="btn btn-primary ms-2"
                        type="button"
                        onClick={handleAddDesignation}
                      >
                        Add
                      </button>
                    </div>
                  </div> */}

                  {/* <div className="mb-3">
                    {designationNames?.map((name, index) => (
                      <span key={index} className="badge bg-info me-2 mb-1">
                        {name}{" "}
                        <button
                          type="button"
                          className="btn-close ms-1"
                          onClick={() => handleRemoveDesignation(name)}
                        ></button>
                      </span>
                    ))}
                  </div> */}

                  {/* Grade Level */}
                  {/*                 <div className="col-lg-12">
                    <div className="row">
                      {" "}
                      <div className="col-lg-12 mb-3">
                        <label className="form-label">
                          Grade Level <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Grade Level"
                          onChange={(e) => setDesignationGrade(e.target.value)}
                          value={designationGrade}
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* Daily Allowance and DA value */}
                  <div className="col-lg-12">
                    <div className="row">
                      {" "}
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          DA Amount (EX City)
                          <span className="text-danger">*</span> (₹)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Grade Level"
                          onChange={(e) =>
                            setDailyAllowanceEXCityAmount(e.target.value)
                          }
                          value={dailyAllowanceEXCityAmount}
                        />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          DA Amount (HQ City)
                          <span className="text-danger">*</span> (₹)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Grade Level"
                          onChange={(e) =>
                            setDailyAllowanceHQCityAmount(e.target.value)
                          }
                          value={dailyAllowanceHQCityAmount}
                        />
                      </div>
                    </div>

                    {/* <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          TA Amount (Out-Station)
                          <span className="text-danger">*</span> (₹)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Grade Level"
                          onChange={(e) =>
                            setTravelAllowanceOutStationCityAmount(e.target.value)
                          }
                          value={travelAllowanceOutStationAmount}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="row mb-3">
                  <label className="form-label">
                    Mode of Travel <span className="text-danger">*</span>
                  </label>

                  {/* Bike Section */}
                  <div className="col-lg-6 mb-3">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <label className="form-label me-2">Bike</label>
                        <input
                          type="checkbox"
                          onChange={(e) => setBikeSelected(e.target.checked)}
                          checked={bikeSelected}
                        />
                      </div>

                      <div className="col-lg-12">
                        <label className="form-label me-2">
                          Travel Allowance (₹/km)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="₹/km"
                          onChange={(e) =>
                            setTravelAllowance((prev) => ({
                              ...prev,
                              bike: e.target.value,
                            }))
                          }
                          value={travelAllowance.bike}
                          disabled={!bikeSelected}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Car Section */}
                  <div className="col-lg-6 mb-3">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <label className="form-label me-2">Car</label>
                        <input
                          type="checkbox"
                          onChange={(e) => setCarSelected(e.target.checked)}
                          checked={carSelected}
                        />
                      </div>

                      <div className="col-lg-12">
                        <label className="form-label me-2">
                          Travel Allowance (₹/km)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="₹/km"
                          onChange={(e) =>
                            setTravelAllowance((prev) => ({
                              ...prev,
                              car: e.target.value,
                            }))
                          }
                          value={travelAllowance.car}
                          disabled={!carSelected}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Public Section */}
                  {/*     <div className="col-lg-12 mb-3">
                    <div className="row align-items-center">
                      <div className="col-lg-3">
                        <label className="form-label me-2">Public</label>
                        <input
                          type="checkbox"
                          onChange={(e) => setPublicSelected(e.target.checked)}
                          checked={publicSelected}
                        />
                      </div>

                      <div className="col-lg-12"></div>
                      <div className="col-lg-4 mb-3">
                        <label className="form-label me-2">
                          Public Transport
                        </label>
                        <select
                          className="form-select"
                          value={publicTransport.transport}
                          onChange={(e) =>
                            setPublicTransport((prev) => ({
                              ...prev,
                              transport: e.target.value,
                            }))
                          }
                          disabled={!publicSelected}
                        >
                          <option value="">Select Transport</option>
                          {PUBLIC_TRANSPORT?.map((data, i) => (
                            <option value={data.value} key={i}>
                              {data.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-4 mb-3">
                        <label className="form-label me-2">
                          Transport Type
                        </label>
                        <select
                          className="form-select"
                          value={publicTransport.type}
                          onChange={(e) =>
                            setPublicTransport((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          disabled={
                            !publicSelected || !publicTransport.transport
                          }
                        >
                          <option value="">Select Transport Type</option>
                          {PUBLIC_TRANSPORT_TYPE.find(
                            (item) =>
                              item.parent ===
                              publicTransport.transport?.toUpperCase()
                          )?.children?.map((data, i) => (
                            <option value={data.value} key={i}>
                              {data.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-3 mb-3">
                        <label className="form-label me-2">
                          Travel Allowance (₹/km)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="₹/km"
                          onChange={(e) =>
                            setPublicTransport((prev) => ({
                              ...prev,
                              allowance: e.target.value,
                            }))
                          }
                          value={publicTransport.allowance}
                          disabled={!publicSelected}
                        />
                      </div>

                      <div className="col-lg-1 mt-2">
                        {publicSelected && (
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              if (
                                !publicTransport.transport ||
                                !publicTransport.type ||
                                !publicTransport.allowance
                              ) {
                                setIsModal(false);

                                Swal.fire({
                                  title: "Incompleted Data",
                                  text:
                                    PUBLIC_TRANSPORT.length > 0
                                      ? "Kindly fill all the fields before adding TA"
                                      : "Something Went Wrong",
                                  icon: "warning",
                                  timer: 2000,
                                  didClose: () => {
                                    setIsModal(true);
                                  },
                                });
                                return;
                              }

                              setPublicTransportData((prev) => [
                                {
                                  transport: publicTransport.transport,
                                  transportType: publicTransport.type,
                                  travelAllowance: publicTransport.allowance,
                                },
                                ...prev,
                              ]);

                              let newPUBLIC_TRANSPORT = PUBLIC_TRANSPORT.filter(
                                (item) =>
                                  item.value !== publicTransport.transport
                              );
                              setPUBLIC_TRANSPORT(newPUBLIC_TRANSPORT);

                              setPublicTransport({
                                transport: "",
                                type: "",
                                allowance: 0,
                              });
                            }}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* <DataTable
                  title={"Public Transport Allowance"}
                  columns={transportTableColumn}
                  data={publicTransportData}
                  dense
                  pagination
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  page
                  paginationServer
                  progressComponent={
                    <Loading animation={"border"} color={"black"} />
                  }
                  paginationComponentOptions={{
                    noRowsPerPage: true,
                  }}
                  noDataComponent={
                    <div>
                      No data available. Please add Public Transport allowance.
                    </div>
                  }
                /> */}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  let modeOfTransportation = [];

                  if (carSelected) {
                    modeOfTransportation.push("Car");
                  }
                  if (bikeSelected) {
                    modeOfTransportation.push("Bike");
                  }

                  if (
                    !travelAllowance.bike ||
                    !travelAllowance.car
                    // PUBLIC_TRANSPORT.length != 0 ||
                  ) {
                    setIsModal(false);

                    Swal.fire({
                      title: "Incompleted Data",
                      text:
                        // PUBLIC_TRANSPORT.length > 0
                        // ?
                        "Kindly fill all the fields before creating designation",
                      // : "Something Went Wrong",
                      icon: "warning",
                      timer: 2000,
                      didClose: () => {
                        setIsModal(true);
                      },
                    });
                    return;
                  }

                  // let taBus =
                  //   publicTransportData?.find(
                  //     (item) => item?.transport?.toUpperCase() === "BUS"
                  //   )?.travelAllowance || 0;
                  // let taTrain =
                  //   publicTransportData?.find(
                  //     (item) => item?.transport?.toUpperCase() === "TRAIN"
                  //   )?.travelAllowance || 0;
                  // let taFlight =
                  //   publicTransportData?.find(
                  //     (item) => item?.transport?.toUpperCase() === "FLIGHT"
                  //   )?.travelAllowance || 0;
                  const payload = {
                    designationName: designationNames,
                    parentDesignationId: Number(currentParentId) + 1,
                    modeOfTransportAllowed: modeOfTransportation,
                    taCar: Number(travelAllowance.car),
                    taBike: Number(travelAllowance.bike),
                    // taBus: Number(taBus),
                    // busLevel:
                    //   publicTransportData?.find(
                    //     (item) => item?.transport?.toUpperCase() === "BUS"
                    //   )?.transportType || null,
                    // taTrain: Number(taTrain),
                    // trainLevel:
                    //   publicTransportData?.find(
                    //     (item) => item?.transport?.toUpperCase() === "TRAIN"
                    //   )?.transportType || null,
                    // taFlight: Number(taFlight),
                    // flightLevel:
                    //   publicTransportData?.find(
                    //     (item) => item?.transport?.toUpperCase() === "FLIGHT"
                    //   )?.transportType || null,
                    // da: Number(dailyAllowanceEXCityAmount),
                    daEx: Number(dailyAllowanceEXCityAmount),
                    daHq: Number(dailyAllowanceHQCityAmount),
                    daOutStation: Number(dailyAllowanceOutStationAmount),
                    // taOutStation : Number(travelAllowanceOutStationAmount),
                    daType: "EX_CITY_DA",
                  };

                  console.log("Payload :", payload);

                  await addDesignationMaster(payload, handleIsModal);

                  setDesignationNames([]);
                  setTravelAllowance({
                    car: 0,
                    bike: 0,
                  });
                  setPublicTransport({
                    transport: "",
                    type: "",
                    allowance: 0,
                  });
                  setPublicTransportData([]);
                  setDailyAllowanceEXCityAmount(0);
                  setDailyAllowanceHQCityAmount(0);
                  setDailyAllowanceOutStationCityAmount(0);
                  // setTravelAllowanceOutStationCityAmount(0)
                }}
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Create
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isModalEdit}
            onHide={() => setIsModalEdit(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Designation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Designation Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Region Name"
                  onChange={(e) => setDesignationNames(e.target.value)}
                  // value={designationNames}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  updateDesignationMaster(
                    { designationName: designationNames, id: editData.id },
                    handleIsModalEdit
                  )
                }
              >
                {buttonLoader.getDropDowns && (
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
            show={isModalDelete}
            centered
            onHide={() => setIsModalDelete(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Designation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <i className="icofont-ui-delete text-danger display-2 mt-2"></i>
              <p className="mt-4 fs-5">This action is irreversible.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleIsModalDelete}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  console.log("delete data :", deleteData);
                  deleteDesignationMaster(deleteData?.id, handleIsModalDelete);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <ModalLoader message={fetchMessage} show={modalLoader} />
        </div>
      )}
    </>
  );
}

export default DesignationMaster;
