import React, { useState } from "react";
import DatePicker from "react-datepicker";

import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Loading from "../../components/UI/Loading";
import PageHeader from "../../components/common/PageHeader";
import ModalLoader from "../UIComponents/ModalLoader";
import { customStyles } from "../../constants/customStyles";
import Swal from "sweetalert2";
import { useDiscountHook } from "../../hooks/discountMasterHook";
import { getDateFormat } from "../../helper/date-functions";
// import TimePicker from "react-time-picker";
// import TimePicker from 'rc-time-picker';
// import TimePicker from 'react-bootstrap-time-picker';

function DiscountMaster() {
  const Cred = useSelector((state) => state.Cred);
  const Discount = useSelector((state) => state.Discount.allDiscount);

  const [isModal, setIsModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    discountCode: "",
    discountType: "",
    percentage: null,
    fixedAmount: null,
    description: "",
    product: "",
    status: "",
    selectedProduct: "",
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date().toISOString().split("T")[0],
    minQuantity: null,
    bogoOfferQty: null,
    bogoFreeQty: null,
  });

  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [fetchMessage, setFetchMessage] = useState("");

  const {
    getAllDiscountCode,
    addDiscountCode,
    deleteDiscountCode,
    updateDiscountCode,
  } = useDiscountHook();

  const [modalLoader, setModalLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
  });

  function handleIsModalDelete() {
    setIsModalDelete(!isModalDelete);
  }

  function handleIsModalEdit() {
    setIsModalEdit(!isModalEdit);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name, jsDate) => {
    setFormData((prev) => ({
      ...prev,
      [name]: jsDate.toISOString().split("T")[0], // Convert Date object to YYYY-MM-DD
    }));
  };

  function handleIsModal() {
    setIsModal(!isModal);
  }

  function getStatusBadge(status) {
    if (status == "Active") {
      return <Badge bg="success">Active</Badge>;
    } else {
      return <Badge bg="danger">Inactive</Badge>;
    }
  }

  const columnsT = [
    {
      name: <span className="text-wrap">DISCOUNT CODE</span>,
      sortable: false,
      cell: (row) => <span>{row.discountCode || "NA"}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">DESCRIPTION</span>,
      sortable: true,
      cell: (row) => <span>{row.description || "NA"}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">PERCENTAGE</span>,
      sortable: true,
      cell: (row) => <span>{row.percentage || "NA"}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">FIXED DISCOUNT</span>,
      sortable: true,
      cell: (row) => <span>{row?.fixedAmount || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">DISCOUNT TYPE</span>,
      sortable: true,
      cell: (row) => <span>{row?.discountType || "NA"}</span>,
      width: "140px",
    },
    {
      name: <span className="text-wrap">VALID FROM</span>,
      sortable: true,
      cell: (row) => (
        <span>{row?.percentage ? getDateFormat(row.percentage) : "NA"}</span>
      ),
    },
    {
      name: <span className="text-wrap">VALID TO</span>,
      sortable: true,
      cell: (row) => (
        <span>{row?.validTo ? getDateFormat(row.validTo) : "NA"}</span>
      ),
    },
    {
      name: <span className="text-wrap">MIN QTY.</span>,
      sortable: true,
      cell: (row) => <span>{row?.minQuantity || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">BOGO OFFER QTY.</span>,
      sortable: true,
      cell: (row) => <span>{row?.bogoOfferQuantity || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">PRODUCT</span>,
      sortable: true,
      cell: (row) => <span>{row?.productName || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">BOGO FREE QTY.</span>,
      sortable: true,
      cell: (row) => <span>{row?.bogoFreeQuantity || "NA"}</span>,
    },
    {
      name: <span className="text-wrap">STATUS</span>,
      sortable: true,
      cell: (row) => (
        <span>{row?.status ? getStatusBadge(row.status) : "NA"}</span>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Discount Master"
            renderRight={() => (
              <div className="col-auto d-flex">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleIsModal();
                  }}
                  disabled={buttonLoader.getDropDowns}
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
                  Create Discount
                </Button>
              </div>
            )}
          />
          <div className="row g-3 py-1 pb-4">
            {Discount?.length > 0 ? (
              <div className="row clearfix g-3">
                <div className="card">
                  <div className="card-body">
                    <DataTable
                      columns={columnsT}
                      title="Discount Master"
                      data={Discount}
                      defaultSortField="title"
                      pagination={true}
                      selectableRows={false}
                      highlightOnHover
                      dense
                      striped
                      customStyles={customStyles}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info text-center">
                No More Discount To Load.
              </div>
            )}
          </div>

          <Modal
            centered
            show={isModal}
            onHide={() => setIsModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Create Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Discount Code<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="discountCode"
                          placeholder="Discount Code"
                          value={formData.discountCode}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Discount Type<span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="discountType"
                          value={formData.discountType}
                          onChange={handleChange}
                        >
                          <option value="">Select Discount Type</option>
                          {[
                            "PROMOTIONAL",
                            "QUANTITY_BASED",
                            "SEASONAL",
                            "BOGO",
                            "VOLUME_BASED",
                            "LOYALTY",
                          ].map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-12 mb-3">
                        <label className="form-label">
                          Description<span className="text-danger">*</span>
                        </label>
                        <textarea
                          type="text"
                          className="form-control"
                          name="description"
                          placeholder=""
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Status<span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="">Select Status</option>
                          {["Active", "Inactive"].map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Product<span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="selectedProduct"
                          value={formData.selectedProduct}
                          onChange={handleChange}
                        >
                          <option value="">Select Product</option>
                          {["Product 1", "Product 2"].map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Valid From</label>
                        <div className="w-100">
                          <DatePicker
                            selected={formData.validFrom}
                            onChange={(date) =>
                              handleDateChange("validFrom", date)
                            }
                            className="form-control w-100"
                            wrapperClassName="w-100"
                            dateFormat="dd-MM-yyyy"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Valid To</label>
                        <div className="w-100">
                          <DatePicker
                            selected={formData.validTo}
                            onChange={(date) =>
                              handleDateChange("validTo", date)
                            }
                            className="form-control w-100"
                            wrapperClassName="w-100"
                            dateFormat="dd-MM-yyyy"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 mb-3">
                        <label className="form-label">
                          Minimum Quantity<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="minQuantity"
                          placeholder="Minimum Quantity"
                          value={formData.minQuantity}
                          onChange={handleChange}
                          min="0"
                        />
                      </div>

                      {formData.discountType !== "BOGO" && (
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Percentage<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="percentage"
                            placeholder="Percentage"
                            value={formData.percentage}
                            onChange={handleChange}
                            min="0"
                          />
                        </div>
                      )}

                      {(formData.discountType === "QUANTITY_BASED" ||
                        formData.discountType === "BOGO" ||
                        formData.discountType === "VOLUME_BASED") && (
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Fixed Amount<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="fixedAmount"
                            placeholder="Fixed Amount"
                            value={formData.fixedAmount}
                            onChange={handleChange}
                            min="0"
                          />
                        </div>
                      )}

                      {formData.discountType === "BOGO" && (
                        <>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">
                              BOGO Offer Quantity
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="bogoOfferQty"
                              placeholder="BOGO Offer Quantity"
                              value={formData.bogoOfferQty}
                              onChange={handleChange}
                              min="0"
                            />
                          </div>

                          <div className="col-lg-6 mb-3">
                            <label className="form-label">
                              BOGO Free Quantity
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="bogoFreeQty"
                              placeholder="BOGO Free Quantity"
                              value={formData.bogoFreeQty}
                              onChange={handleChange}
                              min="0"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  if (
                    !formData.selectedProduct ||
                    !formData.discountCode ||
                    !formData.fixedAmount ||
                    !formData.status ||
                    !formData.validFrom ||
                    !formData.validTo
                  ) {
                    setIsModal(false);

                    Swal.fire({
                      title: "Incompleted Data",
                      text: "Kindly fill all the fields before creating Discount",
                      icon: "warning",
                      timer: 2000,
                      didClose: () => {
                        setIsModal(true);
                      },
                    });
                    return;
                  }

                  console.log("Payload :", formData);
                }}
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Create
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            centered
            show={isModalEdit}
            onHide={() => setIsModalEdit(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Edit Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Designation Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Region Name"
                  // onChange={(e) => setDesignationNames(e.target.value)}
                  // value={designationNames}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  // updateDesignationMaster({ designationName: 'designationNames', id: editData.id },handleIsModalEdit)
                  console.log("edit discount")
                }
              >
                {buttonLoader.getDropDowns && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                )}
                Update
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={isModalDelete}
            centered
            onHide={() => setIsModalDelete(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <i className="icofont-ui-delete text-danger display-2 mt-2"></i>
              <p className="mt-4 fs-5">This action is irreversible.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleIsModalDelete}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  console.log("delete data :", deleteData);
                  // deleteDesignationMaster(deleteData?.id, handleIsModalDelete);
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <ModalLoader message={fetchMessage} show={modalLoader} />
        </div>
      )}
    </>
  );
}

export default DiscountMaster;
