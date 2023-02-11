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
          bgImage={"/404.jpg"}
          bgSize={"cover"}
          position={"relative"}
        >
          <Box position={"absolute"} bottom={0} w={"100%"}>
            <Center w={"100%"} color={"#DDD"}>
              designed by <a href="//vecteezy.com">vecteezy.com</a>
            </Center>
          </Box>
        </Box>
      </Center>
    </>
  )
}

export default NotFound
