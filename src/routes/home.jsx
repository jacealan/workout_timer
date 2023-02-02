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
  const [keyCircle, setKeyCircle] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(60)
  const [initialRemainingTime, setInitialRemainingTime] = useState(duration)
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
        newWorkout.push({ title: "done", duration: 0 })
      }
    }

    setWorkout(JSON.parse(JSON.stringify(newWorkout)))
    setTotalTime(newTotalTime)
    setElapsedTotalTime(0)
    setRemainingTotalTime(newTotalTime)

    setPlayingRound(0)
    setWorkoutIndex(0)
    setDuration(newWorkout[0].duration)
    setInitialRemainingTime(newWorkout[0].duration)
    setRemainingDurationTime(newWorkout[0].duration)

    setKeyCircle((prev) => ++prev)
  }

  const onComplete = async () => {
    if (workoutIndex !== workout.length - 2) {
      bell.play()

      const newWorkoutIndex = (await workoutIndex) + 1
      await setWorkoutIndex((prev) => ++prev)
      await setPlayingRound((prev) =>
        workout[newWorkoutIndex].title === "round" ? ++prev : prev
      )
      await setDuration(workout[newWorkoutIndex].duration)
      // await setInitialRemainingTime(workout[newWorkoutIndex].duration)
      await setRemainingDurationTime(workout[newWorkoutIndex].duration)

      await setKeyCircle((prev) => ++prev)
      setIsPlaying(true)
    } else {
      nice.play()
      await setIsPlaying(false)
      await makeWorkout()
      await setKeyCircle((prev) => ++prev)
    }
    return { shouldRepeat: true, delay: 0 }
  }

  const onUpdate = () => {
    setElapsedTotalTime((prev) => ++prev)
    setRemainingTotalTime((prev) => --prev)
    setRemainingDurationTime((prev) => --prev)
  }

  // const playWorkout = async () => {
  //   setElapsedTotalTime((prev) => ++prev)
  //   setRemainingTotalTime((prev) => --prev)
  //   setRemainingDurationTime((prev) => --prev)
  //   if (remaingDurationTime == 0) {
  //     setKeyCircle((prev) => ++prev)
  //     const newWorkoutIndex = workoutIndex + 1
  //     setWorkoutIndex((prev) => ++prev)
  //     setDuration(workout[newWorkoutIndex].duration)
  //     setRemainingDurationTime(workout[newWorkoutIndex].duration)
  //     if (workout[newWorkoutIndex].title === "round") {
  //       setPlayingRound((prev) => ++prev)
  //     }
  //   }
  //   // if (workout[workoutIndex].title === "done") {
  //   if (remainingTotalTime === 2) {
  //     console.log("done")

  //     setIsPlaying(false)
  //     setPlayingRound(0)
  //     setWorkoutIndex(0)
  //     setDuration(workout[0].duration)
  //     setInitialRemainingTime(workout[0].duration)
  //     setRemainingDurationTime(workout[0].duration)
  //     nice.play()
  //   }
  // }

  useEffect(() => {
    makeWorkout()
  }, [])

  useEffect(() => makeWorkout(), [roundCount, roundTime, restTime, prepareTime])

  return (
    <>
      <Center
        bgColor={
          workout[workoutIndex]?.title === "round"
            ? "#632D47"
            : workout[workoutIndex]?.title === "rest"
            ? "#22404B"
            : "#2B2B35"
        }
        color={"white"}
        padding={10}
        w={"100%"}
        h={"100%"}
      >
        <VStack>
          <CountdownCircleTimer
            key={keyCircle}
            updateInterval={0}
            size={500}
            strokeLinecap={"round"}
            strokeWidth={22}
            trailStrokeWidth={20}
            // trailColor={"black"}
            isPlaying={isPlaying}
            duration={duration}
            // initialRemainingTime={initialRemainingTime}
            colors={["#4FC1E9", "#FFCE54", "#EC87C0", "#AC92EC"]}
            colorsTime={[duration, duration - 5, roundEndWarningTime, 0]}
            isSmoothColorTransition={true}
            onComplete={onComplete}
            //   async () => {
            //   console.log(workoutIndex, workout.length)
            //   await onComplete()
            //   // if (workoutIndex !== workout.length - 2) {
            //   //   bell.play()
            //   //   await setKeyCircle((prev) => ++prev)

            //   //   const newWorkoutIndex = (await workoutIndex) + 1
            //   //   await setWorkoutIndex((prev) => ++prev)
            //   //   await setPlayingRound((prev) =>
            //   //     workout[newWorkoutIndex].title === "round" ? ++prev : prev
            //   //   )
            //   //   await setDuration(workout[newWorkoutIndex].duration)
            //   //   await setInitialRemainingTime(workout[newWorkoutIndex].duration)
            //   //   await setRemainingDurationTime(
            //   //     workout[newWorkoutIndex].duration
            //   //   )
            //   //   setIsPlaying(true)
            //   // } else {
            //   //   nice.play()
            //   //   await setIsPlaying(false)
            //   //   await makeWorkout()
            //   //   await setKeyCircle((prev) => ++prev)
            //   // }
            //   return { shouldRepeat: true, delay: 0 }
            // }}
            onUpdate={(remainingTime) => {
              if (isPlaying) onUpdate()
              if (remainingTime <= roundEndWarningTime && remainingTime != 0) {
                tick.play()
              }
            }}
          >
            {({ elapsedTime, remainingTime }) => {
              // console.log(elapsedTime, remainingTime)

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
                        bgColor={"transparent"}
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
                        bgColor={"transparent"}
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
                              {index + 1 === playingRound &&
                              workout[workoutIndex].title === "round"
                                ? "⦿"
                                : "⬤"}
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
                  onClick={() => {
                    const newPrepareTime = prepareTime - 1
                    setPrepareTime(newPrepareTime)
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
                    const newPrepareTime = prepareTime - 10
                    setPrepareTime(newPrepareTime)
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
                  {Math.floor(prepareTime / 60)}:
                  {(prepareTime % 60).toString().padStart(2, "0")}
                </Box>
                <Box p={"0 10px 10px 10px"} mt={1} fontSize={10}>
                  Prepare Time
                </Box>
              </Flex>
              <HStack>
                <Button
                  onClick={() => {
                    const newPrepareTime = prepareTime + 1
                    setPrepareTime(newPrepareTime)
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
                    const newPrepareTime = prepareTime + 10
                    setPrepareTime(newPrepareTime)
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
