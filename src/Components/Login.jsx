import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

export default function Login(props) {
    let [user, setUser] = useState({
        email: "",
        password: ""
    });

    let [errorMsg, setErrorMsg] = useState('');

    let [errors, setErrors] = useState([]);

    let [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function goToHome() {
        navigate('/home');
    }

    function validateForm() {
        const schema = Joi.object({
            email: Joi.string().required().email({ tlds: { allow: ['net', 'com'] } }),
            password: Joi.string().required().pattern(new RegExp(/^[a-z][0-9]{3,7}$/)),

        });
        return schema.validate(user, { abortEarly: false });
    }

    async function submitFormData(e) {
        e.preventDefault();
        setLoading(true);
        let validateResponse = validateForm();
        if (validateResponse.error) {
            // console.log(validateResponse.error.details);
            setErrors(validateResponse.error.details);
        } else {
            let { data } = await axios.post(`https://route-movies-api.vercel.app/signin`, user);
            if (data.message === "success") {
                localStorage.setItem("userToken", data.token);
                props.saveUserData();
                goToHome();
            }
            else {
                // console.log(data.message);
                setErrorMsg(data.message);
            }
        }
        setLoading(false);
    }

    function getFormValue(e) {
        let myUser = { ...user }; //deep copy
        myUser[e.target.name] = e.target.value;
        setErrorMsg('');
        setErrors([]);
        setUser(myUser);
        // console.log(myUser);
    }

    function currError(key) {
        for (const err of errors) {
            if (err.context.key === key) {
                // console.log(err.message)
                return err.message;
            }
        }
        return '';
    }

    return (
        <>
        <div className="container">
                        <div className="register w-75 m-auto pt-5">
                <h1>
                    Login Form
                </h1>
                {errorMsg ? <div className="text-danger mt-4">{errorMsg}</div> : " "}
                <form onSubmit={submitFormData}>
                    <div className="inp-gp my-4">
                        <label htmlFor="email">Email:</label>
                        <input onChange={getFormValue} type="email" name='email' className='form-control my-2' id='email' />
                        {currError("email").length === 0 ? '' : <div className="text-danger">{currError("email")}</div>
                        }
                    </div>
                    <div className="inp-gp my-4">
                        <label htmlFor="password">Password:</label>
                        <input onChange={getFormValue} type="password" name='password' className='form-control my-2' id='password' />
                        {currError("password").length === 0 ? '' :
                            <div className="text-danger">
                                <p>password must contain letters and numbers like "d123"</p>
                            </div>
                        }
                    </div>
                    <button className='btn btn-info'>
                        {loading ? <i className='fas fa-spinner fa-spin'></i> : "Login"}
                    </button>
                    <p className='d-flex justify-content-center my-3'>
                        <span>
                            Don't have an account?
                        </span>
                        <span>
                            <Link className="nav-link mx-2 text-info" to="/register">Register</Link>
                        </span>
                    </p>

                </form>
            </div>
        </div>

        </>
    )
}
