import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { permissionIds } from "../constants/constants";
import {
  addEmployeeCodeMaster,
  addInvoiceNumberMaster,
  setEmployeeCodeMaster,
  setInvoiceNumberMaster,
} from "../redux/features/codeConfigMasterSlice";
import axios from "axios";
import { API_URL, EMPLOYEE_CODE_MASTER_ENDPOINTS, INVOICE_NUMBER_MASTER_ENDPOINTS } from "../constants/api-url";

export function useCodeConfigurationHook() {
  const dispatch = useDispatch();
  const codeConfig = useSelector((state) => state.CodeConfig);
  const { employeeCodeMaster, invoiceNumberMaster } = codeConfig;
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

  async function getAllEmployeeCode() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (!employeeCodeMaster) {
          const resp = await axios.get(
            API_URL.backend_url + EMPLOYEE_CODE_MASTER_ENDPOINTS.GETALL_ENDPOINT,
            {
              headers: header,
            }
          );
          // if (resp.data.length >= 0) {
            dispatch(setEmployeeCodeMaster(resp.data));
          // }
        }
      } catch (error) {
        // Swal.fire({
        //   title: "Something went wrong!",
        //   text: "Can't Fetch Employee Codes! Please try After Some Time",
        //   icon: "error",
        // });
        setIsError(true);
        console.log("Error fetching Employee code ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function getAllInvoiceNumber() {
    if (
      MemberPermission.some(
        (item) =>
          item === permissionIds.SUPER_ADMIN
      )
    ) {
      setIsLoading(true);
      try {
        if (!invoiceNumberMaster) {
          const resp = await axios.get(
            API_URL.backend_url + INVOICE_NUMBER_MASTER_ENDPOINTS.GETALL_ENDPOINT,
            {
              headers: header,
            }
          );
          // if (resp.data.length >= 0) {
            dispatch(setInvoiceNumberMaster(resp.data));
          // }
        }
      } catch (error) {
        // Swal.fire({
        //   title: "Something went wrong!",
        //   text: "Can't Fetch Invoice Number! Please try After Some Time",
        //   icon: "error",
        // });
        setIsError(true);
        console.log("Error fetching Invoice Number ::", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getAllEmployeeCode();
      getAllInvoiceNumber();
    }
  }, [pageNumber, sizeNumber, Cred]);

  
  async function addEmployeeCode(payload, handleIsModal) {
    try {
      if (!payload.code  || !payload.preOrPost) {
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
        API_URL.backend_url + EMPLOYEE_CODE_MASTER_ENDPOINTS.POST_ENDPOINT,
        {...payload},
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(addEmployeeCodeMaster(resp.data));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Employee Code added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add Employee Code! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding Employee Code ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addInvoiceNumber(payload, handleIsModal) {
    try {
      if (!payload.code  || !payload.preOrPost) {
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
        API_URL.backend_url + INVOICE_NUMBER_MASTER_ENDPOINTS.POST_ENDPOINT,
        {...payload},
        {
          headers: header,
        }
      );
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(addInvoiceNumberMaster(resp.data));
        handleIsModal();
        Swal.fire({
          title: "Successfull",
          text: "Invoice Number added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModal();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Add Invoice Number! Please try After Some Time",
        icon: "error",
      });
      handleIsModal();
      setIsError(true);
      console.log("Error Adding Invoice Number ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateEmployeeCode(payload, handleIsModalEdit) {
    try {
      if (!payload.preOrPost || !payload.code) {
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
      const resp = await axios.put(API_URL.backend_url + `${EMPLOYEE_CODE_MASTER_ENDPOINTS.PUT_ENDPOINT}`,
         {...payload},
        {
            headers : header
        });
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(addEmployeeCodeMaster(resp.data));
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "Employee Code updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update Employee Code! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating Employee Code ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateInvoiceNumber(payload, handleIsModalEdit) {
    try {
      if (!payload.preOrPost || !payload.code) {
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
      const resp = await axios.put(API_URL.backend_url + `${INVOICE_NUMBER_MASTER_ENDPOINTS.PUT_ENDPOINT}`,
         {...payload},
        {
            headers : header
        });
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(addInvoiceNumberMaster(resp.data));
        handleIsModalEdit();
        Swal.fire({
          title: "Successfull",
          text: "Invoice Number updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      handleIsModalEdit();
      await Swal.fire({
        title: "Something went wrong!",
        text: "Can't Update Invoice Number! Please try After Some Time",
        icon: "error",
      });
      handleIsModalEdit();
      setIsError(true);
      console.log("Error Updating Invoice Number ::", error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    getAllEmployeeCode,
    getAllInvoiceNumber,
    addEmployeeCode,
    addInvoiceNumber,
    updateEmployeeCode,
    updateInvoiceNumber,
    pageNumber,
    sizeNumber,
    setPage,
    setSize,
    isLoading,
    isError,
  };
}
