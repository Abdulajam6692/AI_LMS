import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const AvailableCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(`/api/student/enrolled-courses/${userId}`);
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, [userId]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/api/enroll', { userId, courseId });
      alert('Enrolled successfully!');
      // Refresh enrolled courses
      const response = await axios.get(`/api/student/enrolled-courses/${userId}`);
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course.');
    }
  };

  return (
    <div>
      <h2>Available Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.name}
            <button onClick={() => handleEnroll(course.id)}>Enroll</button>
          </li>
        ))}
      </ul>

      <h2>Enrolled Courses</h2>
      <ul>
        {enrolledCourses.map(course => (
          <li key={course.course_id}>
            {course.course_name} - Completed: {course.completed ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};
AvailableCourses.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default AvailableCourses;
