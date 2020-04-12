import React from 'react';
import { string } from 'prop-types';
import { Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import IconSearch from '../icons/icon-search';
import IconBellNew from '../icons/icon-bell-new';
import { MDBInput } from 'mdbreact';
import { withRouter } from "react-router";

const styles = StyleSheet.create({
    avatar: {
        height: 35,
        width: 35,
        borderRadius: 50,
        marginLeft: 14,
        border: '1px solid #363740',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: 600,
        background: '#363740',
        color: '#fff',
        textTransform: 'Capitalize',
        paddingTop: '2px',
    },
    container: {
        height: 40
    },
    cursorPointer: {
        cursor: 'pointer'
    },
    name: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: 14,
        lineHeight: '20px',
        textAlign: 'right',
        letterSpacing: 0.2,
        '@media (max-width: 768px)': {
            display: 'none'
        }
    },
    separator: {
        borderLeft: '1px solid #DFE0EB',
        marginLeft: 32,
        marginRight: 32,
        height: 32,
        width: 2,
        '@media (max-width: 768px)': {
            marginLeft: 12,
            marginRight: 12
        }
    },
    title: {
        fontFamily: 'Muli',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: '30px',
        letterSpacing: 0.3,
        '@media (max-width: 768px)': {
            marginLeft: 36
        },
        '@media (max-width: 468px)': {
            fontSize: 20
        }
    },
    iconStyles: {
        cursor: 'pointer',
        marginLeft: 25,
        '@media (max-width: 768px)': {
            marginLeft: 12
        }
    }
});

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            logout: false

        }
    }
    search = () => {

    }
    handlesearch = (e) => {
        this.setState({ search: e.target.value })
        this.props.onSelectSearch(e.target.value);
    }
    search = () => {
        console.log('clickeddd.')
        this.props.onsearchClick(true);
        this.setState({ search: '' })
    }
    logout = (logout) => {
        console.log('logout--->', logout)
        if (logout === 'client') {
            localStorage.clear()
            console.log('this.props.history.index=0', this.props.history)
            this.props.history.push('/')
        }

        if(logout === 'admin'){
            localStorage.clear()
            console.log('this.props.history.index=0', this.props.history)
            this.props.history.push('/administrator')
        }
    }
    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
        if (this.node.contains(e.target)) {
            this.setState({ logout: true })
            return;
        }
        this.setState({ logout: false })
    }
    render() {
        const { icon, title, showsearch, clientname, headimg, logout, ...otherProps } = this.props;

        return (
            <Row className={css(styles.container)} vertical="center" horizontal="space-between" >
                <span className={css(styles.title)}>{title}</span>
                {showsearch === 'showsearch' && <div style={{ width: '100%', marginLeft: '20px' }}>
                    <input className='search' placeholder="Search Q/A..."
                        onChange={this.handlesearch} value={this.state.search} />
                </div>}
                <Row vertical="center">
                    {showsearch === 'showsearch' && <div onClick={this.search} className={css(styles.iconStyles)}>
                        <IconSearch />
                    </div>}
                    <div className={css(styles.separator)}></div>
                    <Row vertical="center" >
                        <span className={css(styles.name, styles.cursorPointer)}>{clientname.length > 0 ? clientname : 'Administrator'}</span>
                        <div ref={node => this.node = node} className='avatar' >
                            <span className={css(styles.avatar, styles.cursorPointer)}>{headimg === '%admin%' ? 'A' : headimg}</span>
                            {this.state.logout && <span onClick={() => this.logout(logout)} className='logoutmodal'><i style={{ paddingRight: '5px' }} className="fas fa-unlock"></i> Logout</span>}

                        </div>
                    </Row>

                </Row>
            </Row>
        );
    }
}



// function HeaderComponent(props) {
//     const { icon, title, showsearch, ...otherProps } = props;
//     console.log(showsearch, 'showsearch--->')
//     return (
//         <Row className={css(styles.container)} vertical="center" horizontal="space-between" {...otherProps}>
//             <span className={css(styles.title)}>{title}</span>
//             {showsearch === 'showsearch' && <div>

//             </div>}
//             <Row vertical="center">
//                 {showsearch === 'showsearch' && <div className={css(styles.iconStyles)}>
//                     <IconSearch />
//                 </div>}
//                 <div className={css(styles.separator)}></div>
//                 <Row vertical="center">
//                     <span className={css(styles.name, styles.cursorPointer)}>Administrator</span>
//                     <img src="https://avatars3.githubusercontent.com/u/21162888?s=460&v=4" alt="avatar" className={css(styles.avatar, styles.cursorPointer)} />
//                 </Row>
//             </Row>
//         </Row>
//     );
// }

// HeaderComponent.propTypes = {
//     title: string
// };

export default withRouter(HeaderComponent);
