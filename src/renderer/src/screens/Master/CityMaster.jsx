import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Loading from "../../components/UI/Loading";
import PageHeader from "../../components/common/PageHeader";
import ModalLoader from "../UIComponents/ModalLoader";
import { useCityMasterHook } from "../../hooks/cityMasterHook";
import { customStyles } from "../../constants/customStyles";
import Swal from "sweetalert2";
import { useStatesMasterHook } from "../../hooks/stateMasterHook";

function CityMaster() {
  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [fetchMessage, setFetchMessage] = useState("");
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [cityClass, setCityClass] = useState("");
  const [cityType, setCityType] = useState("");
  const [addedCities, setAddedCities] = useState([]);
  const cityTypeOptions = [
    { value: "HEAD_OFFICE", label: "Head Office" },
    { value: "EX_CITY", label: "Ex City" },
    { value: "OUT_STATION", label: "Out Station" },
  ];

  const {
    getallCityMaster,
    deleteCityMaster,
    addCityMaster,
    updateCityMaster,
  } = useCityMasterHook();

  const { getallStateMaster } = useStatesMasterHook();

  const { allCityMaster } = useSelector((state) => state.CityMaster);
  const { allStatesMaster } = useSelector((state) => state.StatesMaster);

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
    setCityName("");
    setCityType("");
    setCityClass("");
    setCityCode("");
    setStateName("");
    setIsModal(!isModal);
  }

  useEffect(() => {
    if (!allStatesMaster.length > 0) {
      getallStateMaster();
    }
  }, []);

  function rephraseCityName() {
    if (!cityName) return "";
    let str = cityName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return str;
  }

  async function handleAddingCityName() {
    if (!cityName || !stateName || !cityType || !cityCode || !cityClass) {
      handleIsModal();
      await Swal.fire({
        title: "Warning",
        text: "Please fill all details",
        icon: "warning",
        timer: 3000,
        timerProgressBar: true,
      });
      handleIsModal();
      return;
    }
    const newState = {
      cityName: rephraseCityName(),
      stateEntity: allStatesMaster.find((item) => item.id == stateName),
      cityType: cityType,
      cityCode: cityCode,
      cityClass: cityClass,
    };
    setAddedCities((prev) => [...prev, newState]);
    setCityName("");
    setCityType("");
    setCityClass("");
    setCityCode("");
    setStateName("");
    console.log(addedCities);
  }

  function handleRemoveButton(index) {
    setAddedCities((prev) => prev.filter((_, i) => i !== index));
  }

  const columnsT = [
    // {
    //   name: "State Id",
    //   selector: (row) => row.id || "NA",
    //   sortable: true,
    //   cell: (row) => <span>{row.id || "NA"}</span>,
    // },
    {
      name: "City Name",
      selector: (row) => row.cityName || "NA",
      sortable: true,
      cell: (row) => <span>{row.cityName || "NA"}</span>,
    },
    {
      name: "State Name",
      selector: (row) => row?.stateName || "NA",
      sortable: true,
      cell: (row) => <span>{row?.stateName || "NA"}</span>,
    },
    {
      name: "City Type",
      selector: (row) => row?.cityType || "NA",
      sortable: true,
      cell: (row) => <span>{row?.cityType || "NA"}</span>,
    },
    {
      name: "City Code",
      selector: (row) => row?.cityCode || "NA",
      sortable: true,
      cell: (row) => <span>{row?.cityCode || "NA"}</span>,
    },
    {
      name: "City Class",
      selector: (row) => row?.cityClass || "NA",
      sortable: true,
      cell: (row) => <span>{row?.cityClass || "NA"}</span>,
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div className="btn-group" role="group" aria-label="Basic actions">
          {row.cityStatus === "ACTIVE" && (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  console.log(row);
                  setEditData(row);
                  setCityName(row.cityName);
                  setStateName(row.stateId);
                  setCityType(row.cityType);
                  setCityClass(row.cityClass);
                  setCityCode(row.cityCode);
                  handleIsModalEdit();
                }}
              >
                <i className="icofont-edit text-success"></i>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteData(row);
                  handleIsModalDelete();
                }}
                className="btn btn-outline-secondary deleterow"
              >
                <i className="icofont-ui-delete text-danger"></i>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.cityStatus !== "ACTIVE",
      style: {
        pointerEvents: "none",
        opacity: 0.5,
        backgroundColor: "#f5f5f5",
      },
    },
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="City Master"
            renderRight={() => (
              <div className="col-auto d-flex">
                <Button
                  variant="primary"
                  onClick={handleIsModal}
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
                  Create City
                </Button>
              </div>
            )}
          />
          <div className="row g-3 py-1 pb-4">
            {allCityMaster?.length > 0 ? (
              <div className="row clearfix g-3">
                <div className="card">
                  <div className="card-body">
                    <DataTable
                      columns={columnsT}
                      title="City Master"
                      data={allCityMaster}
                      defaultSortField="title"
                      pagination={true}
                      selectableRows={false}
                      highlightOnHover
                      dense
                      customStyles={customStyles}
                      conditionalRowStyles={conditionalRowStyles}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info text-center">
                No More City To Load.
              </div>
            )}
          </div>

          <Modal centered show={isModal} onHide={() => setIsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Create City</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-wrap gap-1 mb-4">
                {addedCities.length > 0 ? (
                  addedCities.map((item, index) => (
                    <div key={index} className="align-items-center d-flex mb-3">
                      <button
                        type="button"
                        className="btn btn-info text-white ms-2 border"
                        onClick={() => handleRemoveButton(index)}
                      >
                        <span>{item.cityName}</span>{" "}
                        <i className="icofont-ui-delete text-danger ms-1"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <span>No Cities Added</span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">City Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City Name"
                  onChange={(e) => setCityName(e.target.value)}
                  value={cityName}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  htmlFor="exampleFormControlInput578"
                >
                  State Name*
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlInput578"
                  value={stateName}
                  onChange={async (e) => {
                    try {
                      if (!allStatesMaster.length > 0) {
                        getallStateMaster();
                      }
                      setStateName(e.target.value);
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
                  {allStatesMaster?.map((value, i) => {
                    return (
                      <option value={value.id} key={value.id}>
                        {value.stateName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
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
                      <option value={value.value} key={value.id}>
                        {value.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">City Code *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  onChange={(e) => setCityCode(e.target.value)}
                  value={cityCode}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City Class *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  onChange={(e) => setCityClass(e.target.value)}
                  value={cityClass}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setCityName([])}>
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
                Clear All
              </Button>
              <Button variant="primary" onClick={handleAddingCityName}>
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
                Add
              </Button>
            </Modal.Footer>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => addCityMaster(addedCities, handleIsModal)}
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
              <Modal.Title className="fw-bold">Edit City</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">City Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City Name"
                  onChange={(e) => setCityName(e.target.value)}
                  value={cityName}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  htmlFor="exampleFormControlInput578"
                >
                  State Name*
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlInput578"
                  value={stateName}
                  onChange={async (e) => {
                    try {
                      if (!allStatesMaster.length > 0) {
                        getallStateMaster();
                      }
                      console.log("target calue", e.target.value);
                      setStateName(e.target.value);
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
                  {allStatesMaster?.map((value, i) => {
                    return (
                      <option value={value.id} key={value.id}>
                        {value.stateName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="mb-3">
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
                    console.log("selected city type :", cityType);
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
              </div>
              <div className="mb-3">
                <label className="form-label">City Code *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  onChange={(e) => setCityCode(e.target.value)}
                  value={cityCode}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City Class *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  onChange={(e) => setCityClass(e.target.value)}
                  value={cityClass}
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
                  updateCityMaster(
                    {
                      cityName: cityName,
                      stateId: stateName,
                      editData: editData,
                      cityClass: cityClass,
                      cityCode: cityCode,
                      cityType: cityType
                    },
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
              <Modal.Title className="fw-bold">Delete City</Modal.Title>
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
                onClick={() =>
                  deleteCityMaster(deleteData?.id, handleIsModalDelete)
                }
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

export default CityMaster;
