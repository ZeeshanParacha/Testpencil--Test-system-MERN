import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';
import HeaderComponent from '../header/HeaderComponent';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player'
import { MDBModal, MDBModalBody, MDBModalHeader, MDBInput } from 'mdbreact';
import axios from 'axios';


class SingleClass extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            classContent: [],
            UniquesubjectName: [],
            UniquechapterName: [],
            UniquetopicsName: [],
            ExtractedQuestionforClass: [],
            UniquechapterName1: [],
            UniquetopicsName1: [],
            ismessageError: false,
            isSubjects: true,
            isChapters: false,
            isTopics: false,
            isQuestions: false,
            chapterlength: 0,
            topicslength: 0,
            IsshowAnswers: false,
            modal14: false,
            modal15: false,
            ispicture: false,
            issound: false,
            isvideo: false,

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
            classmaterial: '',
            materialName: '',

            ModifyMaterialname: '',
            PreviousModifyMaterialvalue: '',
            ModifyMaterialvalue: '',
            ModifyMaterialimage: '',
            ModifyMaterialimagePath: '',


            NewMaterialimgPath: '',
            NewContentname: '',
            NewContentvalue: '',
            NewContentdocumentId: '',

            modalnewQuestion: false
        }

    }
    componentWillMount() {

        if (this.props.location.state != undefined) {
            localStorage.setItem('singleClassId', this.props.location.state.singleClassId);

        }

    }

    componentDidMount() {
        const singleClassId = localStorage.getItem('singleClassId')
        console.log('singleClassId--------->', singleClassId)
        fetch(`${process.env.REACT_APP_API}Admin/singleclasscontent`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                classId: singleClassId,
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
                    const { chapterlength, topicslength } = this.state
                    UniquesubjectName = res.result.filter((obj, pos, arr) => {
                        uniqueId = obj._id
                        return arr.map(mapObj => mapObj['Subject']).indexOf(obj['Subject']) === pos;
                    });


                    console.log('UniquesubjectName----> ', UniquesubjectName)


                    // UniquechapterName =  res.result.filter((obj, pos, arr) => {
                    //     uniqueId = obj._id
                    //     return arr.map(mapObj => mapObj['Chapter']).indexOf(obj['Chapter']) === pos;
                    // });


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


                    console.log('UniquetopicsName', UniquetopicsName);

                    console.log('uniqueId----> 108', uniqueId)
                    this.setState({ ismessageError: false, uniqueId: uniqueId, classContent: res.result, UniquesubjectName: UniquesubjectName, UniquechapterName: UniquechapterName, UniquetopicsName: UniquetopicsName })
                }
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

        this.setState({ isTopics: false, isQuestions: true, ExtractedQuestionforClass: ExtractedQuestionforClass, topicname: topicname })

    }

    fetchnewQuestions() {
        console.log('fetchnewquestions')
        const singleClassId = localStorage.getItem('singleClassId')
        const { subjectname, chaptername, topicname } = this.state;
        console.log('subjectname', subjectname)
        console.log('chaptername', chaptername)
        console.log('topicname', topicname)

        let ExtractedQuestionforClass = []


        fetch(`${process.env.REACT_APP_API}Admin/singleclasscontent`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                classId: singleClassId,
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === true) {
                    for (let exact in res.result) {
                        console.log(res.result[exact])
                        let questionsExact = res.result[exact]
                        if (questionsExact.Subject === subjectname && questionsExact.Chapter === chaptername && questionsExact.Topic === topicname) {
                            if (questionsExact.content) {
                                for (let key in questionsExact.content) {
                                    ExtractedQuestionforClass.push(questionsExact.content[key])
                                }
                            }
                        }
                    }
                }
            }).then(() => {
                this.setState({ ExtractedQuestionforClass: ExtractedQuestionforClass, isTopics: false, isQuestions: true, })
                console.log('ExtractedQuestionforClass', ExtractedQuestionforClass)

            })






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
        console.log(this.state.questionId)
        const classname = localStorage.getItem('singleClassId')

        const {chaptername , topicname , subjectname} = this.state
        


        fetch(`${process.env.REACT_APP_API}Admin/deleteQuestion`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                documentId: this.state.questionId,
                classname: classname,
                Subject : subjectname ,
                Topic : topicname,
                Chapter : chaptername,
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

    toggle15(PreviousModifyMaterialvalue, ModifyMaterialname, ModifyMaterialimagePath) {

        this.setState({
            modal15: !this.state.modal15,
            ModifyMaterialname: ModifyMaterialname,
            PreviousModifyMaterialvalue: PreviousModifyMaterialvalue,
            ModifyMaterialimagePath: ModifyMaterialimagePath
        })
    }

    newQuestiontoggle() {
        this.setState({
            modalnewQuestion: !this.state.modalnewQuestion
        })
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
        let audio;

        if (path === 'audio') {
            audio = e.target.files[0]
            this.setState({ audioPath: audio, QuestionImagePath: '', videopath: '' })
        }
        if (path === 'question') {
            this.setState({
                
                QuestionImagePath: e.target.files[0],
                audioPath: '',
                videopath: ''

            });
        }
    }

    modifyQuestion = () => {
        const { subjectname, chaptername, topicname, Question, Option1, Option2, Option3, CorrectAnswer, QuestionImagePath, audioPath, videopath, modifyquestionid, uniqueId } = this.state;

        if (Question === '' || Option1 === '' || Option2 === '' || Option3 === '' || CorrectAnswer === '') {
            ToastsStore.warning("All fields are required")
            console.log('clicked inside--->')

        }
        else {

            const singleClassId = localStorage.getItem('singleClassId')
            let imageFormObj = new FormData();
            imageFormObj.append("imageName", "QuestionImage-" + Date.now());
            imageFormObj.append("Questionimage", QuestionImagePath);
            imageFormObj.append("Audio", audioPath);
            let content = {
                questionId: modifyquestionid,
                classname : singleClassId,
                Subject : subjectname,
                Topic : topicname,
                Chapter : chaptername,
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
                        this.fileInput.value = "";
                    }
                    else {

                        this.setState({ ismessageError: true })
                        setTimeout(() => {
                            this.setState({ ismessageError: false, })
                        }, 3000);
                        this.fileInput.value = "";
                    }
                })
                .catch((err) => {
                    //   alert("Error while uploading image using multer");
                    //   this.setDefaultImage("multer");
                });
        }
    }

    modifyMaterialcontent = () => {
        const { ModifyMaterialimage, ModifyMaterialimagePath, ModifyMaterialname, ModifyMaterialvalue, PreviousModifyMaterialvalue } = this.state;
        const singleClassId = localStorage.getItem('singleClassId')

        let imageFormObj = new FormData();

        imageFormObj.append("imageName", "ModifyMaterialimage-" + Date.now());
        imageFormObj.append("classContentImg", ModifyMaterialimage);
        let content = {
            classname: singleClassId,
            ModifyMaterialimagePath,
            ModifyMaterialname,
            ModifyMaterialvalue,
            PreviousModifyMaterialvalue
        }
        imageFormObj.append("content", JSON.stringify(content))
        let API_URL = process.env.REACT_APP_API
        axios.post(`${API_URL}Admin/modifyclassContent`, imageFormObj)
            .then((data) => {
                console.log('data--->', data.data.isSuccess)

                if (data.data.isSuccess === true) {
                    this.setState({ ModifyMaterialimagePath: '', ModifyMaterialname: '', ModifyMaterialvalue: '', })
                    this.toggle15()
                    ToastsStore.warning("Class content has been modified")
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);

                }
                else {
                    ToastsStore.warning("Some issues while modifying class content")

                }
            })
            .catch((err) => {
                //   alert("Error while uploading image using multer");
                //   this.setDefaultImage("multer");
            });

    }

    fetchtopics(Chaptername) {
        const Subjectname = localStorage.getItem('Subjectname');

        if (Chaptername != undefined) {
            localStorage.setItem('Chaptername', Chaptername);
        }
        const { UniquetopicsName, UniquechapterName, sessiondata } = this.state
        let newTopicdata
        let newTopicarr = []

        let newTopics = []
        for (let key in UniquetopicsName) {
            if (UniquetopicsName[key].Chapter === Chaptername && UniquetopicsName[key].Subject === Subjectname) {
                newTopics.push(UniquetopicsName[key])
            }
        }

        this.setState({ UniquetopicsName1: newTopics, isChapters: false, isTopics: true, chaptername: Chaptername })
    }
    fetchchapters(Subjectname, NewContentdocumentId) {
        if (Subjectname != undefined) {
            localStorage.setItem('Subjectname', Subjectname);
        }

        console.log('Subjectname--->', Subjectname)

        const { UniquechapterName } = this.state
        console.log('UniquechapterName------>', UniquechapterName)
        let newChapters = []
        for (let key in UniquechapterName) {
            if (UniquechapterName[key].Subject === Subjectname) {
                newChapters.push(UniquechapterName[key])
            }
        }
        console.log('UniquechapterName------>', newChapters)

        this.setState({ UniquechapterName1: newChapters, isSubjects: false, isChapters: true, subjectname: Subjectname, })
    }

    deleteAditionals(classmaterial, materialName) {
        const singleClassId = localStorage.getItem('singleClassId')
        console.log('singleClassId-------------->', singleClassId)
        console.log('materialName-------------->', this.state.materialName)

        this.setState({ classmaterial: classmaterial, materialName: materialName })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmdeleteAditionals()
                },
                {
                    label: 'No',

                }
            ]
        });
    }

    confirmdeleteAditionals() {
        console.log('delete')
        const singleClassId = localStorage.getItem('singleClassId')
        console.log('singleClassId-------------->', singleClassId)
        console.log('materialName-------------->', this.state.materialName)


        console.log(this.state.classmaterial)

        fetch(`${process.env.REACT_APP_API}Admin/deleteclassMaterial`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                classId: singleClassId,
                classmaterial: this.state.classmaterial,
                materialName: this.state.materialName
            })
        }).then(res => res.json())
            .then((res) => {
                console.log('Delete', res.result)
                if (res.isSuccess === true) {
                    confirmAlert({
                        title: 'Success',
                        message: 'Your content has been removed',
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
    createmorematerial = () => {

        const { NewContentvalue, NewContentname, NewMaterialimgPath, NewContentdocumentId } = this.state
        const singleClassId = localStorage.getItem('singleClassId')


        let imageFormObj = new FormData();
        imageFormObj.append("imageName", "Newclasscontentimages-" + Date.now());
        imageFormObj.append("Newclasscontentimages", NewMaterialimgPath);

        if (NewContentname === 'Subject') {
            let content = {
                classname: singleClassId,
                NewContentname: NewContentname,
                NewContentvalue: NewContentvalue
            }
            imageFormObj.append("content", JSON.stringify(content))
            let API_URL = process.env.REACT_APP_API
            axios.post(`${API_URL}Admin/Addsubject`, imageFormObj)
                .then((data) => {
                    console.log('data--->', data.data.isSuccess)

                    if (data.data.isSuccess === true) {
                        this.setState({ NewContentvalue: '', NewContentname: '', NewMaterialimgPath: '', })
                        this.toggle1()
                        ToastsStore.warning("New Subject has been added")

                        setTimeout(() => {
                            window.location.reload()
                        }, 2000);
                    }
                    else {
                        ToastsStore.warning("Some issues while adding subject")

                    }
                })
                .catch((err) => {
                    //   alert("Error while uploading image using multer");
                    //   this.setDefaultImage("multer");
                });
        }
        else if (NewContentname === 'Chapter') {
            const Subjectname = localStorage.getItem('Subjectname')

            let content = {
                classname: singleClassId,
                NewContentname: NewContentname,
                NewContentvalue: NewContentvalue,
                Subjectname: Subjectname
            }
            imageFormObj.append("content", JSON.stringify(content))
            let API_URL = process.env.REACT_APP_API
            axios.post(`${API_URL}Admin/Addadditionalchapters`, imageFormObj)
                .then((data) => {
                    console.log('data--->', data.data.isSuccess)

                    if (data.data.isSuccess === true) {
                        this.setState({ NewContentvalue: '', NewContentname: '', NewMaterialimgPath: '', })
                        this.toggle1()
                        ToastsStore.warning("New Content has been added")

                        setTimeout(() => {
                            window.location.reload()
                        }, 2000);
                    }
                    else {
                        ToastsStore.warning("Some issues while adding Content")

                    }
                })
                .catch((err) => {
                    //   alert("Error while uploading image using multer");
                    //   this.setDefaultImage("multer");
                });
        }
        else if (NewContentname === 'Topic') {
            const Subjectname = localStorage.getItem('Subjectname')
            const Chaptername = localStorage.getItem('Chaptername')


            let content = {
                classname: singleClassId,
                NewContentname: NewContentname,
                NewContentvalue: NewContentvalue,
                Subjectname: Subjectname,
                Chaptername: Chaptername
            }
            imageFormObj.append("content", JSON.stringify(content))
            let API_URL = process.env.REACT_APP_API
            axios.post(`${API_URL}Admin/Addadditionaltopics`, imageFormObj)
                .then((data) => {
                    console.log('data--->', data.data.isSuccess)

                    if (data.data.isSuccess === true) {
                        this.setState({ NewContentvalue: '', NewContentname: '', NewMaterialimgPath: '', })
                        this.toggle1()
                        ToastsStore.warning("New Content has been added")

                        setTimeout(() => {
                            window.location.reload()
                        }, 2000);
                    }
                    else {
                        ToastsStore.warning("Some issues while adding Content")

                    }
                })
                .catch((err) => {
                    //   alert("Error while uploading image using multer");
                    //   this.setDefaultImage("multer");
                });
        }



    }

    toggle1(NewContentname, NewContentdocumentId) {
        this.setState({
            modal1: !this.state.modal1,
            NewContentname: NewContentname,
            NewContentdocumentId: NewContentdocumentId
        })
    }

    uploadClassContent = () => {
        console.log('clicked--->')

        const { subjectname, topicname, chaptername, Question, Option1, Option2, Option3, CorrectAnswer, QuestionImagePath, audioPath, videopath } = this.state;
        let audio = audioPath


        if (Question === '' || Option1 === '' || Option2 === '' || Option3 === '' || CorrectAnswer === '') {
            ToastsStore.warning("All fields are required")
            console.log('clicked inside--->')

        }
        else {
            console.log('audio----> updatecontentme', audio)
            const singleClassId = localStorage.getItem('singleClassId')

            let imageFormObj = new FormData();

            imageFormObj.append("imageName", "QuestionImage-" + Date.now());
            imageFormObj.append("Questionimage", QuestionImagePath);
            imageFormObj.append("Audio", audio);


            let content = {
                classname: singleClassId,
                Subject : subjectname,
                Topic : topicname,
                Chapter : chaptername,
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
                        ToastsStore.warning("New Question has been added!!")
                        this.fileInput.value = "";

                    }
                    else {
                        ToastsStore.warning("Some erroe while adding question.")
                        this.fileInput.value = "";

                    }


                })
                .catch((err) => {
                    //   alert("Error while uploading image using multer");
                    //   this.setDefaultImage("multer");
                });
        }
    }
    render() {
            console.log('uniqueId---->',this.state.uniqueId)

        return (


            <>

                <HeaderComponent title={`${this.props.match.params.class}`} clientname={''} headimg={'%admin%'} logout={'admin'} />
                <ToastsContainer store={ToastsStore} />

                {this.state.isSubjects && <div>
                    <div className='gobackiconhead addmorecontent' style={{ marginBottom: '20px', marginTop: '20px', cursor: 'pointer' }}>
                        <Link to='/admindashboard/allclasses' className='singleclasslinkheader' >
                            <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                        </Link>
                        <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Subjects</span></h2>

                        <h2 onClick={() => this.toggle1('Subject', '')}><span className='addmore' style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Add Subject</span></h2>
                    </div>
                    <div className='content' style={{ marginTop: '20px', }}  >
                        <Row noGutters className='classcard-row'>
                            {this.state.UniquesubjectName.map((item) => {
                                return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                    <div className='Allclasscard' style={{ padding: '8px' }} >
                                        <div className='additionalBtns' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <div onClick={() => this.toggle15(item.Subject, 'Subject', 'SubjectimgPath')}>
                                                <MDBIcon className='edit' style={{ paddingRight: '5px', cursor: 'pointer', fontSize: '16px', color: '#428bca' }} icon="undo" />
                                            </div>
                                            {/* <div onClick={this.deletequestion.bind(this, item.questionId)}></div> */}
                                            <div onClick={this.deleteAditionals.bind(this, item.Subject, 'Subject')}>
                                                <MDBIcon style={{ paddingRight: '5px', fontSize: '16px', cursor: 'pointer', color: '#d9534f' }} icon="trash" />
                                            </div>
                                        </div>
                                        <div onClick={() => this.fetchchapters(item.Subject, item._id)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            {item.SubjectimgPath ?
                                                <img src={process.env.REACT_APP_API + item.SubjectimgPath} width='80' height='80' style={{ borderRadius: '10px 20px' }} /> :
                                                <img src={process.env.PUBLIC_URL + '/images/not_found.jpg'} width='80' height='80' style={{ borderRadius: '10px 20px' }} />}
                                            <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>{item.Subject}</span></h2>
                                        </div>
                                    </div>
                                </Col>
                            })}
                        </Row>
                    </div>
                </div>}
                {this.state.isChapters && <div>
                    <div className='gobackiconhead addmorecontent' style={{ marginBottom: '20px', marginTop: '20px', cursor: 'pointer' }}>
                        <div className='singleclasslinkheader' onClick={() => window.location.reload()}>
                            <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                        </div>
                        <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Chapters</span></h2>
                        <h2 onClick={() => this.toggle1('Chapter', this.state.NewContentdocumentId)}><span className='addmore' style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Add Chapter</span></h2>

                    </div>
                    <div className='content' style={{ marginTop: '20px' }}>
                        <Row noGutters className='classcard-row'>
                            {this.state.UniquechapterName1.map((item, index) => {
                                index = index + 1
                                return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                    <div className='Allclasscard' style={{ padding: '8px' }}>
                                        {item.Chapter ? <div className='additionalBtns' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <div onClick={() => this.toggle15(item.Chapter, 'Chapter', 'ChapterimgPath')}>
                                                <MDBIcon className='edit' style={{ paddingRight: '5px', cursor: 'pointer', fontSize: '16px', color: '#428bca' }} icon="undo" />
                                            </div>
                                            {/* <div onClick={this.deletequestion.bind(this, item.questionId)}></div> */}
                                            <div onClick={this.deleteAditionals.bind(this, item.Chapter, 'Chapter')}>
                                                <MDBIcon style={{ paddingRight: '5px', fontSize: '16px', cursor: 'pointer', color: '#d9534f' }} icon="trash" />
                                            </div>
                                        </div> : null}
                                        <div onClick={() => this.fetchtopics(item.Chapter)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            {item.ChapterimgPath ?
                                                <img src={process.env.REACT_APP_API + item.ChapterimgPath} width='80' height='80' style={{ borderRadius: '10px 20px' }} /> :
                                                <img src={process.env.PUBLIC_URL + '/images/not_found.jpg'} width='80' height='80' style={{ borderRadius: '10px 20px' }} />}
                                            <h2 style={{ marginBottom: '0' }}><span style={{ color: '#363740', margin: '0px', marginTop: '10px', fontSize: '18px' }}>{item.Chapter}</span></h2>
                                            <h2 style={{ fontSize: '10px', fontFamily: 'Montserrat' }}><span style={{ fontSize: '10px', color: '#757575' }}>{item.Chapter ? 'Chapter ' + index : 'Not yet added'}</span></h2>

                                        </div>
                                    </div>
                                </Col>
                            })}
                        </Row>
                    </div>
                </div>}
                {this.state.isTopics && <div>
                    <div className='gobackiconhead addmorecontent' style={{ marginBottom: '20px', marginTop: '20px', display: 'inline-Block', cursor: 'pointer' }}>
                        <div className='singleclasslinkheader' onClick={() => { this.setState({ isChapters: true, isTopics: false, UniquechapterName: this.state.UniquechapterName }) }} >
                            <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                        </div>
                        <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Topics</span></h2>
                        <h2 onClick={() => this.toggle1('Topic', this.state.NewContentdocumentId)}><span className='addmore' style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Add Topics</span></h2>
                    </div>
                    <div className='content' style={{ marginTop: '20px' }} >
                        <Row noGutters className='classcard-row'>
                            {this.state.UniquetopicsName1.map((item, index) => {
                                index = index + 1
                                return <Col key={item._id} style={{ padding: '5px', }} md={4} xs={6}>
                                    <div className='Allclasscard' style={{ padding: '8px' }}  >
                                        {item.Topic ? <div className='additionalBtns' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <div onClick={() => this.toggle15(item.Topic, 'Topic', 'TopicimgPath')}>
                                                <MDBIcon className='edit' style={{ paddingRight: '5px', cursor: 'pointer', fontSize: '16px', color: '#428bca' }} icon="undo" />
                                            </div>
                                            {/* <div onClick={this.deletequestion.bind(this, item.questionId)}></div> */}
                                            <div onClick={this.deleteAditionals.bind(this, item.Topic, 'Topic')}>
                                                <MDBIcon style={{ paddingRight: '5px', fontSize: '16px', cursor: 'pointer', color: '#d9534f' }} icon="trash" />
                                            </div>
                                        </div> : null}
                                        <div onClick={() => this.fetchclassquestions(item.Topic)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            {item.TopicimgPath ?
                                                <img src={process.env.REACT_APP_API + item.TopicimgPath} width='80' height='80' style={{ borderRadius: '10px 20px' }} /> :
                                                <img src={process.env.PUBLIC_URL + '/images/not_found.jpg'} width='80' height='80' style={{ borderRadius: '10px 20px' }} />}
                                            <h2 style={{ marginBottom: '0' }}><span style={{ color: '#363740', nargin: '0px', marginTop: '10px', fontSize: '18px' }}>{item.Topic}</span></h2>
                                            <h2 style={{ fontSize: '10px', fontFamily: 'Montserrat', margin: '0' }}><span style={{ fontSize: '10px', color: '#757575' }}>{item.Topic ? 'Topic ' + index : 'Not yet added'}</span></h2>

                                        </div>
                                    </div>
                                </Col>
                            })}
                        </Row>
                    </div>
                </div>}
                {this.state.isQuestions && <div>
                    <div className='gobackiconhead addmorecontent' style={{ marginBottom: '20px', marginTop: '20px', display: 'inline-Block', cursor: 'pointer' }}>
                        <div className='singleclasslinkheader' onClick={() => { this.setState({ isTopics: true, isQuestions: false }) }} >
                            <MDBIcon style={{ paddingRight: '5px', fontSize: '20px' }} icon="arrow-left" />
                        </div>
                        <h2><span style={{ color: '#363740', marginTop: '10px', fontSize: '22px' }}>
                            {this.state.subjectname + ' ' + '||' + ' ' + ' ' + this.state.chaptername + ' ' + '||' + ' ' + this.state.topicname}
                        </span></h2>
                        <h2 onClick={() => this.newQuestiontoggle()}><span className='addmore' style={{ color: '#363740', marginTop: '10px', fontSize: '18px' }}>Add Questions</span></h2>
                    </div>
                    <div className='content' style={{ marginTop: '20px' }} >
                        <Row noGutters className='classcard-row' style={{ paddingBottom: '30px' }}>
                            {this.state.ExtractedQuestionforClass.length > 0 && this.state.ExtractedQuestionforClass.map((item, index) => {
                                return <Col key={item.questionId} style={{ padding: '5px', }} md={{ span: 10, }} xs={12}>
                                    <div className='Allclasscard' style={{ padding: '8px', cursor: 'default' }}>
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
                {this.state.isQuestions && !this.state.ExtractedQuestionforClass.length > 0 && <div className='contentbox' style={{ height: '50vh' }}>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard'>
                                <div className='text-center'>
                                    <h4 style={{ margin: '0' }}>Questions not found</h4>
                                </div>
                            </div>
                        </Col>
                    </Row>
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
                                <input type="file" id="myfile" name="myfile" onChange={(e) => this.uploadImage(e, 'question')} ref={ref => this.fileInput = ref} />

                            </div>}
                            {this.state.isvideo && <div className='selectIcon' style={{ marginTop: '20px', cursor: 'default' }}>
                                <MDBInput style={{ cursor: 'default' }} label="Video link" icon="file-video" validate error="wrong"
                                    success="right" onChange={(e) => { this.setState({ videopath: e.target.value, QuestionImagePath: '', audioPath: '' }) }} value={this.state.videopath} required />
                            </div>}
                            {this.state.issound && <form encType="multipart/form-data" className='selectIcon' style={{ marginTop: '20px' }} ref={ref => this.fileInput = ref}>

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
                                    <div className='nextBtn' onClick={this.modifyQuestion}>Modify it<MDBIcon style={{ paddingLeft: '5px' }} icon="arrow-right" /></div>
                                </div>
                            </div>
                        </MDBModalBody>

                    </MDBModal>

                </div>

                <div className='modifyModal'>
                    <MDBModal isOpen={this.state.modal15} toggle={() => this.toggle15()} centered>
                        <MDBModalHeader toggle={() => this.toggle15()}>Modify {this.state.ModifyMaterialname}</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput label={this.state.ModifyMaterialname} icon="exclamation-circle" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ ModifyMaterialvalue: e.target.value }) }} value={this.state.ModifyMaterialvalue} required />
                            <div className='selectIcon'>
                                <label>Select Icon:</label>
                                <input type="file" id="myfile" name="myfile" onChange={(e) => this.setState({ ModifyMaterialimage: e.target.files[0] })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                    <div className='nextBtn' onClick={this.modifyMaterialcontent}>Modify it</div>
                                </div>
                            </div>
                        </MDBModalBody>

                    </MDBModal>

                </div>

                <div className='modifyModal'>
                    <MDBModal isOpen={this.state.modal1} toggle={() => this.toggle1()} centered>
                        <MDBModalHeader toggle={() => this.toggle1()}>Adding {this.state.NewContentname}</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput label={this.state.NewContentname} icon="exclamation-circle" validate error="wrong"
                                success="right" onChange={(e) => { this.setState({ NewContentvalue: e.target.value }) }} value={this.state.NewContentvalue} required />
                            <div className='selectIcon'>
                                <label>Select Icon:</label>
                                <input type="file" id="myfile" name="myfile" onChange={(e) => this.setState({ NewMaterialimgPath: e.target.files[0] })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                    <div className='nextBtn' onClick={this.createmorematerial}>Add now</div>
                                </div>
                            </div>
                        </MDBModalBody>
                    </MDBModal>

                </div>


                <div className='modifyModal'>
                    <MDBModal isOpen={this.state.modalnewQuestion} toggle={() => this.newQuestiontoggle()} centered>
                        <MDBModalHeader toggle={() =>window.location.reload()}>New Questions</MDBModalHeader>
                        <MDBModalBody>
                            <div className='newAddQuestions'>
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

                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <div style={{ display: 'inline-block', textAlign: 'right' }}>
                                        <div className='nextBtn' onClick={this.uploadClassContent}>Add Question</div>
                                    </div>
                                </div>
                            </div>
                        </MDBModalBody>

                    </MDBModal>

                </div>
            </>

        );

    }
}

export default SingleClass;
