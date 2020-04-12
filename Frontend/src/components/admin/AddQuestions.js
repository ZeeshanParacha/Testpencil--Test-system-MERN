import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import HeaderComponent from '../header/HeaderComponent';
import { ToastsContainer, ToastsStore } from 'react-toasts';




import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

import axios from 'axios';

class AddQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {


            allclasses: [],
            Subjectnames: [],
            Topicnames: [],
            Chapternames: [],
            Classesnames: [],

            isclass: true,
            isSubject: false,
            isTopic: false,
            isChapter: false,
            isQuestion: false,

            classname: '',
            Subject: '',
            Chapter: '',
            Topic: '',
            Question: '',
            Option1: '',
            Option2: '',
            Option3: '',
            CorrectAnswer: '',
            videolink: '',
            picture: '',
            sound: '',
            multerImage: '',
            QuestionImagePath: '',
            audio: '',
            videopath: '',

            classContent: [],
            uploadcontent: false,
            isUploaded: false,
            ispicture: false,
            issound: false,
            isvideo: false,
            ismessageError: false,

            uniquesclassloop: []
        }
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_API}Admin/allclasses`).then(res => res.json())
            .then((res) => {
                if (res.isClass === false) {
                    console.log(res.message)
                    this.setState({ ismessageError: true, })
                }
                else {
                    console.log('result-->', res.result)

                    const Uniqueclassesnames = []
                    res.result.filter(function (item) {
                        if (Uniqueclassesnames.indexOf(item['classname']) === -1) {
                            Uniqueclassesnames.push(item['classname'])
                            return true
                        }
                    })
                    this.setState({ ismessageError: false, Classesnames: Uniqueclassesnames, allclasses: res.result })
                }
            });
    }

    uploadClassContent = () => {
        console.log('clicked--->')

        const { Subject, Topic, Chapter, Question, Option1, Option2, Option3, CorrectAnswer, QuestionImagePath, audio, videopath } = this.state;

        if (Question === '' || Option1 === '' || Option2 === '' || Option3 === '' || CorrectAnswer === '') {
            ToastsStore.warning("All fields are required")
            console.log('clicked inside--->')

        }
        else {
            console.log('audio----> updatecontentme', audio)

            let imageFormObj = new FormData();

            imageFormObj.append("imageName", "QuestionImage-" + Date.now());
            imageFormObj.append("Questionimage", QuestionImagePath);
            imageFormObj.append("Audio", audio);


            let content = {
                classname: this.state.classname,
                Subject,
                Topic,
                Chapter,
                Question,
                Option1,
                Option2,
                Option3,
                CorrectAnswer,
                videopath,
            }
            imageFormObj.append("content", JSON.stringify(content))

            let API_URL = process.env.REACT_APP_API
            axios.post(`${API_URL}Admin/addquestions`, imageFormObj)
                .then((data) => {
                    console.log('data--->', data.data.isSuccess)

                    if (data.data.isSuccess === true) {
                        this.setState({ Question: '', Option1: '', Option2: '', Option3: '', CorrectAnswer: '', videopath: '', isUploaded: true, isQuestion: false })
                        setTimeout(() => {
                            this.setState({ isUploaded: false, isSubject: false, isChapter: false, isTopic: false, isQuestions: false, isclass: true })
                        }, 3000);
                        this.fileInput.value = "";
                    }
                    else {

                        this.setState({ ismessageError: true })
                        setTimeout(() => {
                            this.setState({ ismessageError: false, })
                        }, 3000);
                    }


                })
                .catch((err) => {
                    //   alert("Error while uploading image using multer");
                    //   this.setDefaultImage("multer");
                });
        }
    }

    addMoreQuestions = () => {
        // const singleClassId = localStorage.getItem('singleClassId')

        console.log('clicked--->')

        const { Subject, Topic, Chapter, Question, Option1, Option2, Option3, CorrectAnswer, QuestionImagePath, audio, videopath } = this.state;
        if (Question === '' || Option1 === '' || Option2 === '' || Option3 === '' || CorrectAnswer === '') {
            ToastsStore.warning("All fields are required")
        }
        else {
            console.log('audio----> updatecontentme', audio)

            let imageFormObj = new FormData();

            imageFormObj.append("imageName", "QuestionImage-" + Date.now())
            imageFormObj.append("Questionimage", QuestionImagePath);
            imageFormObj.append("Audio", audio);


            let content = {
                classname: this.state.classname,
                Subject,
                Topic,
                Chapter,
                Question,
                Option1,
                Option2,
                Option3,
                CorrectAnswer,
                videopath,

            }
            imageFormObj.append("content", JSON.stringify(content))

            let API_URL = process.env.REACT_APP_API
            axios.post(`${API_URL}Admin/addquestions`, imageFormObj)
                .then((data) => {
                    this.setState({ Question: '', Option1: '', Option2: '', Option3: '', CorrectAnswer: '', videopath: '', })
                    this.fileInput.value = "";
                })
                .catch((err) => {
                });
        }
    }

    checkRadio(e) {
        console.log('radio---->', e)

        if (e === 'picture') {
            this.setState({ ispicture: true, isvideo: false, issound: false })
        }
        else if (e === 'video') {
            this.setState({ isvideo: true, ispicture: false, issound: false })
        }
        else if (e === 'sound') {
            this.setState({ issound: true, ispicture: false, isvideo: false })
        }
    }

    uploadImage(e, path) {
        // stores a readable instance of 
        // the image being uploaded using multer
        console.log('e.target.files[0]', e.target.files[0])
        let subjectImage;
        let ChapterImage;
        let TopicImage;
        let audio;
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

        if (path === 'audio') {
            audio = e.target.files[0]
            this.setState({ audio: audio, QuestionImagePath: '', videopath: '' })

        }
        if (path === 'question') {
            this.setState({

                QuestionImagePath: e.target.files[0],
                audio: '',
                videopath: ''
            });

        }
    }

    fetchSubjects(classname) {
        const { allclasses } = this.state;

        console.log('classname', classname)
        let uniquesclassloop = []
        for (let key in allclasses) {
            console.log('classname-->', allclasses[key].classname)
            if (allclasses[key].classname === classname) {
                uniquesclassloop.push(allclasses[key])
            }
        }



        const UniqueSubjectnames = []
        uniquesclassloop.filter(function (item) {
            if (UniqueSubjectnames.indexOf(item['Subject']) === -1) {
                UniqueSubjectnames.push(item['Subject'])
                return true
            }
        })


        this.setState({ Subjectnames: UniqueSubjectnames, isclass: false, isSubject: true, uniquesclassloop: uniquesclassloop })

    }

    fetchChapters(Subject) {
        const { uniquesclassloop } = this.state;

        console.log('Subject', Subject)
        console.log('uniquesclassloop', uniquesclassloop)
        let chapters = []
        for (let key in uniquesclassloop) {
            if (uniquesclassloop[key].Subject === Subject) {
                chapters.push(uniquesclassloop[key])
            }
        }




        console.log('Uniquechaaptersnames', chapters)

        this.setState({ Chapternames: chapters, isSubject: false, isChapter: true })
    }
    fetchTopics(Chapter) {
        const { uniquesclassloop } = this.state;

        console.log('Subject', Chapter)
        console.log('uniquesclassloop', uniquesclassloop)
        let Topics = []
        for (let key in uniquesclassloop) {
            if (uniquesclassloop[key].Chapter === Chapter) {
                Topics.push(uniquesclassloop[key])
            }
        }
        console.log('Topics', Topics)

        this.setState({ Topicnames: Topics, isChapter: false, isTopic: true })
    }

    render() {
        console.log('allClasses---->', this.state.allclasses)
        return (
            //  Step#1 of creating class
            <>
        <ToastsContainer store={ToastsStore} />
                <HeaderComponent title={'Add Question'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                {this.state.isclass && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-left'>
                                    <h4>Select Class</h4>
                                </div>
                                <div className='select'>
                                    <div className='selectoptions'>
                                        <MDBIcon style={{ color: '#fa4c56', fontSize: '26px' }} icon="graduation-cap" />
                                        <select onChange={(e) => { this.setState({ classname: e.target.value }) }} >
                                            <option value="">Select Class</option>

                                            {this.state.Classesnames.map((item) => {
                                                return <option key={item} value={item}>{item}</option>

                                            })}
                                        </select>
                                    </div>
                                    {/* {this.state.isClass && <div className='classformError'>*Required</div>} */}

                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                    <div className='nextBtn' onClick={() => this.fetchSubjects(this.state.classname)}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
                {this.state.isSubject && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-left'>
                                    <h4>Select Subject</h4>
                                </div>
                                <div className='select'>
                                    <div className='selectoptions'>
                                        <MDBIcon style={{ color: '#fa4c56', fontSize: '26px' }} icon="exclamation-circle" />
                                        <select onChange={(e) => { this.setState({ Subject: e.target.value }) }} >
                                            <option value="">Select Subject</option>

                                            {this.state.Subjectnames.map((item) => {
                                                return <option key={item} value={item}>{item}</option>

                                            })}
                                        </select>
                                    </div>
                                    {/* {this.state.isClass && <div className='classformError'>*Required</div>} */}

                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <div style={{ display: 'inline-block' }} className='text-left'>
                                        <div className='nextBtn' onClick={() => this.setState({ isSubject: false, isclass: true })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                    </div>
                                    <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                        <div className='nextBtn' onClick={() => this.fetchChapters(this.state.Subject)}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
                {this.state.isChapter && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-left'>
                                    <h4>Select Chapter</h4>
                                </div>
                                <div className='select'>
                                    <div className='selectoptions'>
                                        <MDBIcon style={{ color: '#fa4c56', fontSize: '26px' }} icon="contao" />
                                        <select onChange={(e) => { this.setState({ Chapter: e.target.value }) }} >
                                            <option value="">Select Chapter</option>

                                            {this.state.Chapternames.map((item) => {
                                                return <option key={item.Chapter} value={item.Chapter}>{item.Chapter}</option>

                                            })}
                                        </select>
                                    </div>
                                    {/* {this.state.isClass && <div className='classformError'>*Required</div>} */}

                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <div style={{ display: 'inline-block' }} className='text-left'>
                                        <div className='nextBtn' onClick={() => this.setState({ isChapter: false, isSubject: true })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                    </div>
                                    <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                        <div className='nextBtn' onClick={() => this.fetchTopics(this.state.Chapter)}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
                {this.state.isTopic && <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-left'>
                                    <h4>Select Topic</h4>
                                </div>
                                <div className='select'>
                                    <div className='selectoptions'>
                                        <MDBIcon style={{ color: '#fa4c56', fontSize: '26px' }} icon="first-order" />
                                        <select onChange={(e) => { this.setState({ Topic: e.target.value }) }} >
                                            <option value="">Select Topic</option>

                                            {this.state.Topicnames.map((item) => {
                                                return <option key={item.Topic} value={item.Topic}>{item.Topic}</option>

                                            })}
                                        </select>
                                    </div>
                                    {/* {this.state.isClass && <div className='classformError'>*Required</div>} */}

                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <div style={{ display: 'inline-block' }} className='text-left'>
                                        <div className='nextBtn' onClick={() => this.setState({ isTopic: false, isChapter: true })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                    </div>
                                    <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                        <div className='nextBtn' onClick={() => this.setState({ isTopic: false, isQuestion: true })}>Next<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}{this.state.isQuestion && <div style={{ height: 'inherit', marginTop: '30px' }}>
                    <Row noGutters className='classcard-row specificclass'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-left'>
                                    <h4>Add Questions</h4>
                                </div>
                                <MDBInput label="Question" icon="first-order" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ Question: e.target.value }) }} value={this.state.Question} required />
                                <div style={{ display: 'flex', color: '#757575', flexDirection: 'row', justifyContent: 'flex-start', marginTop: '-20px', marginBottom: '-20px' }}>
                                    <p>Optional :</p>
                                    <label className='containerradio optionalradio'> Picture
                                                    <input onClick={() => { this.checkRadio('picture') }} type="radio" name="optionalQuestionContent" />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className='containerradio optionalradio'> Video
                                                    <input onClick={() => { this.checkRadio('video') }} type="radio" name="optionalQuestionContent" />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className='containerradio optionalradio'> Sound
                                                    <input onClick={() => { this.checkRadio('sound') }} type="radio" name="optionalQuestionContent" />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                {this.state.ispicture && <div className='selectIcon' style={{ marginTop: '20px' }}>
                                    <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'question')} ref={ref => this.fileInput = ref} />

                                </div>}
                                {this.state.isvideo && <div className='selectIcon' style={{ marginTop: '20px', cursor: 'default' }}>
                                    <MDBInput style={{ cursor: 'default' }} label="Video link" icon="file-video" validate error="wrong"
                                        success="right" onChange={(e) => { this.setState({ videopath: e.target.value, QuestionImagePath: '', audio: '' }) }} value={this.state.videopath} required />
                                </div>}
                                {this.state.issound && <form encType="multipart/form-data" className='selectIcon' style={{ marginTop: '20px' }}>

                                    <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'audio')} ref={ref => this.fileInput = ref} />
                                </form>}
                                <MDBInput label="Wrong option" icon="times-circle" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ Option1: e.target.value }) }} value={this.state.Option1} required />

                                <MDBInput label="Wrong option" icon="times-circle" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ Option2: e.target.value }) }} value={this.state.Option2} required />
                                <MDBInput label="Wrong option" icon="times-circle" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ Option3: e.target.value }) }} value={this.state.Option3} required />

                                <MDBInput label="Correct option" icon="check-circle" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ CorrectAnswer: e.target.value }) }} value={this.state.CorrectAnswer} required />


                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'inline-block' }} className='text-left'>
                                        <div className='nextBtn' onClick={() => this.setState({ isTopic: true, isQuestion: false })}><MDBIcon style={{ paddingRight: '5px' }} icon="arrow-left" />Back</div>
                                    </div>
                                    <div onClick={this.addMoreQuestions} className='addmorebtn'>
                                        <div>Add More</div>
                                    </div>
                                    <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                        <div className='nextBtn' onClick={this.uploadClassContent}>Upload<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>

                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
                {this.state.isUploaded && <div className='contentbox'>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-center'>
                                    <h4 style={{ margin: '0' }}>Questions has been added.</h4>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
                {this.state.ismessageError && <div className='contentbox'>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-center'>
                                    <h4 style={{ margin: '0' }}>It seems some error occurs, Try again...</h4>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
            </>
        );

    }
}

export default AddQuestion;
