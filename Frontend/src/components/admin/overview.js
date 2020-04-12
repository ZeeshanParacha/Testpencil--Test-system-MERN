import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';

import HeaderComponent from '../header/HeaderComponent';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Chart from "react-apexcharts";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player'
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBInput } from 'mdbreact';
import axios from 'axios';
class HelpSection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: ['USER COUNT', 'TEST COUNT']
                }
            },

            search: '',
            isdatafound: false,
            searchContent: [],
            isQuestions: false,
            modal14: false,
            ispicture: false,
            issound: false,
            isvideo: false,
            IsshowAnswers: false,
            showAnswers: '',
            subjectname: '',
            chaptername: '',
            topicname: '',
            questionId: '',
            uniqueId: '',
            Question: '',
            Option1: '',
            Option2: '',
            Option3: '',
            CorrectAnswer: '',
            QuestionImagePath: '',
            audioPath: '',
            videopath: '',
            QuestionimgURL: '',
            modifyquestionid: '',
            totaltesttaken: 0,
            totalusers: 0,
            series: []


        };
    }

    componentWillMount() {
        let totaltesttaken = 0
        let totalusers = 0
        fetch(`${process.env.REACT_APP_API}user/fetchAllResults`).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === true && res.result) {
                    console.log('fetchResults-->', res.result)

                    totaltesttaken = res.result.length
                    this.setState({ totaltesttaken })

                }
                else {
                    totaltesttaken = 0
                }
            }).then(() => {
                fetch(`${process.env.REACT_APP_API}Auth/allusers`).then(res => res.json())
                    .then((res) => {
                        if (res.isSuccess === true) {
                            console.log('allusers-->', res.result.length)
                            totalusers = res.result.length
                            this.setState({ totalusers })
                        }
                        else {
                            totalusers = 0
                        }
                    }).then(() => {

                        console.log('a;agse---> ', totalusers)

                        const series = [
                            {
                                name: "Total users registers",
                                data: [totalusers]
                            },
                            {
                                name: 'Total test taken',
                                data: [totaltesttaken]
                            }
                        ]

                        this.setState({ series: series })
                    })
            })



    }

    componentDidMount() {

    }

    handleSearch = (searchVal) => {
        console.log('searchVal', searchVal)
        this.setState({ search: searchVal });
    }
    handlesearchclick = (clickVal) => {
        if (clickVal === true) {
            console.log(this.state.search)
            if (this.state.search !== '') {
                fetch(`${process.env.REACT_APP_API}Admin/search`, {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        search: this.state.search,
                    })
                }).then((res) => res.json())
                    .then((res) => {
                        if (res.isSuccess === false) {
                            console.log(res.message)
                            this.setState({ isdatafound: true })
                        }
                        else {
                            console.log('searchresult-->', res.result)
                            console.log('searchresult-->', res)
                            let Searchcontent;
                            let uniqueid;

                            for (let key in res.result) {
                                // console.log('res.result[key].content' ,res.result[key].content)
                                Searchcontent = res.result[key].content
                                uniqueid = res.result[key]._id
                            }

                            console.log(Searchcontent, 'Searchcontent--->')

                            this.setState({
                                searchContent: Searchcontent,
                                isQuestions: true,
                                uniqueId: uniqueid
                            })
                        }
                    })

            }
        }
    }

    deletequestion(id) {
        this.setState({ questionId: id })
        console.log(this.state.questionId)
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteQuestion()
                },
                {
                    label: 'No',

                }
            ]
        });
    }
    deleteQuestion() {
        console.log('delete')
        console.log(this.state.uniqueId)

        fetch(`${process.env.REACT_APP_API}Admin/deleteQuestion`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                documentId: this.state.questionId,
                uniqueId: this.state.uniqueId
            })
        }).then(res => res.json())
            .then((res) => {
                console.log('Delete', res.result)
                if (res.isSuccess === true) {
                    confirmAlert({
                        title: 'Success',
                        message: 'Question has been removed',
                        buttons: [

                            {
                                label: 'OK',
                                onClick: () => this.fetchnewQuestions()

                            }
                        ]
                    });
                }
            });
    }
    modifyQuestion = () => {
        const { subjectname, chaptername, topicname, Question, Option1, Option2, Option3, CorrectAnswer, QuestionImagePath, audioPath, videopath, modifyquestionid, uniqueId } = this.state;

        let imageFormObj = new FormData();

        imageFormObj.append("imageName", "QuestionImage-" + Date.now());
        imageFormObj.append("Questionimage", QuestionImagePath);
        imageFormObj.append("Audio", audioPath);
        let content = {
            questionId: modifyquestionid,
            uniqueId,
            subjectname,
            topicname,
            chaptername,
            Question,
            Option1,
            Option2,
            Option3,
            CorrectAnswer,
            videopath,
        }
        imageFormObj.append("content", JSON.stringify(content))
        let API_URL = process.env.REACT_APP_API
        axios.post(`${API_URL}Admin/modifyQuestion`, imageFormObj)
            .then((data) => {
                console.log('data--->', data.data.isSuccess)

                if (data.data.isSuccess === true) {
                    this.setState({ Question: '', Option1: '', Option2: '', Option3: '', CorrectAnswer: '', videopath: '', })
                    this.toggle()
                    this.fetchnewQuestions()
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
    uploadImage(e, path) {
        // stores a readable instance of 
        // the image being uploaded using multer
        console.log('e.target.files[0]', e.target.files[0])
        let audio;

        if (path === 'audio') {
            audio = e.target.files[0]
            this.setState({ audioPath: audio, QuestionImagePath: '', videopath: '' })
        }
        if (path === 'question') {
            this.setState({
                QuestionimgURL: URL.createObjectURL(e.target.files[0]),
                QuestionImagePath: e.target.files[0],
                audioPath: '',
                videopath: ''

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
    toggle(question, option1, option2, option3, correctanswer, QuestionImagePath, audioPath, videopath, questionId) {
        console.log(question, option1, option2, option3, correctanswer)
        this.setState({
            modal14: !this.state.modal14,
            Question: question,
            Option1: option1,
            Option2: option2,
            Option3: option3,
            CorrectAnswer: correctanswer,
            QuestionImagePath: QuestionImagePath,
            audioPath: audioPath,
            videopath: videopath,
            modifyquestionid: questionId
        })
    }
    fetchnewQuestions() {
        fetch(`${process.env.REACT_APP_API}Admin/search`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                search: this.state.search,
            })
        }).then((res) => res.json())
            .then((res) => {
                if (res.isSuccess === false) {
                    console.log(res.message)
                    this.setState({ isdatafound: true })
                }
                else {
                    console.log('searchresult-->', res.result)
                    console.log('searchresult-->', res)
                    let Searchcontent
                    for (let key in res.result) {
                        // console.log('res.result[key].content' ,res.result[key].content)
                        Searchcontent = res.result[key].content
                    }

                    console.log(Searchcontent, 'Searchcontent--->')

                    this.setState({
                        searchContent: Searchcontent,

                    })
                }
            })
    }
    render() {

        console.log('this.state.searchContent', this.state.searchContent)
        return (
            <>
                {/* <HeaderComponent title={'Overview'} showsearch={'showsearch'} onSelectSearch={this.handleSearch} onsearchClick={this.handlesearchclick} /> */}
                <HeaderComponent title={'Overview'} clientname={''} headimg={'%admin%'} logout={'admin'} showsearch={'showsearch'} onSelectSearch={this.handleSearch} onsearchClick={this.handlesearchclick} />

                {!this.state.isQuestions && <div>
                    <div>
                        <div className='contentbox' style={{ marginTop: '40px' }}>
                            <Row noGutters className='classcard-row'>
                                <Col md={6} style={{ padding: '5px' }} xs={{ span: 12 }}>
                                    <div className='classcard usercount'>
                                        <div className='text-center'>
                                            <h4 style={{ margin: '0' }}>TOTAL USERS</h4>
                                            <h3 style={{ margin: '0' }}>{this.state.totalusers}</h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} style={{ padding: '5px' }} xs={{ span: 12 }}>
                                    <div className='classcard usercount'>
                                        <div className='text-center'>
                                            <h4 style={{ margin: '0' }}>TOTAL TEST GIVEN</h4>
                                            <h3 style={{ margin: '0' }}>{this.state.totaltesttaken}</h3>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div id="chart">
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={{ span: 12 }} >
                                <div>
                                    <Chart
                                        options={this.state.options}
                                        series={this.state.series}
                                        type="bar"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>}
                {this.state.isQuestions && <div>
                    <div className='gobackiconhead' style={{ marginBottom: '-25px', marginTop: '30px', display: 'inline-Block', cursor: 'pointer' }}>
                        <div className='singleclasslinkheader' onClick={() => { this.setState({ isQuestions: false }) }} >
                            <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                        </div>

                    </div>
                    <div className='content' style={{ marginTop: '60px' }} >
                        <Row noGutters className='classcard-row' style={{ paddingBottom: '30px' }}>
                            {this.state.searchContent.length > 0 && this.state.searchContent.map((item, index) => {
                                return <Col key={index} style={{ padding: '5px', }} md={{ span: 10 }} xs={12}>
                                    <div className='Allclasscard searchquestions' style={{ padding: '8px', cursor: 'default' }}>
                                        <div className='questionDiv'>
                                            <div style={{ cursor: 'pointer', width: '90%' }} onClick={() => this.setState({ IsshowAnswers: !this.state.IsshowAnswers, showAnswers: item.questionId })}>
                                                <p>Q.{index + 1} {item.Question}</p>
                                            </div>
                                            <div className='editdiv' style={{ padding: '5px', width: '10%', textAlign: 'right', justifyContent: 'flex-end' }}>
                                                <div onClick={() => this.toggle(item.Question, item.Option1, item.Option2, item.Option3, item.CorrectAnswer, item.Questionimagepath, item.audioPath, item.videopath, item.questionId)}>
                                                    <MDBIcon className='edit' style={{ paddingRight: '5px', cursor: 'pointer', fontSize: '16px', color: '#428bca' }} icon="undo" />
                                                </div>
                                                <div onClick={this.deletequestion.bind(this, item.questionId)}>
                                                    <MDBIcon style={{ paddingRight: '5px', fontSize: '16px', cursor: 'pointer', color: '#d9534f' }} icon="trash" />
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.IsshowAnswers && this.state.showAnswers === item.questionId && <div className='answersDiv'>
                                            <div className='questionImg'>
                                                {item.Questionimagepath && <div>
                                                    <span> Optionals: </span>
                                                    <div className='optionaldiv' style={{ marginLeft: 'auto', marginRight: 'auto', width: '300px', textAlign: 'center', paddingBottom: '5px' }}>
                                                        <img src={process.env.REACT_APP_API + item.Questionimagepath} width='300' />
                                                    </div>
                                                </div>}
                                                {item.audioPath && <div>
                                                    <span> Optionals: </span>
                                                    <div className='optionaldiv' style={{ marginLeft: 'auto', marginRight: 'auto', width: '300px', paddingBottom: '5px' }}>
                                                        <AudioPlayer
                                                            src={process.env.REACT_APP_API + item.audioPath}
                                                            onPlay={e => console.log("onPlay")}
                                                        // other props here
                                                        />
                                                    </div>
                                                </div>}
                                                {item.videopath && <div>
                                                    <span> Optionals: </span>
                                                    <div className='optionaldiv' style={{ marginLeft: 'auto', marginRight: 'auto', width: '300px', paddingBottom: '5px' }}>
                                                        <ReactPlayer className='reactplayer' url={item.videopath} playing={false} controls />
                                                    </div>
                                                </div>}



                                            </div>
                                            <p style={{ marginTop: '1rem' }}>Incorrect Answer : {item.Option1}</p>
                                            <p>Incorrect Answer : {item.Option2}</p>
                                            <p>Incorrect Answer : {item.Option3}</p>
                                            <p>Correct Answer : {item.CorrectAnswer}</p>
                                        </div>}
                                    </div>
                                </Col>
                            })}
                        </Row>
                    </div>
                </div>}

                <div className='modifyModal'>
                    <MDBModal isOpen={this.state.modal14} toggle={() => this.toggle()} centered>
                        <MDBModalHeader toggle={() => this.toggle()}>Modify Questions</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput label="Question" icon="first-order" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ Question: e.target.value }) }} value={this.state.Question} required />
                            <div style={{ display: 'flex', color: '#757575', flexDirection: 'row', justifyContent: 'center', }}>
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
                                <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'question')} />

                            </div>}
                            {this.state.isvideo && <div className='selectIcon' style={{ marginTop: '20px', cursor: 'default' }}>
                                <MDBInput style={{ cursor: 'default' }} label="Video link" icon="file-video" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ videopath: e.target.value, QuestionImagePath: '', audioPath: '' }) }} value={this.state.videopath} required />
                            </div>}
                            {this.state.issound && <form encType="multipart/form-data" className='selectIcon' style={{ marginTop: '20px' }}>

                                <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'audio')} />
                            </form>}
                            <MDBInput label="Wrong option" icon="times-circle" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ Option1: e.target.value }) }} value={this.state.Option1} required />

                            <MDBInput label="Wrong option" icon="times-circle" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ Option2: e.target.value }) }} value={this.state.Option2} required />
                            <MDBInput label="Wrong option" icon="times-circle" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ Option3: e.target.value }) }} value={this.state.Option3} required />

                            <MDBInput label="Correct option" icon="check-circle" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ CorrectAnswer: e.target.value }) }} value={this.state.CorrectAnswer} required />
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                    <div className='nextBtn' onClick={this.modifyQuestion}>Modify<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                </div>
                            </div>
                        </MDBModalBody>

                    </MDBModal>
                </div>

            </>
        );

    }

}

export default HelpSection;
