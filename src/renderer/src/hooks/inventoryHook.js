import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  addInventory,
  deleteAllInventory,
  setInventory,
  updateInventory,
} from "../redux/features/inventorySlice";
import {
  addNewInventory,
  getAllInventory,
  UpdateInventory,
} from "../api/inventory/inventory-api";
import { useIsManager } from "../helper/isManager";

export function useInventoryHook() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.Inventory);
  const { allInventory, paginationData } = inventory;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Cred = useSelector((state) => state.Cred);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [sizeNumber, setSizeNumber] = useState(20);
  const isManager = useIsManager();
  const setPage = (pageNumber) => setPageNumber(pageNumber);
  const setSize = (sizeNumber) => setSizeNumber(sizeNumber);

  async function getEveryInventory() {
    if (isManager) {
      setIsLoading(true);
      try {
        if (allInventory.length === 0) {
          dispatch(deleteAllInventory());
          const resp = await getAllInventory(
            Cred.token,
            pageNumber,
            sizeNumber
          );
          if (resp.content.length >= 0) {
            dispatch(
              setInventory({
                allInventory: resp.content,
                paginationData: {
                  page: resp.page,
                  totalElements: resp.totalElements,
                  totalPages: resp.totalPages,
                },
              })
            );
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Inventory! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Inventory ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getEveryInventory();
    }
    // }, []);
  }, [pageNumber, sizeNumber, Cred]);

  async function AddInventory(payload, handleIsModal) {
    try {
      if (!payload) {
        handleIsModal();
        await Swal.fire({
          title: "Incomplete Data!",
          text: "Please fill all the mandatory details",
          icon: "warning",
        });
        handleIsModal();
        return;
      }
      const resp = await addNewInventory(payload, Cred.token);
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(addInventory(payload));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Inventory added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add Inventory! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding Inventory ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateExistingInventory(payload, handleIsModal) {
    try {
      if (!payload.productId || !payload.quantity || !payload.salesLevel) {
        handleIsModal();
        await Swal.fire({
          title: "Incomplete Data!",
          text: "Please fill all the mandatory details",
          icon: "warning",
        });
        handleIsModal();
        return;
      }

      const data = {
        salesLevel: payload.salesLevel,
        quantitySold: payload.quantity,
      };
      const resp = await UpdateInventory(data, payload.productId, Cred.token);
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(updateInventory(payload));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Inventory updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: error.response.data.message
          ? error.response.data.message
          : "Can't Update Inventory! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Updating Inventory ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteExistingInventory() {}
  async function getSingleInventory() {}

  return {
    getEveryInventory,
    getSingleInventory,
    AddInventory,
    updateExistingInventory,
    deleteExistingInventory,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
