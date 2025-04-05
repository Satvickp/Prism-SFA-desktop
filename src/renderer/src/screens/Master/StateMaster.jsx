import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Loading from "../../components/UI/Loading";
import PageHeader from "../../components/common/PageHeader";
import ModalLoader from "../UIComponents/ModalLoader";
import { useStatesMasterHook } from "../../hooks/stateMasterHook";
import { customStyles } from "../../constants/customStyles";
import Swal from "sweetalert2";
import { useRegionMasterHook } from "../../hooks/regionMasterHook";

function StateMaster() {
  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [fetchMessage, setFetchMessage] = useState("");
  const [statesName, setStatesName] = useState("");
  const [regionName, setRegionName] = useState("");
  const [addedStates, setAddedStates] = useState([]);

  const {
    getallStateMaster,
    deleteStateMaster,
    addStateMaster,
    updateStateMaster,
  } = useStatesMasterHook();

  const { getallRegionMaster } = useRegionMasterHook();

  const { allStatesMaster } = useSelector((state) => state.StatesMaster);
  const { allRegionMaster } = useSelector((state) => state.RegionMaster);

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
    setStatesName("");
    setIsModal(!isModal);
  }

  useEffect(() => {
    if (!allRegionMaster.length > 0) {
      getallRegionMaster();
    }
  }, []);

  function rephraseStateName() {
    if (!statesName) return "";
    let str = statesName
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    return str;
  }

  async function handleAddingStates() {
    if (!statesName || !regionName) {
      handleIsModal();
      await Swal.fire({
        title: "Warning",
        text: "Please enter a valid State Name",
        icon: "warning",
        timer: 3000,
        timerProgressBar: true,
      });
      handleIsModal();
      return;
    }
    const newState = {
      stateName: rephraseStateName(),
      regionEntity: allRegionMaster.find((item) => item.id == regionName),
    };
    setAddedStates((prev) => [...prev, newState]);
    setStatesName("");
    console.log(addedStates);
  }

  function handleRemoveButton(index) {
    setAddedStates((prev) => prev.filter((_, i) => i !== index));
  }

  const columnsT = [
    // {
    //   name: "State Id",
    //   selector: (row) => row.id || "NA",
    //   sortable: true,
    //   cell: (row) => <span>{row.id || "NA"}</span>,
    // },
    {
      name: "State Name",
      selector: (row) => row.stateName || "NA",
      sortable: true,
      cell: (row) => <span>{row.stateName || "NA"}</span>,
    },
    {
      name: "Region Name",
      selector: (row) => row?.regionEntity?.regionName || "NA",
      sortable: true,
      cell: (row) => <span>{row?.regionEntity?.regionName || "NA"}</span>,
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div className="btn-group" role="group" aria-label="Basic actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              console.log(row);
              setEditData(row);
              setStatesName(row.stateName);
              setRegionName(row.regionEntity.id);
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
        </div>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="State Master"
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
                  Create State
                </Button>
              </div>
            )}
          />
          <div className="row g-3 py-1 pb-4">
            {allStatesMaster?.length > 0 ? (
              <div className="row clearfix g-3">
                <div className="card">
                  <div className="card-body">
                    <DataTable
                      columns={columnsT}
                      title="State Master"
                      data={allStatesMaster}
                      defaultSortField="title"
                      pagination={true}
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
                No More State To Load.
              </div>
            )}
          </div>

          <Modal centered show={isModal} onHide={() => setIsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Create State</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-wrap gap-1 mb-4">
                {addedStates.length > 0 ? (
                  addedStates.map((item, index) => (
                    <div key={index} className="align-items-center d-flex mb-3">
                      <button
                        type="button"
                        className="btn btn-info text-white ms-2 border"
                        onClick={() => handleRemoveButton(index)}
                      >
                        <span>{item.stateName}</span>{" "}
                        <i className="icofont-ui-delete text-danger ms-1"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <span>No states Added</span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">State Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  onChange={(e) => setStatesName(e.target.value)}
                  value={statesName}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  htmlFor="exampleFormControlInput578"
                >
                  Region Name*
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlInput578"
                  value={regionName}
                  onChange={async (e) => {
                    try {
                      if (!allRegionMaster.length > 0) {
                        getallRegionMaster();
                      }
                      setRegionName(e.target.value);
                    } catch (error) {
                      Swal.fire(
                        "Something went wrong",
                        "Please Try After Some Time",
                        "error"
                      );
                    }
                  }}
                >
                  <option value="">Select a Region</option>
                  {allRegionMaster?.map((value, i) => {
                    return (
                      <option value={value.id} key={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setStatesName([])}>
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
              <Button variant="primary" onClick={handleAddingStates}>
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
                onClick={() => addStateMaster(addedStates, handleIsModal)}
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
              <Modal.Title className="fw-bold">Edit State</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">State Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State Name"
                  onChange={(e) => setStatesName(e.target.value)}
                  value={statesName}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  htmlFor="exampleFormControlInput578"
                >
                  Region Name*
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlInput578"
                  value={regionName}
                  onChange={async (e) => {
                    try {
                      if (!allRegionMaster.length > 0) {
                        getallRegionMaster();
                      }
                      console.log("target calue", e.target.value)
                      setRegionName(e.target.value);
                    } catch (error) {
                      Swal.fire(
                        "Something went wrong",
                        "Please Try After Some Time",
                        "error"
                      );
                    }
                  }}
                >
                  <option value="">Select a Region</option>
                  {allRegionMaster?.map((value, i) => {
                    return (
                      <option value={value.id} key={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  updateStateMaster(
                    { stateName: statesName, regionId: regionName, editData: editData},
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
              <Modal.Title className="fw-bold">Delete State</Modal.Title>
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
                  deleteStateMaster(deleteData?.id, handleIsModalDelete)
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

export default StateMaster;
