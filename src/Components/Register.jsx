import axios from 'axios';
import Joi from 'joi';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    let [user, setUser] = useState({
        first_name: "",
        last_name: "",
        age: "",
        email: "",
        password: ""
    });

    let [errorMsg, setErrorMsg] = useState('');

    let [errors, setErrors] = useState([]);

    let [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function goToLogin() {
        navigate('/login');
    }

    function validateForm() {
        const schema = Joi.object({
            first_name: Joi.string().alphanum().min(3).max(10).required(),
            last_name: Joi.string().alphanum().min(3).max(10).required(),
            age: Joi.number().min(18).max(75).required(),
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
            let { data } = await axios.post(`https://route-movies-api.vercel.app/signup`, user);
            if (data.message === "success") {
                goToLogin();
            }
            else {
                // console.log(data.message);
                setErrorMsg(data.message.split(" ").splice(4, 20).join(" "));
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
                        Registration Form
                    </h1>
                    <form onSubmit={submitFormData}>
                        <div className="inp-gp my-4">
                            <label htmlFor="first_name">First Name:</label>
                            <input onChange={getFormValue} type="text" name='first_name' className='form-control my-2' id='first_name' />
                            {currError("first_name").length === 0 ? '' : <div className="text-danger">{currError("first_name")}</div>
                            }
                        </div>
                        <div className="inp-gp my-4">
                            <label htmlFor="last_name">Last Name:</label>
                            <input onChange={getFormValue} type="text" name='last_name' className='form-control my-2' id='last_name' />
                            {currError("last_name").length === 0 ? '' : <div className="text-danger">{currError("last_name")}</div>
                            }
                        </div>
                        <div className="inp-gp my-4">
                            <label htmlFor="age">Age:</label>
                            <input onChange={getFormValue} type="number" name='age' className='form-control my-2' id='age' />
                            {currError("age").length === 0 ? '' : <div className="text-danger">{currError("age")}</div>
                            }
                        </div>
                        <div className="inp-gp my-4">
                            <label htmlFor="email">Email:</label>
                            <input onChange={getFormValue} type="email" name='email' className='form-control my-2' id='email' />
                            {currError("email").length === 0 ? '' : <div className="text-danger">{currError("email")}</div>
                            }
                            {errorMsg ? <div className="text-danger">{errorMsg}</div> : " "}
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
                            {loading ? <i className='fas fa-spinner fa-spin'></i> : "Register"}
                        </button>
                        <p className='d-flex justify-content-center mt-3'>
                            <span>
                                You have an account?
                            </span>
                            <span>

                                <Link className="nav-link mx-2 text-info" to="/login">Login</Link>
                            </span>
                        </p>
                        {/* <div className="clr"></div> */}
                    </form>
                </div>
            </div>
        </>
    )
}
