import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentLogin.css';

const StudentLogin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/student/login', { name, email });
      if (response.data.success) {
        const studentId = response.data.studentId; 
        navigate(`/student-dashboard/${studentId}`);
      } else {
        setError('Invalid name or email.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="student-login-container">
      <h1 className="student-login-title">Student Login</h1>
      <div className="student-login-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="student-login-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="student-login-input"
        />
        <button onClick={handleLogin} className="student-login-button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default StudentLogin;