import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Schema } from "./schema";
import Swal from "sweetalert2";
import {
  addProducts,
  updateProducts,
} from "../../../../redux/features/productsSlice";
import {
  addNewProduct,
  updateProduct,
} from "../../../../api/products/products-api";

function ProductModal({ editData, handleIsModal }) {
  const Cred = useSelector((state) => state.Cred);
  const [buttonLoader, setButtonLoader] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(Schema) });

  // console.log("editData", editData);

  function handleUnitOfMeasurement(value) {
    for (let i = 0; i < value.length; i++) {
      if (
        value.charAt(i)?.toUpperCase() >= "A" &&
        value.charAt(i)?.toUpperCase() <= "Z"
      ) {
        let result = {
          measurementUnit: value.slice(i),
          measurementValue: Number(value.slice(0, i)),
        };
        // console.log(result);
        return result;
      }
    }
  }

  useEffect(() => {
    // reset();
    if (editData) {
      let val = handleUnitOfMeasurement(editData.unitOfMeasurement);
      reset({
        ...editData,
        gstPercentage: editData.productPriceRes.gstPercentage,
        retailerPrice: editData.productPriceRes.retailerPrice,
        stockListPrice: editData.productPriceRes.stockListPrice,
        warehousePrice: editData.productPriceRes.warehousePrice,
        measurementUnit: val.measurementUnit,
        measurementValue: val.measurementValue,
      });
    }
  }, []);

  const handleDataChange = async (values) => {
    setButtonLoader(true);
    console.log(values);

    if (editData) {
      let data = {
        name: values.name,
        sku: values.sku,
        unitOfMeasurement: String(values.measurementValue) + values.measurementUnit,
        warehousePrice: values.warehousePrice,
        gstPercentage: values.gstPercentage,
        stockListPrice: values.stockListPrice,
        retailerPrice: values.retailerPrice,
      };
      console.log("data", data);
      try {
        // Update logic here
        handleIsModal();
        const resp = await updateProduct(data, values.productId, Cred.token);
        if (resp.productId) {
          const storeData = {
            name: data.name,
            sku: data.sku,
            unitOfMeasurement: data.unitOfMeasurement,
            productId: resp.productId,
            productPriceRes: {
              gstPercentage: data.gstPercentage,
              warehousePrice: data.warehousePrice,
              stockListPrice: data.stockListPrice,
              retailerPrice: data.retailerPrice
            }
          }
          console.log("storeData", storeData)
          dispatch(updateProducts(storeData));
          Swal.fire("Success", "Product updated successfully", "success");
          reset();
        }
      } catch (error) {
        Swal.fire("Error", "Unable to Update Product Details");
      }
    } else {
      try {
        handleIsModal();
        const resp = await addNewProduct(values, Cred.token);
        if (resp.productId) {
          dispatch(addProducts({ ...values, productId: resp.productId }));
          Swal.fire("Success", "Product added successfully", "success");
          reset();
        } else {
          Swal.fire("Error", "Product Not Created", "error");
        }
      } catch (error) {
        handleIsModal();
        console.log("Error Adding Product", error);
        Swal.fire("Error", "Unable to Add Product!");
      }
    }
    setButtonLoader(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleDataChange)}>
      {/* {console.log("errors", errors)} */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Product Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Product Name"
          {...register("name")}
        />
        <p className="text-danger">{errors.name?.message}</p>
      </div>
        <div className="mb-3">
          <label htmlFor="sku" className="form-label">
            SKU (Stock Keeping Unit)
          </label>
          <input
            type="text"
            className="form-control"
            id="sku"
            placeholder="Stock Keeping Unit"
            {...register("sku")}
          />
          <p className="text-danger">{errors.sku?.message}</p>
        </div>
      <div className="row g-3">
        <div className="col-lg-6">
          <label htmlFor="sku" className="form-label">
            Measurement value
          </label>
          <input
            type="text"
            className="form-control"
            id="sku"
            placeholder="Measurement Value"
            {...register("measurementValue")}
          />
          <p className="text-danger">{errors.measurementValue?.message}</p>
        </div>
        <div className="col-lg-6">
          <label htmlFor="unit_of_measurement" className="form-label">
            Measurement Unit
          </label>
          <select
            className="form-control"
            id="unit_of_measurement"
            {...register("measurementUnit")}
          >
            <option value="">Select Unit</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="gms">Gram (gms)</option>
            <option value="ml">MilliLiters (ml)</option>
            <option value="L">Liters (L)</option>
            <option value="mg">Milligram (mg)</option>
          </select>
          <p className="text-danger">{errors.measurementUnit?.message}</p>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="warehouse_price" className="form-label">
          Warehouse Price
        </label>
        <input
          type="text"
          className="form-control"
          id="warehouse_price"
          placeholder="Warehouse Price"
          {...register("warehousePrice")}
        />
        <p className="text-danger">{errors.warehousePrice?.message}</p>
      </div>
      <div className="row g-3">
        <div className="col-lg-6">
          <label htmlFor="stockistPrice" className="form-label">
            Stockist Price
          </label>
          <input
            type="text"
            className="form-control"
            id="stockListPrice"
            placeholder="StockList Price"
            {...register("stockListPrice")}
          />
          <p className="text-danger">{errors.stockListPrice?.message}</p>
        </div>
        <div className="col-lg-6">
          <label htmlFor="retailer_price" className="form-label">
            Retailer Price
          </label>
          <input
            type="text"
            className="form-control"
            id="retailer_price"
            placeholder="Retailer Price"
            {...register("retailerPrice")}
          />
          <p className="text-danger">{errors.retailerPrice?.message}</p>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="gst_percentage" className="form-label">
          GST Percentage
        </label>
        <input
          type="text"
          className="form-control"
          id="gst_percentage"
          placeholder="GST Percentage"
          {...register("gstPercentage")}
        />
        <p className="text-danger">{errors.gstPercentage?.message}</p>
      </div>
      <div className="w-100 d-flex gap-2 justify-content-end mt-4 mb-3">
        <button className="btn btn-secondary" onClick={handleIsModal}>
          Done
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

export default ProductModal;
