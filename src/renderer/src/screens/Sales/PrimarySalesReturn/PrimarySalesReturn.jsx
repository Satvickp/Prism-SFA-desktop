import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import PageHeader from '../../../components/common/PageHeader'
import PrimarySalesModal from './form/Modal'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { useReturnSalesHook } from './return-sales-hook'
function PrimarySalesReturn() {
  const [isModal, setIsModal] = useState(false)
  const navigate = useNavigate()

  function handleIsModal() {
    setIsModal(!isModal)
  }
  const { helperFunctionSales, loading, sales_col, uniqueSaleRecords, Sales } =
    useReturnSalesHook(true)

  const handleNextPage = (page) => {
    page--
    if (page < Sales.totalPages && loading === -1) {
      console.log(page)
      helperFunctionSales(page)
    }
  }

  return (
    <>
      <div className="container-xxl">
        <PageHeader
          headerTitle="Return Primary Sales"
          renderRight={() => {
            return (
              <div className="col-auto d-flex">
                <Button
                  variant="primary"
                  onClick={() => navigate(-1)}
                  className="btn btn-primary"
                  disabled={loading != -1}
                >
                  back
                </Button>
              </div>
            )
          }}
        />
        {/* <FilterComponent onFilterChange={handleFilterChange} /> */}
        <div className="mt-4 ">
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
                  backgroundColor: '#f1f5f9',
                  fontWeight: 'bold'
                }
              },
              rows: {
                style: {
                  minHeight: '41px'
                }
              }
            }}
          />
        </div>
        <PrimarySalesModal handleIsModal={setIsModal} isOpen={isModal} isPrimary={true} />
      </div>
    </>
  )
}

export default PrimarySalesReturn
