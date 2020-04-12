import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon } from 'mdbreact';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {

            name: '',
            email: '',
            password: '',
            age: '',
            classname: '',
            School: '',
            city: '',
            phone: '',
            gender: '',
            country: '',
            message: '',
            showAlert: false,



            isValidate: false,
            isfullName: false,
            isEmail: false,
            isGender: false,
            isCountry: false,
            isCity: false,
            isPassword: false,
            isAge: false,
            isSchool: false,
            ismessageError: false,


        }
        this.Signup = this.Signup.bind(this)

    }


    Signup(e) {
        e.preventDefault();
        const { email, password, name, age, classname, School, city, phone, gender, country,
        } = this.state;


        // email validation
        const emailREGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailResult = emailREGEX.test(email);

        const passwordREGEX = new RegExp("^(?=.*[0-9])(?=.{6,})");
        const passwordResult = passwordREGEX.test(password);

        //full name validation

        if (name.length === 0) {
            this.setState({ isfullName: true })
        }
        else if (emailResult === false) {
            this.setState({ isEmail: true });
        }
        else if (passwordResult === false) {
            this.setState({ isPassword: true });
        }

        else if (isNaN(age) || age <= 0 || age > 100) {
            this.setState({ isAge: true });
        }
        else if (classname.length === 0) {
            this.setState({ isClass: true });
        }
        else if (School.length === 0 || !isNaN(School)) {
            this.setState({ isSchool: true });
        }
        else if (country.length === 0 || !isNaN(country)) {
            this.setState({ isCountry: true });
        }
        else if (city.length === 0 || city === '' || !isNaN(city)) {
            this.setState({ isCity: true });
        }

        else if (gender === '') {
            this.setState({ isGender: true })
        }
        else {
            fetch(`${process.env.REACT_APP_API}Auth/Signup`, {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                    school: School,
                    city: city,
                    country: country,
                    phone: phone,
                    gender: gender,
                    class: classname,
                    age: age,


                })
            }).then(res => res.json())
                .then((res) => {
                    if (res.isUser === false) {
                        console.log(res.message)
                        this.setState({ message: res.message, ismessageError: true, name: '', email: '', password: '', classname: '', gender: '', country: '', city: '', phone: '', age: '', School: '' })
                        setTimeout(() => {
                            this.setState({ ismessageError: false })
                        }, 6000);
                    }
                    else {
                        this.setState({ showAlert: true, name: '', email: '', password: '', classname: '', gender: '', country: '', city: '', classname: '', phone: '', age: '', School: '' })

                        setTimeout(() => {
                            this.setState({ showAlert: false })
                        }, 6000);
                    }
                });

        }
    }

    resetThenSet = (id, key) => {
        let temp = JSON.parse(JSON.stringify(this.state[key]));
        temp.forEach(item => item.selected = false);
        temp[id].selected = true;
        this.setState({
            [key]: temp
        });
    }

    render() {
        const props = this.props;
        return (
            <>
                {/*Login Modal*/}

                <MDBContainer>
                    <MDBModal isOpen={this.props.isopen} toggle={this.props.toggle(9)} fullHeight position="right">
                        <MDBModalHeader toggle={this.props.toggle(9)}></MDBModalHeader>
                        <MDBModalBody>
                            {this.state.showAlert &&
                                <div id='showAlert' style={{ fontSize: '13px', margin: '6px' }}>
                                    <div>
                                        <span className='special'>Congratulations!</span>
                                        <p>Your account has been created.</p>
                                    </div>

                                </div>}

                            {!this.state.showAlert && <div>
                                <MDBRow>
                                    <MDBCol md="12">
                                        <form>
                                            <div className='loginimg'>
                                                {/* <img src="./images/logo4.png" style={{ width: '90px', height: '90px' }} /> */}
                                                <h1>Sign up</h1>
                                            </div>

                                            {this.state.ismessageError === true ? <p style={{ fontSize: '13px', margin: '6px' }}>{this.state.message}</p> :
                                                <>
                                                    <div>
                                                        <MDBInput label="Name" icon="user" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ name: e.target.value }) }} value={this.state.name} required />
                                                        {!this.state.isfullName && <div className='formError formnoError'>Required*</div>}
                                                        {this.state.isfullName && <div className='formError'>*Required i.e Mark Zuckerbarg</div>}
                                                        <MDBInput label="Email" icon="envelope" validate type='email' error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ email: e.target.value }) }} value={this.state.email} required />
                                                        {!this.state.isEmail && <div className='formError formnoError'>*Must be in email format i.e abc@co.com</div>}
                                                        {this.state.isEmail && <div className='formError'>*Must be in email format i.e abc@co.com</div>}


                                                        <MDBInput label="Password" icon="lock" validate type="password"
                                                            onChange={(e) => { this.setState({ password: e.target.value }) }} value={this.state.password} required />
                                                        {!this.state.isPassword && <div className="formError formnoError">*Password should contain minimum 6 characters and at least a number</div>}
                                                        {this.state.isPassword && <div className="formError">*Password should contain minimum 6 characters and at least a number</div>}
                                                        <MDBInput label="Age" icon="adn" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ age: e.target.value }) }} value={this.state.age} required />
                                                        {!this.state.isAge && <div className='formError formnoError'>*Required, must be a valid number</div>}
                                                        {this.state.isAge && <div className='formError'>*Required, must be a valid number</div>}
                                                        {/* <MDBInput label="Class" icon="graduation-cap" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ classname: e.target.value }) }} value={this.state.classname} required /> */}
                                                        <div className='select'>
                                                            <div className='selectoptions'>
                                                                <MDBIcon style={{ color : '#fa4c56', fontSize: '26px' }} icon="graduation-cap" />
                                                                <select onChange={(e) => { this.setState({ classname: e.target.value }) }} >
                                                                    <option value="">Select Class</option>
                                                                    <option value="Class I">Class I</option>
                                                                    <option value="Class II">Class II</option>
                                                                    <option value="Class III">Class III</option>
                                                                    <option value="Class IV">Class IV</option>
                                                                    <option value="Class V">Class V</option>
                                                                    <option value="Class VI">Class VI</option>
                                                                    <option value="Class VII">Class VII</option>
                                                                    <option value="Class VIII">Class VIII</option>
                                                                    <option value="Class IX">Class IX</option>
                                                                    <option value="Class X">Class X</option>
                                                                    <option value="Class XI">Class XI</option>
                                                                    <option value="Class XII">Class XII</option>
                                                                </select>
                                                            </div>
                                                            {!this.state.isClass && <div className='formError formnoError'>*Required</div>}
                                                            {this.state.isClass && <div className='formError'>*Required</div>}
                                                        </div>
                                                        <MDBInput label="School name" icon="university" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ School: e.target.value }) }} value={this.state.School} required />
                                                        {!this.state.isSchool && <div className='formError formnoError'>*Required, must be string i.e Roots national</div>}
                                                        {this.state.isSchool && <div className='formError'>*Required, must be string i.e Roots national</div>}

                                                        <MDBInput label="Country" icon="flag" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ country: e.target.value }) }} value={this.state.country} required />
                                                        {!this.state.isCountry && <div className='formError formnoError'>*Required, must be string i.e India</div>}
                                                        {this.state.isCountry && <div className='formError'>*Required, must be string i.e India</div>}


                                                        <MDBInput label="City" icon="contao" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ city: e.target.value }) }} value={this.state.city} required />
                                                        {!this.state.isCity && <div className='formError formnoError'>*Required, must be string i.e mumbai</div>}
                                                        {this.state.isCity && <div className='formError'>*Required, must be string i.e mumbai</div>}


                                                        <MDBInput label="Phone" icon="phone" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ phone: e.target.value }) }} value={this.state.phone} required />
                                                        <div className='formErrorphone'>*Optional, i.e 045219910193</div>
                                                        <div>
                                                            <label className='containerradio'> Male
                                                    <input onClick={(e) => { this.setState({ gender: 'male' }) }} type="radio" name="gender" />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                            <label className='containerradio'> Female
                                                    <input onClick={(e) => { this.setState({ gender: 'female' }) }} type="radio" name="gender" />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                            {this.state.isGender && <div className='formError gender'>*Required</div>}

                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className='loginBtn' onClick={this.Signup}>Sign up</div>
                                                    </div>
                                                    <div className='text-center signuplink'>
                                                        <p><span style={{ color: '#9e9e9e' }}>Already have an account?</span> <span onClick={this.props.switchtoggle(9)} style={{ cursor: 'pointer', fontWeight: 'bold', color: '#fa4c56' }}>Login</span></p>
                                                    </div>
                                                </>
                                            }
                                        </form>


                                    </MDBCol>
                                </MDBRow>
                            </div>}
                        </MDBModalBody>
                        <MDBModalFooter>
                            <div className='closebtn' onClick={this.props.toggle(9)}>Close</div>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
            </>
        );
    }
}

export default Signup;