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

  const [roundCount, setRoundCount] = useState(12)
  const [roundTime, setRoundTime] = useState(60)
  const [restTime, setRestTime] = useState(30)
  const [prepareTime, setPrepareTime] = useState(25)
  const [roundEndWarningTime, setRoundEndWarningTime] = useState(10)

  const [roundList, setCountList] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ])
  const [playingRound, setPlayingRound] = useState(2)
  const [isRound, setIsRound] = useState(true)
  const preSecond = useRef(0)

  const bell = new Audio(
    "https://www.myinstants.com/media/sounds/boxing-bell.mp3"
  )
  const tick = new Audio(
    "https://www.myinstants.com/media/sounds/tick-deepfrozenapps-397275646-2.mp3"
  )

  return (
    <>
      <Center bgColor={"black"} color={"white"} padding={10}>
        <VStack>
          <CountdownCircleTimer
            updateInterval={0}
            size={500}
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
                remainingTime.toFixed(0) !== preSecond.current.toFixed(0)
              ) {
                tick.play()
              }
              preSecond.current = remainingTime

              return (
                <>
                  <VStack>
                    <Box>{isRound ? "ROUND" : "REST"}</Box>
                    <Center>
                      <Button
                        onClick={() => setRoundCount((prev) => --prev)}
                        colorScheme={"blackAlpha"}
                        p={1}
                      >
                        −
                      </Button>
                      {playingRound} / {roundCount}
                      <Button
                        onClick={() => setRoundCount((prev) => ++prev)}
                        colorScheme={"blackAlpha"}
                        p={1}
                      >
                        +
                      </Button>
                    </Center>
                    <HStack>
                      {roundList.map((round, index) => (
                        <>
                          <Box
                            color={index + 1 <= playingRound ? "white" : "#555"}
                          >
                            {index + 1 === playingRound ? "⦿" : "⬤"}
                          </Box>
                        </>
                      ))}
                    </HStack>
                    <Box fontSize={150}>
                      {minutes}:{seconds.toString().padStart(2, "0")}
                    </Box>
                    <Button
                      colorScheme={"whiteAlpha"}
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
          {/*  */}
          {/* Round Time */}
          <HStack>
            <Button
              onClick={() => {
                const newRoundTime = roundTime - 10
                setRoundTime(newRoundTime)
                setDuration(newRoundTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              -10
            </Button>
            <Button
              onClick={() => {
                const newRoundTime = roundTime - 1
                setRoundTime(newRoundTime)
                setDuration(newRoundTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              -1
            </Button>
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Box fontSize={50} h={58} w={150} textAlign={"center"}>
                {Math.floor(roundTime / 60)}:
                {(roundTime % 60).toString().padStart(2, "0")}
              </Box>
              <Box p={"0 10px 0 10px"} mt={1} fontSize={10}>
                Round Time
              </Box>
            </Flex>
            <Button
              onClick={() => {
                const newRoundTime = roundTime + 1
                setRoundTime(newRoundTime)
                setDuration(newRoundTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              +1
            </Button>
            <Button
              onClick={() => {
                const newRoundTime = roundTime + 10
                setRoundTime(newRoundTime)
                setDuration(newRoundTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              +10
            </Button>
          </HStack>
          {/*  */}
          {/* Rest Time */}
          <HStack>
            <Button
              onClick={() => {
                const newRestTime = restTime - 10
                setRestTime(newRestTime)
                setDuration(newRestTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              -10
            </Button>
            <Button
              onClick={() => {
                const newRestTime = restTime - 1
                setRestTime(newRestTime)
                setDuration(newRestTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              -1
            </Button>
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Box fontSize={50} h={58} w={150} textAlign={"center"}>
                {Math.floor(restTime / 60)}:
                {(restTime % 60).toString().padStart(2, "0")}
              </Box>
              <Box p={"0 10px 0 10px"} mt={1} fontSize={10}>
                Rest Time
              </Box>
            </Flex>
            <Button
              onClick={() => {
                const newRestTime = restTime + 1
                setRestTime(newRestTime)
                setDuration(newRestTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              +1
            </Button>
            <Button
              onClick={() => {
                const newRestTime = restTime + 10
                setRestTime(newRestTime)
                setDuration(newRestTime)
              }}
              colorScheme={"whiteAlpha"}
            >
              +10
            </Button>
          </HStack>
          {/*  */}
          {/* Prepare Time */}
          <HStack>
            <Button
              onClick={() => setPrepareTime((prev) => prev - 10)}
              colorScheme={"whiteAlpha"}
            >
              -10
            </Button>
            <Button
              onClick={() => setPrepareTime((prev) => prev - 1)}
              colorScheme={"whiteAlpha"}
            >
              -1
            </Button>
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Box fontSize={50} h={58} w={150} textAlign={"center"}>
                {Math.floor(prepareTime / 60)}:
                {(prepareTime % 60).toString().padStart(2, "0")}
              </Box>
              <Box p={"0 10px 0 10px"} mt={1} fontSize={10}>
                Prepare Time
              </Box>
            </Flex>
            <Button
              onClick={() => setPrepareTime((prev) => prev + 1)}
              colorScheme={"whiteAlpha"}
            >
              +1
            </Button>
            <Button
              onClick={() => setPrepareTime((prev) => prev + 10)}
              colorScheme={"whiteAlpha"}
            >
              +10
            </Button>
          </HStack>
          {/*  */}
          {/* Round End Warning Time */}
          <HStack>
            <Button
              onClick={() => setRoundEndWarningTime((prev) => prev - 10)}
              colorScheme={"whiteAlpha"}
            >
              -10
            </Button>
            <Button
              onClick={() => setRoundEndWarningTime((prev) => prev - 1)}
              colorScheme={"whiteAlpha"}
            >
              -1
            </Button>
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Box fontSize={50} h={58} w={150} textAlign={"center"}>
                {Math.floor(roundEndWarningTime / 60)}:
                {(roundEndWarningTime % 60).toString().padStart(2, "0")}
              </Box>
              <Box p={"0 10px 0 10px"} mt={1} fontSize={10}>
                Round End Warning Time
              </Box>
            </Flex>
            <Button
              onClick={() => setRoundEndWarningTime((prev) => prev + 1)}
              colorScheme={"whiteAlpha"}
            >
              +1
            </Button>
            <Button
              onClick={() => setRoundEndWarningTime((prev) => prev + 10)}
              colorScheme={"whiteAlpha"}
            >
              +10
            </Button>
          </HStack>
        </VStack>
      </Center>
    </>
  )
}

export default Home
