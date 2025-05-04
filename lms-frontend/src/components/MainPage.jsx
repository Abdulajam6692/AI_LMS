import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <h1 className="main-title">Start learning here! 😀</h1>
      <div className="button-container">
        <button 
          onClick={() => navigate('/student-login')} 
          className="login-button student-login"
        >
          Student Login
        </button>
        <button 
          onClick={() => navigate('/admin-login')} 
          className="login-button admin-login"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default MainPage;