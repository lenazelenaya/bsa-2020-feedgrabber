import React from "react";
import { Menu, Icon, Image, Header as HeaderUI, Button, Dropdown } from "semantic-ui-react";
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Header = ({ user }) => {
    const history = useHistory();
    return (
        <Menu secondary>
            <Menu.Item onClick={() => history.push('/')}>
                <HeaderUI>
                    <Image circular src="https://img.icons8.com/cotton/64/000000/chat.png" />
                    {' '}
                    <span>Feedgrabber</span>
                </HeaderUI>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item name="horizontally" fitted="horizontally">
                    <Button basic icon type="button" className={`${styles.menuBtn} ${styles.logoutBtn}`}>
                        <Icon name="bell" size="large" />
                    </Button>
                </Menu.Item>
                <Menu.Item name="horizontally" fitted="horizontally">
                    <Dropdown
                        icon={null}
                        pointing='top right'
                        trigger={<Image avatar
                                        src={user.avatar}
                                        className={styles.headerUserDropDown}/>}
                                        size="medium">
                        <Dropdown.Menu>
                            <Dropdown.Header>{user.username}</Dropdown.Header>
                            <Dropdown.Item onClick={() => history.push('/profile')}>
                                Your Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push('/requests')}>
                                Your Requests
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push('/profile/settings')}>
                                Your Settings
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => history.push('/help')}>
                                Help Center
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item name="horizontally" fitted="horizontally">
                    <Button basic icon type="button"
                            className={`${styles.menuBtn} ${styles.logoutBtn}`}
                            onClick={() => history.push('/login')}>
                        <Icon name="log out" size="large" />
                    </Button>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};

Header.propTypes = {
    user: PropTypes.objectOf(PropTypes.any)
};
Header.defaultProps = {
    user: { username: "User", avatar: "https://img.icons8.com/cotton/64/000000/chat.png"}
};
export default Header;