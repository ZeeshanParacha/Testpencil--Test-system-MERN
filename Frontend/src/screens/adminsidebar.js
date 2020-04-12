import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import SidebarComponent from '../components/sidebar/SidebarComponent';
import CreateClass from '../components/admin/Createclass'
import AddQuestions from '../components/admin/AddQuestions'
import { Route, Switch, withRouter } from "react-router";
import AllClasses from '../components/admin/allClasses'
import SingleClass from '../components/admin/specificClass'
import Allusers from '../components/admin/Usersprofiles'
import HelpSection from '../components/admin/helpsection'
import Overview from '../components/admin/overview'
import PractiseQA from '../components/admin/practiseQA'

import '../App.css';

const styles = StyleSheet.create({
    container: {
        height: '100%',
        height: '100vh'
    },
    content: {
        height: '100%'
    },
    mainBlock: {
        backgroundColor: '#F7F8FC',
        padding: 30,
        width: '100%',
        overflow: 'auto',

    }
});

class sidebar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedItem: ''
        }
    }


    componentDidMount() {
        window.addEventListener('resize', this.resize);
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function (event) {
            window.history.pushState(null, document.title, window.location.href);
        });
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = () => this.forceUpdate();

    render() {
        const { selectedItem } = this.state;
        return (
            <Row className={css(styles.container)}>
                <SidebarComponent selectedItem={selectedItem} onChange={(selectedItem) => this.setState({ selectedItem })} />
                <Column flexGrow={1} className={css(styles.mainBlock)}>
                    <div className={css(styles.content)}>
                        <Switch>
                            <Route path="/admindashboard/createclass">
                                <CreateClass />
                            </Route>
                            <Route path="/admindashboard/addquestions">
                                <AddQuestions />
                            </Route>

                            <Route path='/admindashboard/allclasses'>
                                <AllClasses />
                            </Route>

                            <Route path='/admindashboard/userprofiles'>
                                <Allusers />
                            </Route>

                            <Route path='/admindashboard/singleclass/:class' component={SingleClass}>
                            </Route>
                            <Route path='/admindashboard/helpsection'>
                                <HelpSection />
                            </Route>
                            <Route path='/admindashboard/overview'>
                                <Overview />
                            </Route>
                            <Route path='/admindashboard/practise'>
                                <PractiseQA />
                            </Route>
                        </Switch>
                    </div>
                </Column>
            </Row>
        );
    }
}

export default withRouter(sidebar);
