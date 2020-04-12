import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import HeaderComponent from '../header/HeaderComponent';
import axios from 'axios';



class Createclass extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            classname: '',
            Subject: '',
            Chapter: '',
            Topic: '',
            TopicImage: '',
            ChapterImage: '',
            SubjectImage: '',




            isClassComponent: true,
            isClassCreated: false,
            ismessageError: false,
            requiredfields: false,

            isClass: true,
            isSubject: false,
            isChapter: false,
            isTopic: false

        }
    }

    createclass = () => {
        const { classname, Subject, Topic, Chapter, SubjectImage, TopicImage, ChapterImage, } = this.state;


        let imageFormObj = new FormData();

        imageFormObj.append("Subjectimage", SubjectImage);
        imageFormObj.append("Chapterimage", ChapterImage);
        imageFormObj.append("Topicimage", TopicImage);

        let content = {
            classname,
            Subject,
            Topic,
            Chapter,
        }
        imageFormObj.append("content", JSON.stringify(content))

        if (classname === '' || Subject === '' || Topic === '' || Chapter === '') {
            this.setState({ requiredfields: true, isClassComponent: false, isClass: false, isSubject: false, isTopic: false, isChapter: false })
            setTimeout(() => {
                this.setState({ requiredfields: false, isClassComponent: true, isClass: true })
            }, 3000);
        }
        else {
            let API_URL = process.env.REACT_APP_API
            axios.post(`${API_URL}Admin/Createclass`, imageFormObj)
                .then((res) => {


                    if (res.data.isSuccess === false) {
                        console.log(res.message, '-----+++++++>>>>>')
                        this.setState({ ismessageError: true, isClassComponent: false, isClass: false, isSubject: false, isTopic: false, isChapter: false })
                        setTimeout(() => {
                            this.setState({ ismessageError: false, isClassComponent: true, isClass: true, isSubject: false, isTopic: false, isChapter: false })
                        }, 7000);
                    }
                    else {
                        this.setState({ isClassCreated: true, isClassComponent: false, isClass: false, isSubject: false, isTopic: false, isChapter: false })
                        setTimeout(() => {
                            this.setState({ isClassCreated: false, isClassComponent: true, isClass: true })
                        }, 3000);
                    }

                })
                .catch((err) => {

                });


        }
    }

    componentDidMount() {





    }
    uploadImage(e, path) {
        // stores a readable instance of 
        // the image being uploaded using multer

        let subjectImage;
        let ChapterImage;
        let TopicImage;
        if (path === 'subject') {
            subjectImage = e.target.files[0]
            this.setState({ SubjectImage: subjectImage, })
        }

        if (path === 'topic') {
            TopicImage = e.target.files[0]
            this.setState({ TopicImage: TopicImage, })

        }

        if (path === 'chapter') {
            ChapterImage = e.target.files[0]
            this.setState({ ChapterImage: ChapterImage, })
        }
    }

    openSelect(){

        var self = this;
      
            document.querySelector('.custom-selectnew').classList.toggle('open');
            


        for (const option of document.querySelectorAll(".custom-option")) {
            option.addEventListener('click', function () {
                if (!this.classList.contains('selected')) {
                    this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                    this.classList.add('selected');
                    this.closest('.custom-selectnew').querySelector('.custom-select__trigger span').textContent = this.textContent;
                    self.setState({ classname: this.textContent })
                }
            })
        }
    }
    render() {
        console.log(this.state.classname, 'classname')
        if (this.state.isClassComponent) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'Create Class'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                   
                    {this.state.isClass && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard'>
                                    <div className='text-left'>
                                        <h4>Select Class</h4>
                                    </div>
                                   
                                    <div className="custom-select-wrapp" onClick={this.openSelect.bind(this)}>
                                        <MDBIcon style={{ color: '#fa4c56', fontSize: '26px' }} icon="graduation-cap" />

                                        <div className="custom-selectnew">

                                            <div className="custom-select__trigger" >
                                                <span> Select Class
                                                    </span>
                                                <div className="arrow"></div>
                                            </div>
                                            <div className="custom-options">
                                                <span className="custom-option selected"></span>
                                                <span className="custom-option">Class I</span>
                                                <span className="custom-option">Class II</span>
                                                <span className="custom-option">Class III</span>
                                                <span className="custom-option">Class IV</span>
                                                <span className="custom-option">Class V</span>
                                                <span className="custom-option">Class VI</span>
                                                <span className="custom-option">Class VII</span>
                                                <span className="custom-option">Class VIII</span>
                                                <span className="custom-option">Class XI</span>
                                                <span className="custom-option">Class X</span>
                                                <span className="custom-option">Class XI</span>
                                                <span className="custom-option">Class XII</span>


                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                        <div className='nextBtn' onClick={() => this.setState({ isClass: false, isSubject: true })}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>}
                    {this.state.isSubject && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row specificclass'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard'>
                                    <div className='text-left'>
                                        <h4>Add Subject</h4>
                                    </div>
                                    <MDBInput label="Subject" icon="exclamation-circle" validate error="wrong"
                                        success="right" onChange={(e) => { this.setState({ Subject: e.target.value }) }} value={this.state.Subject} required />
                                    <div className='selectIcon'>
                                        <label>Select Icon:</label>
                                        <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'subject')} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'inline-block' }} className='text-left'>
                                            <div className='nextBtn' onClick={() => this.setState({ isSubject: false, isClass: true })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                        </div>
                                        <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                            <div className='nextBtn' onClick={() => this.setState({ isSubject: false, isChapter: true })}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>}
                    {this.state.isChapter && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row specificclass'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard'>
                                    <div className='text-left'>
                                        <h4>Add Chapter</h4>
                                    </div>
                                    <MDBInput label="Chapter" icon="contao" validate error="wrong"
                                        success="right" onChange={(e) => { this.setState({ Chapter: e.target.value }) }} value={this.state.Chapter} required />
                                    <div className='selectIcon'>
                                        <label>Select Icon:</label>
                                        <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'chapter')} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'inline-block' }} className='text-left'>
                                            <div className='nextBtn' onClick={() => this.setState({ isSubject: true, isChapter: false })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                        </div>
                                        <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                            <div className='nextBtn' onClick={() => this.setState({ isChapter: false, isTopic: true })}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                        </div>
                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </div>}
                    {this.state.isTopic && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row specificclass'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard'>
                                    <div className='text-left'>
                                        <h4>Add Topic</h4>
                                    </div>
                                    <MDBInput label="Topic" icon="first-order" validate error="wrong"
                                        success="right" onChange={(e) => { this.setState({ Topic: e.target.value }) }} value={this.state.Topic} required />
                                    <div className='selectIcon'>
                                        <label>Select Icon:</label>
                                        <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'topic')} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'inline-block' }} className='text-left'>
                                            <div className='nextBtn' onClick={() => this.setState({ isChapter: true, isTopic: false })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                        </div>
                                        <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                            <div className='nextBtn' onClick={this.createclass}>Create<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>}
                </>
            );
        }
        if (this.state.isClassCreated) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'Create Class'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                    <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard' style={{ display: 'flex', justifyContent: 'center', alignItems: 'çenter' }}>
                                    <div className='text-center'>
                                        <h4 style={{ margin: '0' }}>Your class has been created.</h4>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>

            );
        }
        if (this.state.ismessageError) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'Create Class'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                  
                    <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard' style={{ display: 'flex', justifyContent: 'center', alignItems: 'çenter' }}>
                                    <div className='text-center'>
                                        <h4 stle={{ marginBottom: '10px' }}>The Class your trying to create is already created, or some technical issues...</h4>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>

            );
        }
        if (this.state.requiredfields) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'Create Class'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                   
                    <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard' style={{ display: 'flex', justifyContent: 'center', alignItems: 'çenter' }}>
                                    <div className='text-center'>
                                        <h4 style={{ margin: '0' }}>All feilds are required, please fill all fields again...</h4>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </>

            );
        }


    }
}

export default Createclass;
