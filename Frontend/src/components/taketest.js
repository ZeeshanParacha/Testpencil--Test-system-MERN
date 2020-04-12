import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { withRouter } from "react-router";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player'
import { MDBIcon } from 'mdbreact';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import HeaderComponent from './header/HeaderComponent';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedprogressProvider";
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
const $ = window.$;


class TakeTest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserAuthenticated: false,
            ismessageError: false,
            classContent: '',
            UniquechapterName: [],
            UniquesubjectName: [],
            UniquetopicsName: [],
            UniquesubjectName1: [],
            UniquetopicsName1: [],
            sessionsprogress: [],
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
            modal10: false,
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
            incorrectanswers: [],
            userSelectanswer: '',
            totallength: '',
            chooseTest: '',
            improvementTest: '',
            showspinner: false,
            previousScore: '',
            previousQuestionlength: '',
            previouspercentage: '',
            resultdata: [],
            noQA: false,
            minutes: 0,
            seconds: 0,
            score: 0,
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

    toggle = (nr) => {

        if (nr == 14) {
            this.setState({
                modal14: !this.state.modal14,
                isterms: !this.state.isterms
            });
        }
        else {
            this.setState({
                modal10: !this.state.modal10,
                isterms: !this.state.isterms
            });
        }


    }
    fetchclassquestions(topicname, isgivenTest) {
        const { classContent, subjectname, chaptername } = this.state;
        console.log('isgivenTest--->', isgivenTest)
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


        console.log('ExtractedQuestionforClass------------------------>', ExtractedQuestionforClass)
        let totallength = ExtractedQuestionforClass.length
        this.setState({ ExtractedQuestionforClass: ExtractedQuestionforClass, topicname: topicname, totallength })

        if (isgivenTest) {
            this.toggle(10)
        }
        else {
            this.toggle(14)
        }
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
                fetch(`${process.env.REACT_APP_API}user/fetchResults`, {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        userId: userdetail._id
                    })
                }).then(res => res.json())
                    .then((res) => {
                        if (res.isSuccess === true) {
                            console.log('fetchResults-->', res.result)
                            // console.log('uniquetopicnames-->', this.state.UniquetopicsName)
                            // let sessiondata = res.result
                            // let newTopicdata
                            // let newTopicarr = []
                            // let improvementTest
                            // let previousScore
                            // let previousQuestionlength
                            // let previouspercentage

                            this.setState({ resultdata: res.result })

                            // for (let key in this.state.UniquetopicsName) {
                            //     newTopicdata = this.state.UniquetopicsName[key]

                            //     console.log('newTopicdata---->', newTopicdata)
                            //     if (sessiondata.topicname === newTopicdata.Topic) {
                            //         newTopicdata.progressbar = sessiondata.percentage
                            //         newTopicdata.isgivenTest = true
                            //         improvementTest = sessiondata.incorrectanswers
                            //         previousScore = sessiondata.score
                            //         previouspercentage = sessiondata.percentage
                            //         previousQuestionlength = sessiondata.totalQuestionLength
                            //         newTopicarr.push(newTopicdata)
                            //     }
                            //     else {
                            //         newTopicdata.progressbar = 0
                            //         newTopicarr.push(newTopicdata)
                            //     }
                            // }

                        }
                    })

            });





    }
    chooseTest = () => {
        const { chooseTest, ExtractedQuestionforClass, improvementTest } = this.state;
        console.log('improvementTest--->', improvementTest)
        console.log('ExtractedQuestionforClass--->', ExtractedQuestionforClass)
        if (chooseTest === '') {
            ToastsStore.warning("Choose test type to proceed")
        }
        else {
            if (chooseTest === 'fresh') {
                this.toggle(14)
                this.toggle(10)
            }
            else if (chooseTest === 'improvement') {
                this.setState({ ExtractedQuestionforClass: improvementTest, totallength: improvementTest.length })
                this.toggle(14)
                this.toggle(10)
            }
            else if (chooseTest === 'bookmark') {
                const { chaptername, subjectname, topicname } = this.state;
                const userdetail = JSON.parse(localStorage.getItem('userdetail'))
                let userid = userdetail._id
                fetch(`${process.env.REACT_APP_API}user/fetchBookmark`, {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        userid
                    })
                }).then(res => res.json())
                    .then((res) => {
                        if (res.isSuccess === true) {
                            console.log('bookmark questions ---> ', res.result)
                            this.setState({ ExtractedQuestionforClass: res.result, totallength: res.result.length })
                            this.toggle(14)
                            this.toggle(10)
                        }
                        else {
                            ToastsStore.warning("You did not add bookmark Q/A")

                        }
                    })

            }
        }
    }
    proceedPractise = () => {

        const { ExtractedQuestionforClass, minutes } = this.state;
        if (minutes === 0) {
            console.log('timer-->', minutes)
            ToastsStore.warning("Choose time before begin")
        }
        else {


            console.log('proceeedclick')
            this.props.sidebardisplay2(false)
            this.toggle(14)

            let IndividialQuestion = ExtractedQuestionforClass[0];
            if (IndividialQuestion === undefined) {
                this.setState({ noQA: true, isTopics: false })

                setTimeout(() => {
                    this.setState({ noQA: false, isTopics: true })
                    this.props.sidebardisplay2(true)

                }, 3000);

            } else {
                console.log('IndividialQuestion---->', IndividialQuestion)
                let options = [IndividialQuestion.Option1, IndividialQuestion.Option2, IndividialQuestion.Option3, IndividialQuestion.CorrectAnswer]

                let sortedoptions = options.sort((a, b) => 0.5 - Math.random());
                console.log('sortedoptions--->', sortedoptions)

                let correctanswer = ExtractedQuestionforClass[0].CorrectAnswer;

                this.setState({ IndividialQuestion, sortedoptions, correctanswer, isStartPractise: true, isTopics: false })
                this.myInterval = setInterval(() => {
                    const { seconds, minutes } = this.state
                    if (seconds > 0) {
                        this.setState(({ seconds }) => ({
                            seconds: seconds - 1
                        }))
                    }
                    if (seconds === 0) {
                        if (minutes === 0) {
                            clearInterval(this.myInterval)
                            this.finish()

                        } else {
                            this.setState(({ minutes }) => ({
                                minutes: minutes - 1,
                                seconds: 59
                            }))
                        }
                    }
                }, 1000)
            }
        }

        if (this.state.index === ExtractedQuestionforClass.length) {
            this.setState({ nextIcon: false, finishBtn: true })
        }

    }
    componentWillUnmount() {
        clearInterval(this.myInterval)
    }
    checkRadio(e) {
        console.log('radio---->', e)

        if (e === 30) {
            this.setState({ minutes: e })
        }
        else if (e === 60) {
            this.setState({ minutes: e })
        }
        else {
            this.setState({ minutes: 0 })
        }
    }

    checktest(e) {
        console.log('radio---->', e)

        if (e === 'fresh') {
            this.setState({ chooseTest: e })

        } else if (e === 'improvement') {
            this.setState({ chooseTest: e })
        }
        else if (e === 'bookmark') {
            this.setState({ chooseTest: e })
        }
        else {
            this.setState({ chooseTest: '' })
        }
    }

    componentDidMount() {

    }

    nextQuestion = () => {
        $(".checkmark").css("background-color", "#e9414b");

        console.log('nexyquestions')
        const { correctanswer, userSelectanswer, selectedVal, ExtractedQuestionforClass, index } = this.state;

        if (correctanswer === userSelectanswer) {
            this.setState({ score: this.state.score + 1 })
        }
        else {
            const { IndividialQuestion, correctanswer, incorrectanswers } = this.state;
            let Question = IndividialQuestion.Question
            let CorrectAnswer = correctanswer
            let Option1 = IndividialQuestion.Option1
            let Option2 = IndividialQuestion.Option2
            let Option3 = IndividialQuestion.Option3
            let videopath = IndividialQuestion.videopath
            let audioPath = IndividialQuestion.audioPath
            let Questionimagepath = IndividialQuestion.Questionimagepath

            incorrectanswers.push({
                Question,
                CorrectAnswer,
                Option1,
                Option2,
                Option3,
                videopath,
                audioPath,
                Questionimagepath
            })
            this.setState({ incorrectanswers })
        }

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


    }

    checkOption = (e) => {
        const { correctanswer } = this.state

        console.log('checkoptions-->', e)
        console.log('correctanswer-->', correctanswer)

        let showcss = {
            padding: '8px 22px 0px 5px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
        }
        this.setState({ showshadow: showcss, isSelected: e, userSelectanswer: e })


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

    finish = () => {
        const { correctanswer, userSelectanswer, selectedVal, ExtractedQuestionforClass, subjectname, chaptername, topicname, previousScore, previousQuestionlength, previouspercentage } = this.state;
        let tempscore = 0
        if (correctanswer === userSelectanswer) {

            this.setState({ score: this.state.score + 1, })
            tempscore = 1
        }
        else {
            const { IndividialQuestion, correctanswer, incorrectanswers } = this.state;
            let Question = IndividialQuestion.Question
            let CorrectAnswer = correctanswer
            let Option1 = IndividialQuestion.Option1
            let Option2 = IndividialQuestion.Option2
            let Option3 = IndividialQuestion.Option3
            let videopath = IndividialQuestion.videopath
            let audioPath = IndividialQuestion.audioPath
            let Questionimagepath = IndividialQuestion.Questionimagepath

            incorrectanswers.push({
                Question,
                CorrectAnswer,
                Option1,
                Option2,
                Option3,
                videopath,
                audioPath,
                Questionimagepath
            })
            this.setState({ incorrectanswers })
        }


        if (this.state.chooseTest === 'bookmark') {
            this.setState({ showspinner: true, isStartPractise: false })
            setTimeout(() => {
                this.setState({ showresult: true, showspinner: false })
            }, 3000)
        }
        else if (this.state.chooseTest === 'improvement') {

            console.log('improvementblock---------->')

            const userdetail = JSON.parse(localStorage.getItem('userdetail'))
            let totalQuestionLength = ExtractedQuestionforClass.length
            let userId = userdetail._id
            let classname = userdetail.class
            let newscore = this.state.score + tempscore
            console.log('score-----> ', newscore)

            let score
            console.log('previouspercentage-----> ', previouspercentage)
            console.log('previousScore-----> ', previousScore)
            console.log('previousQuestionlength-----> ', previousQuestionlength)
            console.log('totalQuestionLength-----> ', totalQuestionLength)

            let incorrectanswers = this.state.incorrectanswers
            let percentagecalc


            if (previouspercentage != undefined || previouspercentage != '' || previouspercentage != null) {
                percentagecalc = ((newscore + parseInt(previousScore)) / parseInt(previousQuestionlength)) * 100
                console.log('Newpercentage', percentagecalc)
                totalQuestionLength = previousQuestionlength
                score = parseInt(newscore) + parseInt(previousScore)
            }
            let percentage = percentagecalc

            console.log('newPercentage--->', percentage)
            fetch(`${process.env.REACT_APP_API}user/StoreResult`, {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    totalQuestionLength,
                    percentage,
                    score,
                    userId,
                    classname,
                    subjectname,
                    chaptername,
                    topicname,
                    incorrectanswers
                })
            }).then(res => res.json())
                .then((res) => {
                    if (res.isSuccess === false) {
                        ToastsStore.warning("Some error while saving store")
                    }
                    else {
                        this.setState({ showspinner: true, isStartPractise: false })
                        setTimeout(() => {
                            this.setState({ showresult: true, showspinner: false })
                        }, 3000)
                    }
                });

        }
        else {
            const userdetail = JSON.parse(localStorage.getItem('userdetail'))
            let totalQuestionLength = ExtractedQuestionforClass.length
            let userId = userdetail._id
            let classname = userdetail.class
            let score = this.state.score
            score = score + tempscore
            let incorrectanswers = this.state.incorrectanswers
            let percentage = (score / totalQuestionLength) * 100


            console.log('newPercentage--->', percentage)
            fetch(`${process.env.REACT_APP_API}user/StoreResult`, {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    totalQuestionLength,
                    percentage,
                    score,
                    userId,
                    classname,
                    subjectname,
                    chaptername,
                    topicname,
                    incorrectanswers
                })
            }).then(res => res.json())
                .then((res) => {
                    if (res.isSuccess === false) {
                        ToastsStore.warning("Some error while saving store")
                    }
                    else {
                        this.setState({ showspinner: true, isStartPractise: false })
                        setTimeout(() => {
                            this.setState({ showresult: true, showspinner: false })
                        }, 3000)
                    }
                });
        }


    }
    canclePractice = () => {
        window.location.reload()
        this.props.sidebardisplay2(true)

    }

    closeresult = () => {
        window.location.reload()
        this.props.sidebardisplay2(true)
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
        const { UniquetopicsName, resultdata } = this.state
        let newTopics = []
        for (let key in UniquetopicsName) {
            if (UniquetopicsName[key].Chapter === Chaptername) {
                newTopics.push(UniquetopicsName[key])
            }
        }

        let improvementTest
        let previousScore
        let previousQuestionlength
        let previouspercentage

        for (let key in resultdata) {
            for (let key2 in newTopics) {
                console.log('resultdata-------->', resultdata[key].topicname)
                console.log('UniquechapterName-------->', newTopics[key2].Topic)


                console.log('resultdata-------->', resultdata[key].chaptername)
                console.log('UniquechapterName-------->', newTopics[key2].Chapter)
                if (newTopics[key2].Topic === resultdata[key].topicname && newTopics[key2].Chapter === resultdata[key].chaptername) {

                    newTopics[key2].progressbar = resultdata[key].percentage
                    newTopics[key2].isgivenTest = true
                    improvementTest = resultdata[key].incorrectanswers
                    previousScore = resultdata[key].score
                    previouspercentage = resultdata[key].percentage
                    previousQuestionlength = resultdata[key].totalQuestionLength
                }

            }
        }
        this.setState({
            UniquetopicsName1: newTopics, isChapters: false, isTopics: true, chaptername: Chaptername,
            improvementTest, previousScore, previouspercentage, previousQuestionlength
        })
    }

    render() {
        console.log('incorrectanswers', this.state.incorrectanswers)
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        const { showshadow, withoutshadow, isSelected, QuestionLength, score, incorrectanswers, ExtractedQuestionforClass, bookmarkcss, totallength } = this.state;
        console.log('totallength--->', totallength)
        console.log('score--->', score)

        let totalscore = (score / totallength) * 100
        return (
            <>
                <HeaderComponent title={'Take Test'} clientname={userdetail.name} headimg={userdetail.name[0]} logout={'client'} />
                <ToastsContainer store={ToastsStore} />


                {!this.state.ismessageError &&
                    <div>
                        {this.state.isSubjects && <div>
                            <div className='contentbox' style={{ marginTop: '40px' }}>
                                <Row noGutters className='classcard-row'>
                                    <Col md={12}>
                                        <div className='heading'>
                                            <div className='text-center'>
                                                <h4 style={{ margin: '0' }}>Select subject to start <span className='practise'>Test</span> now</h4>
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
                                <div className='singleclasslinkheader' onClick={() => window.location.reload()}>
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
                                <div className='singleclasslinkheader' onClick={() => { this.setState({ isChapters: true, isTopics: false ,UniquechapterName : this.state.UniquechapterName}) }} >
                                    <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                                </div>
                                <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Topics</span></h2>
                            </div>
                            <div className='content' style={{ marginTop: '20px' }} >
                                <Row noGutters className='classcard-row'>
                                    {this.state.UniquetopicsName1.map((item, index) => {
                                        index = index + 1
                                        return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                            <div className='Allclasscard usercount usercountremovepadding' style={{ padding: '8px' }} onClick={() => this.fetchclassquestions(item.Topic, item.isgivenTest)}  >
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
                                                    <span onClick={this.bookmark} className='bmark' style={this.state.isbookmarkclick ? bookmarkcss : { textAlign: 'right', cursor: 'pointer' }}><i className="fas fa-bookmark"><p style={this.state.isbookmarkclick ? bookmarkcss : null} >Bookmark</p></i></span>

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
                                                    <span className='bmark' style={{ textAlign: 'right', cursor: 'pointer' }}><i className="fas fa-clock"><p>{this.state.minutes}:{this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</p></i></span>
                                                </div>

                                                <ToastsContainer store={ToastsStore} />


                                                <p>Select Answers Below</p>
                                                <div className='answers'>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[0] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[0])} type="radio" name="optionalQuestionContent" />
                                                                <span className="checkmark"><div>A</div></span> <p>{this.state.sortedoptions[0]}</p>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[1] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[1])} type="radio" name="optionalQuestionContent" />
                                                                <span className="checkmark"><div>B</div></span> <p>{this.state.sortedoptions[1]}</p>


                                                            </label>


                                                        </div>

                                                    </div>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[2] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[2])} type="radio" name="optionalQuestionContent" />
                                                                <span className="checkmark"><div>C</div></span> <p>{this.state.sortedoptions[2]}</p>

                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='optioncontainer' style={{ display: 'flex', paddingTop: '20px', paddingBottom: '10px' }}>
                                                        <div className='afterchecked' style={isSelected === this.state.sortedoptions[3] ? showshadow : withoutshadow}>
                                                            <label className='quizradio optionalradio'>
                                                                <input onClick={() => this.checkOption(this.state.sortedoptions[3])} type="radio" name="optionalQuestionContent" />
                                                                <span className="checkmark"><div>D</div></span> <p>{this.state.sortedoptions[3]}</p>
                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                                {this.state.nextIcon && <div className='bookmark' >
                                                    <span onClick={this.nextQuestion} style={{ cursor: 'pointer', }}><i className="fas fa-long-arrow-alt-right"></i></span>
                                                </div>}
                                                {this.state.finishBtn && <div className='bookmark finishBtn'  >
                                                    <p onClick={this.finish} style={{ cursor: 'pointer', }}>Finish</p>
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
                                            <h4 style={{ margin: '0' }}>You dont have any test or improvements of this topic</h4>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>}
                    </div>}

                {/********************************************************** Modal *************************************************************************/}
                <div className='terms'>
                    <MDBModal isOpen={this.state.modal14} toggle={() => this.toggle(14)} centered>
                        <MDBModalHeader toggle={() => this.toggle(14)}>Choose Timer</MDBModalHeader>
                        <MDBModalBody>
                            <div style={{ display: 'flex', color: '#757575', flexDirection: 'row', justifyContent: 'center' }}>

                                <label className='containerradio optionalradio'> 30 minutes
                                                    <input onClick={() => { this.checkRadio(30) }} type="radio" name="optionalQuestionContent" />
                                    <span className="checkmark"></span>
                                </label>
                                <label className='containerradio optionalradio'> 60 minutes
                                                    <input onClick={() => { this.checkRadio(60) }} type="radio" name="optionalQuestionContent" />
                                    <span className="checkmark"></span>
                                </label>

                            </div>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="primary" onClick={this.proceedPractise}>Take Test</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </div>


                <div className='terms'>
                    <MDBModal isOpen={this.state.modal10} toggle={() => this.toggle(10)} centered>
                        <MDBModalHeader toggle={() => this.toggle(10)}>Choose test</MDBModalHeader>
                        <MDBModalBody>
                            <div style={{ display: 'flex', color: '#757575', flexDirection: 'column', justifyContent: 'center', fontSize: '14px' }}>

                                <label className='containerradio optionalradio'> Take fresh test
                                                    <input onClick={() => { this.checktest('fresh') }} type="radio" name="optionalQuestionContent" />
                                    <span className="checkmark"></span>
                                </label>
                                <label className='containerradio optionalradio'> Take improvement test
                                                    <input onClick={() => { this.checktest('improvement') }} type="radio" name="optionalQuestionContent" />
                                    <span className="checkmark"></span>
                                </label>
                                <label className='containerradio optionalradio'> Take bookmark test
                                                    <input onClick={() => { this.checktest('bookmark') }} type="radio" name="optionalQuestionContent" />
                                    <span className="checkmark"></span>
                                </label>

                            </div>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="primary" onClick={this.chooseTest}>Proceed</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </div>
                {/********************************************************** Modal *************************************************************************/}


                {this.state.showspinner && <div>
                    <div className='contentbox' style={{ height: '70vh' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={12}>
                                <div className='heading'>
                                    <div className='text-center'>
                                        <Spinner animation="grow" />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>}
                {this.state.showresult && <div style={{ marginTop: '20px', height: '80vh' }}>

                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 10, offset: 1 }} xs={12}>
                            <div className='classcard'>
                                <div className='savesession'>
                                    <span onClick={this.closeresult} className='bmark' style={{ textAlign: 'left', cursor: 'pointer', fontSize: '16px' }}><i className="fas fa-times"></i></span>
                                </div>
                                <div className='text-center'>
                                    <div className='overallscore'>
                                        <p>Overall Score</p>
                                    </div>
                                    <div style={{ width: '150px', margin: '0 auto' }}>
                                        <AnimatedProgressProvider
                                            valueStart={0}
                                            valueEnd={totalscore}
                                            duration={1.4}
                                            easingFunction={easeQuadInOut}

                                        >
                                            {value => {
                                                const roundedValue = Math.round(value);
                                                return (
                                                    <CircularProgressbar
                                                        value={value}
                                                        strokeWidth={1}
                                                        text={`${roundedValue}%`}
                                                        /* This is important to include, because if you're fully managing the
                                                  animation yourself, you'll want to disable the CSS animation. */
                                                        styles={buildStyles({
                                                            pathTransition: "none", strokeLinecap: "butt",
                                                            textSize: "14px"
                                                        })}
                                                    />
                                                );
                                            }}
                                        </AnimatedProgressProvider>

                                    </div>
                                </div>
                                <div className='showresulttable'>
                                    <Row>
                                        <Col md={{ span: 10, offset: 1 }}>
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>Total no of questions</th>
                                                        <th>Total no of correct answers</th>
                                                        <th>Total no of wrong answers</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{ExtractedQuestionforClass.length}</td>
                                                        <td>{score}</td>
                                                        <td>{ExtractedQuestionforClass.length - score}</td>
                                                    </tr>

                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>

                                </div>
                                <div className='wrongQA'>
                                    <p className='head'>Questions which are incorrectly answered </p>
                                    {incorrectanswers.map((item, index) => {
                                        return <div key={index} style={{ marginTop: '20px', marginBottom: '20px' }}>
                                            <Row noGutters className='row'>
                                                <Col style={{ borderRight: '1px solid #dee2e6', background: '#f2f2f2' }} xs={2}>
                                                    <p>Question</p>
                                                </Col>
                                                <Col xs={10}>
                                                    <p>{item.Question}</p>
                                                </Col>
                                            </Row>
                                            <Row noGutters className='row'>
                                                <Col style={{ borderRight: '1px solid #dee2e6', background: '#f2f2f2' }} xs={2}>
                                                    <p>Correct answer</p>
                                                </Col>
                                                <Col xs={10}>
                                                    <p>{item.CorrectAnswer}</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    })}

                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
                {this.state.ismessageError && <div>
                    <div className='contentbox' style={{ height: '70vh' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={12}>
                                <div className='heading'>
                                    <div className='text-center'>
                                        <h4 style={{ margin: '0' }}>Class tests are not created yet.</h4>
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

export default withRouter(TakeTest);
