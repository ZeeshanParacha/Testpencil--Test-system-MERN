import React, { Component } from "react";
import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
  MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon
} from "mdbreact";

import LoginModal from './login.js'
import SignupModal from './signup.js'



class NavbarPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal8: false,
      modal9: false,
      modal10 : false,
      isUser: true,
      isLoginClicked: true

    }

    this.handler = this.handler.bind(this)

  }
  handler(nr){
    let modalNumber = 'modal' + nr;

    this.setState({
     modal8 : false,
     isUser:false,
     isUser:false

    });
}

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  switchtoggle = num => () => {

    console.log('nummm', num)
    let closeOthermodal;
    let openOthermodal;
    if (num == 9) {
      console.log('toggle99--->')
      closeOthermodal = 'modal' + num;
      num = num - 1
      openOthermodal = 'modal' + num;
      this.setState({
        [closeOthermodal]: false,
        [openOthermodal]: true,
        showAlert : false
      })
    }
    else if(num == 8){
      closeOthermodal = 'modal' + num;
      num = num + 1
      openOthermodal = 'modal' + num;
      this.setState({
        [closeOthermodal]: false,
        [openOthermodal]: true,
       
  
      })
    }
    else {
      closeOthermodal = 'modal' + num;
      num = num - 2
      openOthermodal = 'modal' + num;
      this.setState({
        [closeOthermodal]: false,
        [openOthermodal]: true,
  
      })
    }
    

    
  }

  toggle = nr => () => {

    console.log('toggle--->')
    let closeOthermodal;
    let modalNumber = 'modal' + nr



    this.setState({
      [modalNumber]: !this.state[modalNumber],

    });
  }


  render() {

    return (
      <>
      {this.state.isUser && this.state.isLoginClicked &&
        <MDBNavbar color="indigo" dark expand="md">
          <MDBNavbarBrand>
            <strong className="white-text">EXCELLENCE</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav left>
              <MDBNavItem active>
                <MDBNavLink exact to="/">Home</MDBNavLink>
              </MDBNavItem>
              {/* <MDBNavItem>
            <span onClick={() => this.handleNavigate(this.props.refe)}>Home</span>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="/reachus">Reach US</MDBNavLink>
            </MDBNavItem> */}
            </MDBNavbarNav>
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light" to="#!">
                  <MDBIcon fab icon="twitter" />
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink className="waves-effect waves-light" to="#!">
                  <MDBIcon fab icon="google-plus-g" />
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <MDBIcon icon="user" />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu right basic className="dropdown-default">
                    <MDBDropdownItem><span  style={{display : 'block'}} onClick={this.toggle(8)}><span style={{display : 'block'}}>Login</span></span></MDBDropdownItem>
                    <MDBDropdownItem><span  style={{display : 'block'}} onClick={this.toggle(9)}><span style={{display : 'block'}} >Sign Up</span></span></MDBDropdownItem>

                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
          </MDBNavbar> }

        <LoginModal isopen={this.state.modal8} change={this.handler} toggle={this.toggle} switchtoggle={this.switchtoggle} />
        <SignupModal isopen={this.state.modal9} toggle={this.toggle} switchtoggle={this.switchtoggle} />


      </>

    );
  }
}

export default NavbarPage;