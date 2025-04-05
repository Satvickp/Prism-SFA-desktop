import React, { useMemo, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  updateOrderApi,
  updateOrderQuantityApi,
} from "../../../../api/order/order-api";
import { useDispatch, useSelector } from "react-redux";
import { dispatchPrimarySaleUpdateOrder } from "../../../../redux/features/order/primary-sale";
import { dispatchSecondarySalesUpdateOrder } from "../../../../redux/features/order/secondary-sale";
import { permissionIds } from "../../../../constants/constants";
import { addNewInventoryBulk } from "../../../../api/inventory/inventory-api";
import { useIsClient, useIsManager } from "../../../../helper/isManager";

const clientOptions = [{ value: "CREATED", label: "Created" }];

const managerOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "DELIVERED", label: "Delivered" },
];

function PrimarySaleUpdateModal({
  isVisible,
  setVisible,
  orderData,
  isPrimary,
  noRedux,
  onUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [remark, setRemark] = useState("");
  const Cred = useSelector((state) => state.Cred);
  const isMember = window.localStorage.getItem("isMember");
  const [quantity, setQuantity] = useState(orderData?.quantity ?? "");
  const isClient = useIsClient();
  const dispatch = useDispatch();
  const isManager = useIsManager();
  const handleClose = () => setVisible(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      const newQuantity = quantity
        ? orderData.bundleType == "Cases"
          ? quantity * (orderData.productRes.bundleSize ?? 0)
          : quantity
        : quantity;
      console.clear();
      const updateResp = isClient
        ? await updateOrderQuantityApi(
            orderData.orderId,
            orderStatus?.value ?? orderData.status,
            "",
            Cred.token,
            newQuantity
          )
        : await updateOrderApi(
            orderData.orderId,
            orderStatus?.value ?? orderData.status,
            remark,
            Cred.token,
            newQuantity
          );
      if (orderStatus?.value === "DELIVERED") {
        const refinedInventoryList = [
          {
            productId: orderData.productId,
            quantity: newQuantity,
            updateAt: "",
            salesLevel: isPrimary ? "WAREHOUSE" : "STOCKIST",
            clientId: orderData.clientId,
          },
        ];
        await addNewInventoryBulk(
          { inventoryRequestList: refinedInventoryList },
          Cred.token
        );
      }
      if (noRedux) {
        onUpdate?.(updateResp);
      } else {
        dispatch(
          isPrimary
            ? dispatchPrimarySaleUpdateOrder(updateResp)
            : dispatchSecondarySalesUpdateOrder(updateResp)
        );
      }

      setVisible(false);
      Swal.fire("Successfully", "Order Updated", "success");
    } catch (error) {
      let orderDataRef = { ...orderData };
      setVisible(null);
      Swal.fire({
        title: "Something Went Wrong",
        text: "Order Can't Be Edited",
        icon: "warning",
      }).finally(() => setVisible(orderDataRef));
      console.log(error);
    }
    setLoading(false);
  };
  const disableButton = useMemo(() => {
    return Boolean(
      !isClient
        ? (remark || orderStatus) &&
            (orderStatus?.value === "PENDING" ? remark : true)
        : orderStatus && quantity
    );
  }, [isClient, remark, orderStatus, quantity]);
  const refresh = useMemo(() => {
    if (orderData && !isClient) {
      setOrderStatus(managerOptions.find((e) => e.value === orderData.status));
    }
    setQuantity(
      orderData?.quantity
        ? orderData.bundleType === "Cases"
          ? orderData?.quantity / orderData?.productRes?.bundleSize
          : orderData?.quantity
        : ""
    );
    setRemark(orderData ? orderData.remarks : "");
    setLoading(false);
  }, [isVisible, orderData]);
  console.log(refresh);
  return (
    <Modal show={isVisible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Sale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Select
              options={
                JSON.parse(isMember)
                  ? isManager
                    ? managerOptions
                    : []
                  : clientOptions
              }
              value={orderStatus}
              isSearchable
              placeholder="Select Status"
              onChange={setOrderStatus}
            />
          </Form.Group>
          {!isClient && orderStatus?.value === "PENDING" && (
            <Form.Group className="mb-3">
              <Form.Label htmlFor="remark">Remark</Form.Label>
              <Form.Control
                id="remark"
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter remark here"
                as="input"
                size="sm"
              />
            </Form.Group>
          )}
          {isClient && (
            <Form.Group className="mb-3">
              <Form.Label htmlFor="remark">Quantity </Form.Label>
              <Form.Control
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  !isNaN(e.target.value) && setQuantity(e.target.value)
                }
                placeholder="Enter Quantity"
                as="input"
                size="sm"
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={loading || !disableButton}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
            />
          ) : orderStatus === null ? (
            "Please Select"
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button variant="secondary" onClick={() => setVisible(null)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PrimarySaleUpdateModal;
