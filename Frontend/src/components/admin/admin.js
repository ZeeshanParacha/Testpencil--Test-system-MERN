import React, { Component } from "react";
import { MDBInput } from 'mdbreact';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model8: '',
      username: '',
      password: '',
      islogin: false
    }

  }

  Login = () => {

    const history = this.props.history;
    console.log('history--->', this.props.history)
    const { username, password } = this.state;
    console.log('Login--->' ,username)
  
    fetch(`${process.env.REACT_APP_API}Administrator/Login`, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: 'POST',
      body: JSON.stringify({
        email: username,
        password: password
      })
    }).then(res => res.json())
      .then((res) => {
        if (res.isSuccess == false) {
          this.setState({ islogin: true, username: '', password: '' })
          setTimeout(() => {
            this.setState({ islogin: false })
          }, 3000);
        }
        else {
          history.push('/admindashboard/overview')
        }
      });
  }

  gotoForgot = () => {
    
    this.props.history.push('/forgotpassword' , {admin : true})
  }
  render() {

    return (
      <>
        {/*Login Modal*/}

        <div>
          <Row noGutters style={{ alignItems: 'center', height: '-webkit-fill-available', paddingRight: '10px', paddingLeft: '10px', background: '#fbfbfb' }}>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
              <form className='adminForm'>
                <div className='loginimg'>
                  {/* <img src="./images/logo4.png" style={{ width: '90px', height: '90px' }} /> */}
                  <h1>Admin</h1>
                </div>

                <div>
                  <MDBInput label="Type your email" icon="envelope" group type="email" type='email' error="wrong"
                    success="right" onChange={(e) => { this.setState({ username: e.target.value }) }} value={this.state.username} required />
                  <MDBInput label="Type your password" icon="lock" group type="password" required onChange={(e) => { this.setState({ password: e.target.value }) }} value={this.state.password} validate />
                  {this.state.islogin && <span id="loginError">Email or Password does not match.</span>}
                </div>
                <div className='text-right'>
                  <p><span style={{ color: '#9e9e9e' }}>Forgot</span> <span onClick={() => { this.gotoForgot() }} style={{ fontWeight: 'bold', color: '#fa4c56', cursor: 'pointer' }}>Password?</span></p>
                </div>
                <div className="text-center">
                  <div className='loginBtn' onClick={() => this.Login()}>Login</div>
                </div>
                <div className='text-center signuplink'>
                  <p><span style={{ color: '#9e9e9e' }}>Login as user?</span> <span onClick={() => this.props.history.push('/')} style={{ fontWeight: 'bold', color: '#fa4c56', cursor: 'pointer' }}>Click here</span></p>
                </div>
              </form>
            </Col>
          </Row>
        </div>

      </>
    );
  }
}

export default Admin;