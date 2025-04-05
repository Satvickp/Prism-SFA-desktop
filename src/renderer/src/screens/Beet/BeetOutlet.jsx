import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/UI/Loading";
import DataTable from "react-data-table-component";
import AddUpdateOutlet from "./Form/AddUpdateOutlet";
import Swal from "sweetalert2";
import { permissionIds } from "../../constants/constants";
import { useParams } from "react-router-dom";
import { deleteOutlet } from "../../api/beet/beet-api";
import { dispatchDeleteOutlet } from "../../redux/features/outletSlice";
import { removeOutletFromBeet } from "../../redux/features/beetSlice";

function BeetOutlet({
  outlets,
  beetId,
  handleOutletViewModal,
  handleGetUserLocation,
  locationError,
  latitude,
  longitude,
  clientFmcgId,
  getPageType
}) {
  //Redux
  const Dispatch = useDispatch();
  const { memberPermissions } = useSelector((state) => state.Permission);
  const { userId } = useParams();
  const Cred = useSelector((state) => state.Cred)

  // UI Manipulation Variables
  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addClient: false,
  });

  // API functions

  const handleDeleteOutlet = async (outletData) => {
    try {
      const resp = await deleteOutlet(Cred.token, outletData.id);
      handleOutletViewModal(false);
      if (resp >= 200 && resp < 300) {
        Dispatch(dispatchDeleteOutlet(outletData.id));
        Dispatch(removeOutletFromBeet({ outletId: outletData.id, beetId: beetId}));
        Swal.fire({
          title: "Success",
          text: `${getPageType() === "Beats" ? "Outlet" : "Chemist"} Deleted Successfully`,
          icon: "success",
          timer: 2000
         });
      }
    } catch (error) {
      handleOutletViewModal(false)
      console.log(`Error Deleting ${getPageType() === "Beats" ? "Outlet" : "Chemist"}: `, error);
      Swal.fire({
        title: "Error",
        text: `Unable to delete ${getPageType() === "Beats" ? "Outlet" : "Chemist"} !`,
        icon: "error",
        timer: 2000
      });
    }
  };

  // UI Modify functions

  function handleIsModal() {
    setIsModal(!isModal);
  }

  //React Table Data Row
  const columns = [
    {
      name: <span className="text-wrap">{getPageType() === "Beats" ? "OUTLET" : "CHEMIST"} NAME</span>,
      selector: (row) => <span className="text-wrap">{row.outletName}</span>,
      sortable: false,
      grow: 2, // Adjust the grow factor to make this column wider
    },
    {
      name: <span className="text-wrap">{getPageType() === "Beats" ? "OUTLET" : "CHEMIST"} OWNER NAME</span>,
      selector: (row) => <span className="text-wrap">{row.ownerName}</span>,
      sortable: true,
      grow: 2,
    },
    {
      name: <span className="text-wrap">{getPageType() === "Beats" ? "OUTLET" : "CHEMIST"} TYPE</span>,
      selector: (row) => <span className="text-wrap">{row.outletType}</span>,
      sortable: false,
      grow: 1,
    },
    {
      name: "",
      selector: (row) => (

        <div
          className="btn-group mt-2 d-flex gap-2"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            onClick={() => {
              handleIsModal()
              setEditData(row)
            }}
            className="btn btn-outline-secondary text-success d-flex gap-2 justify-content-center align-items-center"
          >
            <i className="icofont-edit text-success"></i>
          </button>
          {
            (
              memberPermissions.some((item) => item == permissionIds.SUPER_ADMIN)
            ) && (
          <button
            type="button"
            onClick={() =>{
              console.log("Row :", row)
              handleDeleteOutlet(row)}}
            className="btn btn-outline-secondary text-danger d-flex gap-2 justify-content-center align-items-center"
          >
            <i className="icofont-bin text-danger"></i>
          </button>
            )
          }
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle={getPageType() === "Beats" ? "Outlet" : "Chemist Details"}
            renderRight={() => {
              return (
                <div className="col-auto d-flex">
                  {(memberPermissions.some(
                    (item) => 
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER ||
                      item == permissionIds.CREATE_MANAGER
                  )) && (userId == Cred.sub ) && (
                    <Button
                      variant="primary"
                      onClick={async () => {
                        await handleGetUserLocation();
                        setEditData(null);
                        handleIsModal();
                        if (locationError) {
                          handleIsModal();
                          Swal.fire({
                            title: "Location Error",
                            text: locationError,
                            timer: 2000,
                            icon: "error",
                          });
                          handleIsModal();
                        }
                      }}
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
                      Add {getPageType() === "Beats" ? "Outlet" : "Chemist"}
                    </Button>
                  )}
                </div>
              );
            }}
          />

          <div className="row g-3 row-cols-1 py-1 pb-4">
            <div className="col-auto d-flex flex-wrap"></div>
            {outlets?.length > 0 ? (
              <div className="col-sm-12">
                <div className="w-100">
                  <div className="row clearfix g-3">
                    <div className="col-sm-12">
                      <DataTable
                        id="Data_table"
                        columns={columns}
                        data={outlets}
                        defaultSortField="outletName"
                        className="table myDataTable table-hover align-middle mb-0 w-100 d-row nowrap dataTable no-footer dtr-inline"
                        highlightOnHover={true}
                        pagination
                        paginationServer
                        paginationTotalRows={outlets.length}
                        paginationComponentOptions={{
                          noRowsPerPage: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                No more {getPageType() === "Beats" ? "Outlet" : "Chemist"} To Load.
              </p>
            )}
          </div>
        </div>
      )}

      <Modal size="xl" centered show={isModal} onHide={handleIsModal}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {editData ? `Edit ${getPageType() === "Beats" ? "Outlet" : "Chemist"}` : `Add ${getPageType() === "Beats" ? "Outlet" : "Chemist"}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUpdateOutlet
            editData={editData}
            handleIsModal={handleIsModal}
            beetId={beetId}
            outletData={outlets}
            handleOutletViewModal={handleOutletViewModal}
            longitude={longitude}
            latitude={latitude}
            clientFmcgId={clientFmcgId}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BeetOutlet;
