import React from 'react';

const CourseCard = ({ course, Height }) => {
  return (
    <div style={{ height: Height }}>
      <h3>{course.title}</h3>
      {/* Add more course details here */}
    </div>
  )
}

export default CourseCard
