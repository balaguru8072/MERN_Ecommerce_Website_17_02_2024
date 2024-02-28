import React from 'react';
import Search from "./Search";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image } from "react-bootstrap"; // Import Dropdown and Image from react-bootstrap
import { logout } from '../../actions/userActions'; // Make sure you import the logout action

export default function Header() {

    const { isAuthenticated, user, logoutFail } = useSelector(state => state.authState);
    console.log(logoutFail)
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout());
    }
    const navigate = useNavigate()

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3">
                <div className="navbar-brand">
                    <Link to="/">
                        <img width="150px" alt='logo loading' src="/images/logo.png" />
                    </Link>
                </div>
            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0">
                {/* Assuming Search component is imported and used correctly */}
                <Search />
            </div>


            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                {isAuthenticated && user ? (
                    <Dropdown className='d-inline'>
                        <Dropdown.Toggle variant='default text-white pr-5' id='dropdown-basic'>
                            <figure className='avatar avatar-nav'>
                                <Image width="50px" src={user.avatar || './images/default_avatar.png'} />
                            </figure>
                            <span>{user.name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* Uncomment below lines if you want to show Dashboard, Profile, and Orders links */}
                            {/* { user.role === 'admin' && <Dropdown.Item onClick={() => {navigate('admin/dashboard')}} className='text-dark'>Dashboard</Dropdown.Item> }
                <Dropdown.Item onClick={() => {navigate('/orders')}} className='text-dark'>Orders</Dropdown.Item> */}
                            <Dropdown.Item onClick={() => { navigate('/myprofile') }} className='text-dark'>Profile</Dropdown.Item>
                            <Dropdown.Item onClick={logoutHandler} className='text-danger'>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <Link to="/login" className="btn" id="login_btn">Login</Link>
                )}
                <Link to="/cart" className="ml-3">Cart</Link>
                {/* Uncomment below line if you want to display the count of cart items */}
                {/* <span className="ml-1" id="cart_count">{cartItems.length}</span> */}
            </div>
        </nav>
    )
}