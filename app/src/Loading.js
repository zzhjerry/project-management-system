import React from 'react'
import ReactLoading from 'react-loading'

export default () => (
  <div className="w-100 d-flex align-items-center" style={{ height: "400px"}}>
    <ReactLoading className="m-auto" type="spin" color="green" height="128px" width="128px"/>
  </div>
)
