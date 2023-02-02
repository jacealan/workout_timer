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
      <Center bgColor={"black"} color={"white"} fontSize={20} fontWeight={500}>
        &copy; Appist.kr
      </Center>
    </>
  )
}

export default Nav
