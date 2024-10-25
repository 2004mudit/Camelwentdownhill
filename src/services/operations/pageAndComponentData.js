export const getCoursePageData = async (categoryId) => {
  // Implement your API call logic here
  // For now, let's return a mock data
  return {
    success: true,
    data: {
      selectedCategory: {
        courses: [{ title: "Course 1" }, { title: "Course 2" }]
      },
      differentCategory: {
        courses: [{ title: "Course 3" }, { title: "Course 4" }]
      },
      mostSellingCourses: [
        { title: "Course 5" }, 
        { title: "Course 6" },
        { title: "Course 7" },
        { title: "Course 8" }
      ]
    }
  }
}