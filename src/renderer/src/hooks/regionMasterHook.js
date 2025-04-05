import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  addRegionsMaster,
  deleteAllRegionMaster,
  deleteRegionsMaster,
  setRegionMaster,
  updateRegionsMaster,
} from "../redux/features/regionMasterSlice";
import axios from "axios";
import { API_URL, REGION_MASTER } from "../constants/api-url";

export function useRegionMasterHook() {
  const dispatch = useDispatch();
  const regionMaster = useSelector((state) => state.RegionMaster);
  const { allRegionMaster, paginationData } = regionMaster;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Cred = useSelector((state) => state.Cred);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [sizeNumber, setSizeNumber] = useState(20);

  const setPage = (pageNumber) => setPageNumber(pageNumber);
  const setSize = (sizeNumber) => setSizeNumber(sizeNumber);

  const header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + Cred.token,
  };

  async function getallRegionMaster() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (allRegionMaster.length === 0) {
          dispatch(deleteAllRegionMaster());
          const resp = await axios.get(
            API_URL.backend_url + REGION_MASTER.GETALL_ENDPOINT,
            {
              headers: header,
            }
          );
          if (resp.data.length >= 0) {
            dispatch(setRegionMaster(resp.data));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Regions! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Regions ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getallRegionMaster();
    }
  }, [pageNumber, sizeNumber, Cred]);

  async function addRegionMaster(payload, handleIsModal) {
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
        API_URL.backend_url + REGION_MASTER.POST_ENDPOINT,
        { regionRequestList : [...payload] },
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        let result = payload.map((item, index) => (
          {
            id: resp.data[index],
            name: item.regionName
          }
        ))
        dispatch(addRegionsMaster(result));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Region added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add Region! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding Region ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRegionMaster(payload, handleIsModalEdit) {
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

      const data = {
        regionName : payload.regionName.toUpperCase()
      }
      const resp = await axios.put(API_URL.backend_url + `${REGION_MASTER.PUT_ENDPOINT}/${payload.id}`,
         {...data},
        {
            headers : header
        });
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(updateRegionsMaster({name: payload.regionName.toUpperCase(), id: payload.id}));
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "Region updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Can't Update Region! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating Region ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteRegionMaster(id, handleIsModal) {
    if (
      MemberPermission?.some(item => 
        item == permissionIds.SUPER_ADMIN 
      )
    ) {
      setIsLoading(true);
      try {
        const resp = await axios.delete(
          API_URL.backend_url + `${REGION_MASTER.DELETE_ENDPOINT}/${id}`,
          {
            headers: header,
          }
        );
        if (resp.status >= 200 && resp.status < 300) {
          dispatch(deleteRegionsMaster(id));
          handleIsModal();
          Swal.fire({
            title: "Successful",
            text: "Region Deleted Successfully",
            icon: "success",
          });
        }
      } catch (error) {
        handleIsModal();
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Delete Region! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error Deleting Regions ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return {
    getallRegionMaster,
    deleteRegionMaster,
    addRegionMaster,
    updateRegionMaster,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
