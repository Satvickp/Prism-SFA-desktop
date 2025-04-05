import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import PageHeader from '../../../components/common/PageHeader'
import PrimarySalesModal from './form/Modal'
import { useSalesHook } from './sales-hook'
import DataTable from 'react-data-table-component'
import { url } from '../../../constants/api-url'
import { useMemberHook } from '../../../hooks/memberHook'
import { useIsClient } from '../../../helper/isManager'
function PrimarySales() {
  const [isModal, setIsModal] = useState(false)
  const isClient = useIsClient()
  function handleIsModal() {
    setIsModal(!isModal)
  }

  const { get } = useMemberHook()
  useEffect(() => {
    if (!isClient) {
      get()
    }
  }, [isClient])

  const { helperFunctionSales, loading, sales_col, uniqueSaleRecords, Sales } = useSalesHook(true)

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
          headerTitle="Primary Sales"
          renderRight={() => {
            return (
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
                  Add Primary Sale
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

export default PrimarySales
