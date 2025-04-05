import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Schema } from "./Schema";
import { addBeet, updateBeet } from "../../../api/beet/beet-api";
import {
  addSingleBeet,
  updateSingleBeet,
} from "../../../redux/features/beetSlice";
import Swal from "sweetalert2";
import { useIsSuperAdmin } from "../../../helper/isManager";

function AddUpdateModal({ editData, handleIsModal, getPageType }) {
  const [buttonLoader, setButtonLoader] = useState(false);
  const CredDetails = useSelector((state) => state.Cred);
  const ClientFMCG = useSelector((state) => state.ClientFMCG.allClients);
  const dispatch = useDispatch();
  const { memberPermissions } = useSelector((state) => state.Permission);
  const isSuperAdmin = useIsSuperAdmin();
  const DropDownsField = useSelector((state) => state.DropDownsField);

  function getOptions() {
    if (isSuperAdmin) {
      return DropDownsField.allCity.map((item) => (
        <option key={item.cityName} value={item.id}>
          {item.cityName}
        </option>
      ));
    } else if (
      CredDetails?.cities?.length > 0 &&
      Array.isArray(CredDetails.cities)
    ) {
      return CredDetails.cities.map((item) => (
        <option key={item.cityName} value={item.id}>
          {item.cityName}
        </option>
      ));
    } else {
      return <option value="">No cities available</option>;
    }
  }

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(Schema) });
  
  const handleDataChange = async (values) => {
    setButtonLoader(true);

    const selectedCity = isSuperAdmin
      ? DropDownsField.allCity.find((item) => item.id == values.city)
      : CredDetails.cities.find((item) => item.id == values.city);

    const payload = {
      ...values,
      remark: "",
      members: {
        id: CredDetails.id,
        firstName: CredDetails.firstName,
        lastName: CredDetails.lastName,
      },
      outlets: [],
      city: {
        id: selectedCity.id,
        cityName: selectedCity.cityName,
      },
    };

    console.log("Edit Data beet: ", editData);

    try {
      if (editData) {
        // data update logic

        console.log("Edit Data beet: ", editData);

        console.log(payload);
        const resp = await updateBeet(
          {
            ...editData,
            address: payload.address,
            beet: payload.beet,
            city: payload.city,
            clientFmcgId: payload.clientFmcgId,
            member: editData.members,
            postalCode: payload.postalCode,
          },
          CredDetails?.token
        );
        if (resp >= 200 && resp < 300) {
          dispatch(
            updateSingleBeet({
              id: editData.id,
              ...editData,
              address: payload.address,
              beet: payload.beet,
              city: payload.city,
              clientFmcgId: payload.clientFmcgId,
              member: editData.members,
              postalCode: payload.postalCode,
            })
          );
          Swal.fire(
            "Success",
            `${getPageType()} added successfully`,
            "success"
          );
        }
        reset(); // Reset the form on success
        handleIsModal(); // Close the modal on success
      } else {
        // data add logic

        console.log(payload);
        const resp = await addBeet(payload, CredDetails?.token);
        if (resp.beetId) {
          dispatch(
            addSingleBeet({
              ...payload,
              id: resp.beetId,
            })
          );
          Swal.fire(
            "Success",
            `${getPageType()} added successfully`,
            "success"
          );
        }
      }
      reset(); // Reset the form on success
      handleIsModal(); // Close the modal on success
    } catch (error) {
      // Handle error
      handleIsModal();
      console.error("Error adding beat:", error);
      Swal.fire(
        "Error",
        "An error occurred while adding the beat. Please try again.",
        "error"
      );
    } finally {
      setButtonLoader(false); // Stop the loader in both success and error cases
    }
  };

  useEffect(() => {
    if (editData) {
      reset({
        beet: editData.beet,
        address: editData.address,
        postalCode: editData.postalCode,
        city: editData.city.id,
        clientFmcgId: editData.clientFmcgId,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(handleDataChange)}>
      <div className="mb-3">
        <label htmlFor="beetName" className="form-label">
          {getPageType()} Name *
        </label>
        <input
          type="text"
          className="form-control"
          id="beetName"
          placeholder={`${getPageType()} Name`}
          {...register("beet")}
        />
        <p className="text-danger">{errors.beet?.message}</p>
      </div>
      <div className="row g-3">
        <div className="col-lg-8">
          <label htmlFor="address" className="form-label">
            Address *
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Beat Address"
            {...register("address")}
          />
          <p className="text-danger">{errors.address?.message}</p>
        </div>
        <div className="col-lg-4">
          <label htmlFor="postalCode" className="form-label">
            Postal Code *
          </label>
          <input
            type="text"
            className="form-control"
            id="postalCode"
            placeholder="Postal Code"
            {...register("postalCode")}
          />
          <p className="text-danger">{errors.postalCode?.message}</p>
        </div>
      </div>

      {editData ? (
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City *
          </label>
          <select className="form-control" id="city" {...register("city")}>
            <option value="">Select a city</option>
            {editData.memberGetCityDtoList.map((item) => (
              <option key={item.id} value={item.id}>
                {`${item.cityName} (${item.cityType})`}
              </option>
            ))}
          </select>
          <p className="text-danger">{errors.city?.message}</p>
        </div>
      ) : (
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City *
          </label>
          <select className="form-control" id="city" {...register("city")}>
            <option value="">Select a city</option>
            {getOptions()}
          </select>
          <p className="text-danger">{errors.city?.message}</p>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="client" className="form-label">
          {getPageType() === "Beats" ? "FMCG Client *" : "Stockist *"}
          {/* {getPageType() === "Beats" ? "FMCG Client *" : "Doctors *"}  */}
        </label>
        <select
          className="form-control"
          id="client"
          {...register("clientFmcgId")}
        >
          <option value="">
            Select a {getPageType() === "Beats" ? "FMCG Client" : "Stockist"}
          </option>
          {ClientFMCG?.length > 0 && Array.isArray(ClientFMCG) ? (
            ClientFMCG.map(
              (item) => (
                <option key={item.id} value={item.id}>
                  {`${item.clientFirstName} ${item.clientLastName} (${item.clientCode})`}
                </option>
              )
            )
          ) : (
            <option value="">
              No {getPageType() === "Beats" ? "Client" : "Stockist"} available
            </option>
          )}
        </select>
        <p className="text-danger">{errors.clientFmcgId?.message}</p>
      </div>

      <div className="w-100 d-flex gap-2 justify-content-end mt-4 mb-3">
        {/* <button className="btn btn-secondary" onClick={handleIsModal}>
          Done
        </button> */}
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

export default AddUpdateModal;
