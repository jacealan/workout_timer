import { useState, useEffect } from "react"
import { Routes, Route, Outlet, Link } from "react-router-dom"

import Layout from "./components/layout"
import Home from "./routes/home"
import NotFound from "./routes/notfound"

function App() {
  const [viewSize, setViewSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })

  useEffect(() => {
    window.addEventListener("resize", () => {
      setViewSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      })
    })
  }, [])

  return (
    <Routes basename={`${process.env.PUBLIC_URL}`}>
      <Route
        path={`${process.env.PUBLIC_URL}/`}
        element={<Layout viewSize={viewSize} />}
      >
        <Route index element={<Home viewSize={viewSize} />} />
        <Route path="*" element={<NotFound viewSize={viewSize} />} />
      </Route>
    </Routes>
  )
}

export default App
