import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomRoutes from './config/CustomRoutes';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.sections = {
    

  }
  }
  

  // afterLogin() {
  //   this.setState({ showProfile: true });
  // }

  render() {
    return (
        <div className="">
          <CustomRoutes/>
          {/* <Home /> */}
          {/* <Accounts /> */}
          {/* {!this.state.showProfile ? <Login afterLogin={this.afterLogin.bind(this)}/> : <Profile />} */}
        </div>
    
    );
  }
}


export default App;
