import { useDispatch, useSelector } from "react-redux";
import { permissionIds } from "../constants/constants";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {
  deleteAllProducts,
  setProducts,
} from "../redux/features/productsSlice";
import { getAllProducts } from "../api/products/products-api";

export function useProductHook( requestedPage=0, requestedSize=0) {
  const Dispatch = useDispatch();
  const { content, paginationData } = useSelector((state) => state.Products);
  const Cred = useSelector((state) => state.Cred);
  const MemberPermission = useSelector(
    (state) => state.Permission.memberPermissions
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(500);

  const setNewPage = (newPage) => {
    setPage(newPage);
  };

  const setNewSize = (newSize) => {
    setSize(newSize);
  };

  async function getAllProduct() {
    if (
      MemberPermission?.some(item => 
        item == permissionIds.SUPER_ADMIN || 
        item == permissionIds.REPORTING_MANAGER ||
        item == permissionIds.VIEW_MANAGER
      )
    ) {
      setIsLoading(true);
      try {
        if (content.length === 0) {
          Dispatch(deleteAllProducts());
          if(requestedPage) setPage(requestedPage);
          if(requestedSize) setSize(requestedSize);
          const ProductsArray = await getAllProducts(Cred.token, page, size);
          if (ProductsArray.content.length >= 0) {
            Dispatch(setProducts(ProductsArray));
          }
        }
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Can't Fetch Products. Please try After Some Time",
          icon: "error",
        });
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (Cred) {
      getAllProduct();
    }
  }, [page, size, Cred]);

  return {
    getAllProduct,
    isLoading,
    isError,
    page,
    size,
    setNewPage,
    setNewSize,
  };
}
