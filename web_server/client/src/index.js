import React from 'react';
import ReactDOM from 'react-dom'
//import App from './App/App'
import registerServiceWorker from './registerServiceWorker';
import './index.css'

import { hashHistory, browserHistory, Router} from 'react-router';
import routes from './routes';

ReactDOM.render(
    //<App />,
    <Router history={browserHistory} routes = {routes}/>,
    document.getElementById('root'));

registerServiceWorker();