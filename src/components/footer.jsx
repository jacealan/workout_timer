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
        color={"grey"}
        fontSize={16}
        fontWeight={300}
        p={1}
      >
        &copy; Appist.kr &copy;
        {new Date().getFullYear()}
      </Center>
    </>
  )
}

export default Nav
