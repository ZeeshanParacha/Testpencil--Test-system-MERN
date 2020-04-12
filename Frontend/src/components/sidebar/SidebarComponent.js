import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import LogoComponent from './LogoComponent';
import MenuItemComponent from './MenuItemComponent';
import IconOverview from '../icons/icon-overview.js';
import IconTickets from '../icons/icon-tickets.js';
import IconIdeas from '../icons/icon-ideas.js';
import IconContacts from '../icons/icon-contacts';
import IconAgents from '../icons/icon-agents.js';
import IconArticles from '../icons/icon-articles';
import IconSettings from '../icons/icon-settings';
import IconSubscription from '../icons/icon-subscription';
import IconBurger from '../icons/icon-burger';
import { Link, withRouter } from 'react-router-dom';


const styles = StyleSheet.create({
    burgerIcon: {
        cursor: 'pointer',
        position: 'absolute',
        left: 24,
        top: 34
    },
    container: {
        backgroundColor: '#363740',
        width: 255,
        paddingTop: 32,
        height: '100vh',
        overflow: 'auto'
    },
    containerMobile: {
        transition: 'left 0.5s, right 0.5s',
        position: 'absolute',
        width: 255,
        height: '100vh',
        zIndex: 901,
        overflow: "auto"
    },
    mainContainer: {
        height: '100%',
        minHeight: 'auto'
    },
    mainContainerMobile: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        minWidth: 'auto'
    },
    mainContainerExpanded: {
        width: '100%',
        minWidth: 'auto',
    },
    menuItemList: {
        marginTop: 52
    },
    outsideLayer: {
        position: 'absolute',
        width: '100vw',
        minWidth: 'auto',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,.50)',
        zIndex: 900
    },
    separator: {
        borderTop: '1px solid #DFE0EB',
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    },
    hide: {
        left: -255
    },
    show: {
        left: 0
    }
});

class SidebarComponent extends React.Component {

    state = { expanded: false };

    onItemClicked = (item) => {
        this.setState({ expanded: false });
        return this.props.onChange(item);
    }

    isMobile = () => window.innerWidth <= 768;

    toggleMenu = () => this.setState(prevState => ({ expanded: !prevState.expanded }));

    renderBurger = () => {
        return <div onClick={this.toggleMenu} className={css(styles.burgerIcon)}>
            <IconBurger />
        </div>
    }

    render() {
        const { expanded } = this.state;
        const isMobile = this.isMobile();
        return (
            <div style={{ position: 'relative' }}>
                <Row className={css(styles.mainContainer)} breakpoints={{ 768: css(styles.mainContainerMobile, expanded && styles.mainContainerExpanded) }}>
                    {(isMobile && !expanded) && this.renderBurger()}
                    <Column className={css(styles.container)} breakpoints={{ 768: css(styles.containerMobile, expanded ? styles.show : styles.hide) }}>
                        <LogoComponent />
                        <Column className={css(styles.menuItemList)}>
                            <Link style={{ textDecoration: 'none' }} to='/admindashboard/overview'>
                                <MenuItemComponent
                                    title="Overview" icon={IconOverview}
                                    onClick={() => this.onItemClicked('overview')}
                                    active={this.props.selectedItem === 'overview'}
                                />
                            </Link>

                            <Link style={{ textDecoration: 'none' }} to='/admindashboard/createclass'>
                                <MenuItemComponent
                                    title="Create Class" icon={IconArticles}
                                    onClick={() => this.onItemClicked('Create Class')}
                                    active={this.props.selectedItem === 'Create Class'}
                                />
                            </Link>

                            <Link style={{ textDecoration: 'none' }} to='/admindashboard/addquestions'>
                                <MenuItemComponent
                                    title="Add Questions" icon={IconTickets}
                                    onClick={() => this.onItemClicked('Add Questions')}
                                    active={this.props.selectedItem === 'Add Questions'}
                                />
                            </Link>
                            <Link to='/admindashboard/userprofiles' style={{ textDecoration: 'none' }}>
                                <MenuItemComponent
                                    title="User Profiles" icon={IconIdeas}
                                    onClick={() => this.onItemClicked('User Profiles')}
                                    active={this.props.selectedItem === 'User Profiles'} />
                            </Link>

                            <Link to='/admindashboard/helpsection' style={{ textDecoration: 'none' }}>
                                <MenuItemComponent
                                    title="Help Section" icon={IconAgents}
                                    onClick={() => this.onItemClicked('Help Section')}
                                    active={this.props.selectedItem === 'Help Section'} />
                            </Link>
                            {/* <Link to='/admindashboard/practise' style={{ textDecoration: 'none' }}>
                                <MenuItemComponent
                                    title="Practise Q/A" icon={IconArticles}
                                    onClick={() => this.onItemClicked('Practise Q/A')}
                                    active={this.props.selectedItem === 'Practise Q/A'} />
                            </Link> */}
                            <div className={css(styles.separator)}></div>
                            <Link style={{ textDecoration: 'none' }} to='/admindashboard/allclasses'>
                                <MenuItemComponent
                                    title="All Classes" icon={IconTickets}
                                    onClick={() => this.onItemClicked('All Classes')}
                                    active={this.props.selectedItem === 'All Classes'}
                                />
                            </Link>
                            
                        </Column>
                    </Column>
                    {isMobile && expanded && <div className={css(styles.outsideLayer)} onClick={this.toggleMenu}></div>}
                </Row>
            </div>
        );
    };
}

export default SidebarComponent;
