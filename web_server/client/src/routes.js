import Base from './Base/Base';
import App from './App/App';
import LoginPage from './Login/LoginPage';
import SignUpPage from './SignUp/SignUpPage';
import Auth from './Auth/Auth';
import VideoPanel from './VideoPanel/VideoPanel';

const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/', 
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, App);
        } else {
          callback(null, LoginPage);
        }
      }
    },
    {
      path: '/videos', 
      //component: Auth.isUserAuthenticated() ? VideoPanel : LoginPage
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, VideoPanel);
        } else {
          callback(null, LoginPage);
        }
      }
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticate();

        replace('/login');
      }
    }
  ]
};

export default routes;