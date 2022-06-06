import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Login } from './pages/auth/Login';
import { Provider } from 'react-redux';
import { store } from './store/index';
import 'rsuite/dist/rsuite.min.css';

import './assets/css/bootstrap.min.css';
import './assets/css/styles.css';
import { MainPage } from './pages/mainPage/MainPage';
import { CheckPrice } from './pages/checkPrice/CheckPrice';
import { BookNow } from './pages/booknow/BookNow';
import { Page8 } from './pages/booknow/Page8';
import { Payment } from './pages/booknow/Payment';
import { Page7 } from './pages/booknow/Page7';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OverView } from './pages/overview/OverView';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { PaymentNew } from './pages/booknow/PaymentNew';
import { BookNowNew } from './pages/bookNowNew/BookNowNew';

/**
 * Configuration for toast
 */
toast.configure({
  closeButton: false, closeOnClick: true, className: 'toaster',
  autoClose: 5000, newestOnTop: true
});
const AppMain = () => {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<MainPage />} >
            <Route path='/booknow' element={<BookNowNew />} />
            <Route path='/overview' element={<OverView />} />
            {/* <Route path='/checkprice' element={<CheckPrice />} /> */}
            <Route path='/payment' element={<PaymentNew />} />
          </Route>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </Router>
    </MuiPickersUtilsProvider>
  )
}

const Routing = (
  <Provider store={store}>
    <AppMain></AppMain>
  </Provider>
);


ReactDOM.render(
  Routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
