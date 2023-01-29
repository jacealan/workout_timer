import { useState, useEffect, useRef } from "react"
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
  const [duration, setDuration] = useState(60)

  const [roundTime, setRoundTime] = useState(60)
  const [restTime, setRestTime] = useState(30)
  const [prepareTime, setPrepareTime] = useState(25)
  const [roundEndWarningTime, setRoundEndWarningTime] = useState(10)
  const [preSecond, setPreSecond] = useState(0)

  const bell = new Audio(
    "https://www.myinstants.com/media/sounds/boxing-bell.mp3"
  )
  const tick = new Audio(
    "https://www.myinstants.com/media/sounds/tick-deepfrozenapps-397275646-2.mp3"
  )

  return (
    <>
      <Center>
        <VStack>
          <CountdownCircleTimer
            updateInterval={0}
            size={300}
            strokeLinecap={"round"}
            strokeWidth={20}
            trailStrokeWidth={20}
            // trailColor={"black"}
            isPlaying={isPlaying}
            duration={duration}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[duration, duration - 10, roundEndWarningTime, 0]}
            isSmoothColorTransition={true}
            onComplete={() => {
              bell.play()
              return { shouldRepeat: true, delay: 0 } // repeat animation in 1.5 seconds
            }}
          >
            {({ elapsedTime, remainingTime }) => {
              const minutes = Math.floor(remainingTime / 60)
              const seconds = remainingTime % 60
              if (
                remainingTime <= roundEndWarningTime &&
                remainingTime.toFixed(0) !== preSecond.toFixed(0)
              ) {
                tick.play()
              }
              setPreSecond(remainingTime)

              return (
                <>
                  <VStack>
                    <Box fontSize={50}>
                      {minutes}:{seconds.toString().padStart(2, "0")}
                    </Box>
                    <Button
                      onClick={() => {
                        // bell.play()
                        if (elapsedTime === 0) {
                          bell.play()
                        }
                        setIsPlaying((prev) => !prev)
                      }}
                    >
                      {isPlaying ? "STOP" : "START"}
                    </Button>
                  </VStack>
                </>
              )
            }}
          </CountdownCircleTimer>
        </VStack>
      </Center>
    </>
  )
}

export default Home
