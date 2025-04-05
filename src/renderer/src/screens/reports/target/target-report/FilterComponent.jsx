import React, { useMemo, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { MONTH_LIST } from "./add-form/useAddTarget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

export default function FilterComponent({ helperCall }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const isButtonDisable = useMemo(() => {
    if (selectedMonth === null) return true;
    if (selectedYear === null) return true;
    return false;
  }, [selectedMonth, selectedYear]);

  return (
    <div>
      <Button onClick={() => setFilterOpen(!filterOpen)}>Date Filter</Button>
      <FilterModal
        visible={filterOpen}
        setVisible={setFilterOpen}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        selectedYear={selectedYear}
        isButtonDisable={isButtonDisable}
      />
    </div>
  );
}

const FilterModal = ({
  visible,
  setVisible,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onSubmit,
  isButtonDisable,
}) => {
  return (
    <Modal show={visible} onHide={() => setVisible(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Date Filter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Month</Form.Label>
            <Select
              options={MONTH_LIST}
              placeholder="Select Month"
              onChange={setSelectedMonth}
              value={selectedMonth}
              noOptionsMessage={() => "Not found"}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Form.Label> Select Year</Form.Label>
            <DatePicker
              selected={selectedYear}
              onChange={(date) => setSelectedYear(date)}
              showYearPicker
              dateFormat="yyyy"
              className="form-control"
              placeholderText="Select Year"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Close
        </Button>
        <Button onClick={onSubmit} disabled={isButtonDisable} variant="primary">
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
