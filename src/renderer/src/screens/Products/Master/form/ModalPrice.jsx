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
  const [imagePreview, setImagePreview] = useState(null);

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
      console.log(selectedOption)
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
  
  const loadDefaultProductOptions = () => {
    const options = Product.map((product) => ({
      label: `${product.name}  (${product.sku})`,
      value: product.productId,
      name: product.name,
      sku: product.sku,
    }));

    return options
  };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
          Swal.fire("Error", "File size exceeds 2MB", "error");
          return;
        }
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          Swal.fire("Error", "Only JPEG or PNG files are allowed", "error");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setValue("imageUrl", reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const isBase64Image = (imagePreview) => {
      const base64Regex = /^data:image\/[a-zA-Z]+;base64,[^\s]+$/;
      return base64Regex.test(imagePreview) ? imagePreview.split(",")[1] : "";
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
        productCode: val.productCode,
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
        bundleSize: Number(values.bundleSize),
        productCode: values.productCode,
        status: "ACTIVE",
        imageUrl: isBase64Image(imagePreview)
      };

      if (editData) {
        const resp = await updateProduct(data, editData.productId, Cred.token);
        if (resp.productId) {
          dispatch(updateProducts({ ...values, imageUrl: resp.imageUrl }));
          Swal.fire("Success", "Product updated successfully", "success");
          reset();
        }
      } else {
        console.log("current price data", data)
        const resp = await addNewProduct(data, Cred.token);
        if (resp.productId) {
          dispatch(addProducts({ ...data, productId: resp.productId, imageUrl: resp.imageUrl }));
          Swal.fire("Success", "Product added successfully", "success");
          reset();
        }
      }
      handleIsModal();
    } catch (error) {
      console.log("Error ::", error)
      Swal.fire("Error", "Unable to save product details.", "error");
    }
    setButtonLoader(false);
    setImagePreview(null)
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
          defaultOptions={loadDefaultProductOptions()}
          loadOptions={loadProductOptions}
          onChange={handleProductSelection}
          placeholder="Search or add a new product"
        />
        <p className="text-danger">{errors.name?.message}</p>
      </div>
      <div className="mb-3">
        <label htmlFor="bundle_size" className="form-label">
          Bundle Size
        </label>
        <input
          type="text"
          className="form-control"
          id="bundle_size"
          placeholder="Bundle Size"
          {...register("bundleSize")}
        />
        <p className="text-danger">{errors.bundleSize?.message}</p>
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
{/* Product Code */}
      <div className="mb-3">
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
          Stockist Price
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

      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Product Image
        </label>
        <input
          type="file"
          className="form-control"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        )}
        <p className="text-danger">{errors.imageUrl?.message}</p>
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
