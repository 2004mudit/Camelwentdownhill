import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import Footer from "../components/Common/Footer"
import CourseCard from "../components/core/Catalog/CourseCard"
import CourseSlider from "../components/core/Catalog/CourseSlider"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCoursePageData } from "../services/operations/pageAndComponentData"

// Updated sample course data with new video links
const sampleCourses = [
  {
    id: "cpp_intro",
    title: "Introduction to C++",
    description: "Learn the fundamentals of C++ programming, including syntax, control structures, and basic data types.",
    thumbnail: "https://i.ytimg.com/vi/iVLQeWbgbXs/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDIxIDBx7GaUiH5SNZivJWTd1FSpw",
    videoUrl: "https://www.youtube.com/embed/iVLQeWbgbXs?enablejsapi=1"
  },
  {
    id: "html_css_advanced",
    title: "Advanced HTML & CSS",
    description: "Dive deeper into web development with advanced HTML5 and CSS3 techniques, including responsive design and animations.",
    thumbnail: "https://i.ytimg.com/vi/G3e-cpL7ofc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCeCRIPYMkDqa-58AscpsxUVLUc4w",
    videoUrl: "https://www.youtube.com/embed/G3e-cpL7ofc?enablejsapi=1"
  },
  {
    id: "js_basics",
    title: "JavaScript Basics",
    description: "Master the basics of JavaScript, including variables, functions, and events to build interactive web applications.",
    thumbnail: "https://i.ytimg.com/vi/ER9SspLe4Hg/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBIjme99R-l_yHv0C9V5uitvb5CoA",
    videoUrl: "https://www.youtube.com/embed/ER9SspLe4Hg?enablejsapi=1"
  }
];

function Courses() {
  const { loading } = useSelector((state) => state.profile)
  const [active, setActive] = useState(1)
  const [coursePageData, setCoursePageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        const category_id = res?.data?.data[0]?._id
        setCategoryId(category_id)
      } catch (error) {
        console.error("Could not fetch Categories.", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchCourseData = async () => {
      if (categoryId) {
        try {
          const res = await getCoursePageData(categoryId)
          setCoursePageData(res)
        } catch (error) {
          console.error("Error fetching course data:", error)
        }
      }
    }
    fetchCourseData()
  }, [categoryId])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="bg-richblack-900 text-white">
      <div className="box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">Home / Courses</p>
          <p className="text-3xl text-richblack-5">Our Courses</p>
          <p className="max-w-[870px] text-richblack-200">
            Explore our wide range of courses
          </p>
        </div>
      </div>

      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Popular
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        {coursePageData && coursePageData.data && (
          <CourseSlider Courses={coursePageData.data.selectedCategory?.courses || []} />
        )}
      </div>

      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Top courses</div>
        <div className="py-8">
          {coursePageData && coursePageData.data && (
            <CourseSlider Courses={coursePageData.data.differentCategory?.courses || []} />
          )}
        </div>
        <div className="mt-8">
          {sampleCourses.map((course, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center p-4 border-b border-richblack-700">
              <Link to={`/course/${course.id}`} className="text-white no-underline flex flex-col md:flex-row items-center w-full">
                <div className="md:w-1/3 p-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-auto cursor-pointer shadow-lg"
                  />
                </div>
                <div className="md:w-2/3 md:ml-4 text-left">
                  <h2 className="text-xl font-bold mb-2 cursor-pointer">{course.title}</h2>
                  <p className="text-richblack-300">{course.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursePageData && coursePageData.data && coursePageData.data.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <CourseCard course={course} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
        <div className="mt-8">
          {sampleCourses.map((course, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center p-4 border-b border-richblack-700">
              <Link to={`/course/${course.id}`} className="text-white no-underline flex flex-col md:flex-row items-center w-full">
                <div className="md:w-1/3 p-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-auto cursor-pointer shadow-lg"
                  />
                </div>
                <div className="md:w-2/3 md:ml-4 text-left">
                  <h2 className="text-xl font-bold mb-2 cursor-pointer">{course.title}</h2>
                  <p className="text-richblack-300">{course.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Courses