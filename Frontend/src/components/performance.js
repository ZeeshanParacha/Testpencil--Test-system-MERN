import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { withRouter } from "react-router";
import HeaderComponent from './header/HeaderComponent';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class Performance extends React.Component {
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
            series: [
                {
                    name: "Total Users Registers",
                    data: [30]
                },
                {
                    name: 'Total test taken',
                    data: [70]
                }
            ],
            averagescore: 0,
            totaltesttaken: 0,
            CategoricalResult: []


        };
    }

    componentWillMount() {
        if (this.props.location.state != undefined) {
            localStorage.setItem('userdetail', JSON.stringify(this.props.location.state.detail));
        }

        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        if (userdetail === null || userdetail._id === undefined || userdetail._id === '') {
            this.props.history.push('/')


        }
        let CategoricalResult
        let integer
        let totaltesttaken
        let averagescore = 0

        fetch(`${process.env.REACT_APP_API}user/fetchResults`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                userId: userdetail._id
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === true && res.result) {
                    console.log('fetchResults-->', res.result)

                    totaltesttaken = res.result.length


                    for (let key in res.result) {
                        integer = parseInt(res.result[key].percentage)
                        averagescore += integer
                    }

                    console.log('averagescore--->', averagescore)
                    console.log('totaltesttaken', totaltesttaken)

                    CategoricalResult = res.result.reduce((Resultmemo, { subjectname, topicname, percentage, chaptername }) => {
                        (Resultmemo[subjectname] = Resultmemo[subjectname] || []).push({ topicname, percentage, chaptername });
                        return Resultmemo;
                    }, {});



                }


            }).then(() => {

                this.setState({ totaltesttaken, averagescore, CategoricalResult })
                console.log('CategoricalResult--->', CategoricalResult)




            })
    }

    render() {
        const userdetail = JSON.parse(localStorage.getItem('userdetail'))
        console.log('CategoricalResult', this.state.CategoricalResult)
        const loop = this.state.CategoricalResult
        return (
            <>
                <HeaderComponent title={'Performance'} clientname={userdetail.name} headimg={userdetail.name[0]} logout={'client'} />

                <div>
                    <div>
                        <div className='contentbox' style={{ marginTop: '40px' }}>
                            <Row noGutters className='classcard-row'>
                                <Col md={6} style={{ padding: '5px' }} xs={{ span: 12 }}>
                                    <div className='classcard usercount'>
                                        <div className='text-center'>
                                            <h4 style={{ margin: '0' }}>Total Test Taken</h4>
                                            <h3 style={{ margin: '0' }}>{this.state.totaltesttaken}</h3>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} style={{ padding: '5px' }} xs={{ span: 12 }}>
                                    <div className='classcard usercount'>
                                        <div className='text-center'>
                                            <h4 style={{ margin: '0' }}>Overall Performance</h4>
                                            <h3 style={{ margin: '0' }}>{this.state.averagescore >= 1 && this.state.totaltesttaken >= 1 ?(this.state.averagescore / this.state.totaltesttaken ).toFixed(2) : 0}%</h3>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className='wrongQA'>
                        {Object
                            .keys(loop)
                            .map((key, index) => (
                                <div key={index} style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <h3>{key}</h3>

                                    {loop[key].map((item, i) => (
                                        <div className='tablerow' key={i}>
                                            <Row noGutters className='row tablehead'>
                                                <Col style={{ borderRight: '1px solid #dee2e6', background: '#f2f2f2' }} xs={4}>
                                                    <p>Chapter</p>
                                                </Col>
                                                <Col style={{ borderRight: '1px solid #dee2e6', background: '#f2f2f2' }}>
                                                    <p>Topic</p>
                                                </Col>
                                                <Col style={{  background: '#f2f2f2' }}>
                                                    <p>Percentage</p>
                                                </Col>
                                            </Row>
                                            <Row noGutters className='row'>
                                                <Col style={{ borderRight: '1px solid #dee2e6',  }} xs={4}>
                                                    <p>{item.chaptername}</p>
                                                </Col>
                                                <Col style={{ borderRight: '1px solid #dee2e6',  }} xs={4}>
                                                    <p>{item.topicname}</p>
                                                </Col>
                                                <Col xs={4}>
                                                    <p>{item.percentage}</p>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}

                                </div>

                            ))}
                    </div>

                </div>



            </>
        );

    }

}

export default withRouter(Performance);
