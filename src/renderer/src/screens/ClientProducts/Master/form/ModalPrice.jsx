import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";
import {
  addProducts,
  updateProducts,
} from "../../../../redux/features/productsSlice";
import {
  addNewProduct,
  updateProduct,
} from "../../../../api/products/products-api";
import { Schema } from "./schemaPrice";

const handleUnitOfMeasurement = (unitOfMeasurement) => {
  const value = parseFloat(unitOfMeasurement);
  const measurementUnit = unitOfMeasurement.replace(value, "").trim();
  return {
    measurementValue: value,
    measurementUnit,
  };
};

function ProductPriceModal({ editData, handleIsModal }) {
  const Cred = useSelector((state) => state.Cred);
  const Product = useSelector((state) => state.Products.content);
  const [buttonLoader, setButtonLoader] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const handleProductSelection = (selectedOption) => {
    if (selectedOption) {
      // Auto-fill the product name and SKU
      setValue("name", selectedOption.name);
      setValue("sku", selectedOption.sku);
    }
  };

  const loadProductOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }

    const filteredProducts = Product.filter((product) =>
      product.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    const options = filteredProducts.map((product) => ({
      label: product.name,
      value: product.productId,
      name: product.name,
      sku: product.sku,
    }));

    callback(options);
  };

  useEffect(() => {
    if (editData) {
      const val = handleUnitOfMeasurement(editData.unitOfMeasurement);
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
  }, [editData, reset]);

  const handleDataChange = async (values) => {
    setButtonLoader(true);
    try {
      const data = {
        name: values.name,
        sku: values.sku,
        unitOfMeasurement: `${values.measurementValue}${values.measurementUnit}`,
        warehousePrice: values.warehousePrice,
        gstPercentage: values.gstPercentage,
        stockListPrice: values.stockListPrice,
        retailerPrice: values.retailerPrice,
      };

      if (editData) {
        const resp = await updateProduct(data, editData.productId, Cred.token);
        if (resp.productId) {
          dispatch(updateProducts({ ...values }));
          Swal.fire("Success", "Product updated successfully", "success");
          reset();
        }
      } else {
        const resp = await addNewProduct(data, Cred.token);
        if (resp.productId) {
          dispatch(addProducts({ ...data, productId: resp.productId }));
          Swal.fire("Success", "Product added successfully", "success");
          reset();
        }
      }
      handleIsModal();
    } catch (error) {
      Swal.fire("Error", "Unable to save product details.", "error");
    }
    setButtonLoader(false);
  };

  return (
    <form onSubmit={handleSubmit(handleDataChange)}>
      {/* Async Product Selector */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Product Name
        </label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadProductOptions}
          onChange={handleProductSelection}
          placeholder="Search or add a new product"
        />
        <p className="text-danger">{errors.name?.message}</p>
      </div>

      {/* SKU Input */}
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

      {/* Warehouse Price */}
      <div className="mb-3">
        <label htmlFor="warehousePrice" className="form-label">
          Warehouse Price
        </label>
        <input
          type="text"
          className="form-control"
          id="warehousePrice"
          placeholder="Warehouse Price"
          {...register("warehousePrice")}
        />
        <p className="text-danger">{errors.warehousePrice?.message}</p>
      </div>

      {/* GST Percentage */}
      <div className="mb-3">
        <label htmlFor="gstPercentage" className="form-label">
          GST Percentage
        </label>
        <input
          type="text"
          className="form-control"
          id="gstPercentage"
          placeholder="GST Percentage"
          {...register("gstPercentage")}
        />
        <p className="text-danger">{errors.gstPercentage?.message}</p>
      </div>

      {/* Stock List Price */}
      <div className="mb-3">
        <label htmlFor="stockListPrice" className="form-label">
          Stock List Price
        </label>
        <input
          type="text"
          className="form-control"
          id="stockListPrice"
          placeholder="Stock List Price"
          {...register("stockListPrice")}
        />
        <p className="text-danger">{errors.stockListPrice?.message}</p>
      </div>

      {/* Retailer Price */}
      <div className="mb-3">
        <label htmlFor="retailerPrice" className="form-label">
          Retailer Price
        </label>
        <input
          type="text"
          className="form-control"
          id="retailerPrice"
          placeholder="Retailer Price"
          {...register("retailerPrice")}
        />
        <p className="text-danger">{errors.retailerPrice?.message}</p>
      </div>

      <div className="col-lg-6">
          <label htmlFor="productCode" className="form-label">
            Product Code
          </label>
          <input
            type="text"
            className="form-control"
            id="productCode"
            placeholder="Product Code"
            {...register("productCode")}
          />
          <p className="text-danger">{errors.productCode?.message}</p>
        </div>

      {/* Measurement Unit */}
      <div className="mb-3">
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

      {/* Measurement Value */}
      <div className="mb-3">
        <label htmlFor="measurementValue" className="form-label">
          Measurement Value
        </label>
        <input
          type="text"
          className="form-control"
          id="measurementValue"
          placeholder="Measurement Value"
          {...register("measurementValue")}
        />
        <p className="text-danger">{errors.measurementValue?.message}</p>
      </div>

      {/* Submit Button */}
      <div className="w-100 d-flex gap-2 justify-content-end mt-4 mb-3">
        <button className="btn btn-secondary" onClick={handleIsModal}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {buttonLoader ? <Spinner animation="border" size="sm" /> : "Save"}
        </button>
      </div>
    </form>
  );
}

export default ProductPriceModal;
