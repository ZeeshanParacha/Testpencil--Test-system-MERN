import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import SidebarComponent from '../components/sidebar/userSidebarComponent';
import { Route, Switch, withRouter } from "react-router";
import Myperformance from '../components/performance'
import ClientPractise from '../components/practise';
import Taketest from '../components/taketest';
import Bookmark from '../components/bookmarks'
import Myprofile from '../components/clientprofile'



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

class usersidebar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedItem: '',
            handlesidebar: true
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

    handlesidebar = (event) => {
        console.log('event--->', event)
        this.setState({ handlesidebar: event })
    }
    resize = () => this.forceUpdate();

    render() {
        const { selectedItem, handlesidebar } = this.state;
        return (
            <Row className={css(styles.container)}>
                <SidebarComponent isdisplay={handlesidebar} selectedItem={selectedItem} onChange={(selectedItem) => this.setState({ selectedItem })} />
                <Column flexGrow={1} className={css(styles.mainBlock)}>
                    <div className={css(styles.content)}>
                        <Switch>
                            <Route path='/userdashboard/overview'>
                                <Myperformance />
                            </Route>
                            <Route path="/userdashboard/practise">
                                <ClientPractise sidebardisplay={this.handlesidebar} />
                            </Route>
                            <Route path="/userdashboard/taketest">
                                <Taketest sidebardisplay2={this.handlesidebar} />
                            </Route>

                            <Route path='/userdashboard/bookmark'>
                                <Bookmark />
                            </Route>

                            <Route path='/userdashboard/profile'>
                                <Myprofile />
                            </Route>
                        </Switch>
                    </div>
                </Column>
            </Row>
        );
    }
}

export default withRouter(usersidebar);
