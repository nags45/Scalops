import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return <div>Authenticating with Google...</div>;
};

export default GoogleCallback;
