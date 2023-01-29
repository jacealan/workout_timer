import { useState, useEffect } from "react"
import { Routes, Route, Outlet, Link } from "react-router-dom"

import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer"

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
} from "@chakra-ui/react"

function Home({ viewSize }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <>
      <Center>HOME</Center>
      <CountdownCircleTimer
        isPlaying={true}
        duration={7}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[7, 5, 2, 0]}
        onComplete={() => {
          return { shouldRepeat: true, delay: 3 }
        }}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>

      <CountdownCircleTimer
        path="test"
        size={300}
        strokeLinecap={"round"}
        strokeWidth={30}
        trailStrokeWidth={10}
        trailColor={"black"}
        isPlaying={isPlaying}
        duration={65}
        colors="#A30000"
        onComplete={() => {
          // do your stuff here
          return { shouldRepeat: true, delay: 1.5 } // repeat animation in 1.5 seconds
        }}
      >
        {({ elapsedTime, remainingTime, path }) => {
          const minutes = Math.floor(remainingTime / 60)
          const seconds = remainingTime % 60
          return (
            <>
              <VStack>
                <Box>
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </Box>
                <Box>{`${elapsedTime.toFixed(
                  0
                )} ${path} ${remainingTime}`}</Box>
                <Button onClick={() => setIsPlaying((prev) => !prev)}>
                  {isPlaying ? "STOP" : "START"}
                </Button>
              </VStack>
            </>
          )
        }}
      </CountdownCircleTimer>

      <CountdownCircleTimer
        isPlaying
        duration={60}
        initialRemainingTime={15}
        colors="#A30000"
      />
    </>
  )
}

export default Home
