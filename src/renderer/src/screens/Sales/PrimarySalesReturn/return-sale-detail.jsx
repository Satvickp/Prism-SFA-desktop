import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { getOrderByOrderId } from "../../../api/order/order-api";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function ReturnSaleDetail({
  visible,
  saleData,
  onHide,
  setSaleData,
  isPrimary,
}) {
  const { state } = useLocation();
  const Cred = useSelector((state) => state.Cred);
  const fetchOrderDetails = async (orderId) => {
    setSaleData({ ...saleData, loading: true });
    try {
      const response = await getOrderByOrderId(
        orderId,
        Cred.token,
        state?.isPrimary ? "primary" : "secondary"
      );
      setSaleData({ loading: false, data: response, visible: true });
    } catch (error) {
      onHide();
      console.error("Error fetching order details:", error);
      Swal.fire("Opps!", "Can't Fetch Data, Please Try Again", "error");
    }
  };

  useEffect(() => {
    if (visible) {
      fetchOrderDetails(saleData?.data?.orderId);
    }
  }, [visible, saleData?.data?.orderId]);

  if (saleData?.loading) {
    return (
      <Modal show={visible} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Loading Sale Details...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Spinner animation="border" variant="primary" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const { data } = saleData;

  return (
    <Modal show={visible} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sale Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <strong>Product Name:</strong>{" "}
          <span>{data?.productRes?.name || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>Product SKU:</strong>{" "}
          <span>{data?.productRes?.sku || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>Quantity:</strong> <span>{data?.quantity || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>Date:</strong>{" "}
          <span>
            {new Date(data?.orderCreatedDate).toLocaleDateString() || "N/A"}
          </span>
        </div>
        <div className="mb-3">
          <strong>Status:</strong> <span>{data?.status || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>GST Amount:</strong> <span>{data?.gstAmount || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>Pre GST:</strong> <span>{data?.totalPrice || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>Post GST:</strong>{" "}
          <span>{data?.totalPriceWithGst || "N/A"}</span>
        </div>
        <div className="mb-3">
          <strong>Invoice Number:</strong>{" "}
          <span>{data?.invoiceNumber || "N/A"}</span>
        </div>
        {data?.beetRespForOrderDto && (
          <>
            <div className="mb-3">
              <strong>Beet Address:</strong>{" "}
              <span>{data?.beetRespForOrderDto?.address || "N/A"}</span>
            </div>
            <div className="mb-3">
              <strong>Beet City:</strong>{" "}
              <span>{data?.beetRespForOrderDto?.city || "N/A"}</span>
            </div>
          </>
        )}
        {data?.outletRespForOrderDto && (
          <>
            <div className="mb-3">
              <strong>Outlet Name:</strong>{" "}
              <span>{data?.outletRespForOrderDto?.outletName || "N/A"}</span>
            </div>
            <div className="mb-3">
              <strong>Outlet Type:</strong>{" "}
              <span>{data?.outletRespForOrderDto?.outletType || "N/A"}</span>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
