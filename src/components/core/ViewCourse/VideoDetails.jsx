import React, { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { Player } from "video-react"
import "video-react/dist/video-react.css"
import { AiFillPlayCircle } from "react-icons/ai"
import IconBtn from "../../Common/IconBtn"
import { createWorker } from 'tesseract.js'

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const playerRef = useRef(null)
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector(
    (state) => state.viewCourse
  )

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [loading, setLoading] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  const [extractedCode, setExtractedCode] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses")
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    }
    setVideoSpecificDetails()
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (data) => data._id === subSectionId
    )
    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true
    }
    return false
  }

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection.length
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1
    ) {
      return true
    }
    return false
  }

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (currentSubSectionIndex !== noOfSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const handleOCRRefresh = async () => {
    if (playerRef.current) {
      setIsExtracting(true)
      const player = playerRef.current.getInternalPlayer()
      const canvas = document.createElement('canvas')
      canvas.width = player.videoWidth
      canvas.height = player.videoHeight
      canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height)
      
      try {
        console.log("Starting OCR process...")
        const worker = await createWorker('eng')
        const { data: { text } } = await worker.recognize(canvas.toDataURL('image/png'))
        console.log("Extracted text:", text)
        
        // Process the extracted text to identify code
        const processedCode = processExtractedText(text)
        console.log("Processed extracted code:", processedCode)
        setExtractedCode(processedCode)
        
        await worker.terminate()
      } catch (error) {
        console.error('Error extracting code from video:', error)
        setExtractedCode("Error occurred while extracting code.")
      } finally {
        setIsExtracting(false)
      }
    }
  }

  // Function to process extracted text and identify code
  const processExtractedText = (text) => {
    // This is a simple example. You might need more sophisticated processing
    // depending on how the code is presented in your videos
    const codeLines = text.split('\n').filter(line => 
      line.trim().startsWith('def') || 
      line.trim().startsWith('class') || 
      line.includes('=') || 
      line.includes('return') ||
      line.trim().startsWith('import') ||
      line.trim().startsWith('from')
    )
    return codeLines.join('\n')
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <AiFillPlayCircle />
        </Player>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">{videoData?.title}</h1>
        <p className="pt-2 pb-6">{videoData?.description}</p>
      </div>

      {/* Code Editor */}
      <div className="bg-richblack-800 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Extracted Code:</h2>
        {isExtracting ? (
          <p>Extracting code... This may take a few moments.</p>
        ) : (
          <textarea
            className="w-full h-64 p-2 bg-richblack-900 text-white rounded"
            value={extractedCode}
            readOnly
          />
        )}
      </div>

      <div className="flex justify-between">
        <IconBtn
          disabled={loading || isFirstVideo()}
          onClick={goToPrevVideo}
          text="Prev"
        />
        <IconBtn
          disabled={loading || isLastVideo()}
          onClick={goToNextVideo}
          text="Next"
        />
      </div>
    </div>
  )
}

export default VideoDetails