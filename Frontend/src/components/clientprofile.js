import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { withRouter } from "react-router";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';



import HeaderComponent from './header/HeaderComponent';
const GifPlayer = require('react-gif-player');

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

            userdetail: '',
            modal: false,
            username: '',
            classname: '',
            school: '',
            city: '',
            country: '',
            age: '',
            phone: '',
            gender: '',

            isfullName: false,
            isEmail: false,
            isGender: false,
            isCountry: false,
            isCity: false,
            isAge: false,
            isSchool: false,


        };
    }

    componentWillMount() {
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))

        if (userdetail === null || userdetail._id === undefined || userdetail._id === '') {
            this.props.history.push('/')
        }
        else {
            this.setState({ userdetail })
        }


    }

    componentDidMount() {


    }
    

    toggle(name,age,classname,school,city,country,gender,phone) {
        this.setState({
            modal: !this.state.modal,
            username : name,
            age:age,
            classname : classname,
            school : school,
            city : city,
            country : country,
            gender : gender,
            phone : phone
        })
    }


    modifyprofile = () => {

        const {username,classname ,school,city , country , age , phone, gender} = this.state

        console.log(username,classname,school,city,country,phone,gender,age)
          //full name validation
  
          if (username.length === 0) {
              this.setState({ isfullName: true })
          }
          else if (isNaN(age) || age <= 0 || age > 100) {
              this.setState({ isAge: true });
          }
          else if (classname.length === 0) {
              this.setState({ isClass: true });
          }
          else if (school.length === 0 || !isNaN(school)) {
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
          }else {
            const userdetail = JSON.parse(localStorage.getItem('userdetail'))
            const profileid = userdetail._id
            fetch(`${process.env.REACT_APP_API}Auth/modifyprofile`, {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    name: username,
                    school: school,
                    city: city,
                    country: country,
                    phone: phone,
                    gender: gender,
                    class: classname,
                    age: age,
                    profileid : profileid
                })
            }).then(res => res.json())
                .then((res) => {
                    if (res.isUser === false) {
                        console.log(res.message)
                        this.setState({  username: '',classname: '', gender: '', country: '', city: '', phone: '', age: '', school: '' })
                        ToastsStore.warning("Some error file modifying profile")

                    }
                    else {
                        this.setState({  username: '',  classname: '', gender: '', country: '', city: '', classname: '', phone: '', age: '', school: '' });
                        ToastsStore.warning("Your profile has been modified.")
                        localStorage.setItem('userdetail', JSON.stringify(res.result))
                        window.location.reload()
                    }
                });
          }

    }
    render() {
        console.log('userdetail', this.state.userdetail)
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        return (
            <>
                <HeaderComponent title={'My Profile'} clientname={userdetail.name} headimg={userdetail.name[0]} logout={'client'} onSelectSearch={this.handleSearch} onsearchClick={this.handlesearchclick} />
                <ToastsContainer store={ToastsStore} />

                <div className='profile'>
                    <Row noGutters style={{ width: '100%' }}>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='profileCard'>
                                <div style={{ textAlign: 'right', marginBottom: '6px' }}>
                                    <p style={{ cursor: 'pointer', display: 'inline-block' }}
                                        onClick={() => this.toggle(userdetail.name,userdetail.age,userdetail.class,userdetail.school,userdetail.city,userdetail.country,userdetail.gender,userdetail.phone)}>
                                        Edit Profile</p>
                                </div>
                                <div style={{ background: '#fdfdfd', borderRadius: '4px', paddingBottom: '20px' }}>
                                    <div className='profileImg'>
                                        <p>
                                            {userdetail.gender === 'male' ?
                                                <GifPlayer
                                                    gif='https://cdn.dribbble.com/users/1961926/screenshots/6607609/tan_rig.gif'
                                                    autoplay={true}
                                                    className="responsiveImage"
                                                /> :
                                                <img src='/images/girlprofile.jpg' />}
                                        </p>

                                    </div>
                                    <div className='profilecontent'>
                                        <p className='username'>{userdetail.name}</p>
                                        <p className='email'>{userdetail.email}</p>
                                        <div className='profileContent'>
                                            <div><p>Classname</p><p className='specialp'>{userdetail.class}</p></div>
                                            <div><p>School</p><p className='specialp'>{userdetail.school}</p></div>
                                            <div><p>City</p><p className='specialp'>{userdetail.city}</p></div>
                                            <div><p>Country</p><p className='specialp'>{userdetail.country}</p></div>
                                            <div><p>Age</p><p className='specialp'>{userdetail.age}</p></div>
                                            <div><p>Gender</p><p className='specialp'>{userdetail.gender}</p></div>
                                            <div><p>Phone</p><p className='specialp'>{userdetail.phone ? userdetail.phone : '---'}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>


                <div className='modifyModal'>
                    <MDBModal isOpen={this.state.modal} toggle={() => this.toggle()} centered>
                        <MDBModalHeader toggle={() => this.toggle()}>Modify Profile</MDBModalHeader>
                        <MDBModalBody>
                            <div>
                                <MDBInput label="Name" icon="user" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ username: e.target.value }) }} value={this.state.username} required />
                                {!this.state.isfullName && <div className='formError formnoError'>Required*</div>}
                                {this.state.isfullName && <div className='formError'>*Required i.e Mark Zuckerbarg</div>}

                                <MDBInput label="Age" icon="adn" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ age: e.target.value }) }} value={this.state.age} required />
                                {!this.state.isAge && <div className='formError formnoError'>*Required, must be a valid number</div>}
                                {this.state.isAge && <div className='formError'>*Required, must be a valid number</div>}
                                {/* <MDBInput label="Class" icon="graduation-cap" validate error="wrong"
                                                            success="right" onChange={(e) => { this.setState({ classname: e.target.value }) }} value={this.state.classname} required /> */}
                                <div className='select'>
                                    <div className='selectoptions'>
                                        <MDBIcon style={{ color: '#fa4c56', fontSize: '26px' }} icon="graduation-cap" />
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
                                    success="right" onChange={(e) => { this.setState({ school: e.target.value }) }} value={this.state.school} required />
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
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                    <div className='nextBtn' onClick={this.modifyprofile}>Modify it</div>
                                </div>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </div>
            </>
        );

    }

}

export default withRouter(Profile);
