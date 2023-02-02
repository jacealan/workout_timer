import Nav from "./nav"
import Footer from "./footer"

import { useState, useEffect } from "react"
import { Routes, Route, Outlet, Link } from "react-router-dom"

import {
  Image,
  Box,
  Center,
  Flex,
  Stack,
  VStack,
  HStack,
  Grid,
  GridItem,
  Divider,
  Text,
} from "@chakra-ui/react"

function Layout({ viewSize }) {
  return (
    <Box height={"100vh"}>
      <Box position={"fixed"} top={0} w="100%">
        <Nav viewSize={viewSize} />
      </Box>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        h={"100vh"}
        w={"100%"}
      >
        <Outlet />
      </Flex>
      <Box position={"fixed"} bottom={0} w="100%">
        <Footer viewSize={viewSize} />
      </Box>
    </Box>
  )
}

export default Layout
