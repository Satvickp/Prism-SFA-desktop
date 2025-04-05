import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DataTable from "react-data-table-component";

function DoctorsModal({
  isModal,
  setIsModal,
  selectedBeet,
  doctorsList,
  setDoctorsList,
  isViewPurpose = false,
}) {
  let column = [
    {
      name: <span className="text-wrap"></span>,
      selector: (row) => row.outletName,
      sortable: true,
      cell: (row) => (
        <input
          className="checkbox"
          type="checkbox"
          value={doctorsList.some((item) => item.id === row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setDoctorsList((prev) => [...prev, row]);
            } else {
              setDoctorsList((prev) =>
                prev.filter((item) => item.id !== row.id)
              );
            }
          }}
        />
      ),
      width: "50px", // Set width for checkbox column
    },
    {
      name: <span className="text-wrap">DOCTOR/CHEMIST NAME</span>,
      selector: (row) => row.outletName,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">
          {row?.outletName + " " + "(" + row.outletType + ")"}
        </p>
      ),
    },
    {
      name: <span className="text-wrap">OWNER NAME</span>,
      selector: (row) => row.ownerName,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">{row.ownerName}</p>
      ),
    },

    {
      name: <span className="text-wrap">GST NUMBER</span>,
      selector: (row) => row.gstNumber,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">{row.gstNumber}</p>
      ),
    },

    {
      name: <span className="text-wrap">OWNER CONTACT</span>,
      selector: (row) => row.mobile,
      sortable: true,
      cell: (row) => (
        <p className="fw-bold text-secondary text-wrap">{row.mobile}</p>
      ),
    },
  ];

  return (
    <Modal
      onHide={() => setIsModal(false)}
      show={isModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Doctors/Chemist List
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>
          {selectedBeet?.beet} - {selectedBeet?.address}
        </h4>
        {selectedBeet?.outlets?.length > 0 ? (
          <DataTable
            title={"Selected beat outlets"}
            columns={column}
            data={selectedBeet?.outlets}
            defaultSortField="title"
            pagination
            disabled={isViewPurpose}
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
          />
        ) : (
          <p>No Doctor/Chemist available for this Route</p>
        )}
      </Modal.Body>
      {!isViewPurpose && (
        <Modal.Footer>
          <Button
            className="btn btn-primary"
            onClick={() => {
              let allOutlets = selectedBeet?.outlets || [];
              setDoctorsList(allOutlets);
              setIsModal(false);
            }}
          >
            Select All and Apply
          </Button>
          <Button className="btn btn-primary" onClick={() => setIsModal(false)}>
            Apply
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default DoctorsModal;
