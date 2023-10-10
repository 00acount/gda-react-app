import { SubmitHandler, useForm } from 'react-hook-form'
import style from './login.module.scss'
import { useEffect } from 'react'
import { getCookie } from '../../utilities/getCookie'
import { useAuth } from '../../utilities/Auth'
import { API_URL } from '../../utilities/backend-api'

type Login = {
    email: string
    password: string
}

export default function Login() {
    const { updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState : { errors }
    } = useForm<Login>();
    
    useEffect(() => {
        (async () =>  await fetch(`${API_URL}/refresh-xsrf`))(); 
    }, []);

    const onSubmit:SubmitHandler<Login> = async (userInfo) => {

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                'content-type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            body: JSON.stringify(userInfo)
        })
        
        if (response.ok) {
            updateLoggedIn(true);
        }
    }
    
    return (
        <div className={style.container}>
            <div className={style.formBox}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <span className={style.boxFields}>
                        <input className={style.inpt} placeholder='Email' id='email' {...register("email", {required: true, pattern: /^[A-Za-z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$$/})} />
                        {errors.email?.type == 'required' && <span className={style.fieldError}>Email is required</span>}
                        {errors.email?.type == 'pattern' && <span className={style.fieldError}>The Email is not valid</span>}
                    </span>
                    <span className={style.boxFields}>
                        <input className={style.inpt} placeholder='Password' id='password' {...register("password", {required: true, minLength: 8})} />
                        {errors.password?.type == 'required' && <span className={style.fieldError}>Password is required</span>}
                        {errors.password?.type == 'minLength' && <span className={style.fieldError}>Must be consist of atleast 8 characters</span>}
                    </span>
                    <span className={style.boxFields}>
                        <input type='submit' value="Login" />
                    </span>
                </form>
            </div>
        </div>
    )
}