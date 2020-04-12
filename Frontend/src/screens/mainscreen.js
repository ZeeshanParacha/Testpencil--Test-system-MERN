import React, { Component } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Typewriter from 'typewriter-effect';
import Container from 'react-bootstrap/Container'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Link } from 'react-router-dom';

// import Accordion from 'react-bootstrap/Accordion'
// import Card from 'react-bootstrap/Card'
// import Button from 'react-bootstrap/Button'

const GifPlayer = require('react-gif-player');

class Home extends Component {
  constructor() {
    super()

    this.search = this.search.bind(this);
    this.myDivToFocus = React.createRef()
  }


  search() {

  }

  render() {
    return (
      <div id='main'>
        <div id='Herosection'>
          <Row noGutters>
            <Col xs={12} md={6}>
              <div className='innerheading'>
                <Typewriter
                  options={{
                    strings: ['Better learning...', 'For better results!!!'],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </div>

            </Col>
            <Col xs={12} md={6}>
              <div className='innerimage'>
                <img
                  className=" w-100"
                  src="./images/muzli.jpg"
                  alt="Third slide"
                />
              </div>
            </Col>
          </Row>
        </div>

        <div id='subsection'>
          <h1>Get better results with India's only complete learning app</h1>
          <Row className='row display-flex'>
            <Col md={3} xs={12}>
              <div id='thumbnailsection'>
                <img src='https://static-cf.toppr.com/marketing/ed0328e/images/home/Doubts.svg' alt='doubts' />
                <h1>Doubts</h1>
                <p>Chat with tutors and get your doubts resolved instantly, 24x7</p>
              </div>
            </Col>

            <Col md={3} xs={12}>
              <div id='thumbnailsection'>
                <img src='https://static-cf.toppr.com/marketing/ed0328e/images/home/Maths.svg' alt='doubts' />
                <h1>Help</h1>
                <p>Be exam ready by solving all India tests and previous years’ papers
                </p>
              </div>
            </Col>

            <Col md={3} xs={12}>
              <div id='thumbnailsection'>
                <img src='https://static-cf.toppr.com/marketing/ed0328e/images/home/practise.svg' alt='doubts' />
                <h1>Adaptive Practise</h1>
                <p>Practice smart with questions created for your unique needs</p>
              </div>
            </Col>

            <Col md={3} xs={12}>
              <div id='thumbnailsection'>
                <img src='https://static-cf.toppr.com/marketing/ed0328e/images/home/learn.svg' alt='doubts' />
                <h1>Video Quiz</h1>
                <p>Learn for free with short videos and live classNameNamees</p>
              </div>
            </Col>
          </Row>
        </div>

        <div ref={this.props.ref1} id='aboutus'>
          <Row noGutters>
            <Col xs={12} md={6} className='aboutussection'>
              <h1 id='ourphilosophy'>Our philosophy</h1>

              <div className='aboutussubsections'>
                <h1>Proven learning approaches</h1>
                <p>Teaching is one of the most challenging and complex jobs on the planet. Our digital resources, tools, and learning materials are developed by educational experts to incorporate leading pedagogical practices. They are useful in any type of teaching moment and many can be used to support national education standards.</p>
              </div>

              <div className='aboutussubsections'>
                <h1>Empowered educators</h1>
                <p>From school teachers and tutors to home schoolers and parents, engaged adults are the key to unlocking each child's potential and drive to learn. We empower all kinds of educators to teach kids by providing the best educational resources in any form or device to be used at home, at school, and everywhere in-between.</p>
              </div>

              <div className='aboutussubsections'>
                <h1>Unique experiences</h1>
                <p>There is no such thing as "one size fits all" in education; each educator and child has unique challenges and goals. We celebrate the diversity of our users by offering differentiated resources that can meet a wide range of educational needs - and raise kids' confidence in learning.</p>
              </div>

              <div className='aboutussubsections'>
                <h1>Conscientious and supportive</h1>
                <p>We continue to provide academically sound content of the highest caliber and welcome input from our users as we address issues of equity, diversity, inclusivity and representation. Since we know there are many different approaches to teaching and education, we develop our materials to complement these different philosophies across subjects and grades.</p>
              </div>


            </Col>
            <Col xs={12} md={6} className='gif'>

              <GifPlayer
                gif='https://miro.medium.com/max/675/0*sz4BZQDzxVzXJ5mq.gif'
                autoplay={true}
                className="responsiveImage"
              />

            </Col>

          </Row>
        </div>

        <section className="testimonial">
          <Container>
            <Col xs={12} md={{ span: 6, offset: 3 }} className="text-center">
              <OwlCarousel
                className="owl-theme"
                loop={true}
                autoplay={true}
                margin={10}
                nav
                items={1}
              >
                <div className="item">
                  <h1>Find Out What Our Clients Say</h1>
                  <img

                    src="./images/testi-1.png"
                    alt="Third slide"
                  />
                  <p> “Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”</p>
                </div>
                <div className="item">
                  <h1>Find Out What Our Clients Say</h1>

                  <img
                    src="./images/testi-1.png"
                    alt="Third slide"
                  />
                  <p> “Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”</p>
                </div>
                <div className="item">
                  <h1>Find Out What Our Clients Say</h1>

                  <img

                    src="./images/testi-1.png"
                    alt="Third slide"

                  />
                  <p> “Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”</p>
                </div>
              </OwlCarousel>
            </Col>
          </Container>
        </section>

        <section id="footer">
          <Container>
            <Row>
              <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">

              </div>
              <hr />
            </Row>
            <Row>
              <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <Link to='/faq'>
                    <p style={{ display: 'inline-block', borderBottom: '1px outset', cursor: 'pointer' }}>Frequently asked questions (FAQ)</p>
                  </Link>
                </div>
                <ul className="list-unstyled list-inline social text-center">
                  <li className="list-inline-item"><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li className="list-inline-item"><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li className="list-inline-item"><a href="#"><i className="fa fa-instagram"></i></a></li>
                  <li className="list-inline-item"><a href="#"><i className="fa fa-google-plus"></i></a></li>
                  <li className="list-inline-item"><a href="#" target="_blank"><i className="fa fa-envelope"></i></a></li>
                </ul>
              </div>
              <hr />
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} className="mt-2 mt-sm-2 text-center">
                <p style={{ fontSize: '13px' }}><u></u> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p className="h6">&copy; All right Reversed.<a className="text-green ml-2" href="#" style={{ color: '#fa4c56', fontSize: '12px' }} target="_blank">Your company brand</a></p>
              </Col>
              <hr />
            </Row>
          </Container>
        </section >
      </div >

    )
  }

}

export default Home;