import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Typewriter from 'typewriter-effect';
import Container from 'react-bootstrap/Container'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Link } from 'react-router-dom';
import { stat } from 'fs';

// import Accordion from 'react-bootstrap/Accordion'
// import Card from 'react-bootstrap/Card'
// import Button from 'react-bootstrap/Button'

const GifPlayer = require('react-gif-player');

class Home extends Component {
    constructor() {
        super()
        this.state = {
            helpcontent: '',
            FAQcontentshow : true
        }
    }


    componentDidMount() {
        fetch('http://localhost:8080/Admin/fetchFAQ').then(res => res.json())
            .then((res) => {
                if (res.isSuccess === false) {
                    console.log(res.message)
                    this.setState({ FAQcontentshow: false, })
                }
                else {
                    console.log('result-->', res.result)
                    this.setState({ helpcontent: res.result })
                }
            });
    }

    render() {
        return (
            <div id='main'>
                <div id='Herosection'>
                    <Row noGutters>
                        <Col xs={12} md={6} style={{ textAlign: 'center' }}>
                            <div className='innerheading innerheading2' >
                                <Typewriter
                                    options={{
                                        strings: ['Frequently asked questions!!!'],
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                            </div>

                        </Col>
                        <Col xs={12} md={6}>
                            <div className='innerimage innerheading2' style={{ background: '#f8f4ec' }}>
                                <img
                                    className=" w-100"
                                    src="https://cdn.dribbble.com/users/1418633/screenshots/4887220/notification.png"
                                    alt="Third slide"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {this.state.FAQcontentshow === true && this.state.helpcontent.length > 0 &&
                    <div style={{ marginTop: '60px' , marginBottom : '20px' }} >
                        <Row noGutters className='classcard-row' style={{ paddingBottom: '30px' }}>
                            {this.state.helpcontent.length > 0 && this.state.helpcontent.map((item, index) => {
                                return <Col key={item._id} style={{ padding: '5px', }} md={{ span: 8, offset : 2 }} xs={12}>
                                    <div className='Allclasscard' style={{ padding: '8px', cursor: 'default' , marginBottom : '20px' }}>
                                        <div className='questionDiv'>
                                            <div style={{ cursor: 'pointer', width: '90%' }} onClick={() => this.setState({ showAnswer: !this.state.showAnswer, answerId: item._id })}>
                                                <p>Q : {item.Question}</p>
                                            </div>
                                        </div>
                                        {this.state.showAnswer && this.state.answerId === item._id && <div className='answersDiv' >
                                            <p style={{ border: 'none', borderTop: '1px solid #ccc', paddingTop: '16px', fontSize: '14px' }}>A : {item.Answer}</p>
                                        </div>}
                                    </div>
                                </Col>
                            })}
                        </Row>
                    </div>}
                    {!this.state.FAQcontentshow && <div className='contentbox' style={{ height: '30vh' }}>
                    <Row noGutters className='classcard-row'>
                        <Col md={{ span: 8, offset: 2 }} xs={12}>
                            <div className='classcard' style={{boxShadow : 'none'}}>
                                <div className='text-center'>
                                    <h4 style={{ margin: '0' ,fontSize : '28px'}}>FAQ not found</h4>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>}
            </div>


        )
    }

}

export default Home;