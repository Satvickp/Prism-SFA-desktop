import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Loading from "../../components/UI/Loading";
import PageHeader from "../../components/common/PageHeader";
import ModalLoader from "../UIComponents/ModalLoader";
import { useRegionMasterHook } from "../../hooks/regionMasterHook";
import { customStyles } from "../../constants/customStyles";
import Swal from "sweetalert2";

function RegionMaster() {
  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false)
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [fetchMessage, setFetchMessage] = useState("");
  const [regionName, setRegionName] = useState("");
  const [addedRegions, setAddedRegions] = useState([]);

  const { getallRegionMaster, deleteRegionMaster, addRegionMaster,updateRegionMaster } = useRegionMasterHook();

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
    setRegionName("")
    setIsModal(!isModal);
  }

  async function handleAddingRegions() {
    if (!regionName) {
      handleIsModal();
      await Swal.fire({
        title: "Warning",
        text: "Please enter a valid Region Name",
        icon: "warning",
        timer: 3000,
        timerProgressBar: true,
      });
      handleIsModal()
      return;
    }
    const newRegion = { regionName: regionName.toUpperCase() };
    setAddedRegions((prev) => [...prev, newRegion]);
    setRegionName(""); 
  }

  function handleRemoveButton(index) {
    setAddedRegions((prev) => prev.filter((_, i) => i !== index));
  }

  const columnsT = [
    // {
    //   name: "Region Id",
    //   selector: (row) => row.id || "NA",
    //   sortable: true,
    //   cell: (row) => <span>{row.id || "NA"}</span>,
    // },
    {
      name: "Region Name",
      selector: (row) => row.name || "NA",
      sortable: true,
      cell: (row) => <span>{row.name || "NA"}</span>,
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
              setRegionName(row.name);
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
            headerTitle="Region Master"
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
                  Create Region
                </Button>
              </div>
            )}
          />
          <div className="row g-3 py-1 pb-4">
            {allRegionMaster?.length > 0 ? (
              <div className="row clearfix g-3">
                <div className="card">
                  <div className="card-body">
                    <DataTable
                      columns={columnsT}
                      title="Region Master"
                      data={allRegionMaster}
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
                No More Region To Load.
              </div>
            )}
          </div>

          <Modal centered show={isModal} onHide={() => setIsModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Create Region</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-wrap gap-1 mb-4">
                {addedRegions.length > 0 ? (
                  addedRegions.map((item, index) => (
                    <div key={index} className="align-items-center d-flex mb-3">
                      <button
                        type="button"
                        className="btn btn-info text-white ms-2 border"
                        onClick={() => handleRemoveButton(index)}
                      >
                        <span>{item.regionName}</span>{" "}
                        <i className="icofont-ui-delete text-danger ms-1"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <span>No regions Added</span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Region Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Region Name"
                  onChange={(e) => setRegionName(e.target.value)}
                  value={regionName}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setAddedRegions([])}>
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
              <Button variant="primary" onClick={handleAddingRegions}>
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
              <Button variant="primary" onClick={() => addRegionMaster(addedRegions, handleIsModal)}>
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



          <Modal centered show={isModalEdit} onHide={() => setIsModalEdit(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Region</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Region Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Region Name"
                  onChange={(e) => setRegionName(e.target.value)}
                  value={regionName}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => updateRegionMaster({regionName: regionName, id: editData.id}, handleIsModalEdit)}>
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
              <Modal.Title className="fw-bold">Delete Region</Modal.Title>
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
                  deleteRegionMaster(deleteData?.id, handleIsModalDelete)
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

export default RegionMaster;
