import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Loading from "../../../components/UI/Loading";
import PageHeader from "../../../components/common/PageHeader";
import PrimarySalesModal from "../PrimarySales/form/Modal";
import { useSalesHook } from "../PrimarySales/sales-hook";
import { useMemberHook } from "../../../hooks/memberHook";
import DataTable from "react-data-table-component";
import { useIsClient } from "../../../helper/isManager";
function SecondarySales() {
  const [isModal, setIsModal] = useState(false);
  const isClientTrue = useIsClient();
  function handleIsModal() {
    setIsModal(!isModal);
  }

  const { get } = useMemberHook();
  useEffect(() => {
    if (!isClientTrue) {
      get();
    }
  }, [isClientTrue]);

  const {
    Sales,
    helperFunctionSales,
    loading,
    sales_col,
    isClient,
    uniqueSaleRecords,
  } = useSalesHook(false);

  const handleNextPage = (page) => {
    if (page < Sales.totalPages && loading === -1) {
      helperFunctionSales(page);
    }
  };

  return (
    <>
      {false ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Secondary Sales"
            renderRight={() => {
              return isClient ? (
                <div className="col-auto d-flex">
                  <Button
                    variant="primary"
                    onClick={handleIsModal}
                    className="btn btn-primary"
                    disabled={loading != -1}
                  >
                    {loading == 0 ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                    ) : (
                      <i className="icofont-plus-circle me-2 fs-6"></i>
                    )}
                    Add Secondary Sale
                  </Button>
                </div>
              ) : null;
            }}
          />
          <div className="mt-4">
            <DataTable
              columns={sales_col}
              data={uniqueSaleRecords}
              pagination
              paginationServer
              paginationTotalRows={Sales.totalElements}
              paginationDefaultPage={Sales.page + 1}
              onChangePage={handleNextPage}
              highlightOnHover
              responsive
              progressPending={loading === 1}
              progressComponent={
                <div className="text-center py-3">
                  <Spinner animation="border" size="lg" role="status" />
                  <p>Loading orders...</p>
                </div>
              }
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              customStyles={{
                headCells: {
                  style: {
                    backgroundColor: "#f1f5f9",
                    fontWeight: "bold",
                  },
                },
                rows: {
                  style: {
                    minHeight: "30px",
                  },
                },
              }}
            />
          </div>
          <PrimarySalesModal
            handleIsModal={setIsModal}
            isOpen={isModal}
            isPrimary={false}
          />
        </div>
      )}{" "}
    </>
  );
}

export default SecondarySales;
