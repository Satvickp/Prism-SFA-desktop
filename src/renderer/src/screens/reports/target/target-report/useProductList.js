import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showError } from "../../../../helper/exportFunction";
import { getAllProducts as apiGetAllProduct } from "../../../../api/products/products-api";
import { dispatchProductContent } from "../../../../redux/features/product-slice";

export const useProductList = () => {
  const [loading, setLoading] = useState(false);
  const productFeature = useSelector((state) => state.productFeature);
  const dispatch = useDispatch();
  const Cred = useSelector((state) => state.Cred);

  async function helperCallProduct() {
    if (productFeature?.content?.length > 0) return;
    setLoading(true);
    try {
      const resp = await apiGetAllProduct(Cred.token, 0, 500);
      dispatch(
        dispatchProductContent({
          content: resp.content,
        })
      );
    } catch (error) {
      showError(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    helperCallProduct();
  }, []);

  return {
    loading,
    productList: productFeature.content,
  };
};
