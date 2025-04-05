import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Button, FormCheck, Modal, Spinner } from "react-bootstrap";
import { getAllProducts } from "../../../../api/products/products-api";
import {
  addNewInventoryBulk,
  getAllInventoryWithProductAndClientFilter,
  getInventory,
  UpdateInventoryBulk,
} from "../../../../api/inventory/inventory-api";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import debounce from "lodash.debounce";
import { truncateString } from "../../../../helper/exportFunction";
import {
  getAllBeetByFmcgClient,
  getAllBeetWithoutFilter,
} from "../../../../api/beet/beet-api";
import Select from "react-select";
import {
  createBulkOrderApi,
  updateOrderBulkApi,
} from "../../../../api/order/order-api";
import { dispatchPrimarySalesAddOrder } from "../../../../redux/features/order/primary-sale";
import { dispatchSecondarySalesAddOrder } from "../../../../redux/features/order/secondary-sale";
import {
  concatProducts,
  setProducts,
} from "../../../../redux/features/productsSlice";
import {
  dispatchBeetPaginatedOrder,
  dispatchBeetSetOrder,
} from "../../../../redux/features/order/beet-slice";
import DataTable from "react-data-table-component";
import EditOrderContentModal from "./edit-order-pop";
import { addCredentials } from "../../../../redux/features/credentialSlice";
import "./index.css";
import {
  getAllClients,
  getAllClientsByReportingManager,
} from "../../../../api/clients/clientfmcg-api";
import { useIsClient } from "../../../../helper/isManager";
import {
  concatClientsFMCG,
  setClientsFMCG,
} from "../../../../redux/features/clientFMCGSlice";
function PrimarySalesModal({ handleIsModal, isOpen, isPrimary }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedBeatId, setSelectedBeatId] = useState("");
  const [selectedOutletId, setSelectedOutletId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingBeats, setLoadingBeats] = useState(false);
  const Cred = useSelector((state) => state.Cred);
  const products = useSelector((state) => state.Products.content);
  const productsPaginationData = useSelector(
    (state) => state.Products.paginationData
  );
  const [isFormActive, setFormActive] = useState(false);
  const beets = useSelector((state) => state.orderBeetSlice.content);
  const isClient = useIsClient();
  const beetsPaginationData = useSelector((state) => state.orderBeetSlice);
  const dispatch = useDispatch();
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const isBeetLoadMoreErrorRef = useRef(false);
  const [orderList, setOrderList] = useState([]);
  const [editOrderData, setEditOrderData] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [bundleType, setBundleType] = useState("Cases");
  const [searchClientCode, setClientCode] = useState("");
  const [clientLoading, setClientLoading] = useState(false);
  const [_, setAllClients] = useState([]);
  const allClients = useSelector((state) => state.ClientFMCG.allClients);
  const [invProducts, setInvProducts] = useState([]);
  const [invProductPaginationData, setInvProductPaginationData] = useState({
    totalElements: 0,
    totalPages: 1,
    page: 0,
  });
  const clientPaginatedData = useSelector(
    (state) => state.ClientFMCG.paginationData
  );
  const getProduct = useCallback(
    (_productId) =>
      products.find((_prod) => _prod.productId === parseInt(_productId)),
    [products]
  );

  const orderListCol = useMemo(
    () => [
      {
        name: "S.NO",
        selector: (_, index) => index + 1,
        sortable: true,
        width: "80px",
        center: true,
      },
      {
        name: "Product",
        selector: (row) =>
          truncateString(
            `${row?.product?.name || ""} (${row?.product?.sku || ""})`,
            100
          ),
        sortable: true,
        left: true,
        width: "350px",
      },
      {
        name: "Quantity",
        selector: (row) =>
          row.bundleType === "Cases"
            ? row.quantity / (row.product.bundleSize ?? 0)
            : row.quantity,
        sortable: true,
        center: true,
      },
      {
        name: "Price",
        selector: (row) => getPrice(row),
        sortable: true,
        center: true,
      },
      {
        name: "ACTION",
        cell: (row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn"
              onClick={() => handleEditOrder(row)}
            >
              <i className="icofont-edit text-success"></i>
            </button>
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                handleOrderListDelete(row._id);
              }}
            >
              <i className="icofont-ui-delete text-danger"></i>
            </button>
          </div>
        ),
        center: true,
      },
    ],
    [orderList]
  );

  const getPrice = useCallback(
    (orderData) =>
      isPrimary
        ? orderData.product.productPriceRes.warehousePrice * orderData.quantity
        : orderData.product.productPriceRes.stockListPrice * orderData.quantity,
    [orderListCol]
  );

  const handleEditOrder = (row) => {
    setEditOrderData(row);
  };

  const handleOrderListDelete = (id) =>
    setOrderList(orderList.filter((ord) => ord._id != id));

  const loadDraftOrder = () => {
    const orderUnParse = window.localStorage.getItem(
      isPrimary ? "primary-sale-draft" : "secondary-sale-draft"
    );

    if (orderUnParse != null) {
      const orderParsed = JSON.parse(orderUnParse);
      setOrderList(Array.isArray(orderParsed) ? orderParsed : []);
    }
  };

  const loadInvProducts = useCallback(
    async (page) => {
      console.clear();
      console.log(page);
      if (
        loadingProducts ||
        invProductPaginationData.page > invProductPaginationData.totalPages
      )
        return;
      setLoadingProducts(true);
      try {
        const newProducts = await getAllInventoryWithProductAndClientFilter(
          isClient ? Cred.sub : selectedOutletId.clientId,
          page,
          100,
          Cred.token
        );
        if (page <= 0) {
          console.clear();
          setInvProducts(newProducts.content.map((e) => e.productRes));
          setInvProductPaginationData({
            totalElements: newProducts.totalElements,
            totalPages: newProducts.totalPages,
            page: newProducts.page,
          });
        } else {
          setInvProducts([
            ...invProducts,
            ...newProducts.content.map((e) => e.productRes),
          ]);
          setInvProductPaginationData({
            totalElements: newProducts.totalElements,
            totalPages: newProducts.totalPages,
            page: newProducts.page,
          });
        }
      } catch (error) {
        handleIsModal(false);
        Swal.fire({
          icon: "error",
          title: "Error loading products",
          text: "Failed to load products. Would you like to retry?",
          showCancelButton: true,
          confirmButtonText: "Retry",
        }).then((result) => {
          if (result.isConfirmed) {
            handleIsModal(true);
            loadInvProducts(page);
          }
        });
      }
      setLoadingProducts(false);
    },
    [loadingProducts, invProducts, invProductPaginationData]
  );
  const loadProducts = useCallback(
    async (page) => {
      console.clear();
      console.log(page);
      if (
        loadingProducts ||
        productsPaginationData.page > productsPaginationData.totalPages
      )
        return;
      setLoadingProducts(true);
      try {
        const newProducts = await getAllProducts(Cred.token, page, 300);
        if (page <= 0) {
          dispatch(setProducts(newProducts));
        } else {
          let dispatchPayload = {
            content: newProducts.content,
            paginationData: {
              page: page,
              totalPages: newProducts.totalPages,
              totalElements: newProducts.totalElements,
            },
          };
          dispatch(concatProducts(dispatchPayload));
        }
      } catch (error) {
        handleIsModal(false);
        Swal.fire({
          icon: "error",
          title: "Error loading products",
          text: "Failed to load products. Would you like to retry?",
          showCancelButton: true,
          confirmButtonText: "Retry",
        }).then((result) => {
          if (result.isConfirmed) {
            handleIsModal(true);
            loadProducts(page);
          }
        });
      }
      setLoadingProducts(false);
    },
    [loadingProducts, products]
  );
  const loadBeats = useCallback(
    async (page) => {
      if (
        loadingBeats ||
        beetsPaginationData.page > beetsPaginationData.totalPages
      )
        return;
      setLoadingBeats(true);
      try {
        const newBeats = await getAllBeetByFmcgClient(
          Cred.token,
          page,
          10,
          Cred.id
        );
        if (page <= 0) {
          dispatch(dispatchBeetSetOrder(newBeats));
        } else {
          dispatch(dispatchBeetPaginatedOrder(newBeats));
        }
      } catch (error) {
        console.log(error);
        isBeetLoadMoreErrorRef.current = true;
      }
      setLoadingBeats(false);
    },
    [Cred.token, loadingBeats, beets]
  );

  const loadClient = useCallback(
    async (page) => {
      if (
        clientLoading ||
        clientPaginatedData.page > clientPaginatedData.totalPages
      )
        return;
      setClientLoading(true);
      try {
        let resp = await getAllClientsByReportingManager(
          Cred.token,
          0,
          Cred.sub
        );
        if (page <= 0) {
          dispatch(
            setClientsFMCG({
              allClients: resp.data,
              paginationData: resp.paginationData,
            })
          );
        } else {
          dispatch(
            concatClientsFMCG({
              allClients: resp.data,
              paginationData: resp.paginationData,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
      setClientLoading(false);
    },
    [Cred.token, clientLoading, allClients, clientPaginatedData]
  );

  useEffect(() => {
    setSearchText("");
    setClientCode("");
    setAddProduct(false);
    setSelectedClientId("");
    setSelectedBeatId("");
    setFormActive(false);
    setOrderList([]);
    setSelectedOutletId("");
    setSelectedProductId("");
    if (!isOpen) return;

    loadDraftOrder();
    if (products.length <= 0) {
      loadProducts(0);
    }

    if (!isPrimary && invProducts.length <= 0) {
      loadInvProducts(0);
    }

    if (beets.length <= 0 && !isPrimary) {
      loadBeats(0);
    }
    if (allClients.length <= 0 && !isClient) {
      loadClient(0);
    }
  }, [isOpen]);

  const handleProductScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      (isPrimary
        ? productsPaginationData.page < productsPaginationData.totalPages - 1
        : invProductPaginationData.page <
          invProductPaginationData.totalPages - 1)
    ) {
      isPrimary
        ? loadProducts(productsPaginationData.page + 1)
        : loadInvProducts(invProductPaginationData.page + 1);
    }
  };

  const handleBeatScroll = (e) => {
    if (isBeetLoadMoreErrorRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      beetsPaginationData.page < beetsPaginationData.totalPages - 1
    ) {
      loadBeats(beetsPaginationData.page + 1);
    }
  };

  const handleClientScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 100 &&
      clientPaginatedData.page < clientPaginatedData.totalPages - 1
    ) {
      loadClient(clientPaginatedData.page + 1);
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    if (productId) {
      debouncedFetchInventory(productId);
    } else {
      setAvailableQuantity(0);
    }
  };

  const handleBeatChange = (e) => {
    const beatId = e.target.value;
    setSelectedBeatId(beatId);
    setSelectedOutletId("");
  };
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);
  };

  const fetchInventory = async (productId) => {
    if (!productId || isPrimary) return;
    const inventory = await getInventory(Cred.token, productId, Cred.sub).catch(
      (e) => {}
    );
    setAvailableQuantity(inventory != undefined ? inventory.quantity : 0);
  };

  const debouncedFetchInventory = useCallback(
    debounce(fetchInventory, 500),
    []
  );

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
  };

  const handleOutletChange = (selectedOption) => {
    setSelectedOutletId(selectedOption ? selectedOption.value : "");
  };

  const getOutletsForSelectedBeat = () => {
    const beat = beets.find((b) => b.id == selectedBeatId);
    return beat
      ? beat.outlets.map((outlet) => ({
          value: outlet.id,
          label: outlet.outletName,
        }))
      : [];
  };

  const isPrimarySaleFormDisable = !isClient && !isFormActive && isPrimary;

  const handleOnAdd = (e) => {
    e.preventDefault();
    let missingFields = [];
    if (!selectedProductId) missingFields.push("Product");
    if (!isClient && !selectedClientId) missingFields.push("Client");
    if (!isPrimary && !selectedBeatId) missingFields.push("Beat");
    if (!quantity || isNaN(quantity)) missingFields.push("Quantity");
    if (!isPrimary && !selectedOutletId) missingFields.push("Outlet");
    if (missingFields.length > 0) {
      return;
    }
    try {
      let productData = getProduct(selectedProductId);
      let payload = {
        productId: selectedProductId,
        quantity:
          bundleType == "Cases"
            ? quantity * (productData.bundleSize ?? 0)
            : quantity,
        salesLevel: isPrimary ? "WAREHOUSE" : "STOCKIST",
        clientId: isClient ? Cred.id : selectedClientId,
        memberId: isClient ? Cred.memberId : Cred.id,
        outletId: selectedOutletId,
        beetId: selectedBeatId,
        _id: orderList.length + 1 + Date.now(),
        availableQuantity: availableQuantity,
        product: productData,
        bundleType,
      };

      const isExist = orderList.findIndex(
        (or) => or.productId === payload.productId
      );

      if (isExist != -1) {
        let newOrderList = [...orderList];
        newOrderList[isExist].quantity =
          parseInt(payload.quantity) + parseInt(newOrderList[isExist].quantity);
        setOrderList(newOrderList);
      } else {
        setOrderList([payload, ...orderList]);
      }

      setSelectedProductId("");
      setQuantity("");
      setAvailableQuantity(0);
      setSearchText("");
    } catch (error) {
      handleIsModal(false);
      Swal.fire({
        title: "Opps! Sale Not Added",
        text: "Please try again " + (error?.response?.data?.message ?? ""),
      }).finally(() => handleIsModal(true));
    }
  };

  const handleSave = () => {
    window.localStorage.setItem(
      isPrimary
        ? "primary-sale-draft"
        : `secondary-sale-draft-${selectedOutletId}`,
      JSON.stringify(orderList)
    );

    handleIsModal(false);
    resetField();
  };

  const resetField = () => {
    setSelectedBeatId("");
    setSelectedOutletId("");
    setQuantity("");
    setSelectedProductId("");
    setOrderList([]);
    setEditOrderData(null);
    setAddProduct(false);
    setSearchText("");
  };

  const handleOnSubmit = async () => {
    setSubmitButtonLoader(true);
    try {
      const refinedOrderList = orderList.map((or) => ({
        productId: or.productId,
        quantity: or.quantity,
        salesLevel: or.salesLevel,
        clientId: or.clientId,
        beetId: or.beetId,
        outletId: or.outletId,
        memberId: or.memberId,
        bundleType: or.bundleType,
      }));
      const orderCreateResp = await createBulkOrderApi(
        isPrimary ? "primary" : "secondary",
        { orderRequestList: refinedOrderList },
        Cred.token
      );
      if (isPrimary) {
      } else {
        const refinedUpdateInventoryList = refinedOrderList.map((ord) => ({
          salesLevel: "WAREHOUSE",
          productId: ord.productId,
          quantitySold: ord.quantity,
          clientId: ord.clientId,
        }));
        await UpdateInventoryBulk(
          {
            updateRequestList: refinedUpdateInventoryList,
          },
          Cred.token
        );
      }
      const refinedOrderUpdateList = orderCreateResp.map((or) => ({
        orderId: or.orderId,
        status: isPrimary ? "CREATED" : "DELIVERED",
      }));
      await updateOrderBulkApi(Cred.token, {
        orderUpdateRequests: refinedOrderUpdateList,
      });
      let dispatchPayload = {
        invoiceNumber: orderCreateResp[0].invoiceNumber,
        orderResponseList: orderCreateResp,
      };
      if (isPrimary) {
        dispatch(dispatchPrimarySalesAddOrder(dispatchPayload));
      } else {
        dispatch(dispatchSecondarySalesAddOrder(dispatchPayload));
      }
      dispatch(
        addCredentials({
          topUpBalance: orderCreateResp[0].clientBalanceAmount,
        })
      );
      handleIsModal(false);
    } catch (error) {
      handleIsModal(false);
      Swal.fire({
        title: "Opps! Sale Not Added",
        text: "Please try again " + (error?.response?.data?.message ?? ""),
      }).finally(() => handleIsModal(true));
    }
    setSubmitButtonLoader(false);
  };

  const totalPrice = useMemo(() => {
    return orderList.reduce((sum, row) => sum + getPrice(row), 0);
  }, [orderList]);

  const getProductList = useMemo(() => {
    return (isPrimary ? products : invProducts)?.filter((prod) => {
      return orderList.findIndex((or) => or.productId == prod.productId) == -1;
    });
  }, [orderList, products, invProducts, isPrimary]);

  const filteredProductList = useMemo(() => {
    return getProductList.filter(
      (prod) =>
        prod.name.toLowerCase().includes(searchText.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [
    getProductList,
    searchText,
    isPrimary,
    invProducts,
    invProductPaginationData,
  ]);

  const filterClientList = useMemo(() => {
    return searchClientCode === ""
      ? allClients
      : allClients.filter((client) =>
          client.clientCode
            .toLowerCase()
            .includes(searchClientCode.toLowerCase())
        );
  }, [allClients, searchClientCode]);

  return (
    <Modal
      size="xl"
      centered
      show={isOpen}
      onHide={() => {
        handleIsModal(false);
        resetField();
      }}
      contentClassName="model-custom"
    >
      <Modal.Header closeButton show={isOpen}>
        <Modal.Title className="fw-bold">
          {isPrimary ? "Add Primary Sales" : "Add Secondary Sales"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          {!isPrimary && (
            <>
              <strong className="">
                {addProduct ? (
                  <span>
                    <i className="icofont-exclamation-circle text-warning me-2"></i>
                    Save or cancel the order to change beat and outlet
                  </span>
                ) : (
                  "Select beat and outlet first"
                )}
              </strong>

              <div className="mb-3 mt-2">
                <label htmlFor="beatId" className="form-label">
                  Select Beet
                </label>
                <div
                  className="form-control p-2"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                  onScroll={handleBeatScroll}
                >
                  {beets?.map((beet) => (
                    <div className="my-1" key={beet.id + " Beat"}>
                      <input
                        type="radio"
                        id={beet.id + " Beat"}
                        name="beatId"
                        value={beet.id}
                        checked={selectedBeatId == beet.id}
                        onChange={handleBeatChange}
                        disabled={addProduct}
                      />
                      <label htmlFor={beet.id + " Beat"} className="ms-2">
                        {beet.beet}
                      </label>
                    </div>
                  ))}
                  {beets?.length === 0 && (
                    <label htmlFor={" Beat"} className="ms-2">
                      {"No Beet"}
                    </label>
                  )}
                  {loadingBeats && (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                      <p>Loading more beats...</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="outletId" className="form-label">
                  Select Outlet
                </label>
                <Select
                  options={getOutletsForSelectedBeat()}
                  onChange={handleOutletChange}
                  value={
                    selectedOutletId
                      ? {
                          value: selectedOutletId,
                          label: getOutletsForSelectedBeat().find(
                            (outlet) => outlet.value === selectedOutletId
                          )?.label,
                        }
                      : null
                  }
                  isDisabled={addProduct}
                />
              </div>

              {!addProduct && (
                <Button
                  variant="primary"
                  disabled={
                    addProduct || selectedOutletId == "" || selectedBeatId == ""
                  }
                  onClick={() => {
                    setAddProduct(true);
                    const orderListData = window.localStorage.getItem(
                      `secondary-sale-draft-${selectedOutletId}`
                    );
                    if (orderListData) {
                      setOrderList(JSON.parse(orderListData));
                    }
                  }}
                  className="flex items-center gap-2 w-100 mb-3"
                >
                  Confirm
                </Button>
              )}
            </>
          )}
          {isPrimary && !isClient && (
            <>
              <strong className="">
                {isFormActive ? (
                  <span>
                    <i className="icofont-exclamation-circle text-warning me-2"></i>
                    Save or cancel the order to change client
                  </span>
                ) : (
                  "Select Client First"
                )}
              </strong>
              <div className="mb-3 mt-2">
                <label htmlFor="beatId" className="form-label">
                  Select Client
                </label>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Client Code..."
                    value={searchClientCode}
                    disabled={isFormActive}
                    onChange={(e) => setClientCode(e.target.value)}
                  />
                </div>
                <div
                  className="form-control p-2"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                  onScroll={handleClientScroll}
                >
                  {filterClientList?.map((client) => (
                    <div className="my-1" key={client.id + " client"}>
                      <input
                        type="radio"
                        id={client.id + " client"}
                        name="beatId"
                        value={client.id}
                        disabled={isFormActive}
                        checked={selectedClientId == client.id}
                        onChange={handleClientChange}
                      />
                      <label htmlFor={client.id + " client"} className="ms-2">
                        {client.clientCode}
                      </label>
                    </div>
                  ))}
                  {allClients?.length === 0 && (
                    <label htmlFor={" Client"} className="ms-2">
                      {"No Client"}
                    </label>
                  )}
                  {clientLoading && (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                      <p>Loading more Clients...</p>
                    </div>
                  )}
                </div>
                {!isFormActive && (
                  <Button
                    variant="primary"
                    disabled={addProduct || selectedClientId == ""}
                    onClick={() => {
                      setFormActive(true);
                    }}
                    className="flex items-center gap-2 w-100 mb-3 mt-2"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </>
          )}
          <div className="mb-3">
            <label htmlFor="productId" className="form-label">
              Select Product
            </label>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search Products..."
                value={searchText}
                disabled={isPrimarySaleFormDisable}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div
              className="form-control p-2"
              style={{ maxHeight: "150px", overflowY: "auto" }}
              onScroll={handleProductScroll}
            >
              {filteredProductList?.map((product) => (
                <div className="my-1" key={product.productId + " Product"}>
                  <input
                    type="radio"
                    id={product.productId + " Product"}
                    name="productId"
                    value={product.productId}
                    onChange={handleProductChange}
                    checked={selectedProductId == product.productId}
                    disabled={
                      (!isPrimary && !addProduct) || isPrimarySaleFormDisable
                    }
                  />
                  <label
                    htmlFor={product.productId + " Product"}
                    className="ms-2 text-[14px]"
                  >
                    {truncateString(`${product.name} (${product.sku})`, 100)}
                  </label>
                </div>
              ))}
              {loadingProducts && (
                <div className="text-center">
                  <Spinner animation="border" size="sm" />
                  <p>Loading more products...</p>
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Bundle Type{" "}
            </label>
            <div class="form-check">
              <input
                disabled={!isPrimary && !addProduct}
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                onChange={() => setBundleType("Cases")}
                checked={bundleType === "Cases"}
              />
              <label class="form-check-label" for="flexCheckDefault">
                Cases
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                // disabled={!isPrimary && !addProduct}
                disabled={
                  (!isPrimary && !addProduct) || isPrimarySaleFormDisable
                }
                id="flexCheckChecked"
                onChange={() => setBundleType("Unit")}
                checked={bundleType === "Unit"}
              />
              <label class="form-check-label" for="flexCheckChecked">
                Unit
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Enter Quantity{" "}
            </label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              // disabled={!isPrimary && !addProduct}
              disabled={(!isPrimary && !addProduct) || isPrimarySaleFormDisable}
            />
          </div>

          <div className="d-flex justify-content-end m-t-5">
            <Button
              variant="primary"
              onClick={handleOnAdd}
              className="align-self-end flex items-center gap-2"
            >
              Add
            </Button>
          </div>

          <div className="my-2 mx-2">
            <strong className="text-sm font-semibold text-gray-700 text-decoration-underline">
              Order Info
            </strong>

            <div className="table-footer m-2">
              {isClient && (
                <div className="d-flex justify-content-start align-items-center">
                  <i className="icofont-wallet text-primary me-2"></i>
                  <strong>Top Up Balance:</strong>
                  <span className="ms-2">
                    ₹ {Cred.topUpBalance?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-start align-items-center mb-2">
                <i className="icofont-dollar text-success me-2"></i>
                <strong>Total Price (Without GST):</strong>
                <span className="ms-2">₹ {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <DataTable
              columns={orderListCol}
              data={orderList}
              pagination
              highlightOnHover
              responsive
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              customStyles={{
                headCells: {
                  style: {
                    backgroundColor: "#f1f5f9",
                    fontWeight: "bold",
                  },
                },
                rows: {
                  style: {
                    minHeight: "20px",
                    padding: 0,
                  },
                },
                cells: {
                  style: {
                    padding: 0,
                  },
                },
              }}
            />
          </div>

          <div className="d-flex justify-content-around m-t-5">
            {!isClient && <div></div>}
            {isClient && (
              <Button
                variant="secondary"
                onClick={handleSave}
                className="self-center flex items-center gap-2"
              >
                Save Draft{"  "}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleOnSubmit}
              className="self-center flex items-center gap-2"
              disabled={orderList.length === 0}
            >
              Submit {"  "}
              {submitButtonLoader && (
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
          </div>
        </form>
      </Modal.Body>
      <EditOrderContentModal
        isPrimary={isPrimary}
        onUpdate={(_quantity) => {
          setOrderList(
            orderList.map((or) => {
              if (or._id === editOrderData?._id) {
                or.quantity =
                  or.bundleType === "Unit"
                    ? _quantity
                    : _quantity * or.product.bundleSize;
              }
              return or;
            })
          );
          setEditOrderData(null);
        }}
        orderContent={editOrderData}
        setIsVisible={setEditOrderData}
      />
    </Modal>
  );
}

export default PrimarySalesModal;
