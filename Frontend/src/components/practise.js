import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { withRouter } from "react-router";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player'
import { MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import HeaderComponent from './header/HeaderComponent';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import ProgressBar from 'react-bootstrap/ProgressBar'
const $ = window.$;

class Practise extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserAuthenticated: false,
            ismessageError: false,
            classContent: '',
            UniquechapterName: [],
            UniquesubjectName: [],
            UniquetopicsName: [],
            sessionsprogress: [],
            UniquechapterName1: [],
            UniquetopicsName1: [],
            isSubjects: true,
            isChapters: false,
            isTopics: false,
            isQuestions: false,
            checkoption: false,
            isStartPractise: false,
            subjectname: '',
            chaptername: '',
            topicname: '',
            modal14: false,
            sortedoptions: [],
            IndividialQuestion: '',
            correctanswer: '',
            selectedVal: '',
            index: 1,
            isselecttrue: true,
            showcorrecticon: '',
            isSelected: '',
            nextIcon: true,
            finishBtn: false,
            QuestionLength: 1,
            isbookmarkclick: false,
            sessiondata: [],
            noQA: false,
            bookmarkcss: {
                color: '#c22e35'
            },
            showshadow: {

                padding: '8px 22px 0px 5px'
            },
            withoutshadow: {
                padding: '8px 22px 0px 5px'
            }

        }

    };

    toggle = () => {
        this.setState({
            modal14: !this.state.modal14,
            isterms: !this.state.isterms
        });
    }
    fetchclassquestions = (topicname) => {
        const { classContent, subjectname, chaptername } = this.state;
        console.log('subjectname', subjectname)
        console.log('chaptername', chaptername)
        console.log('topicname', topicname)
        console.log('classContent', classContent)
        let ExtractedQuestionforClass = []

        for (let exact in classContent) {
            console.log(classContent[exact])
            console.log('classContent[exact]')

            let questionsExact = classContent[exact]
            if (questionsExact.Subject === subjectname && questionsExact.Chapter === chaptername && questionsExact.Topic === topicname) {
                if (questionsExact.content)
                    for (let i = 0; i < questionsExact.content.length; i++) {
                        ExtractedQuestionforClass.push(questionsExact.content[i])
                    }
            }
        }


        console.log('ExtractedQuestionforClass', ExtractedQuestionforClass)
        this.toggle()

        this.setState({ ExtractedQuestionforClass: ExtractedQuestionforClass, topicname: topicname })
    }

    componentWillMount() {
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        if (userdetail === null || userdetail._id === undefined || userdetail._id === '') {
            this.props.history.push('/')
        }
        let classname = userdetail.class
        console.log('classname--------->', classname)
        fetch(`${process.env.REACT_APP_API}Admin/singleclasscontent`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                classId: classname,
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === false) {
                    console.log(res.message)
                    this.setState({ ismessageError: true, })
                }
                else {
                    console.log('result-->', res.result)
                    let UniquesubjectName
                    let UniquechapterName
                    let UniquetopicsName
                    let uniqueId = ''

                    UniquesubjectName = res.result.filter((obj, pos, arr) => {
                        return arr.map(mapObj => mapObj['Subject']).indexOf(obj['Subject']) === pos;
                    });

                    console.log('UniquesubjectName----> ', UniquesubjectName)
                    UniquechapterName = res.result.reduce(function (prev, ele) {
                        var found = prev.find(function (fele) {
                            return ele.Subject === fele.Subject && ele.Chapter === fele.Chapter;
                        });
                        if (!found) {
                            prev.push(ele);
                        }
                        return prev;
                    }, []);

                    console.log('UniquechapterName----> ', UniquechapterName)

                    UniquetopicsName = res.result.filter((v, i, a) => a.findIndex(t => (t.Topic === v.Topic && t.Chapter === v.Chapter && t.Subject === v.Subject)) === i)

                    console.log('UniquetopicsName----> ', UniquetopicsName)


                    this.setState({ ismessageError: false, uniqueId: uniqueId, classContent: res.result, UniquesubjectName: UniquesubjectName, UniquechapterName: UniquechapterName, UniquetopicsName: UniquetopicsName })
                }
            }).then(() => {
                fetch(`${process.env.REACT_APP_API}user/fetchSavesession`, {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        userId: userdetail._id
                    })
                }).then(res => res.json())
                    .then((res) => {
                        if (res.isSuccess === true) {

                            this.setState({ sessiondata: res.result })
                        }
                    })

            });





    }

    proceedPractise = () => {
        const { ExtractedQuestionforClass } = this.state;
        console.log('proceeedclick')
        this.props.sidebardisplay(false)
        this.toggle()

        let IndividialQuestion = ExtractedQuestionforClass[0];
        if (IndividialQuestion === undefined) {
            this.setState({ noQA: true, isTopics: false })
            setTimeout(() => {
                this.props.sidebardisplay(true)
                this.setState({ noQA: false, isTopics: true })
            }, 3000);
        } else {
            console.log('IndividialQuestion---->', IndividialQuestion)
            let options = [IndividialQuestion.Option1, IndividialQuestion.Option2, IndividialQuestion.Option3, IndividialQuestion.CorrectAnswer]

            let sortedoptions = options.sort((a, b) => 0.5 - Math.random());
            console.log('sortedoptions--->', sortedoptions)

            let correctanswer = ExtractedQuestionforClass[0].CorrectAnswer;

            this.setState({ IndividialQuestion, sortedoptions, correctanswer, isStartPractise: true, isTopics: false })
        }


    }

    componentDidMount() {

    }

    nextQuestion = () => {
        $(".checkmark").css("background-color", "#e9414b");
        console.log('nexyquestions')
        const { correctanswer, selectedVal, ExtractedQuestionforClass, index } = this.state;

        let IndividialQuestion = ExtractedQuestionforClass[index]
        let options = [IndividialQuestion.Option1, IndividialQuestion.Option2, IndividialQuestion.Option3, IndividialQuestion.CorrectAnswer]
        let sortedoptions = options.sort((a, b) => 0.5 - Math.random());
        console.log('sortedoptions--->', sortedoptions)
        let newcorrectanswer = ExtractedQuestionforClass[index].CorrectAnswer;
        let newIndex = index
        newIndex = newIndex + 1
        this.setState({ IndividialQuestion, sortedoptions, correctanswer: newcorrectanswer, index: this.state.index + 1, QuestionLength: this.state.QuestionLength + 1, isselecttrue: true, isbookmarkclick: false })

        if (newIndex === ExtractedQuestionforClass.length) {
            this.setState({ nextIcon: false, finishBtn: true })
        }
        $("input[type=radio]").attr('disabled', false);

    }

    checkOption = (e) => {
        console.log('checkoptions-->', e)
        let showcss = {
            padding: '8px 22px 0px 5px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
        }
        this.setState({ showshadow: showcss, isSelected: e, isselecttrue: false })
        $("input[type=radio]").attr('disabled', true);

    }

    bookmark = () => {
        const { IndividialQuestion } = this.state
        console.log('boookmark')
        console.log('individualQuestions', IndividialQuestion)
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        let userid = userdetail._id
        IndividialQuestion.userid = userid
        fetch(`${process.env.REACT_APP_API}user/Bookmark`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                IndividialQuestion
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === false) {
                    ToastsStore.warning("Already Bookmark")
                }
                else {
                    this.setState({ isbookmarkclick: true })
                }
            });
    }
    savesession = () => {
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))

        console.log('savesessions')
        const { QuestionLength, ExtractedQuestionforClass, subjectname, chaptername, topicname } = this.state
        let totalQuestionAttempt = QuestionLength
        let totalQuestionLength = ExtractedQuestionforClass.length
        let userId = userdetail._id
        let classname = userdetail.class
        fetch(`${process.env.REACT_APP_API}user/Savesession`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                totalQuestionAttempt,
                totalQuestionLength,
                userId,
                classname,
                subjectname,
                chaptername,
                topicname
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === false) {
                    ToastsStore.warning("Some error while saving session")
                }
                else {
                    ToastsStore.warning("Session saved")

                }
            });
    }
    finish = () => {
        this.props.sidebardisplay(true)
        window.location.reload()
    }
    canclePractice = () => {
        this.props.sidebardisplay(true)
        this.setState({ isStartPractise: false, isTopics: true })
    }
    fetchchapters(Subjectname) {
        const { UniquechapterName } = this.state
        console.log('UniquechapterName------>', UniquechapterName)
        let newChapters = []
        for (let key in UniquechapterName) {
            if (UniquechapterName[key].Subject === Subjectname) {
                newChapters.push(UniquechapterName[key])
            }
        }
        console.log('UniquechapterName------>', newChapters)

        this.setState({ UniquechapterName1: newChapters, isSubjects: false, isChapters: true, subjectname: Subjectname })
    }

    fetchtopics(Chaptername) {
        const { UniquetopicsName, UniquechapterName, sessiondata } = this.state
        let newTopicdata
        let newTopicarr = []

        let newTopics = []
        for (let key in UniquetopicsName) {
            if (UniquetopicsName[key].Chapter === Chaptername) {
                newTopics.push(UniquetopicsName[key])
            }
        }

        for (let key in sessiondata) {
            for (let key2 in newTopics) {
                console.log('sessiondata-------->', sessiondata[key].topicname)
                console.log('UniquechapterName-------->', newTopics[key2].Topic)

                if (newTopics[key2].Topic === sessiondata[key].topicname) {
                    newTopics[key2].progressbar = (sessiondata[key].totalQuestionAttempt / sessiondata[key].totalQuestionLength) * 100
                }

            }
        }

        this.setState({ UniquetopicsName1: newTopics, isChapters: false, isTopics: true, chaptername: Chaptername })
    }
    render() {
        console.log('UniquetopicsName-------->', this.state.UniquetopicsName)
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        const { showshadow, withoutshadow, isSelected, showcorrecticon, isselecttrue, QuestionLength, bookmarkcss } = this.state;
        return (
            <>
                <HeaderComponent title={'Practise Test'} clientname={userdetail.name} headimg={userdetail.name[0]} logout={'client'} />

                {!this.state.ismessageError &&
                    <div>
                        {this.state.isSubjects && <div>
                            <div className='contentbox' style={{ marginTop: '40px' }}>
                                <Row noGutters className='classcard-row'>
                                    <Col md={12}>
                                        <div className='heading'>
                                            <div className='text-center'>
                                                <h4 style={{ margin: '0' }}>What would you like to <span className='practise'>Practise</span> today?</h4>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='content' style={{ marginTop: '40px' }}  >
                                <Row noGutters className='classcard-row'>
                                    {this.state.UniquesubjectName.map((item) => {
                                        return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                            <div className='Allclasscard usercount usercountremovepadding' style={{ padding: '8px' }} onClick={() => this.fetchchapters(item.Subject)} >
                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                    {item.SubjectimgPath ?
                                                        <img src={process.env.REACT_APP_API + item.SubjectimgPath} width='80' height='80' style={{ borderRadius: '10px 20px' }} /> :
                                                        <img src={process.env.PUBLIC_URL + '/images/not_found.jpg'} width='80' height='80' style={{ borderRadius: '10px 20px' }} />}
                                                    <h2><span style={{ color: '#363740', marginTop: '8px', fontSize: '16px' }}>{item.Subject}</span></h2>
                                                </div>
                                            </div>

                                        </Col>
                                    })}
                                </Row>
                            </div>
                        </div>}
                        {this.state.isChapters && <div>
                            <div className='gobackiconhead' style={{ marginBottom: '20px', marginTop: '20px', display: 'inline-Block', cursor: 'pointer' }}>
                                <div className='singleclasslinkheader' onClick={() => window.location.reload()} >
                                    <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                                </div>
                                <h2><span style={{ color: '#363740', marginTop: '8px', fontSize: '18px' }}>Chapters</span></h2>
                            </div>
                            <div className='content' style={{ marginTop: '20px' }}>
                                <Row noGutters className='classcard-row'>
                                    {this.state.UniquechapterName1.map((item, index) => {
                                        index = index + 1
                                        return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                            <div className='Allclasscard usercount usercountremovepadding' style={{ padding: '8px' }} onClick={() => this.fetchtopics(item.Chapter)}  >
                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                    {item.ChapterimgPath ?
                                                        <img src={process.env.REACT_APP_API + item.ChapterimgPath} width='80' height='80' style={{ borderRadius: '10px 20px' }} /> :
                                                        <img src={process.env.PUBLIC_URL + '/images/not_found.jpg'} width='80' height='80' style={{ borderRadius: '10px 20px' }} />}
                                                    <h2 style={{ margin: '0' }}><span style={{ color: '#363740', margin: '0', marginTop: '8px', fontSize: '16px' }}>{item.Chapter}</span></h2>
                                                    <h2 style={{ margin: '0', fontSize: '10px', fontFamily: 'Montserrat' }}><span style={{ margin: '0', fontSize: '10px', color: '#757575' }}>{'Chapter ' + index}</span></h2>

                                                </div>
                                            </div>
                                        </Col>
                                    })}
                                </Row>
                            </div>
                        </div>}
                        {this.state.isTopics && <div>
                            <div className='gobackiconhead' style={{ marginBottom: '20px', marginTop: '20px', display: 'inline-Block', cursor: 'pointer' }}>
                                <div className='singleclasslinkheader' onClick={() => { this.setState({ isChapters: true, isTopics: false, UniquechapterName: this.state.UniquechapterName }) }} >
                                    <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                                </div>
                                <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Topics</span></h2>
                            </div>
                            <div className='content' style={{ marginTop: '20px' }} >
                                <Row noGutters className='classcard-row'>
                                    {this.state.UniquetopicsName1.map((item, index) => {
                                        index = index + 1
                                        return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                            <div className='Allclasscard usercount usercountremovepadding' style={{ padding: '8px' }} onClick={() => this.fetchclassquestions(item.Topic)}  >
                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                    <div>
                                                        {item.TopicimgPath ?
                                                            <img src={process.env.REACT_APP_API + item.TopicimgPath} width='80' height='80' style={{ borderRadius: '10px 20px' }} /> :
                                                            <img src={process.env.PUBLIC_URL + '/images/not_found.jpg'} width='80' height='80' style={{ borderRadius: '10px 20px' }} />}

                                                    </div>
                                                    <h2 style={{ margin: '0' }}><span style={{ color: '#363740', margin: '0', marginTop: '8px', fontSize: '16px' }}>{item.Topic}</span></h2>
                                                    <h2 style={{ margin: '0', fontSize: '10px', fontFamily: 'Montserrat' }}><span style={{ margin: '0', fontSize: '10px', color: '#757575' }}>{'Topic ' + index}</span></h2>
                                                </div>
                                            </div>
                                            <ProgressBar now={item.progressbar ? item.progressbar : 0} label={`${item.progressbar ? item.progressbar : 0}%`} />

                                        </Col>
                                    })}
                                </Row>
                            </div>
                        </div>}
                        {this.state.isStartPractise && <div>
                            <div className='TestBox' style={{ marginTop: '20px', height: '80vh' }} >
                                <Row noGutters className='classcard-row'>
                                    <Col md={6} xs={12}>
                                        <div className='leftTestBox' style={{ height: '80vh' }}>
                                            <div style={{ paddingTop: '20px', textAlign: 'center' }}>
                                                <div className='savesession'>
                                                    <span onClick={this.canclePractice} className='bmark' style={{ textAlign: 'left', cursor: 'pointer', fontSize: '16px' }}><i className="fas fa-times"></i></span>
                                                    <span onClick={this.savesession} className='bmark' style={{ textAlign: 'right', cursor: 'pointer' }}><i className="fas fa-save"></i><p>Save Session</p></span>
                                                </div>
                                                <p>Question {QuestionLength + '/' + this.state.ExtractedQuestionforClass.length}</p>
                                                <div>
                                                    {/* {!this.state.IndividialQuestion.Questionimagepath && !this.state.IndividialQuestion.videopath &&
                                                    <img src={'https://cdn.dribbble.com/users/674925/screenshots/6561893/thinking_2x.png'} width='220' height='220' />} */}
                                                    {this.state.IndividialQuestion.Questionimagepath && <img src={process.env.REACT_APP_API + this.state.IndividialQuestion.Questionimagepath} width='220' height='220' />}
                                                    {this.state.IndividialQuestion.audioPath && <div className='optionaldiv' style={{ marginLeft: 'auto', marginRight: 'auto', width: '300px', paddingBottom: '5px', marginTop: '50px', marginBottom: '50px', fontFamily: 'Montserrat' }}>
                                                        <AudioPlayer
                                                            src={process.env.REACT_APP_API + this.state.IndividialQuestion.audioPath}
                                                            onPlay={e => console.log("onPlay")}
                                                            volume={0.2}
                                                        // other props here
                                                        />
                                                    </div>}
                                                    {this.state.IndividialQuestion.videopath && <div className='optionaldiv' style={{ marginLeft: 'auto', marginRight: 'auto', width: '300px', paddingBottom: '5px', marginTop: '50px', marginBottom: '50px', }}>
                                                        <ReactPlayer className='reactplayer' url={this.state.IndividialQuestion.videopath} playing={false} controls />
                                                    </div>}
                                                </div>
                                                <h2>{this.state.IndividialQuestion.Question}</h2>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <div className='rightTestBox' style={{ height: '80vh' }}>
                                            <div style={{ paddingTop: '20px', textAlign: 'center' }}>
                                                <div className='bmarkcont' >
                                                    <span onClick={this.bookmark} className='bmark' style={this.state.isbookmarkclick ? bookmarkcss : { textAlign: 'right', cursor: 'pointer' }}><i className="fas fa-bookmark"><p style={this.state.isbookmarkclick ? bookmarkcss : null} >Bookmark</p></i></span>
                                                </div>

                                                <ToastsContainer store={ToastsStore} />


                                                <p>Select Answers Below</p>
                                                <div className='answers'>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[0] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[0])} type="radio" name="optionalQuestionContent" />
                                                                {isselecttrue && <> <span className="checkmark"><div>A</div></span> <p>{this.state.sortedoptions[0]}</p></>}
                                                                {!isselecttrue && this.state.correctanswer === this.state.sortedoptions[0] && <> <span className="checkmark"><div><i className="fas fa-check"></i></div></span> <p>{this.state.sortedoptions[0]}</p> </>}
                                                                {!isselecttrue && this.state.correctanswer != this.state.sortedoptions[0] && <> <span className="checkmark"><div><i className="fas fa-times"></i></div></span> <p>{this.state.sortedoptions[0]}</p> </>}

                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[1] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[1])} type="radio" name="optionalQuestionContent" />
                                                                {isselecttrue && <> <span className="checkmark"><div>B</div></span> <p>{this.state.sortedoptions[1]}</p></>}
                                                                {!isselecttrue && this.state.correctanswer === this.state.sortedoptions[1] && <> <span className="checkmark"><div><i className="fas fa-check"></i></div></span> <p>{this.state.sortedoptions[1]}</p> </>}
                                                                {!isselecttrue && this.state.correctanswer != this.state.sortedoptions[1] && <> <span className="checkmark"><div><i className="fas fa-times"></i></div></span> <p>{this.state.sortedoptions[1]}</p> </>}

                                                            </label>


                                                        </div>

                                                    </div>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[2] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[2])} type="radio" name="optionalQuestionContent" />
                                                                {isselecttrue && <> <span className="checkmark"><div>C</div></span> <p>{this.state.sortedoptions[2]}</p></>}
                                                                {!isselecttrue && this.state.correctanswer === this.state.sortedoptions[2] && <> <span className="checkmark"><div><i className="fas fa-check"></i></div></span> <p>{this.state.sortedoptions[2]}</p> </>}
                                                                {!isselecttrue && this.state.correctanswer != this.state.sortedoptions[2] && <> <span className="checkmark"><div><i className="fas fa-times"></i></div></span> <p>{this.state.sortedoptions[2]}</p> </>}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[3] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[3])} type="radio" name="optionalQuestionContent" />
                                                                {isselecttrue && <> <span className="checkmark"><div>D</div></span> <p>{this.state.sortedoptions[3]}</p></>}
                                                                {!isselecttrue && this.state.correctanswer === this.state.sortedoptions[3] && <> <span className="checkmark"><div><i className="fas fa-check"></i></div></span> <p>{this.state.sortedoptions[3]}</p> </>}
                                                                {!isselecttrue && this.state.correctanswer != this.state.sortedoptions[3] && <> <span className="checkmark"><div><i className="fas fa-times"></i></div></span> <p>{this.state.sortedoptions[3]}</p> </>}

                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                                {this.state.nextIcon && <div className='bookmark' >
                                                    <span onClick={this.nextQuestion} style={{ cursor: 'pointer', }}><i className="fas fa-long-arrow-alt-right"></i></span>
                                                </div>}
                                                {this.state.finishBtn && <div className='bookmark'  >
                                                    <p onClick={this.finish} style={{ cursor: 'pointer', }}>Finish Practise</p>
                                                </div>}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>}

                        {this.state.noQA && <div className='contentbox' style={{ height: '70vh' }}>
                            <Row noGutters className='classcard-row'>
                                <Col md={{ span: 8, offset: 2 }} xs={12}>
                                    <div className='classcard'>
                                        <div className='text-center'>
                                            <h4 style={{ margin: '0' }}>Q/A is not added yet</h4>


                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>}
                    </div>}

                {/********************************************************** Modal *************************************************************************/}
                <div className='terms'>
                    <MDBModal isOpen={this.state.modal14} toggle={() => this.toggle()} centered>
                        <MDBModalHeader toggle={() => this.toggle()}>Terms & Conditions</MDBModalHeader>
                        <MDBModalBody>
                            <p>An exam is a test at which you demonstrate your individual qualifications and skills within the framework and on the
                                        conditions laid down by the university for the relevant exam.</p>
                            <p>If you – intentionally or unintentionally – act in
                                        such a way as to improve your exam conditions compared to what was intended, you are cheating to obtain an incorrect assessment.</p>
                            <p>If you help someone else obtain an undue advantage at an exam, this also constitutes cheating.</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="primary" onClick={this.proceedPractise}>Proceed Practise</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </div>
                {/********************************************************** Modal *************************************************************************/}

                {this.state.ismessageError && <div>
                    <div className='contentbox' style={{ height: '70vh' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={12}>
                                <div className='heading'>
                                    <div className='text-center'>
                                        <h4 style={{ margin: '0' }}>Your practise session is not created by admin yet.</h4>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>}


            </>
        );

    }

}

export default withRouter(Practise);
