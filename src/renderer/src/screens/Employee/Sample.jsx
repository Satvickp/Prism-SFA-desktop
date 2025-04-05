import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { Button, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useProductHook } from "../../hooks/productsHook";
import {
  createSample,
  getAllSample,
  deleteSampleInventory,
  updateSampleInventory,
} from "../../api/sampleInventory/sampleInventory-api";
import {
  setAllSample,
  addSample,
  deleteSample,
  updateSample,
} from "../../redux/features/sampleSlice";
import Loading from "../../components/UI/Loading";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function Sample() {
  const dispatch = useDispatch();
  const { userId } = useParams();

  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const [sampleQnt, setSampleQnt] = useState();
  const [productId, setProductId] = useState();
  const [deleteData, setDeleteData] = useState(null);
  const [editData, setEditData] = useState(null);

  const Cred = useSelector((state) => state.Cred);
  const Product = useSelector((state) => state.Products);
  const AllSample = useSelector((state) => state.Samples);
  const { memberPermissions } = useSelector((state) => state.Permission);

  useProductHook();

  function handleIsModal() {
    setIsModal(!isModal);
  }

  function handleIsModalDelete() {
    setIsModalDelete(!isModalDelete);
  }

  const handleDeleteSample = async () => {
    try {
      handleIsModalDelete();
      await deleteSampleInventory(Cred.token, deleteData?.id);
      dispatch(deleteSample({ id: deleteData?.id }));
      Swal.fire({
        title: "Sample Deleted",
        text: "This Sample is deleted successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.log("Error:: ", error);
      handleIsModalDelete();
      Swal.fire("Unable to delete this Sample", "", "error");
    }
  };

  const handleUpdateSample = async () => {
    try {
      let id = editData?.id;
      let sampleQuantity = parseInt(sampleQnt, 10);

      const resp = await updateSampleInventory(Cred.token, id, sampleQuantity);
      dispatch(updateSample(resp.data));
      handleIsModal();
      setSampleQnt();
      setEditData(null);

      Swal.fire({
        title: "Success",
        text: "Sample updated successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.log("Error Updating Sample:", error);
      Swal.fire("Error", "Unable to update sample!", "warning");
    }
  };

  const handleCreateSample = async () => {
    try {
      if (!productId || !sampleQnt) {
        setIsModal(false);
        Swal.fire("Incomplete", "Please Fill The Form", "warning").finally(() =>
          setIsModal(true)
        );
        return;
      }

      const payload = {
        productId: productId ? parseInt(productId, 10) : null,
        sampleQuantity: sampleQnt ? parseInt(sampleQnt, 10) : null,
        memberId: userId ? parseInt(userId, 10) : null,
      };
      const resp = await createSample(Cred.token, payload);
      dispatch(addSample({ ...AllSample.allSample, ...resp }));
      handleIsModal();
      setSampleQnt();
      setProductId();
      Swal.fire({
        title: "Success",
        text: "Sample added successfully",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      handleIsModal();
      console.log("Error Adding Sample", error);
      Swal.fire("Error", "Unable to Add Sample!", "warning");
    }
  };

  const allSample = async () => {
    setLoading(true);
    try {
      const resp = await getAllSample(Cred.token, userId, 0);
      dispatch(
        setAllSample({
          allSample: resp.data,
          paginationData: resp.paginationData,
        })
      );
      setLoading(false);
    } catch (error) {
      Swal.fire("Something Went Wrong", "Please Try After Some Time", "error");
    }
  };

  useEffect(() => {
    allSample();
  }, []);

  const hasPermission =
    memberPermissions.includes("Super_Admin") ||
    memberPermissions.includes("Reporting_Manager") ||
    memberPermissions.includes("Manager");

  var columnT = "";
  columnT = [
    {
      name: <span className="text-wrap">PRODUCT IMAGE</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.productRes ? (
            <img
              src={row.productRes.imageUrl}
              alt="product-image"
              height={"50px"}
              width={"50px"}
            />
          ) : (
            <img
              src={"/no-image-available.png"}
              alt="product-image"
              height={"50px"}
              width={"50px"}
            />
          )}
        </span>
      ),
      sortable: true,
      //   width: "150px",
    },
    {
      name: <span className="text-wrap">PRODUCT NAME</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.productRes ? row.productRes.name : "NA"}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">SAMPLE QUANTITY</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.sampleQuantity ? row.sampleQuantity : "NA"}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">MEASUREMENT UNIT</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.productRes ? row.productRes.unitOfMeasurement : "NA"}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">BUNDLE SIZE</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.productRes ? row.productRes.bundleSize : "NA"}
        </span>
      ),
      sortable: true,
    },
  ];

  if (hasPermission) {
    columnT.push({
      name: "ACTION",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setEditData(row);
              setSampleQnt(row.sampleQuantity);
              setProductId(row.productRes.id);
              handleIsModal();
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          {/* <button
            type="button"
            onClick={() => {
              setDeleteData(row);
              handleIsModalDelete();
            }}
            className="btn btn-outline-secondary deleterow"
          >
            <i className="icofont-ui-delete text-danger"></i>
          </button> */}
        </div>
      ),
    });
  }

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl ">
          <PageHeader
            headerTitle={"Sample Inventory"}
            renderRight={() => {
              return (
                <div className="col-auto d-flex w-sm-100">
                  <Button onClick={handleIsModal}>
                    {" "}
                    <i className="icofont-plus-circle me-2 fs-6"></i>Create
                    Sample
                  </Button>
                </div>
              );
            }}
          />
          <div className="mt-4 ">
            <DataTable
              columns={columnT}
              data={AllSample.allSample}
              pagination
              paginationServer
              // paginationTotalRows={}
              paginationDefaultPage={AllSample.paginationData + 1}
              // onChangePage={}
              highlightOnHover
              responsive
            />
          </div>
          <Modal
            show={isModal}
            size="md"
            onHide={() => {
              setIsModal(false);
              setEditData(null);
              setProductId();
              setSampleQnt();
            }}
            style={{ marginTop: "5%" }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                {editData ? "Update Sample Quantity" : "Create Sample"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Select Product</label>
                <select
                  className="form-control"
                  value={productId || editData?.productId || ""}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {Product?.content
                    .filter(
                      (product) =>
                        !AllSample.allSample.some(
                          (sample) =>
                            sample.productRes?.productId ===
                              product.productId &&
                            product.productId !==
                              editData?.productRes?.productId
                        )
                    )
                    .map((item) => (
                      <option key={item.productId} value={item.productId}>
                        {item.name} ({item.sku})
                      </option>
                    ))}
                  {/* {Product?.content.map((item) => (
                    <option key={item.productId} value={item.productId}>
                      {item.name} ({item.sku})
                    </option>
                  ))} */}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Sample Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sample quantity"
                  value={
                    sampleQnt !== undefined
                      ? sampleQnt
                      : editData?.sampleQuantity || ""
                  }
                  onChange={(e) => setSampleQnt(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={editData ? handleUpdateSample : handleCreateSample}
              >
                {editData ? "Update" : "Create"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={isModalDelete}
            centered
            onHide={() => {
              setIsModalDelete(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Sample</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                You can delete this sample Permanently
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleIsModalDelete}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="btn btn-danger color-fff"
                onClick={handleDeleteSample}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default Sample;
