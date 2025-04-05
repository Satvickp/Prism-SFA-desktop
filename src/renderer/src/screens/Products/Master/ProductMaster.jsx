import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast } from "react-bootstrap";
import PageHeader from "../../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import ProductModal from "./form/Modal";
import { permissionIds } from "../../../constants/constants";
import Loading from "../../../components/UI/Loading";
import ModalLoader from "../../UIComponents/ModalLoader";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import {
  deleteProducts,
  setProducts,
} from "../../../redux/features/productsSlice";
import {
  deleteProduct,
  getAllProducts,
} from "../../../api/products/products-api";
import ProductPriceModal from "./form/ModalPrice";
import { customStyles } from "../../../constants/customStyles";
import { useProductHook } from "../../../hooks/productsHook";
function ProductMaster() {
  const [isModal, setIsModal] = useState(false);
  const [isPriceModal, setIsPriceModal] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // data store variable
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [fetchMessage, setFetchMessage] = useState("");

  // redux selectors
  const dispatch = useDispatch();
  const Product = useSelector((state) => state.Products);
  const Cred = useSelector((state) => state.Cred);
  const { memberPermissions } = useSelector((state) => state.Permission);

  const [modalLoader, setModalLoader] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [buttonLoader, setButtonLoader] = useState({
    getDropDowns: false,
    addProduct: false,
  });
  const [length, setLength] = useState(0);

  // const [page, setPage] = useState(0);
  // const [size, setSize] = useState(10);

  // hooks
  const {
    getAllProduct,
    isError,
    isLoading,
    page,
    setNewPage,
    setNewSize,
    size,
  } = useProductHook();

  // modal change function
  function handleIsModalDelete() {
    setIsModalDelete(!isModalDelete);
  }
  function handleIsModal() {
    setIsModal(!isModal);
  }
  function handleIsPriceModal() {
    setIsPriceModal(!isPriceModal);
  }

  const handlePageChange = async (NextPage) => {
    if (
      // Holiday.paginationData.totalPages - 1 == Holiday.paginationData.number ||
      // Holiday.paginationData.number > Holiday.paginationData.totalPages
      console.log(NextPage)
    ) {
      return;
    }

    try {
      // const resp = await getAllHolidays(
      //   Cred.token,
      //   Holiday.paginationData.number + 1
      // );
      // Dispatch(concatHoliday({
      //     allHoliday: resp.data,
      //     paginationData: resp.paginationData,
      //   }));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Fetch More Data");
    }
  };

  // var columnsT = "";

  const columnsT = [
    {
      name: <span className="text-wrap">PRODUCT IMAGE</span>,
      selector: (row) => (
        <span className="text-wrap">
          <img
            src={row.imageUrl ? row.imageUrl : "/no-image-available.png"}
            alt="product-image"
            height="50px"
            width="50px"
            style={{ borderRadius: "50%" }} 
          />
        </span>
      ),
      sortable: false,
      width: "90px", 
    },
    {
      name: <span className="text-wrap">PRODUCT</span>,
      selector: (row) => <span className="text-wrap">{row.name || "NA"}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="text-wrap">PRODUCT CODE</span>,
      selector: (row) => <span className="text-wrap">{row.productCode || "NA"}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="text-wrap">SKU</span>,
      selector: (row) => <span className="text-wrap">{row.sku || "NA"}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="text-wrap">UNIT</span>,
      selector: (row) => <span className="text-wrap">{row.unitOfMeasurement || "NA"}</span>,
      sortable: true,
      width: "90px",
    },
    {
      name: <span className="text-wrap">BUNDLE</span>,
      selector: (row) => <span className="text-wrap">{row.bundleSize || "NA"}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">GST (%)</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.productPriceRes ? row.productPriceRes.gstPercentage + " %" : "NA"}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">RETAILER (₹)</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.productPriceRes ? "₹ " + row.productPriceRes.retailerPrice : "NA"}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">STOCKIST (₹)</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.productPriceRes ? "₹ " + row.productPriceRes.stockListPrice : "NA"}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">WAREHOUSE (₹)</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.productPriceRes ? "₹ " + row.productPriceRes.warehousePrice : "NA"}
        </span>
      ),
      sortable: true,
      width: "150px",
      Text:'center'
    },
  ];

  var actionColumnsT = "";

  actionColumnsT = [
    {
      name: "ACTION",
      selector: () => {},
      sortable: true,
      width:"150px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {memberPermissions.some(
            (item) =>
              item == permissionIds.SUPER_ADMIN ||
              item == permissionIds.REPORTING_MANAGER
              // || item == permissionIds.CREATE_MANAGER
          ) && (
            <div className="d-flex text-center">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setEditData(row);
                  handleIsModal();
                }}
              >
                <i className="icofont-edit text-success"></i>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteData(row);
                  handleIsModalDelete();
                }}
                className="btn btn-outline-secondary deleterow"
              >
                <i className="icofont-ui-delete text-danger"></i>
              </button>
            </div>
          )}
        </div>
      ),
      width:"100px"
    },
  ];

  const handleDeleteProduct = async () => {
    console.log("Delete data", deleteData);
    try {
      handleIsModalDelete();
      await deleteProduct(Cred.token, deleteData.productId);
      dispatch(deleteProducts({ id: deleteData.productId }));
      Swal.fire(
        "Product Deleted",
        "This Product is deleted successfully",
        "success"
      );
    } catch (error) {
      console.log("Error:: ", error);
      handleIsModalDelete();
      Swal.fire("Unable to delete this product", "", "error");
    }
  };

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Products"
            renderRight={() => {
              return (
                <div className="col-auto d-flex gap-3">
                  {(memberPermissions.some(
                    (item) => 
                      item == permissionIds.SUPER_ADMIN ||
                      item == permissionIds.REPORTING_MANAGER
                  )) && (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleIsModal}
                        className="btn btn-primary"
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
                        Create Product
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleIsPriceModal}
                        className="btn btn-primary"
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
                        Add Price
                      </Button>
                    </>
                  )}
                </div>
              );
            }}
          />
          <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-1 row-cols-xl-1 row-cols-xxl-1 row-deck py-1 pb-4">
            {/* add filters here */}

            {Product.content.length > 0 ? (
              <div className="row clearfix ">
                <div className="card">
                  <div className="card-body">
                    <DataTable
                      columns={(memberPermissions.some((item) => 
                          item == permissionIds.SUPER_ADMIN ||
                          item == permissionIds.REPORTING_MANAGER
                      )) ? [...columnsT, ...actionColumnsT] : columnsT}
                      title={Product.content.name}
                      onChangePage={handlePageChange}
                      data={Product.content}
                      defaultSortField="title"
                      pagination
                      selectableRows={false}
                      // className="table myDataTable table-hover align-middle mb-0 d-row dataTable no-footer dtr-inline" // Removed "nowrap"
                      highlightOnHover={true}
                      dense
                      customStyles={customStyles}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="background-color: #3498db; color: #fff; text-align: center; padding: 10px;">
                <p className="font-size: 18px; font-weight: bold;">
                  No More Products To Load.
                </p>
              </div>
            )}
          </div>

          <Modal
            size="md"
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false);
            }}
          >
            <Modal.Header
              closeButton
              show={isModal}
              onHide={() => {
                handleIsModal();
                setEditData(null);
              }}
            >
              <Modal.Title className="fw-bold">
                {editData ? "Edit Product" : "Create Product"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProductModal handleIsModal={handleIsModal} editData={editData} />
            </Modal.Body>
          </Modal>

          <Modal
            size="md"
            centered
            show={isPriceModal}
            onHide={() => {
              setIsPriceModal(false);
            }}
          >
            <Modal.Header
              closeButton
              show={isPriceModal}
              onHide={() => {
                handleIsPriceModal();
                // setEditData(null);
              }}
            >
              <Modal.Title className="fw-bold">Add Price</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProductPriceModal
                handleIsModal={handleIsPriceModal}
                editData={null}
              />
            </Modal.Body>
          </Modal>

          <Modal
            show={isModalDelete}
            centered
            onHide={() => {
              setIsModalDelete(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Product</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                You can delete this item Permanently
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
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <ModalLoader message={fetchMessage} show={modalLoader} />

          {/* {Product.paginationData.totalPages &&
            (Product.paginationData.totalPages - 1 > Product.paginationData.page) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    // onEndReach();
                    setLength(length - 10);
                  }}
                  style={{ width: "200px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontSize: 18, marginBottom: -2 }}>Load More</p>
                    {loadMore && (
                      <Spinner
                        animation="border"
                        size="sm"
                        style={{ marginLeft: "10px" }}
                      />
                    )}
                  </div>
                </Button>
              </div>
            )} */}

          <div>
            <Toast show={showToast} onClose={() => setShowToast(false)}>
              <Toast.Header>
                <strong className="mr-auto">No More Product's to load</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      )}{" "}
    </>
  );
}

export default ProductMaster;
