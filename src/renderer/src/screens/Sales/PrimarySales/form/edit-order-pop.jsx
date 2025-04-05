import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
function EditOrderContentModal({
  orderContent,
  setIsVisible,
  isPrimary,
  onUpdate,
}) {
  const [quantity, setQuantity] = useState(orderContent?.quantity ?? "");
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (parseInt(e) < 0) return;

    setQuantity(value);
  };

  useEffect(() => {
    if (orderContent) {
      let _q =
        orderContent.bundleType === "Unit"
          ? orderContent.quantity
          : orderContent.quantity / orderContent.product.bundleSize;
      setQuantity(_q);
    }
  }, [orderContent]);
  return (
    <Modal
      size="sm"
      centered
      className="bg-slate-900"
      show={Boolean(orderContent)}
      backdropClassName="custom-backdrop"
      onHide={() => {
        setIsVisible(null);
      }}
    >
      <Modal.Header closeButton show={Boolean(orderContent)}>
        <Modal.Title className="fw-bold">{"Edit Order"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Enter Quantity{" "}
            {/* {!isPrimary
              ? `(Available: ${orderContent?.availableQuantity})`
              : ""} */}
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
          />
        </div>
        <div className="d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={() => onUpdate(quantity)}
            className="self-center flex items-center gap-2"
            disabled={quantity === ""}
          >
            Submit {"  "}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditOrderContentModal;
