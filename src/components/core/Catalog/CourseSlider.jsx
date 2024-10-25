import React from 'react'

const CourseSlider = ({ Courses }) => {
  return (
    <div>
      {/* Implement your slider logic here */}
      <h3>Course Slider</h3>
      {Courses && Courses.map((course, index) => (
        <div key={index}>{course.title}</div>
      ))}
    </div>
  )
}

export default CourseSlider