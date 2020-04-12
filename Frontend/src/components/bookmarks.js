import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import {  withRouter } from "react-router";


import HeaderComponent from './header/HeaderComponent';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player'
class Bookmark extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

            search: '',
            isdatafound: false,
            searchContent: [],
            isQuestions: false,
            initialdata: [],
            questionId: '',



        };
    }

    componentWillMount() {
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))

        if (userdetail === null || userdetail._id === undefined || userdetail._id === '') {
            this.props.history.push('/')
        }
    }

    componentDidMount() {

        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        let userid = userdetail._id
        fetch(`${process.env.REACT_APP_API}user/fetchBookmark`,{
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                userid
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isClass === false) {
                    console.log(res.message)
                    this.setState({ ismessageError: true, })
                }
                else {
                    console.log('result-->', res.result)
                    this.setState({
                        initialdata: res.result,

                    })
                }
            });
    }

    handleSearch = (searchVal) => {
        console.log('searchVal', searchVal)
        this.setState({ search: searchVal });
    }
    handlesearchclick = (clickVal) => {
        if (clickVal === true) {
            console.log(this.state.search)
            if (this.state.search !== '') {
                fetch(`${process.env.REACT_APP_API}user/search`, {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        search: this.state.search,
                    })
                }).then((res) => res.json())
                    .then((res) => {
                        if (res.isSuccess === false) {
                            console.log(res.message)
                            ToastsStore.warning("Search not found, try another search")

                        }
                        else {
                            console.log('searchresult-->', res.result)
                            console.log('searchresult-->', res)

                            this.setState({
                                searchContent: res.result,
                                isQuestions: true,
                            })
                        }
                    })
            }
        }
    }

    deletequestion(id) {
        this.setState({ questionId: id })
        console.log('questionId--->', this.state.questionId)
        console.log('questionId--->', id)

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
        console.log(this.state.questionId)

        fetch(`${process.env.REACT_APP_API}user/deleteQuestion`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                documentId: this.state.questionId,
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
                                onClick: () => window.location.reload()

                            }
                        ]
                    });
                }
            });
    }

    // fetchnewQuestions() {
    //     fetch(`${process.env.REACT_APP_API}user/search`, {
    //         headers: { "Content-Type": "application/json; charset=utf-8" },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             search: this.state.search,
    //         })
    //     }).then((res) => res.json())
    //         .then((res) => {
    //             if (res.isSuccess === false) {
    //                 console.log(res.message)
    //                 this.setState({ isdatafound: true })
    //             }
    //             else {
    //                 console.log('searchresult-->', res.result)
    //                 console.log('searchresult-->', res)

    //                 this.setState({
    //                     searchContent: res.result,
    //                     isQuestions: true,
    //                 })
    //             }
    //         })
    // }

    deleteAllBookmarks = () =>{
        console.log('deletedall')
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        let userid = userdetail._id
        fetch(`${process.env.REACT_APP_API}user/deleteAllfetchBookmark`,{
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                userid
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isClass === false) {
                    ToastsStore.warning("Some error!! while deleting Q/A'S")

                }
                else {
                    ToastsStore.warning("All Q/A'S Deleted!! ")
                    setTimeout(()=>{
                            window.location.reload()
                    },2000)
                }
            });
    
    }
    render() {

        console.log('this.state.searchContent', this.state.searchContent)
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        return (
            <>
                <HeaderComponent title={'Bookmark'} showsearch={'showsearch'} clientname={userdetail.name} headimg={userdetail.name[0]} logout={'client'} onSelectSearch={this.handleSearch} onsearchClick={this.handlesearchclick} />
                <ToastsContainer store={ToastsStore} />

                {!this.state.isQuestions && <div>
                    <div className='addmorecontent' style={{ textAlign : 'right' , marginBottom: '-25px', marginTop: '30px', display: '',  }}>
                        <h2 ><span onClick={this.deleteAllBookmarks} className='addmore' style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Delete All</span></h2>
                    </div>
                    <div className='content' style={{ marginTop: '60px' }} >
                        <Row noGutters className='classcard-row' style={{ paddingBottom: '30px' }}>
                            {this.state.initialdata && this.state.initialdata.length > 0 ? this.state.initialdata.map((item, index) => {
                                return <Col key={index} style={{ padding: '5px', }} md={{ span: 10 }} xs={12}>
                                    <div className='Allclasscard searchquestions' style={{ padding: '8px', cursor: 'default' }}>
                                        <div className='questionDiv'>
                                            <div style={{ cursor: 'pointer', width: '90%' }} onClick={() => this.setState({ IsshowAnswers: !this.state.IsshowAnswers, showAnswers: item.questionId })}>
                                                <p>Q.{index + 1} {item.Question}</p>
                                            </div>
                                            <div className='editdiv' style={{ padding: '5px', width: '10%', textAlign: 'right', justifyContent: 'flex-end' }}>

                                                <div onClick={this.deletequestion.bind(this, item.questionId)}>
                                                    <MDBIcon style={{ paddingRight: '5px', fontSize: '16px', cursor: 'pointer', color: '#d9534f' }} icon="trash" />
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.IsshowAnswers && this.state.showAnswers === item.questionId && <div className='answersDiv'>
                                            {item.Questionimagepath && item.audioPath && item.videopath && <div className='questionImg'>
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
                                            </div>}
                                            <p style={{ marginTop: '1rem' }}>Incorrect Answer : {item.Option1}</p>
                                            <p>Incorrect Answer : {item.Option2}</p>
                                            <p>Incorrect Answer : {item.Option3}</p>
                                            <p>Correct Answer : {item.CorrectAnswer}</p>
                                        </div>}
                                    </div>
                                </Col>
                            }) : <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90%', height: '60vh' }}>
                                    <Row noGutters className='classcard-row'>
                                        <Col xs={12}>
                                            <div className='classcard' style={{ background: 'none', boxShadow: 'none' }}>
                                                <div className='text-center'>
                                                    <h4 style={{ margin: '0', fontSize: '26px' }}>Bookmark Q/A not found!</h4>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>}
                        </Row>
                    </div>
                </div>}
                {this.state.isQuestions && <div>
                    <div className='gobackiconhead' style={{ marginBottom: '-25px', marginTop: '30px', display: 'inline-Block', cursor: 'pointer' }}>
                        <div className='singleclasslinkheader' onClick={() => window.location.reload()} >
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

                                                <div onClick={this.deletequestion.bind(this, item.questionId)}>
                                                    <MDBIcon style={{ paddingRight: '5px', fontSize: '16px', cursor: 'pointer', color: '#d9534f' }} icon="trash" />
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.IsshowAnswers && this.state.showAnswers === item.questionId && <div className='answersDiv'>
                                            {item.Questionimagepath && item.audioPath && item.videopath && <div className='questionImg'>
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



                                            </div>}
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
            </>
        );

    }

}

export default withRouter(Bookmark);
