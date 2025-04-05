import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function WeekDaySelectionModal({ isModal, setIsModal, selectedDays, setSelectedDays }) {
  const weekDays = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day) // Remove if already selected
        : [...prev, day] // Add if not selected
    );
  };

  return (
    <Modal
      onHide={() => setIsModal(false)}
      show={isModal}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select days of the Week
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-2 flex-wrap">
          {weekDays.map((item) => (
            <Button
              key={item} // Added unique key
              variant={selectedDays.includes(item) ? "success" : "secondary"}
              onClick={() => toggleDaySelection(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn-primary"
          onClick={() => {
            setSelectedDays(weekDays);
            setIsModal(false);
          }}
        >
          Select All and Apply
        </Button>
        <Button className="btn btn-primary" onClick={() => setIsModal(false)}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WeekDaySelectionModal;
