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
import { RepeatClockIcon } from "@chakra-ui/icons"

const toMMSS = (second) => {
  const mm = Math.floor(second / 60).toString()
  const ss = (second % 60).toString().padStart(2, "0")
  return `${mm}:${ss}`
}

function Home({ viewSize }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(60)
  const [remaingDurationTime, setRemainingDurationTime] = useState(duration)

  const [workout, setWorkout] = useState([])
  const [totalTime, setTotalTime] = useState(0)
  const [elapsedTotalTime, setElapsedTotalTime] = useState(0)
  const [remainingTotalTime, setRemainingTotalTime] = useState(totalTime)
  const [nowRound, setNowRound] = useState(1)
  const [workoutIndex, setWorkoutIndex] = useState(0)
  const workoutIndexElapsedTime = useRef(0)

  const [roundCount, setRoundCount] = useState(12)
  const [prepareTime, setPrepareTime] = useState(25)
  const [roundTime, setRoundTime] = useState(60)
  const [roundEndWarningTime, setRoundEndWarningTime] = useState(10)
  const [restTime, setRestTime] = useState(30)

  const [roundList, setRoundList] = useState(new Array(roundCount).fill(0))
  const [playingRound, setPlayingRound] = useState(0)
  const [isRound, setIsRound] = useState(true)
  const preSecond = useRef(0)

  const bell = new Audio(
    "https://www.myinstants.com/media/sounds/boxing-bell.mp3"
  )
  const tick = new Audio(
    "https://www.myinstants.com/media/sounds/tick-deepfrozenapps-397275646-2.mp3"
  )

  const nice = new Audio(
    "https://www.myinstants.com/media/sounds/nice-shot-wii-sports.mp3"
  )

  const makeWorkout = () => {
    const newWorkout = [{ title: "prepare", duration: prepareTime }]
    let newTotalTime = prepareTime
    for (let i = 1; i <= roundCount; i++) {
      newWorkout.push({ title: "round", round: i, duration: roundTime })
      newTotalTime += roundTime
      if (i !== roundCount) {
        newWorkout.push({ title: "rest", duration: restTime })
        newTotalTime += restTime
      } else {
        newWorkout.push({ title: "done" })
      }
    }

    setWorkout(JSON.parse(JSON.stringify(newWorkout)))
    setTotalTime(newTotalTime)
    setElapsedTotalTime(0)
    setRemainingTotalTime(newTotalTime)

    setPlayingRound(0)
    setWorkoutIndex(0)
    setDuration(newWorkout[0].duration)
    setRemainingDurationTime(newWorkout[0].duration)

    console.log(newWorkout)
    console.log(toMMSS(newTotalTime))
    console.log(newWorkout[workoutIndex].duration)
  }

  const playWorkout = () => {
    setElapsedTotalTime((prev) => ++prev)
    setRemainingTotalTime((prev) => --prev)
    setRemainingDurationTime((prev) => --prev)

    if (remaingDurationTime == 0) {
      const newWorkoutIndex = workoutIndex + 1
      setWorkoutIndex((prev) => ++prev)
      setDuration(workout[newWorkoutIndex].duration)
      setRemainingDurationTime(workout[newWorkoutIndex].duration)
      if (workout[newWorkoutIndex].title === "round") {
        setPlayingRound((prev) => ++prev)
      }
      if (workout[newWorkoutIndex].title === "done") {
        console.log("done")
        setTimeout(makeWorkout, 500)
        setPlayingRound(0)
        setWorkoutIndex(0)
        setIsPlaying(false)
        nice.play()
      }
    }
  }

  useEffect(() => {
    makeWorkout()
  }, [])

  useEffect(() => makeWorkout(), [roundCount, roundTime, restTime, prepareTime])

  return (
    <>
      <Center bgColor={"black"} color={"white"} padding={10}>
        <VStack>
          <CountdownCircleTimer
            key={workoutIndex}
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
              //   console.log(workoutIndex, workout.length)
              //   if (workoutIndex === workout.length - 2) {
              //     setIsPlaying(false)
              //     nice.play()
              //     return { shouldRepeat: true, delay: 0 } // repeat animation in 1.5 seconds
              //   } else {
              //     bell.play()
              return { shouldRepeat: true, delay: 0 } // repeat animation in 1.5 seconds
              //   }
            }}
            onUpdate={(remainingTime) => {
              // console.log(workoutIndex, workout.length)
              // if (workoutIndex === workout.length - 2) {
              //   setIsPlaying(false)
              //   nice?.play()
              // } else {
              //   bell?.play()
              // }
              // tick.play()
              playWorkout()
              if (remainingTime <= roundEndWarningTime) {
                tick.play()
              }
            }}
            // onUpdate={({ remainingTime }) => {
            //   if (remainingTime?.toFixed(0) !== preSecond.current?.toFixed(0)) {
            //     playWorkout()
            //     if (remainingTime <= roundEndWarningTime) {
            //       tick.play()
            //     }
            //   }
            //   preSecond.current = remainingTime
            // }}
          >
            {({ elapsedTime, remainingTime }) => {
              const minutes = Math.floor(remainingTime / 60)
              const seconds = remainingTime % 60
              if (elapsedTime.toFixed(0) !== preSecond.current.toFixed(0)) {
                // playWorkout()
                // if (remainingTime <= roundEndWarningTime) {
                //   tick.play()
                // }
              }
              preSecond.current = elapsedTime

              return (
                <>
                  <VStack>
                    <Box>
                      {/* {isRound ? "ROUND" : "REST"} */}
                      {workout[workoutIndex]?.title.toUpperCase()}
                    </Box>
                    <Center style={{ margin: 0 }}>
                      <Button
                        onClick={() => {
                          setRoundList(new Array(roundCount - 1).fill(0))
                          setRoundCount((prev) => --prev)
                        }}
                        colorScheme={"blackAlpha"}
                        p={1}
                      >
                        −
                      </Button>
                      {playingRound} / {roundCount}
                      <Button
                        onClick={() => {
                          setRoundList(new Array(roundCount + 1).fill(0))
                          setRoundCount((prev) => ++prev)
                        }}
                        colorScheme={"blackAlpha"}
                        p={1}
                      >
                        +
                      </Button>
                    </Center>
                    <VStack style={{ margin: 0 }}>
                      <HStack>
                        {roundList.map((round, index) => (
                          <div key={index}>
                            <Box
                              color={
                                index + 1 <= playingRound ? "white" : "#555"
                              }
                            >
                              {index + 1 === playingRound ? "⦿" : "⬤"}
                            </Box>
                          </div>
                        ))}
                      </HStack>
                      <Flex
                        justifyContent={"space-between"}
                        w="100%"
                        style={{ margin: 0 }}
                      >
                        <Box>{toMMSS(elapsedTotalTime)}</Box>
                        <Box>{toMMSS(remainingTotalTime)}</Box>
                      </Flex>
                    </VStack>
                    <Box fontSize={150} style={{ margin: 0 }}>
                      {/* {minutes}:{seconds.toString().padStart(2, "0")} */}
                      {toMMSS(remaingDurationTime)}
                    </Box>
                    <Button
                      colorScheme={"whiteAlpha"}
                      onClick={() => {
                        // makeWorkout()
                        if (elapsedTime === 0) {
                          bell.play()
                        }
                        setIsPlaying((prev) => !prev)
                      }}
                      style={{ margin: 0 }}
                    >
                      {isPlaying ? "PAUSE" : "START"}
                    </Button>
                    <Box onClick={makeWorkout}>
                      <RepeatClockIcon />
                    </Box>
                  </VStack>
                </>
              )
            }}
          </CountdownCircleTimer>
          <Box h={10} />
          <Flex justifyContent={"space-between"} w="100%">
            {/*  */}
            {/* Prepare Time */}
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
              border={"solid 1px white"}
              borderRadius={20}
              p={"10px 0"}
            >
              <HStack>
                <Button
                  onClick={() => setPrepareTime((prev) => prev - 1)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -1
                </Button>
                <Button
                  onClick={() => setPrepareTime((prev) => prev - 10)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -10
                </Button>
              </HStack>
              <Flex
                flexDirection={"column"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <Box fontSize={35} h={35} w={110} textAlign={"center"}>
                  {Math.floor(prepareTime / 60)}:
                  {(prepareTime % 60).toString().padStart(2, "0")}
                </Box>
                <Box p={"0 10px 10px 10px"} mt={1} fontSize={10}>
                  Prepare Time
                </Box>
              </Flex>
              <HStack>
                <Button
                  onClick={() => setPrepareTime((prev) => prev + 1)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +1
                </Button>
                <Button
                  onClick={() => setPrepareTime((prev) => prev + 10)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +10
                </Button>
              </HStack>
            </Flex>
            {/*  */}
            {/* Round Time */}
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
              border={"solid 1px white"}
              borderRadius={20}
              p={"10px 0"}
            >
              <HStack>
                <Button
                  onClick={() => {
                    const newRoundTime = roundTime - 1
                    setRoundTime(newRoundTime)
                    // setDuration(newRoundTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -1
                </Button>
                <Button
                  onClick={() => {
                    const newRoundTime = roundTime - 10
                    setRoundTime(newRoundTime)
                    // setDuration(newRoundTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -10
                </Button>
              </HStack>
              <Box fontSize={35} h={35} w={110} textAlign={"center"}>
                {Math.floor(roundTime / 60)}:
                {(roundTime % 60).toString().padStart(2, "0")}
              </Box>
              <Box p={"0 10px 10px 10px"} mt={1} fontSize={10}>
                Round Time
              </Box>
              <HStack>
                <Button
                  onClick={() => {
                    const newRoundTime = roundTime + 1
                    setRoundTime(newRoundTime)
                    // setDuration(newRoundTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +1
                </Button>
                <Button
                  onClick={() => {
                    const newRoundTime = roundTime + 10
                    setRoundTime(newRoundTime)
                    // setDuration(newRoundTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +10
                </Button>
              </HStack>
            </Flex>
            {/*  */}
            {/* Round End Warning Time */}
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
              border={"solid 1px white"}
              borderRadius={20}
              p={"10px 0"}
            >
              <HStack>
                <Button
                  onClick={() => setRoundEndWarningTime((prev) => prev - 1)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -1
                </Button>
                <Button
                  onClick={() => setRoundEndWarningTime((prev) => prev - 10)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -10
                </Button>
              </HStack>
              <Flex
                flexDirection={"column"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <Box fontSize={35} h={35} w={110} textAlign={"center"}>
                  {Math.floor(roundEndWarningTime / 60)}:
                  {(roundEndWarningTime % 60).toString().padStart(2, "0")}
                </Box>
                <Box p={"0 10px 10px 10px"} mt={1} fontSize={10}>
                  Round End Warning
                </Box>
              </Flex>
              <HStack>
                <Button
                  onClick={() => setRoundEndWarningTime((prev) => prev + 1)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +1
                </Button>
                <Button
                  onClick={() => setRoundEndWarningTime((prev) => prev + 10)}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +10
                </Button>
              </HStack>
            </Flex>

            {/*  */}
            {/* Rest Time */}
            <Flex
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems={"center"}
              border={"solid 1px white"}
              borderRadius={20}
              p={"10px 0"}
            >
              <HStack>
                <Button
                  onClick={() => {
                    const newRestTime = restTime - 1
                    setRestTime(newRestTime)
                    // setDuration(newRestTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -1
                </Button>
                <Button
                  onClick={() => {
                    const newRestTime = restTime - 10
                    setRestTime(newRestTime)
                    // setDuration(newRestTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  -10
                </Button>
              </HStack>
              <Flex
                flexDirection={"column"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <Box fontSize={35} h={35} w={110} textAlign={"center"}>
                  {Math.floor(restTime / 60)}:
                  {(restTime % 60).toString().padStart(2, "0")}
                </Box>
                <Box p={"0 10px 10px 10px"} mt={1} fontSize={10}>
                  Rest Time
                </Box>
              </Flex>
              <HStack>
                <Button
                  onClick={() => {
                    const newRestTime = restTime + 1
                    setRestTime(newRestTime)
                    // setDuration(newRestTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +1
                </Button>
                <Button
                  onClick={() => {
                    const newRestTime = restTime + 10
                    setRestTime(newRestTime)
                    // setDuration(newRestTime)
                  }}
                  colorScheme={"whiteAlpha"}
                  borderRadius={15}
                  fontSize={14}
                  p={0}
                >
                  +10
                </Button>
              </HStack>
            </Flex>
          </Flex>
        </VStack>
      </Center>
    </>
  )
}

export default Home
