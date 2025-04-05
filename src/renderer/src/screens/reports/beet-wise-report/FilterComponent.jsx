import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Select from "react-select";

function FilterComponent({
  exportToExcel,
  onConfirm,
  stateList,
  setSelectedStates,
  selectedStates,
  citiesList,
  setSelectedCites,
  selectedCities,
}) {
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

  const handleStatesSelectChange = (_selectedStates) => {
    setSelectedCites([]);
    if (_selectedStates.length > 3) return;
    const selectedStatesIds = _selectedStates.map((member) => member.value);
    setSelectedStates(selectedStatesIds);
  };

  const handleCitiesSelectChange = (_selectedCity) => {
    setSelectedStates([]);
    if (_selectedCity.length > 3) return;
    const selectedCitiesIds = _selectedCity.map((member) => member.label);
    setSelectedCites(selectedCitiesIds);
  };

  return (
    <div style={{marginBottom:'5px'}} className="d-flex gap-2">
      <div>
        <Select
          isMulti
          options={stateList}
          onChange={handleStatesSelectChange}
          value={stateList.filter((option) =>
            selectedStates.includes(option.value)
          )}
          placeholder="Select State"
        />
      </div>
      <div>
        <Select
          isMulti
          options={citiesList}
          onChange={handleCitiesSelectChange}
          value={citiesList.filter((option) =>
            selectedCities.includes(option.label)
          )}
          placeholder="Select Cites"
        />
      </div>
      <Button
        style={{
          display: "flex",
          flex: "row",
          gap: "2px",
          alignItems: "center",
        }}
        onClick={handleShow}
      >
        Filter
      </Button>
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
        onClick={() => exportToExcel()}
      >
        <i className="icofont-download-alt"></i> Export
      </Button>
    </div>
  );
}

export default FilterComponent;
