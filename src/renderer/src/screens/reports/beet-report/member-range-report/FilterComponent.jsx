import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function FilterComponent({ exportToExcel, onConfirm, exportToPdf }) {
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      dateRange.endDate < dateRange.startDate
    ) {
      setDateRange((prev) => ({ ...prev, endDate: "" }));
    }
  }, [dateRange.startDate]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleConfirmClick = () => {
    if (!dateRange.startDate || !dateRange.endDate) return;
    onConfirm(dateRange.startDate, dateRange.endDate);
    handleClose();
  };

  return (
    <div style={{ marginBottom: "2px" ,marginLeft:'5px'}} className="d-flex gap-2">
      <Button onClick={handleShow}>Filter</Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                min={dateRange.startDate}
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmClick}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Button
        style={{
          display: "flex",
          flex: "row",
          gap: "2px",
          alignItems: "center",
        }}
        onClick={() => exportToExcel(dateRange)}
      >
        <i className="icofont-download-alt"></i> Excel
      </Button>
      {typeof exportToPdf === "function" && (
        <Button
          style={{
            display: "flex",
            flex: "row",
            gap: "2px",
            alignItems: "center",
          }}
          onClick={() => exportToPdf()}
        >
          <i className="icofont-download-alt"></i> PDF
        </Button>
      )}
    </div>
  );
}

export default FilterComponent;
