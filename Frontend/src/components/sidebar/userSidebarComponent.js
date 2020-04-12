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
            <>
           {this.props.isdisplay && <div style={{ position: 'relative' }} className='userSideBar'>
                <Row className={css(styles.mainContainer)} breakpoints={{ 768: css(styles.mainContainerMobile, expanded && styles.mainContainerExpanded) }}>
                    {(isMobile && !expanded) && this.renderBurger()}
                    <Column className={css(styles.container)} breakpoints={{ 768: css(styles.containerMobile, expanded ? styles.show : styles.hide) }}>
                        <LogoComponent />
                        <Column className={css(styles.menuItemList)}>
                            <Link style={{ textDecoration: 'none' }} to='/userdashboard/overview'>
                                <MenuItemComponent
                                    title="Performance" icon={IconOverview}
                                    onClick={() => this.onItemClicked('Performance')}
                                    active={this.props.selectedItem === 'Performance'}
                                />
                            </Link>

                            <Link style={{ textDecoration: 'none' }} to='/userdashboard/practise'>
                                <MenuItemComponent
                                    title="Practise" icon={IconArticles}
                                    onClick={() => this.onItemClicked('Practise')}
                                    active={this.props.selectedItem === 'Practise'}
                                />
                            </Link>

                            <Link style={{ textDecoration: 'none' }} to='/userdashboard/taketest'>
                                <MenuItemComponent
                                    title="Take Test" icon={IconTickets}
                                    onClick={() => this.onItemClicked('Take Test')}
                                    active={this.props.selectedItem === 'Take Test'}
                                />
                            </Link>
                            <Link to='/userdashboard/bookmark' style={{ textDecoration: 'none' }}>
                                <MenuItemComponent
                                    title="Bookmarks" icon={IconIdeas}
                                    onClick={() => this.onItemClicked('Bookmarks')}
                                    active={this.props.selectedItem === 'Bookmarks'} />
                            </Link>
                            <Link to='/userdashboard/profile' style={{ textDecoration: 'none' }}>
                                <MenuItemComponent
                                    title="My Profile" icon={IconIdeas}
                                    onClick={() => this.onItemClicked('My Profile')}
                                    active={this.props.selectedItem === 'My Profile'} />
                            </Link>
                        </Column>
                    </Column>
                    {isMobile && expanded && <div className={css(styles.outsideLayer)} onClick={this.toggleMenu}></div>}
                </Row>
            </div>}
            </>
        );
    };
}

export default SidebarComponent;
