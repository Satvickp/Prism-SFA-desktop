import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { OutletSchema } from "./Schema";
import { addOutLet, updateOutLet } from "../../../api/beet/beet-api";
import { addOutletToBeet, updateOutletToBeet } from "../../../redux/features/beetSlice";
import Swal from "sweetalert2";
import {
  getAllClients,
  getAllClientsByReportingManager,
} from "../../../api/clients/clientfmcg-api";
import { setClients } from "../../../redux/features/clientSlice";
import { permissionIds } from "../../../constants/constants";
import { setClientsFMCG } from "../../../redux/features/clientFMCGSlice";
import { getCurrentCoordinates } from "../../../helper/getCurrentCoordinates";

function AddUpdateOutlet({
  editData,
  handleIsModal,
  beetId,
  outletData,
  handleOutletViewModal,
  latitude,
  longitude,
  clientFmcgId,
}) {
  const [buttonLoader, setButtonLoader] = useState(false);
  const dispatch = useDispatch();
  const Cred = useSelector((state) => state.Cred);
  const Client = useSelector((state) => state.ClientFMCG);
  const { memberPermissions } = useSelector((state) => state.Permission);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(OutletSchema) });

  async function get() {
    try {
      if (Client.allClients.length <= 0) {
        const resp = memberPermissions.some(
          (item) => item === permissionIds.MANAGER
        )
          ? await getAllClients(Cred.token, 0, Cred.sub)
          : await getAllClientsByReportingManager(Cred.token, 0, Cred.sub);
        dispatch(
          setClientsFMCG({
            allClients: resp.data,
            paginationData: resp.paginationData,
          })
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Clients. Please try After Some Time",
        icon: "error",
      });
    }
  }

  useEffect(() => {
    get();
    
    if (editData) {
        reset({
          outletName: editData.outletName,
          outletType: editData.outletType,
          mobile: editData.mobile,
          ownerName: editData.ownerName,
          email: editData.email,
          gstNumber: editData.gstNumber,
          panNumber: editData.panNumber,
        })
    }
   
  }, []);


  function getOptions() {
    if (Client?.allClients?.length > 0 && Array.isArray(Client.allClients)) {
      return Client.allClients.map((item) => (
        <option key={item.clientCode} value={item.id}>
          {`${item.clientFirstName} ${item.clientLastName} (${item.clientCode})`}
        </option>
      ));
    }
    return <option value="">No clients available</option>;
  }

  const handleDataChange = async (values) => {
    setButtonLoader(true);
    const coordinates = await getCurrentCoordinates();
    const payload = {
      ...values,
      beet: {
        id: beetId,
      },
      latitude: `${coordinates.latitude}`,
      longitude: `${coordinates.longitude}`,
      clientFMCId: clientFmcgId,
      memberId: Cred.sub,
      salesLevelConstant: "STOCKIST", // member and Stockist and client is Retailer
    };
    if (editData) {
      try {
        // Update logic here
        const updatePayload = {
          id: editData.id,
          ...values,
          geoFencingStatus: editData.geoFencingStatus,
          ownerMobileNo: editData.ownerMobileNo,
          salesLevelConstant: "STOCKIST",
          clientFMCGId: editData.clientId,
        };

        const resp = await updateOutLet(Cred.token, updatePayload);
        if (resp >= 200 && resp < 300) {
          Swal.fire({
            title: "Success",
            text: "Outlet updated successfully",
            icon: "success",
            timer: 2000,
          });
        };
        dispatch(
          updateOutletToBeet({
            data: {...updatePayload},
            beetId: beetId,
          })
        );
        handleOutletViewModal();
        handleIsModal();

      } catch (error) {
        Swal.fire("Error", "Unable to Update Outlet Details");
        console.log("Error Updating Outlet:", error)
      }
    } else {
      try {
        const resp = await addOutLet(Cred.token, payload);
        if (resp) {
          dispatch(
            addOutletToBeet({
              data: {...payload, id: resp.outlet},
              id: resp.outlet,
            })
          );
          handleOutletViewModal();
          handleIsModal();
          Swal.fire({
            title: "Success",
            text: "Outlet added successfully",
            icon: "success",
            timer: 2000,
          });
        }
      } catch (error) {
        handleIsModal();
        console.log("Error Adding Outlet", error);
        Swal.fire("Error", "Unable to Add Outlet!");
      }
    }
    setButtonLoader(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleDataChange)}>
      <div className="row g-3">
        <div className="col-lg-6">
          <label htmlFor="outletName" className="form-label">
            Outlet Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="outletName"
            placeholder="Outlet Name"
            {...register("outletName")}
          />
          <p className="text-danger">{errors.outletName?.message}</p>
        </div>
        <div className="col-lg-6">
          <label htmlFor="outletType" className="form-label">
            Outlet Type <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="outletType"
            placeholder="Outlet Type"
            {...register("outletType")}
          />
          <p className="text-danger">{errors.outletType?.message}</p>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="mobile" className="form-label">
          Mobile Number <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="mobile"
          placeholder="Mobile Number"
          maxLength={10}
          {...register("mobile")}
        />
        <p className="text-danger">{errors.mobile?.message}</p>
      </div>
      <div className="row g-3">
        <div className="col-lg-6">
          <label htmlFor="ownerName" className="form-label">
            Owner Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="ownerName"
            placeholder="Owner Name"
            {...register("ownerName")}
          />
          <p className="text-danger">{errors.ownerName?.message}</p>
        </div>
        {
         !editData &&
          <div className="col-lg-6">
          <label htmlFor="ownerMobileNo" className="form-label">
            Owner Mobile Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="ownerMobileNo"
            placeholder="Owner Mobile Number"
            maxLength={10}
            {...register("ownerMobileNo")}
          />
          <p className="text-danger">{errors.ownerMobileNo?.message}</p>
        </div>
        }
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Email"
          {...register("email")}
        />
        <p className="text-danger">{errors.email?.message}</p>
      </div>
      <div className="row g-3">
        {/* <div className="col-lg-6">
          <label htmlFor="client" className="form-label">
            Client*
          </label>
          <select
            className="form-control"
            id="client"
            {...register("clientFMCId")}
          >
            <option value="">Select a Client</option>
            {getOptions()}
          </select>
          <p className="text-danger">{errors.clientFMCId?.message}</p>
        </div> */}
        <div className="col-lg-6">
          <label htmlFor="gstNumber" className="form-label">
            GST Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            id="gstNumber"
            // autoCapitalize="on"
            placeholder="GST Number"
            {...register("gstNumber")}
          />
          <p className="text-danger">{errors.gstNumber?.message}</p>
        </div>
        <div className="col-lg-6">
          <label htmlFor="panNumber" className="form-label">
            Pan Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            style={{ textTransform: "uppercase" }}
            id="panNumber"
            placeholder="Pan Number"
            {...register("panNumber")}
          />
          <p className="text-danger">{errors.panNumber?.message}</p>
        </div>
      </div>
      <div className="w-100 d-flex gap-2 justify-content-end mt-4 mb-3">
        <button className="btn btn-danger" onClick={handleIsModal}>
          cancel
        </button>
        <button className="btn btn-primary" type="submit">
          {buttonLoader && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
            />
          )}
          {editData ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default AddUpdateOutlet;
