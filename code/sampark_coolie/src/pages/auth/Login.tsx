import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import { getCookie } from '../../utils/cookies';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { login } from '../../services/auth';
import { useForm } from 'react-hook-form';
import { Header } from '../../components/header/Header';
import { useNavigate } from 'react-router-dom'
import configs from '../../configs/apiConfigs';
export const Login = () => {
    const history = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    useEffect(() => {
        const login = getCookie();
        if (login) {
            history('/booknow');
        }
    }, []);

    const onClickLogin = (data: any) => {
        let request = {
            mobile: data.mobile,
            password: data.password,
            remember_token: true
        }
        login(request).then((success) => {
            if (success && success.status === true && success.errorcode === 200 && success.response) {
                Cookie.set('coolie_cookie', json, { expires: 30 });
                Cookie.remove('coolie_cookie'); Cookie.remove('coolie_cookie', { domain: configs.COOKIE_DOMAIN });
                const key1 = 'id';
                const key2 = 'name';
                const key3 = 'email';
                const key4 = 'mobile';
                const key5 = 'encryptedId';
                var json: any = {};
                json[key1] = success.response.id;
                json[key2] = success.response.first + " " + success.response.last;
                json[key3] = success.response.email;
                json[key4] = success.response.mobile;
                json[key5] = success.response.encrypted_id;
                Cookie.set('coolie_cookie', json, { expires: 30 });
                Cookie.set('coolie_cookie', json, { domain: configs.COOKIE_DOMAIN, url: '/', expires: 30 });
                history('/booknow');
            } else if (success && success.status === false && success.errorcode === 200 && success.message) {
                setLoginErrorMessage(success.message);
            }

        }).catch((error) => {
            console.log('login_error', error);
        })
    }
    return (
        <>
            <section id="loginPage">
                <div className="loginCont">
                    <div>
                        <div className="login-logo">
                            <img src={require("../../assets/images/logo.svg").default} />
                        </div>
                        <div className="login-form">
                            <label>
                                <span className="contryCode">
                                    <select>
                                        <option>+ 91</option>
                                        <option>+ 11</option>
                                        <option>+ 11</option>
                                        <option>+ 01</option>
                                    </select>
                                </span>
                                <input type="tel" autoComplete="off" placeholder="Mobile number"
                                    {...register('mobile', {
                                        required: true, minLength: 10, maxLength: 10,
                                        pattern: /^[0-9]+$/,
                                    })} />
                                {
                                    (errors && errors.mobile && errors.mobile.type === 'required') &&
                                    <span className='text-danger'>Mobile number is required.</span>
                                }
                                {
                                    (errors && errors.mobile && (errors.mobile.type === 'pattern' || errors.mobile.type === "minLength" || errors.mobile.type === "maxLength")) &&
                                    <span className='text-danger'>Mobile number is invalid.</span>
                                }
                                <div></div>
                            </label>

                            <label><input type="password" id="pwd" placeholder="password"
                                {...register('password', {
                                    required: true
                                })}
                            />
                                {
                                    (errors && errors.password && errors.password.type === 'required') &&
                                    <span className='text-danger'>Password is required.</span>
                                }
                            </label>
                            <div>{loginErrorMessage && loginErrorMessage}</div>

                            <label> <button className="loginBtn" onClick={handleSubmit(onClickLogin)}>Login</button></label>

                            <label>login using <a href="">OTP</a></label>
                        </div>

                        <div className="orline">
                            <p>or</p>
                        </div>

                        <div className="socialLink">
                            <a href="" className="socialBtn" >
                                <i><img src={require("../../assets/images/google.png")} /></i>
                                <span>Login With Gmail</span>
                            </a>

                            <a href="" className="socialBtn fbBtn">
                                <i><img src={require("../../assets/images/fb.png")} /></i>
                                <span>Login With Facebook</span>
                            </a>
                        </div>

                        <div className="guestLink">
                            <a href="">Continue as a Guest</a>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
