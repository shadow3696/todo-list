import React from 'react'
import Table0 from "../../components/table/table"
import { Navigate } from 'react-router-dom'

const TablePage = ({auth}) => {
  return (
    auth ?
    <div>
      <Table0 auth={auth}/>
    </div>
    :
    <Navigate to="/login" />
  )
};

export default TablePage
