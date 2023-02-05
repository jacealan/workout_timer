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
import { FaRegClock, FaCalendarDay } from "react-icons/fa"

function Nav({ viewSize }) {
  return (
    <>
      <Center
        bgColor={"black"}
        color={"white"}
        fontSize={24}
        fontWeight={800}
        p={1}
      >
        Workout Timer
        {/* <Grid templateColumns={"30px 1fr 30px"} w="500px" alignItems={"center"}>
          <GridItem>
            <FaRegClock />
          </GridItem>
          <GridItem>
            <Center>Workout Timer</Center>
          </GridItem>
          <GridItem>
            <FaCalendarDay />
          </GridItem>
        </Grid> */}
      </Center>
    </>
  )
}

export default Nav
