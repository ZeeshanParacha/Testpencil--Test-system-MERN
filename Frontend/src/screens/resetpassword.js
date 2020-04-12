import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDBInput, MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'



const loading = {
    margin: '1em',
    fontSize: '24px',
};

const title = {
    pageTitle: 'Password Reset Screen',
};

export default class ResetPassword extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            updated: false,
            isLoading: true,
            error: false,
        };
    }

    async componentDidMount() {
        console.log('token---->' , this.props.match.params.token)
        
        try {
            fetch('http://localhost:8080/Auth/reset', {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    resetPasswordToken: this.props.match.params.token,
                })
            }).then((res) => res.json()).then((response=>{
                if (response.msg === 'password reset link a-ok') {
                    this.setState({
                        username: response.username,
                        updated: false,
                        isLoading: false,
                        error: false,
                    });
                }
            })); 
        } catch (error) {
            console.log(error);
            this.setState({
                updated: false,
                isLoading: false,
                error: true,
            });
        }
    }

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    updatePassword = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        try {
            fetch('http://localhost:8080/Auth/updatePasswordViaEmail', {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    email : username,
                    password : password,
                    resetPasswordToken: this.props.match.params.token,

                })
            }).then((res) => res.json()).then((response) =>{

                if (response.msg === 'password updated') {
                    this.setState({
                        updated: true,
                        error: false,
                    });
                } else {
                    this.setState({
                        updated: false,
                        error: true,
                    });
                }
            })
        } catch (error) {
            console.log(error.response.data);
        }
    };

    render() {
        const {
            password, error, isLoading, updated
        } = this.state;

        if (error) {
            return (
                <Row noGutters className='forgotpassword'>
                    <Col md={{ span: 6, offset: 3 }} xs={{ span: 8, offset: 2 }}>

                        <div className='forgotcard'>
                            <div className="text-center">
                                <h3>Problem resetting password. Please send another reset link.</h3>
                                <div className="text-left">
                                    <div className='Gohome'><Link to='/'><MDBIcon icon="arrow-left" />Go Home</Link></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            );
        }
        if (isLoading) {
            return (
                <Row noGutters className='forgotpassword'>
                    <Col md={{ span: 6, offset: 3 }} xs={{ span: 8, offset: 2 }}>

                        <div className='forgotcard'>
                            <div className="text-center">
                                <h3>Loading User Data...</h3>
                            </div>
                        </div>
                    </Col>
                </Row>
            );
        }
        return (
            <Row noGutters className='forgotpassword'>
                <Col md={{ span: 6, offset: 3 }} xs={{ span: 8, offset: 2 }}>
                    <div className='forgotcard'>
                        <div className="text-center">
                            <h3>Password Reset</h3>
                        </div>
                        <form className="profile-form" onSubmit={this.updatePassword}>
                            <MDBInput label="New Password" icon="lock" group type="password" required onChange={this.handleChange('password')} value={password} />
                            <button className="text-center">
                                <div className='loginBtn reset'>Update Password</div>
                            </button>
                        </form>
                        {updated && (
                            <div className='text-center error'>
                                <p>
                                    Your password has been successfully reset, please try logging in
                                    again.
                                 </p>
                                <div className="text-right">
                                    <div className='Gohome'><Link to='/'>Login<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></Link></div>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>


        );
    }
}

