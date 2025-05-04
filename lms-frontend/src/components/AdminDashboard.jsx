import { useState, useEffect } from "react";
import axios from "axios";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadableMaterial, setDownloadableMaterial] = useState("");
  const [message, setMessage] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Failed to fetch courses.");
    }
  };

  const addCourse = async () => {
    try {
      const response = await axios.post("http://localhost:5000/admin/add-course", {
        courseName,
        description,
      });
      setMessage(response.data.message);
      fetchCourses();
      setCourseName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("Failed to add course.");
    }
  };

  const removeCourse = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/admin/remove-course/${id}`);
      setMessage(response.data.message);
      fetchCourses();
    } catch (error) {
      console.error("Error removing course:", error);
      setMessage("Failed to remove course.");
    }
  };

  const addLesson = async () => {
    if (!selectedCourse) {
      setMessage("Please select a course.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/admin/add-content", {
        courseId: selectedCourse,
        title: lessonTitle,
        videoUrl: videoUrl,
        downloadableMaterial: downloadableMaterial,
      });
      setMessage(response.data.message);
      setLessonTitle("");
      setVideoUrl("");
      setDownloadableMaterial("");
      fetchCourses();
    } catch (error) {
      console.error("Error adding lesson:", error);
      setMessage("Failed to add lesson.");
    }
  };

  const removeLesson = async (lessonId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/admin/remove-content/${lessonId}`);
      setMessage(response.data.message);
      fetchCourses();
    } catch (error) {
      console.error("Error removing lesson:", error);
      setMessage("Failed to remove lesson.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <h2>Add Course</h2>
      <input
        type="text"
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={addCourse}>
        Add Course
      </button>

      <h2>Manage Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <strong>{course.name}</strong> - {course.description}
            <button onClick={() => removeCourse(course.id)}>
              Remove Course
            </button>
            <ul>
              {course.lessons &&
                course.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    {lesson.title} - Video: {lesson.video_url} - Material: {lesson.downloadable_material}
                    <button onClick={() => removeLesson(lesson.id)}>
                      Remove Lesson
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Add Lesson to Course</h2>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Lesson Title"
        value={lessonTitle}
        onChange={(e) => setLessonTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Downloadable Material URL"
        value={downloadableMaterial}
        onChange={(e) => setDownloadableMaterial(e.target.value)}
      />
      <button onClick={addLesson}>
        Add Lesson
      </button>

      <h2>Message</h2>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminDashboard;