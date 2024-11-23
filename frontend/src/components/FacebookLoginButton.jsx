import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const FacebookLoginButton = () => {
  const { facebookLogin } = useAuthStore();
  const navigate = useNavigate();

  const responseFacebook = (response) => {
    if (response.accessToken) {
      facebookLogin(response.accessToken);
      navigate('/home')
    } else {
      console.error('Facebook login failed:', response);
    }
  };

  return (
    <FacebookLogin
      appId="1729149067883095"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      icon="fa-facebook"
    />
  );
};

export default FacebookLoginButton;