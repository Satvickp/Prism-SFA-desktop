import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  addDesignationsMaster,
  deleteAllDesignationsMaster,
  deleteDesignationsMaster,
  setDesignationsMaster,
  updateDesignationsMaster
} from "../redux/features/designationMasterSlice";
import axios from "axios";
import { API_URL, DESIGNATION_MASTER } from "../constants/api-url";

export function useDesignationMasterHook() {
  const dispatch = useDispatch();
  const designationMaster = useSelector((state) => state.DesignationMaster);
  const { allDesignationMaster } = designationMaster;
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

  async function getAllDesignationMaster() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (allDesignationMaster.length === 0) {
          dispatch(deleteAllDesignationsMaster());
          const resp = await axios.get(
            API_URL.backend_url + DESIGNATION_MASTER.GETALL_ENDPOINT,
            {
              headers: header,
            }
          );
          if (resp.data.length >= 0) {
            dispatch(setDesignationsMaster(resp.data));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Designations! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Designations ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getAllDesignationMaster();
    }
  }, [pageNumber, sizeNumber, Cred]);

  async function addDesignationMaster(payload, handleIsModal) {
    try {
      const resp = await axios.post(
        API_URL.backend_url + DESIGNATION_MASTER.POST_ENDPOINT,
        payload,
        {
          headers: header,
        }
      );
        dispatch(addDesignationsMaster(resp.data));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Desigantion added Successfully",
          icon: "success",
        });
    } catch (error) {
      handleIsModal();
      // await Swal.fire({
      //   title: "Something went wrong!",
      //   text: "Can't Add Designation! Please try After Some Time",
      //   icon: "error",
      // });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding Designnation ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDesignationMaster(payload, handleIsModalEdit) {
    try {
      if (!payload.designationName || !payload.id) {
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

      const data = {
        designationName : payload.designationName.toUpperCase()
      }
      const resp = await axios.put(API_URL.backend_url + `${DESIGNATION_MASTER.PUT_ENDPOINT}/${payload.id}`,
         {...data},
        {
            headers : header
        });
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(updateDesignationsMaster({name: payload.designationName.toUpperCase(), id: payload.id}));
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "Designation updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Can't Update Designation! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating Designation ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteDesignationMaster(id, handleIsModal) {
    if (
      MemberPermission?.some(item => 
        item == permissionIds.SUPER_ADMIN 
      )
    ) {
      setIsLoading(true);
      try {
        const resp = await axios.delete(
          API_URL.backend_url + `${DESIGNATION_MASTER.DELETE_ENDPOINT}/${id}`,
          {
            headers: header,
          }
        );
        if (resp.status >= 200 && resp.status < 300) {
          dispatch(deleteDesignationsMaster(id));
          handleIsModal();
          Swal.fire({
            title: "Successful",
            text: "Designation Deleted Successfully",
            icon: "success",
          });
        }
      } catch (error) {
        handleIsModal();
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Delete Designation! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error Deleting Designation ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return {
    getAllDesignationMaster,
    addDesignationMaster,
    updateDesignationMaster,
    deleteDesignationMaster,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
