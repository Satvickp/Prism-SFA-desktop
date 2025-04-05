import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  addStatesMaster,
  deleteAllStatesMaster,
  deleteStatesMaster,
  setStatesMaster,
  updateStatesMaster,
} from "../redux/features/stateMasterSlice";
import axios from "axios";
import { API_URL, STATE_MASTER } from "../constants/api-url";

export function useStatesMasterHook() {
  const dispatch = useDispatch();
  const statesMaster = useSelector((state) => state.StatesMaster);
  const { allStatesMaster, paginationData } = statesMaster;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Cred = useSelector((state) => state.Cred);
  const { allRegionMaster } = useSelector((state) => state.RegionMaster);

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

  async function getallStateMaster() {
    if (
      MemberPermission?.some(item => 
        item == permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (allStatesMaster.length === 0) {
          dispatch(deleteAllStatesMaster());
          const resp = await axios.get(
            API_URL.backend_url + STATE_MASTER.GETALL_ENDPOINT,
            {
              headers: header,
              params: {
                page: 0,
                pageSize: 500,
              },
            }
          );
          if (resp.data.content.length > 0) {
            dispatch(setStatesMaster(resp.data.content));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch States! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching States ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getallStateMaster();
    }
  }, [pageNumber, sizeNumber, Cred]);

  async function addStateMaster(payload, handleIsModal) {
    try {
      if (!payload || payload.length === 0) {
        handleIsModal();
        await Swal.fire({
          title: "Incomplete Data!",
          text: "Please fill valid details",
          icon: "warning",
        });
        handleIsModal();
        return;
      }
      const finalLoad = payload.map((item) => ({
        stateName: item.stateName,
        regionId: item.regionEntity.id,
      }));
      const resp = await axios.post(
        API_URL.backend_url + STATE_MASTER.POST_ENDPOINT,
        { stateRequestList: [...finalLoad] },
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        let result = payload.map((item, index) => ({
          stateName: item.stateName,
          id: resp.data[index],
          regionEntity: {
            id: item.regionEntity.id,
            regionName: item.regionEntity.name,
          },
        }));
        dispatch(addStatesMaster(result));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "State added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add State! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding State ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStateMaster(payload, handleIsModalEdit) {
    try {
      if (!payload.stateName || !payload.regionId) {
        handleIsModalEdit();
        console.log("payload", payload);
        await Swal.fire({
          title: "Incomplete Data!",
          text: "Please fill all the mandatory details",
          icon: "warning",
        });
        handleIsModalEdit();
        return;
      }

      const data = {
        stateName: payload.stateName.toUpperCase(),
        regionId: Number(payload.regionId),
      };
      const resp = await axios.put(
        API_URL.backend_url + `${STATE_MASTER.PUT_ENDPOINT}/${payload.editData.id}`,
        { ...data },
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        let selectedRegion = allRegionMaster.find(
          (item) => item.id == payload.regionId)
        dispatch(
          updateStatesMaster({
            ...payload.editData,
            stateName: payload.stateName.toUpperCase(),
            regionEntity: {
              ...selectedRegion,
              regionName: selectedRegion.name
            }
            
          })
        );
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "State updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Can't Update State! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating State ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteStateMaster(id, handleIsModal) {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        const resp = await axios.delete(
          API_URL.backend_url + `${STATE_MASTER.DELETE_ENDPOINT}/${id}`,
          {
            headers: header,
          }
        );
        if (resp.status >= 200 && resp.status < 300) {
          dispatch(deleteStatesMaster(id));
          handleIsModal();
          Swal.fire({
            title: "Successful",
            text: "State Deleted Successfully",
            icon: "success",
          });
        }
      } catch (error) {
        handleIsModal();
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Delete State! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error Deleting States ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return {
    getallStateMaster,
    deleteStateMaster,
    addStateMaster,
    updateStateMaster,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
