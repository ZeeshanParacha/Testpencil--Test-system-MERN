import React, { Component } from "react";
import { MDBContainer, MDBBtn, MDBRow, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { withRouter  , Link} from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        model8 : '',
        email : '',
        password :'',
        islogin : false
    }

  }


  Login = () => {

    
     const history = this.props.history;
     console.log('history--->' , this.props.history)
      const {email , password} = this.state;
      console.log('Login--->')
      console.log('Login--->',this.state.email)
      console.log('Login--->', this.state.password)
      fetch(`${process.env.REACT_APP_API}Auth/Login`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
       method: 'POST',
        body: JSON.stringify({
          email: email,
          password :password
        })
      }).then(res=>res.json())
      .then((res)=>{
          if(res.isUser == false){
              this.setState({islogin : true , email : '' , password : ''})
              setTimeout(() => {
                this.setState({islogin : false})
              }, 3000);
          }
          else{
            this.props.change(8)
           console.log("res-user" , res.userdata.name)
            history.push({
              pathname: '/userdashboard/overview',
              state: { detail: res.userdata }
            })
            
          }
      });
  }
 
  gotoForgot = () => {
    this.props.change(8)
    this.props.history.push('/forgotpassword')
  }

  render() {

    return (
     
      <>
        {/*Login Modal*/}
        
        <MDBContainer>
          <MDBModal isOpen={this.props.isopen} toggle={this.props.toggle(8)} fullHeight position="right">
            <MDBModalHeader toggle={this.props.toggle(8)}></MDBModalHeader>
            <MDBModalBody>
              <div>
                <MDBRow>
                  <MDBCol md="12">
                    <form>
                      <div className='loginimg'>
                        {/* <img src="./images/logo4.png" style={{ width: '90px', height: '90px' }} /> */}
                        <h1>Login</h1>
                      </div>

                      <div>
                        <MDBInput label="Type your email" icon="envelope" group type="email" type='email' error="wrong"
                          success="right" onChange={(e) => { this.setState({ email: e.target.value }) }} value={this.state.email} required/>
                        <MDBInput label="Type your password" icon="lock" group type="password" required onChange={(e) => { this.setState({ password: e.target.value }) }} value={this.state.password} validate />
                        {this.state.islogin && <span id="loginError">Email or Password does not match.</span>}
                      </div>
                      <div className='text-right'>
                        <p><span style={{ color: '#9e9e9e' }}>Forgot</span> <span onClick={()=> {this.gotoForgot()}} style={{ fontWeight: 'bold', color: '#fa4c56' , cursor : 'pointer' }}>Password?</span></p>
                      </div>
                      <div className="text-center">
                        <div className='loginBtn' onClick={() => this.Login()}>Login</div>
                      </div>
                      <div className='text-center signuplink'>
                        <p><span style={{ color: '#9e9e9e' }}>Dont have an account?</span> <span  onClick={this.props.switchtoggle(8)} style={{cursor : 'pointer', fontWeight: 'bold', color: '#fa4c56' }}>Sign up</span></p>
                      </div>
                    </form>
                  </MDBCol>
                </MDBRow>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <div className='closebtn' onClick={this.props.toggle(8)}>Close</div>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
      </>
    );
  }
}

export default withRouter(Login);