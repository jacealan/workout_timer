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
      </Center>
    </>
  )
}

export default Nav
