import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  dispatchAddDiscount,
  dispatchDeleteDiscount,
  dispatchRemoveAllDiscount,
  dispatchSetDiscount,
  dispatchUpdateDiscount
} from "../redux/features/discount-slice";
import axios from "axios";
import { API_URL, DISCOUNT_MASTER } from "../constants/api-url";

export function useDiscountHook() {
  const dispatch = useDispatch();
  const Discount = useSelector((state) => state.Discount);
  const { allDiscount } = Discount;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Cred = useSelector((state) => state.Cred);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [sizeNumber, setSizeNumber] = useState(20);

  const setPage = (pageNumber) => setPageNumber(pageNumber);
  const setSize = (sizeNumber) => setSizeNumber(sizeNumber);

  const header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + Cred.token,
  };

  async function getAllDiscountCode() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (allDiscount.length >= 0) {
          const resp = await axios.get(
            API_URL.backend_url + DISCOUNT_MASTER.GETALL_ENDPOINT,
            {
              headers: header,
            }
          );
          if (resp.data.content.length >= 0) {
            dispatch(dispatchSetDiscount(resp.data.content));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Discount Codes! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Discount codes ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function addDiscountCode(payload) {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
          const resp = await axios.get(
            API_URL.backend_url + DISCOUNT_MASTER.POST_ENDPOINT,
            {
              headers: header,
              data: payload,
            }
          );
            dispatch(dispatchAddDiscount(resp.data));
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Add Discount Codes! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error add Discount codes ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function updateDiscountCode(payload) {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
          const resp = await axios.get(
            API_URL.backend_url + DISCOUNT_MASTER.PUT_ENDPOINT,
            {
              headers: header,
              data: payload,
            }
          );
            dispatch(dispatchUpdateDiscount(resp.data));
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't update Discount Codes! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error update Discount codes ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function deleteDiscountCode(id) {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
          const resp = await axios.get(
            API_URL.backend_url + DISCOUNT_MASTER.DELETE_ENDPOINT + `/${id}`,
            {
              headers: header,
            }
          );
            dispatch(dispatchDeleteDiscount(resp.data));
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't delete Discount Codes! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error delete Discount codes ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getAllDiscountCode();
    }
  }, [pageNumber, sizeNumber, Cred]);

  return {
    getAllDiscountCode,
    addDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
