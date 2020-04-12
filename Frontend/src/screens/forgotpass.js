import React, { Component } from 'react';
import { MDBInput, MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const title = {
    pageTitle: 'Forgot Password Screen',
};

class ForgotPassword extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            showError: false,
            messageFromServer: '',
            showNullError: false,
        };
    }

    handleChange = name => (event) => {

        this.setState({
            [name]: event.target.value,
        });

    };
    sendAdminEmail = (e) => {
        e.preventDefault();
        console.log(this.state.email)
        const { email } = this.state;
        if (email === '') {
            this.setState({
                showError: false,
                messageFromServer: '',
                showNullError: true,
            });
        } else {
            try {
                fetch('http://localhost:8080/Administrator/forgotPassword', {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                    })
                })
                    .then((res) => res.json()).then((response => {
                        console.log('res---->', response.msg)
                        if (response.msg === 'recovery email sent') {
                            this.setState({
                                showError: false,
                                messageFromServer: 'recovery email sent',
                                showNullError: false,
                            });
                        }
                        if (response.msg === 'email not in db') {
                            this.setState({
                                showError: true,
                                messageFromServer: '',
                                showNullError: false,
                            });
                        }

                    }));
            } catch (error) {
                console.error('error', error);

            }
        }
    };

    sendEmail = (e) => {
        e.preventDefault();
        console.log(this.state.email)
        const { email } = this.state;
        if (email === '') {
            this.setState({
                showError: false,
                messageFromServer: '',
                showNullError: true,
            });
        } else {
            try {
                fetch('http://localhost:8080/Auth/forgotPassword', {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                    })
                })
                    .then((res) => res.json()).then((response => {
                        console.log('res---->', response.msg)
                        if (response.msg === 'recovery email sent') {
                            this.setState({
                                showError: false,
                                messageFromServer: 'recovery email sent',
                                showNullError: false,
                            });
                        }
                        if (response.msg === 'email not in db') {
                            this.setState({
                                showError: true,
                                messageFromServer: '',
                                showNullError: false,
                            });
                        }

                    }));
            } catch (error) {
                console.error('error', error);

            }
        }
    };

    render() {
        const {
            email, messageFromServer, showNullError, showError
        } = this.state;
        console.log(this.props.location)
        return (
            <>
                
                    {!this.props.location.state === undefined && this.props.location.state.admin === true && <Row noGutters className='forgotpassword'>
                        <Col md={{ span: 6, offset: 3 }} xs={{ span: 8, offset: 2 }}>

                            <div className='forgotcard'>
                                <div className="text-center">
                                    <h3>Forgot Password</h3>
                                </div>
                                <form className="profile-form" onSubmit={this.sendAdminEmail}>
                                    <MDBInput label="Email" icon="envelope" group type="email" value={email} onChange={this.handleChange('email')} />
                                    <button className="text-center">
                                        <div className='loginBtn reset'>Reset Password</div>
                                    </button>
                                </form>
                                {showNullError && (
                                    <div className='text-center error'>
                                        <p>The email address cannot be null.</p>
                                    </div>
                                )}
                                {showError && (
                                    <div className='text-center error'>
                                        <p>
                                            That email address isn&apos;t recognized. Please try again or
                                            register for a new account.
                             </p>

                                    </div>
                                )}
                                {messageFromServer === 'recovery email sent' && (
                                    <div className='text-center error'>
                                        <p>Password Reset Email Successfully Sent, Please Check Your Mail!</p>
                                    </div>
                                )}
                                {/* <div className="text-left">
                                    <div className='Gohome'><Link to='/administrator'><MDBIcon icon="arrow-left" /></Link></div>
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                    }
                
                {this.props.location.state === undefined && <Row noGutters className='forgotpassword'>
                    <Col md={{ span: 6, offset: 3 }} xs={{ span: 8, offset: 2 }}>

                        <div className='forgotcard'>
                            <div className="text-center">
                                <h3>Forgot Password</h3>
                            </div>
                            <form className="profile-form" onSubmit={this.sendEmail}>
                                <MDBInput label="Email" icon="envelope" group type="email" value={email} onChange={this.handleChange('email')} />
                                <button className="text-center">
                                    <div className='loginBtn reset'>Reset Password</div>
                                </button>
                            </form>
                            {showNullError && (
                                <div className='text-center error'>
                                    <p>The email address cannot be null.</p>
                                </div>
                            )}
                            {showError && (
                                <div className='text-center error'>
                                    <p>
                                        That email address isn&apos;t recognized. Please try again or
                                        register for a new account.
                             </p>
                                    <div className="text-right">
                                        <div className='Gohome'><Link to='/signup'>Register<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></Link></div>
                                    </div>
                                </div>
                            )}
                            {messageFromServer === 'recovery email sent' && (
                                <div className='text-center error'>
                                    <p>Password Reset Email Successfully Sent, Please Check Your Mail!</p>
                                </div>
                            )}
                            <div className="text-left">
                                <div className='Gohome'><Link to='/'><MDBIcon icon="arrow-left" /></Link></div>
                            </div>
                        </div>
                    </Col>
                </Row>
                }
            </>
        );
    }
}

export default ForgotPassword;