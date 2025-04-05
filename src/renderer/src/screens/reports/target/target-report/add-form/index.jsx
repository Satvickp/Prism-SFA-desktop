import React from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useAddTarget } from "./useAddTarget";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TargetAdd({ visible, setVisible, cityList }) {
  const {
    productList,
    MONTH_LIST,
    selectedMonth,
    selectedProduct,
    setSelectedMonth,
    setSelectedProduct,
    productTargetQuantity,
    setProductTargetQuantity,
    targetAmount,
    setTargetAmount,
    productLoader,
    selectedYear,
    setSelectedYear,
    isButtonDisable,
    handleAddTarget,
    selectedCity,
    setSelectedCity,
    addLoader,
  } = useAddTarget(setVisible);

  return (
    <Modal show={visible} onHide={() => setVisible(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Target</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Select
              options={cityList?.map((e) => ({
                label: `${e.cityName}`,
                value: e.id,
              }))}
              placeholder="Select City"
              onChange={setSelectedCity}
              value={selectedCity}
              noOptionsMessage={() => "Not found"}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Product</Form.Label>
            <Select
              options={productList?.map((e) => ({
                label: `${e.name} ${e.sku}`,
                value: e.productId,
              }))}
              placeholder="Select Product"
              isLoading={productLoader}
              onChange={setSelectedProduct}
              value={selectedProduct}
              noOptionsMessage={() => "Not found"}
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Target Quantity</Form.Label>
            <Form.Control
              type="number"
              value={productTargetQuantity}
              onChange={(e) => setProductTargetQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Target Amount</Form.Label>
            <Form.Control
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setVisible(false)}>
          Close
        </Button>
        <Button
          onClick={handleAddTarget}
          disabled={isButtonDisable || addLoader}
          variant="primary"
        >
          Save
          {addLoader && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TargetAdd;
