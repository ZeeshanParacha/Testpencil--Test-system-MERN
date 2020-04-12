import React from 'react';
import { Router, Route } from 'react-router-dom';


import Navbar from '../components/Navbar.js';

import Home from '../screens/mainscreen';
import admindashboard from '../screens/adminsidebar'
import Forgotpassword from '../screens/forgotpass'
import ResetPassword from '../screens/resetpassword'
import AdminresetPassword from '../screens/adminresetpassword'
import Administrator from '../components/admin/admin'

import FAQ from '../screens/FAQ'

import UserSidebar from '../screens/usersidebar'

import { createBrowserHistory } from 'history';
const customHistory = createBrowserHistory({ forceRefresh: true });


console.log('customHistory.location.pathname--->', customHistory.location.pathname)



const CustomeRoutes = () => (
  <Router history={customHistory}>
    <div>
      {customHistory.location.pathname === '/' ? <Navbar /> : null}
      <Route exact path="/" component={Home} />
      <Route path='/faq' component={FAQ} />
      <Route path='/administrator' component={Administrator} />
      <Route path='/forgotpassword' component={Forgotpassword} />
      <Route path='/reset/:token' component={ResetPassword} />
      <Route path='/adminreset/:token' component={AdminresetPassword} />
      <Route path="/admindashboard" component={admindashboard} />
      <Route path="/userdashboard" component={UserSidebar} />

    </div>
  </Router>
)

class CustomeRoutesComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model8: ''
    }

  }

  //   componentWillReceiveProps = (nextProps) => {
  //     if (nextProps.location.pathname !== this.props.location.pathname) {
  //         window.location.reload();
  //     }
  // }


  render() {

    return (
      <CustomeRoutes />
    );
  }
}


export default CustomeRoutesComponent;