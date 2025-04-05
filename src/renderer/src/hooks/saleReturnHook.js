import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {
  addPrimarySaleReturn,
  addSecondarySaleReturn,
  deleteAllPrimarySaleReturn,
  deleteAllSecondarySaleReturn,
  deletePrimarySaleReturn,
  deleteSecondarySaleReturn,
  setPrimarySaleReturn,
  setSecondarySaleReturn,
  updatePrimarySaleReturn,
  updateSecondarySaleReturn,
} from "../redux/features/saleReturnSlice";
import {
  addNewSaleReturn,
  deleteSaleReturn,
  getAllOrdersByClientFMCGId,
  getAllSalesReturnBySaleLevel,
  updateSaleReturn,
} from "../api/sales/returnSales/returnSales-api";
import { setOrder } from "../redux/features/orderSlice";

export function useReturnSalesHook(
  requestedPage = 0,
  requestedSize = 0,
  isPrimary = ""
) {
  const Dispatch = useDispatch();
  const SalesReturn = useSelector((state) => state.SaleReturn);
  const Cred = useSelector((state) => state.Cred);
  const Order = useSelector((state) => state.Orders);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(500);

  const setNewPage = (newPage) => {
    setPage(newPage);
  };

  const setNewSize = (newSize) => {
    setSize(newSize);
  };

  async function getAllPrimaryReturnSales() {
    try {
      if (SalesReturn.Primary.content.length <= 0) {
        Dispatch(deleteAllPrimarySaleReturn());
        if (requestedPage) setPage(requestedPage);
        if (requestedSize) setSize(requestedSize);
        const ProductsArray = await getAllSalesReturnBySaleLevel(
          Cred.token,
          page,
          size,
          Cred.sub,
          "WAREHOUSE"
        );
        if (ProductsArray.content.length >= 0) {
          Dispatch(setPrimarySaleReturn(ProductsArray));
        }
      }
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire("Error", "Error fetching Primary Return Sales", "error");
    }
  }

  async function getAllOrdersByClientFMCG() {
    try {
      if (Order.allOrder.length <= 0) {
        const OrdersArray = await getAllOrdersByClientFMCGId(
          Cred.token,
          Cred.sub
        );
        if (OrdersArray.content.length >= 0) {
          Dispatch(
            setOrder({
              allOrder: OrdersArray.content,
              paginationData: {
                page: OrdersArray?.page || 0,
                totalElements: OrdersArray?.totalElements || 0,
                totalPages: OrdersArray?.totalPages || 0,
              },
            })
          );
        }
      }
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire("Error", "Error fetching Orders", "error");
    }
  }

  async function getAllSecondaryReturnSales() {
    try {
      if (SalesReturn.Secondary.content.length <= 0) {
        Dispatch(deleteAllSecondarySaleReturn());
        if (requestedPage) setPage(requestedPage);
        if (requestedSize) setSize(requestedSize);
        const ProductsArray = await getAllSalesReturnBySaleLevel(
          Cred.token,
          page,
          size,
          Cred.sub,
          "STOCKIST"
        );
        if (ProductsArray.content.length >= 0) {
          Dispatch(setSecondarySaleReturn(ProductsArray));
        }
      }
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire("Error", "Error fetching Secondary Return Sales", "error");
    }
  }

  async function getAllReturnSale() {
    setIsLoading(true);
    try {
      if (isPrimary === "true") {
        // run getAll Primary Return Sales
        await getAllPrimaryReturnSales();
      } else if (isPrimary === "false") {
        // run getAll Secondary Return Sales
        await getAllSecondaryReturnSales();
      } else {
        // run get All Primary and secondary Return sale
        await getAllPrimaryReturnSales();
        await getAllSecondaryReturnSales();
      }
    } catch (error) {
      console.log("cannot get all return sale :: Error ::", error);
      setIsError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addReturnSales(payload) {
    try {
      const {ProductsArray, status} = await addNewSaleReturn(payload, Cred.token);
      if(status < 200 || status > 299){
        return ProductsArray
      }
      if (ProductsArray?.salesLevel?.toUpperCase() === "WAREHOUSE") {
        Dispatch(addPrimarySaleReturn(ProductsArray));
      } else if (ProductsArray?.salesLevel?.toUpperCase() === "STOCKIST") {
        Dispatch(addSecondarySaleReturn(ProductsArray));
      }
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire("Error", "Error Creating Return Sales", "error");
    }
  }

  async function updateReturnSales(payload, saleType, id) {
    try {
      const ProductsArray = await updateSaleReturn(Cred.token, payload, id);
      if (saleType?.toUpperCase() === "WAREHOUSE") {
        Dispatch(updatePrimarySaleReturn(ProductsArray));
      } else if (saleType?.toUpperCase() === "STOCKIST") {
        Dispatch(updateSecondarySaleReturn(ProductsArray));
      }
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire("Error", "Error Updating Sale", "error");
    }
  }

  async function deleteReturnSales(saleId, SaleType) {
    try {
      const responseStatus = await deleteSaleReturn(Cred.token, saleId);
      if (responseStatus >= 200 && responseStatus < 300) {
        if (SaleType?.toUpperCase() === "WAREHOUSE") {
          Dispatch(deletePrimarySaleReturn(saleId));
          return true;
        } else if (SaleType?.toUpperCase() === "STOCKIST") {
          Dispatch(deleteSecondarySaleReturn(saleId));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log("Error ::", error);
      Swal.fire("Error", "Error Deleting Return Sales", "error");
    }
  }

  useEffect(() => {
    if (Cred.token && Cred.sub) {
      getAllReturnSale();
    }
  }, [page, size, Cred]);

  return {
    getAllReturnSale,
    getAllPrimaryReturnSales,
    getAllSecondaryReturnSales,
    addReturnSales,
    deleteReturnSales,
    updateReturnSales,
    getAllOrdersByClientFMCG,
    isLoading,
    isError,
    page,
    size,
    setNewPage,
    setNewSize,
  };
}
