import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  dispatchAddOutlet,
  dispatchDeleteAllOutlet,
  dispatchDeleteOutlet,
  dispatchSetOutlets,
  dispatchUpdateOutlet,
} from "../redux/features/outletSlice";
import axios from "axios";
import { API_URL, OUTLET_CHEMIST_URL_ENDPOINTS } from "../constants/api-url";

export function useOutletHook() {
  const dispatch = useDispatch();
  const outlet = useSelector((state) => state.Outlets);
  const { allOutlets } = outlet;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Cred = useSelector((state) => state.Cred);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [sizeNumber, setSizeNumber] = useState(500);

  const setPage = (pageNumber) => setPageNumber(pageNumber);
  const setSize = (sizeNumber) => setSizeNumber(sizeNumber);

  const header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + Cred.token,
  };

  async function getAllOutlets() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (allOutlets.length === 0) {
          dispatch(dispatchDeleteAllOutlet());
          const resp = await axios.get(
            API_URL.backend_url + OUTLET_CHEMIST_URL_ENDPOINTS.GETALL_ENDPOINT + `?page=0&size=500&sort=desc`,
            {
              headers: header,
            }
          );
          if (resp?.data?.outletGet?.length > 0) {
            dispatch(dispatchSetOutlets(resp?.data?.outletGet));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Outlets! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Outlets ::", error);
      } finally {
        setIsLoading(false);
      }
    }
    else{
      setIsLoading(true);
      try {
        if (allOutlets.length === 0) {
          dispatch(dispatchDeleteAllOutlet());
          const resp = await axios.get(
            API_URL.backend_url + OUTLET_CHEMIST_URL_ENDPOINTS.GETALL_BY_MEMBER_ID_ENDPOINT + `/${Cred.sub}`,
            {
              headers: header,
            }
          );
          if (resp?.data?.length > 0) {
            dispatch(dispatchSetOutlets(resp?.data));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Outlets! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Outlets ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getAllOutlets();
    }
  }, [pageNumber, sizeNumber, Cred]);

  async function addOutlet(payload, handleIsModal) {
    try {
      if (!payload  || payload.length === 0) {
        handleIsModal();
        await Swal.fire({
          title: "Incomplete Data!",
          text: "Please fill valid details",
          icon: "warning",
        });
        handleIsModal();
        return;
      }
      const resp = await axios.post(
        API_URL.backend_url + OUTLET_CHEMIST_URL_ENDPOINTS.POST_ENDPOINT,
        {...payload},
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(dispatchAddOutlet(resp.data));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Outlet added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add Outlet! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding Outlet ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOutlet(payload, handleIsModalEdit) {
    try {
      if (!payload.regionName || !payload.id) {
        handleIsModalEdit();
        console.log("payload",payload)
        await Swal.fire({
          title: "Incomplete Data!",
          text: "Please fill all the mandatory details",
          icon: "warning",
        });
        handleIsModalEdit();
        return;
      }

      const resp = await axios.put(API_URL.backend_url + `${OUTLET_CHEMIST_URL_ENDPOINTS.PUT_ENDPOINT}/${payload.id}`,
         {...payload},
        {
            headers : header
        });
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(dispatchUpdateOutlet(resp.data));
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "Outlet updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update Outlet ! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating Outlet ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteOutlet(id, handleIsModal) {
    if (
      MemberPermission?.some(item => 
        item == permissionIds.SUPER_ADMIN 
      )
    ) {
      setIsLoading(true);
      try {
        const resp = await axios.delete(
          API_URL.backend_url + `${OUTLET_CHEMIST_URL_ENDPOINTS.DELETE_ENDPOINT}/${id}`,
          {
            headers: header,
          }
        );
        if (resp.status >= 200 && resp.status < 300) {
          dispatch(dispatchDeleteOutlet(id));
          handleIsModal();
          Swal.fire({
            title: "Successful",
            text: "Outlet Deleted Successfully",
            icon: "success",
          });
        }
      } catch (error) {
        handleIsModal();
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Delete Outlet! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error Deleting Outlet ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return {
    getAllOutlets,
    deleteOutlet,
    addOutlet,
    updateOutlet,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
