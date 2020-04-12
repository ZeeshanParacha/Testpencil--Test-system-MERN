import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import { Link } from 'react-router-dom';

import HeaderComponent from '../header/HeaderComponent';




class AllClasses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            classname: '',
            Subject: '',
            Chapter: '',
            Topic: '',

            allclasses: [],

            ismessageError: true,
            isClass: false,
            isSubject: false,
            isChapter: false,
            isTopic: false


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

                    console.log('Uniqueclassesnames-->' , Uniqueclassesnames)
                    this.setState({ ismessageError: false, allclasses: Uniqueclassesnames })
                }
            });
    }
    render() {

        if (!this.state.ismessageError) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'All Classes'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                    <div className='content' style={{    marginTop: '30px' ,}}>
                        <Row noGutters className='classcard-row'>
                            {this.state.allclasses.map((item) => {
                                return  <Col key={item} style={{ padding: '5px' }} md={3} xs={6} ><Link className='singleclasslink' key={item} 
                                to={{pathname:`/admindashboard/singleclass/${item}`,
                                state:{
                                    singleClassId: item
                                }
                                }}>
                                   
                                    <div className='Allclasscard' >
                                        <div className='classheader'>
                                            <h2><span style={{ color: '#fa4c56' }}>{item}</span></h2>
                                        </div>
                                    </div>
                                </Link></Col>
                            })}
                        </Row>
                    </div>
                </>
            );
        }

        if (this.state.ismessageError) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'All Classes'} clientname={''} headimg={'%admin%'} logout={'admin'} />
                    <div className='content' style={{display: 'flex' , justifyContent : 'center' , alignItems : 'center'}}>
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard' style={{ display: 'flex', justifyContent: 'center', alignItems: 'çenter' }}>
                                    <div className='text-center'>
                                        <h4 style={{ margin: '0' }}>No Class yet created.</h4>
                                        <h4 style={{ marginTop : '20px' , marginBottom : '20px' }}>OR</h4>
                                        <h4 style={{ margin: '0' }}>Network Problem</h4>

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

export default AllClasses;
