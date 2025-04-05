import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  addCitiesMaster,
  deleteAllCitiesMaster,
  deleteCitiesMaster,
  setCitiesMaster,
  updateCitiesMaster
} from "../redux/features/cityMasterSlice"
import axios from "axios";
import { API_URL, CITY_MASTER } from "../constants/api-url";

export function useCityMasterHook() {
  const dispatch = useDispatch();
  const statesMaster = useSelector((state) => state.StatesMaster);
  const { allStateMaster, paginationData } = statesMaster;
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );
  const Cred = useSelector((state) => state.Cred);
  const { allCityMaster } = useSelector((state) => state.CityMaster)

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

  async function getallCityMaster() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (allCityMaster.length === 0) {
          dispatch(deleteAllCitiesMaster());
          const resp = await axios.get(
            API_URL.backend_url + CITY_MASTER.GETALL_ENDPOINT,
            {
              headers: header,
              params: {
                page: 0,
                pageSize: 500,
                sortDirection: "desc"
              },
            }
          );
          if (resp.data.content.length > 0) {
            dispatch(setCitiesMaster(resp.data.content));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Cities! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error fetching Cities ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getallCityMaster();
    }
  }, [pageNumber, sizeNumber, Cred]);


  async function addCityMaster(payload, handleIsModal) {
    try {
      console.log(payload)
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
        cityName: item.cityName,
        stateId: item.stateEntity.id,
        cityType: item.cityType,
        cityCode: item.cityCode,
        cityClass: item.cityClass
      }));
      const resp = await axios.post(
        API_URL.backend_url + CITY_MASTER.POST_ENDPOINT,
        { cityRequestList: [...finalLoad] },
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        let result = payload.map((item, index) => ({
          id: resp.data[index],
          cityName: item.cityName,
          stateId: item.stateEntity.id,
          stateName: item.stateEntity.stateName,
          cityType: item.cityType,
          cityCode: item.cityCode,
          cityClass: item.cityClass,
          cityStatus: "ACTIVE"
        }));
        dispatch(addCitiesMaster(result));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "City added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add City! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding City ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCityMaster(payload, handleIsModalEdit) {
    try {
      console.log(payload)
      if (!payload.cityName || !payload.stateId) {
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
        cityName: payload.cityName,
        stateId: Number(payload.stateId),
        cityCode: payload.cityCode,
        cityClass: payload.cityClass,
        cityType: payload.cityType
      };
      const resp = await axios.put(
        API_URL.backend_url + `${CITY_MASTER.PUT_ENDPOINT}/${payload.editData.id}`,
        { ...data },
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(
          updateCitiesMaster(resp.data)
        );
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "City updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: error?.response?.data?.message
          ? error?.response?.data?.message
          : "Can't Update City! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating City ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCityMaster(id, handleIsModal) {
    if (
      MemberPermission?.some(item => 
        item == permissionIds.SUPER_ADMIN )
    ) {
      setIsLoading(true);
      try {
        const resp = await axios.delete(
          API_URL.backend_url + `${CITY_MASTER.DELETE_ENDPOINT}/${id}`,
          {
            headers: header,
          }
        );
        if (resp.status >= 200 && resp.status < 300) {
          dispatch(deleteCitiesMaster(id));
          handleIsModal();
          Swal.fire({
            title: "Successful",
            text: "City Deleted Successfully",
            icon: "success",
          });
        }
      } catch (error) {
        handleIsModal();
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Delete City! Please try After Some Time",
          icon: "error",
        });
        setIsError(true);
        console.log("Error Deleting City ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return {
    getallCityMaster,
    deleteCityMaster,
    addCityMaster,
    updateCityMaster,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
