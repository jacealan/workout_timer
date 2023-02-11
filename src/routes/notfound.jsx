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
  Button,
  Tooltip,
} from "@chakra-ui/react"

function NotFound() {
  return (
    <>
      <Center w={"100vw"} h={"100vh"} bgColor={"white"}>
        <Box
          w={{ base: "400px", md: "700px" }}
          h={{ base: "400px", md: "700px" }}
          bgImage={"/404.png"}
          bgSize={"cover"}
          position={"relative"}
        />
      </Center>
    </>
  )
}

export default NotFound
