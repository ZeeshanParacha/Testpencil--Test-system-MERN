import React from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { MDBIcon } from 'mdbreact';
import HeaderComponent from '../header/HeaderComponent';





class Allusers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {


            allusers: [],
            isuserdetail : false,
            id : ''

        }
    }

    componentDidMount() {
        let newArr = []
        let allusers = []
        fetch(`${process.env.REACT_APP_API}Auth/allusers`).then(res => res.json())
            .then((res) => {
                if (res.isSuccess === false) {
                    console.log(res.message)
                    this.setState({ ismessageError: true, })
                }
                else {
                    console.log('result-->', res.result)
                    let randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
                    for (let key in res.result) {
                        console.log(newArr = res.result[key])
                        newArr = res.result[key]
                        newArr.initial = res.result[key].name[0]
                        newArr.color = randomColor;
                        allusers.push(newArr)
                    }
                    this.setState({ ismessageError: false, allusers: allusers })
                }
            });
    }
    render() {
        console.log('users--->', this.state.allusers)
        if (!this.state.ismessageError) {
            return (
                //  Step#1 of creating class
                <>
                <HeaderComponent title={'Users Profiles'} clientname={''} headimg={'%admin%'} logout={'admin'} />

                    <div className='content' style={{ marginTop: '30px', }}>
                        <Row noGutters className='classcard-row'>
                            {this.state.allusers.map((item) => {
                                return <Col key={item._id} style={{ padding: '5px' }} md={4} xs={6} >

                                    <div className='Allclasscard' >
                                        <div className='classheader' onClick={()=> {this.setState({isuserdetail : !this.state.isuserdetail , id : item._id})}}>
                                            <h2 style={{ color : '#fa4c56' ,fontSize: '22px', textTransform: 'capitalize' , margin: '0px' }}>{item.name}</h2>
                                        </div>
                                        {this.state.isuserdetail && item._id === this.state.id && <div className='profilebody' style={{cursor : 'initial'}}>
                                        <div style={{paddingTop : '8px' , paddingLeft : '4px',paddingBottom : '8px', borderBottom : '1px solid #f8f8f8'}}>
                                            <MDBIcon style={{ paddingRight: '10px', fontSize : '14px' , color : '#707070'   }} icon="envelope-open" />
                                            <span className='titlevaluue'>{item.email}</span>
                                            </div>

                                            <div style={{paddingTop : '8px' , paddingLeft : '4px',paddingBottom : '8px', borderBottom : '1px solid #f8f8f8'}}>
                                            <MDBIcon style={{ paddingRight: '10px' ,fontSize : '14px' , color : '#707070'  }} icon="graduation-cap" />
                                            <span style={{textTransform : 'capitalize'}} className='titlevaluue'>{item.school} School</span>
                                            </div>

                                            <div style={{paddingTop : '8px' , paddingLeft : '4px',paddingBottom : '8px', borderBottom : '1px solid #f8f8f8'}}>
                                            <MDBIcon style={{ paddingRight: '10px' , fontSize : '14px' , color : '#707070'  }} icon="contao" />
                                            <span style={{textTransform : 'capitalize'}} className='titlevaluue'>{item.class}</span>
                                            </div>

                                            <div style={{paddingTop : '8px' , paddingLeft : '4px',paddingBottom : '8px', borderBottom : '1px solid #f8f8f8'}}>
                                            <MDBIcon style={{ paddingRight: '10px' , fontSize : '14px' , color : '#707070'  }} icon="adn" />
                                            <span className='titlevaluue'>{item.age} Years</span>
                                            </div>

                                            <div style={{paddingTop : '8px' , paddingLeft : '4px',paddingBottom : '8px', borderBottom : '1px solid #f8f8f8'}}>
                                            <MDBIcon style={{ paddingRight: '10px', fontSize : '14px' , color : '#707070'  }} icon="map-marker" />
                                            <span style={{textTransform : 'capitalize'}} className='titlevaluue'>{item.city}, {item.country}</span>
                                            </div>

                                            <div style={{paddingTop : '8px' , paddingLeft : '4px',paddingBottom : '8px', borderBottom : '1px solid #f8f8f8'}}>
                                            <MDBIcon style={{ paddingRight: '10px' ,  fontSize : '14px' , color : '#707070'   }} icon="transgender" />
                                            <span style={{textTransform : 'capitalize'}} className='titlevaluue'>{item.gender}</span>
                                            </div>

                                            <div style={{paddingTop : '8px' , paddingLeft : '4px', paddingBottom : '8px'}}>
                                            <MDBIcon style={{ paddingRight: '10px', fontSize : '14px' , color : '#707070'  }} icon="phone" />
                                            <span  className='titlevaluue'>{item.phone}</span>
                                            </div>
                                           
                                           
                                        </div>}
                                    </div>

                                </Col>
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
                    <HeaderComponent title={'All Classes'} />
                    <div className='content' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Row noGutters className='classcard-row'>
                            <Col md={{ span: 8, offset: 2 }} xs={12}>
                                <div className='classcard' style={{ display: 'flex', justifyContent: 'center', alignItems: 'çenter' }}>
                                    <div className='text-center'>
                                        <h4 style={{ margin: '0' }}>No users.</h4>
                                        <h4 style={{ marginTop: '20px', marginBottom: '20px' }}>OR</h4>
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

export default Allusers;
