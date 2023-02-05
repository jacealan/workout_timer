import { useState, useEffect, useRef } from "react"
import {
  Routes,
  Route,
  Outlet,
  Link,
  useInRouterContext,
} from "react-router-dom"

import {
  CountdownCircleTimer,
  useCountdown,
} from "react-countdown-circle-timer"

import Calendar from "react-calendar"
import "../calendar.css"

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
import {
  RepeatClockIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons"
import {
  FaRegClock,
  FaCalendarDay,
  FaCalendarPlus,
  FaPreviousIcon,
} from "react-icons/fa"
import { useToast } from "@chakra-ui/react"

import moment from "moment"

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
  const logWorkout = useRef([])
  const toast = useToast()

  const [showLog, setShowLog] = useState(false)
  const [value, onChange] = useState(new Date())

  const bell = new Audio(
    "https://www.myinstants.com/media/sounds/boxing-bell.mp3"
  )
  const tick = new Audio(
    "https://www.myinstants.com/media/sounds/tick-deepfrozenapps-397275646-2.mp3"
  )

  const nice = new Audio(
    "https://www.myinstants.com/media/sounds/nice-shot-wii-sports.mp3"
  )

  const getDayWorkout = (date) => {
    const result = logWorkout.current.filter(
      (workout) =>
        workout.date === moment(date.toISOString()).format("YYYY-MM-DD")
    )

    let logs = []
    result.forEach((workout) => {
      logs.push(`${workout.time24} ••• ${workout.workout}`)
    })
    return logs
  }

  const logCalcendar = () => {
    const now = new Date()
    const logNow = {
      datetime: `${now.toISOString()}`,
      date: moment(now.toISOString()).format("YYYY-MM-DD"),
      time24: moment(now.toISOString()).format("HH:mm"),
      time12: moment(now.toISOString()).format("hh:mm"),
      workout: `${roundCount} x ${toMMSS(roundTime)}`,
    }
    logWorkout.current = [...logWorkout.current, logNow]
    console.log(logWorkout)
    // console.log(now.toISOString()) // 2023-02-04T15:19:19.229Z
    // console.log(moment(now.toISOString()).format()) // 2023-02-05T00:19:19+09:00
    // console.log(moment(now.toISOString()).format("YYYY-MM-DD")) //2023-02-05
    // console.log(moment(now.toISOString()).format("HH:mm")) // 00:19
    // console.log(moment(now.toISOString()).format("hh:mm")) // 12:19

    window.localStorage.setItem(
      "logWorkout",
      JSON.stringify(logWorkout.current)
    )
  }

  const makeWorkout = () => {
    const newWorkout = [{ title: "prepare", duration: prepareTime }]
    if (prepareTime === 0) newWorkout.pop()

    let newTotalTime = prepareTime
    for (let i = 1; i <= roundCount; i++) {
      if (roundTime !== 0)
        newWorkout.push({ title: "round", round: i, duration: roundTime })
      newTotalTime += roundTime

      if (i !== roundCount && restTime !== 0) {
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
    setDuration((prev) => newWorkout[0].duration)
    setInitialRemainingTime((prev) => newWorkout[0].duration)
    setRemainingDurationTime((prev) => newWorkout[0].duration)

    setKeyCircle((prev) => ++prev)
  }

  const onComplete = async () => {
    if (isPlaying) {
      if (workoutIndex !== workout.length - 2) {
        // await setIsPlaying(false)
        bell.play()

        const newWorkoutIndex = (await workoutIndex) + 1
        await setWorkoutIndex((prev) => ++prev)
        await setPlayingRound((prev) =>
          workout[newWorkoutIndex].title === "round" ? ++prev : prev
        )

        const newDuration = workout[newWorkoutIndex].duration
        await setDuration((prev) => newDuration)
        await setInitialRemainingTime((prev) => newDuration)
        await setRemainingDurationTime((prev) => newDuration)

        // await setIsPlaying(true)
      } else {
        nice.play()
        await setIsPlaying(false)
        await makeWorkout()

        logCalcendar()
        toast({
          title: "Workout is done.",
          description: "The workout is logged.",
          status: "success",
          duration: 2000,
          isClosable: true,
        })
      }
    }
    await setKeyCircle((prev) => ++prev)

    return { shouldRepeat: true, delay: 0 }
  }

  const onUpdate = () => {
    setElapsedTotalTime((prev) => ++prev)
    setRemainingTotalTime((prev) => --prev)
    setRemainingDurationTime((prev) => prev--)
  }

  useEffect(() => {
    const fromLocalStorage = JSON.parse(
      window.localStorage.getItem("lastWorkout")
    )
    if (fromLocalStorage !== null) {
      setRoundCount(fromLocalStorage.roundCount)
      setRoundList(new Array(roundCount).fill(0))
      setPrepareTime(fromLocalStorage.prepareTime)
      setRoundTime(fromLocalStorage.roundTime)
      setRoundEndWarningTime(fromLocalStorage.roundEndWarningTime)
      setRestTime(fromLocalStorage.restTime)
    }
    makeWorkout()

    const logFromLocalStorage = JSON.parse(
      window.localStorage.getItem("logWorkout")
    )
    if (logFromLocalStorage !== null) logWorkout.current = logFromLocalStorage
  }, [])

  useEffect(() => {
    if (roundCount < 1) setRoundCount(1)
    if (roundCount > 20) setRoundCount(20)
    if (prepareTime < 0) setPrepareTime(0)
    if (roundTime < 0) setRoundTime(0)
    if (roundEndWarningTime > roundTime) setRoundEndWarningTime(roundTime)
    if (restTime < 0) setRestTime(0)
    setRoundList(new Array(roundCount).fill(0))
    makeWorkout()
  }, [roundCount, prepareTime, roundTime, roundEndWarningTime, restTime])

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
            onUpdate={(remainingTime) => {
              if (isPlaying) onUpdate()
              if (remainingTime <= roundEndWarningTime && remainingTime != 0) {
                tick.play()
              }
            }}
          >
            {({ elapsedTime, remainingTime }) => {
              // console.log(elapsedTime, remainingTime)
              if (showLog) {
                return (
                  <Calendar
                    onChange={onChange}
                    value={value}
                    calendarType={"US"} // 요일순: 일~토
                    navigationLabel={({ date, label, locale, view }) => (
                      <Center w="100%" h="100%">
                        {date.getFullYear()}년 {date.getMonth() + 1}월
                      </Center>
                    )}
                    formatDay={(locale, date) => moment(date).format("D")} // 날'일' 제외하고 숫자만 보이도록 설정
                    minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                    maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
                    // prevLabel={<ChevronLeftIcon />}
                    // prev2Label={<ArrowLeftIcon />}
                    // nextLabel={<ChevronRightIcon />}
                    // next2Label={<ArrowRightIcon />}
                    tileContent={({ activeStartDate, date, view }) => {
                      const logs = getDayWorkout(date)
                      if (view === "month" && logs.length > 0) {
                        return (
                          <Center>
                            <Tooltip
                              label={logs.map((log, index) => (
                                <Box key={index} fontFamily={"Fira Code"}>
                                  {log}
                                </Box>
                              ))}
                              fontSize={16}
                              fontWeight={300}
                              borderRadius={10}
                              p={3}
                            >
                              <Box
                                w={2}
                                h={2}
                                bgColor={"red"}
                                borderRadius={5}
                                margin={"3px 0 0 0"}
                              />
                            </Tooltip>
                          </Center>
                        )
                      } else {
                        return (
                          <Center>
                            <Box w={2} h={2} margin={"3px 0 0 0"} />
                          </Center>
                        )
                      }
                    }}
                  />
                )
              } else {
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
                            // setRoundList(new Array(roundCount - 1).fill(0))
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
                            // setRoundList(new Array(roundCount + 1).fill(0))
                            setRoundCount((prev) => ++prev)
                          }}
                          bgColor={"transparent"}
                          p={1}
                        >
                          +
                        </Button>
                      </Center>
                      <VStack style={{ margin: 0 }}>
                        <Flex justifyContent={"space-between"}>
                          {roundList.map((round, index) => (
                            <div key={index}>
                              <Box
                                color={
                                  index + 1 <= playingRound ? "white" : "#555"
                                }
                                margin={"0 2px"}
                              >
                                {index + 1 === playingRound &&
                                workout[workoutIndex].title === "round"
                                  ? "⦿"
                                  : "⬤"}
                              </Box>
                            </div>
                          ))}
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          w="100%"
                          style={{ margin: 0 }}
                        >
                          <Box
                            p={"1px 5px"}
                            bgColor={"#777"}
                            borderRadius={10}
                            margin={"0 10px 0 0"}
                          >
                            {toMMSS(elapsedTotalTime)}
                          </Box>
                          <Divider minWidth={1} />
                          <Box
                            p={"1px 5px"}
                            bgColor={"#777"}
                            borderRadius={10}
                            margin={"0 0 0 10px"}
                          >
                            {toMMSS(remainingTotalTime)}
                          </Box>
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
                          window.localStorage.setItem(
                            "lastWorkout",
                            JSON.stringify({
                              roundCount: roundCount,
                              prepareTime: prepareTime,
                              roundTime: roundTime,
                              roundEndWarningTime: roundEndWarningTime,
                              restTime: restTime,
                            })
                          )
                        }}
                        style={{ margin: 0 }}
                      >
                        {isPlaying ? "PAUSE" : "START"}
                      </Button>
                      <Center onClick={makeWorkout}>
                        <RepeatClockIcon />
                        {/* <Box w={3} />
                        <FaCalendarPlus /> */}
                      </Center>
                    </VStack>
                  </>
                )
              }
            }}
          </CountdownCircleTimer>
          <Box
            p={3}
            onClick={() => {
              setShowLog((prev) => !prev)
            }}
            size={20}
          >
            {showLog ? <FaRegClock /> : <FaCalendarDay />}
          </Box>
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
