import { useState, useEffect } from "react"
import { Routes, Route, Outlet, Link } from "react-router-dom"

import Nav from "./nav"
import Footer from "./footer"

function Layout({ viewSize }) {
  return (
    <>
      <Nav viewSize={viewSize} />
      <Outlet />
      <Footer viewSize={viewSize} />
    </>
  )
}

export default Layout
