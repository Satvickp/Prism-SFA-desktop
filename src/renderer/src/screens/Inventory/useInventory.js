import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllInventoryByMemberId,
  getAllInventoryWithProductAndClientFilter,
} from "../../api/inventory/inventory-api";
import {
  concatInventory,
  setInventory,
} from "../../redux/features/inventorySlice";
import Swal from "sweetalert2";
import { useIsClient, useIsSuperAdmin } from "../../helper/isManager";

// -1 no-loader
// 0 paginationTableCall 1 for next page

function useInventory() {
  const { paginationData, allInventory } = useSelector(
    (state) => state.Inventory
  );
  const [loading, setLoading] = useState(-1);
  const dispatch = useDispatch();
  const isMember = JSON.parse(window.localStorage.getItem("isMember"));
  const isClient = useIsClient();
  const Cred = useSelector((state) => state.Cred);
  const [selectedClient, setSelectedClient] = useState(null);
  const isSuperAdmin = useIsSuperAdmin();
  async function helperFunctionInventory(page, clientId = null) {
    setLoading(page == 0 ? 1 : 0);
    try {
      let pageSize = 10;
      let actualClientId = clientId ?? (isMember ? Cred.sub : null);
      const resp = await (isClient || actualClientId || isSuperAdmin
        ? getAllInventoryWithProductAndClientFilter(
            actualClientId !== null ? actualClientId : Cred.sub,
            page,
            pageSize,
            Cred.token
          )
        : getAllInventoryByMemberId(Cred.sub, 0, pageSize, Cred.token));

      dispatch(
        page === 0
          ? dispatch(
              setInventory({
                allInventory: resp.content,
                paginationData: {
                  page: resp.page,
                  totalPages: resp.totalPages,
                  totalElements: resp.totalElements,
                },
              })
            )
          : dispatch(
              concatInventory({
                allInventory: resp.content,
                paginationData: {
                  page: resp.page,
                  totalPages: resp.totalPages,
                  totalElements: resp.totalElements,
                },
              })
            )
      );
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Orders. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(-1);
  }

  useEffect(() => {
    helperFunctionInventory(0);
  }, []);
  console.clear();
  const table_columns = useMemo(() => {
    const common_cols = [
      {
        name: "Image",
        selector: (row) => row?.productRes?.imageUrl,
        cell: (row) => (
          <img
            src={row?.productRes?.imageUrl}
            alt={row.name}
            style={{
              width: 25,
              height: 25,
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ),
        sortable: false,
        width: "150px",
      },
      {
        name: "Product Name",
        selector: (row) => row.productRes.name,
        sortable: true,
        width: "240px",
      },
      {
        name: "SKU",
        selector: (row) => row.productRes.sku,
        sortable: true,
        // width: "300px",
      },
      {
        name: "Unit Price",
        selector: (row) =>
          "₹ " + row?.productRes?.productPriceRes?.warehousePrice ?? "N/A",
        sortable: true,
        width: "200px",
      },
      {
        name: "In Stock",
        selector: (row) => row.quantity,
        sortable: true,
      },
    ];
    if (isMember && selectedClient === null) {
      common_cols.splice(2, 0, {
        name: "Client Name",
        selector: (row) =>
          row?.clientFMCGResponse?.clientFirstName +
            row?.clientFMCGResponse?.clientLastName ?? "N/A",
        sortable: true,
        width: "200px",
      });
    }
    return common_cols;
  }, [allInventory]);

  const conditionalRowStyles = [
    {
      when: (row) => row.quantity < 10,
      style: {
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    },
  ];

  return {
    paginationData,
    allInventory,
    helperFunctionInventory,
    loading,
    table_columns,
    isMember,
    isClient,
    selectedClient,
    setSelectedClient,
    conditionalRowStyles,
  };
}

export default useInventory;
