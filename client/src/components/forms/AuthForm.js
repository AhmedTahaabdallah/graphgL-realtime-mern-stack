import React from "react";
import { Link } from "react-router-dom";

const AuthForm = props => {
    const { 
        formTitle, submitHandler, email, disableEmail,
        password, loading, buttonTitle, googleLogin, showForgotPassword
    } = props;
    return (
        <div className="container p-5">
            <h4>{formTitle}</h4>
            <form onSubmit={submitHandler}>
                {
                    email && <div className="form-group">
                        <label>Email Address</label>
                        <input 
                        type='email'
                        ref={email}
                        className='form-control'
                        placeholder="Enter Email"
                        disabled={loading || disableEmail}
                        />
                    </div>
                }
                {
                    password && <div className="form-group">
                        <label>Password</label>
                        <input 
                        type='password'
                        ref={password}
                        className='form-control'
                        placeholder="Enter Your Password"
                        disabled={loading}
                        autoComplete="on"
                        />
                    </div>
                }
                {
                    showForgotPassword && showForgotPassword === true &&
                    <Link
                    className="text-danger float-end mt-2"
                    to='/password/forgot'
                    >
                        Password Forgot
                    </Link>
                }
                <button
                className="btn btn-raised btn-primary  mt-2 mb-2"
                disabled={loading}
                >{loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                 : buttonTitle}</button>
                {
                    googleLogin && <button
                    type="button"
                    className="btn btn-raised btn-danger d-block"
                    disabled={loading}
                    onClick={googleLogin}
                    >Login With Google</button>
                }
            </form>
        </div>
    );
};

export default AuthForm;