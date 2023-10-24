import { useForm, SubmitHandler } from 'react-hook-form'
import style from './add-update-user.module.scss'
import { User, UserWithoutPassword } from '../../../types/global';
import { Role, roles } from '../../../utilities/roles';
import { API_URL } from '../../../utilities/backend-api';
import { getToken } from '../../../utilities/authToken';
import { useAuth } from '../../../utilities/Auth';
import { LoggedIn } from '../../common/context-provider';
import { useState } from 'react';

export default function AddUser({ setAddBtn, setUsersList }: any) {
    const { updateLoggedIn, authenticatedUser } = useAuth();
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<User>()

    const onSubmit: SubmitHandler<User> = async (userInfo) => {

        userInfo.role = userInfo.role || Role.USER

        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': getToken()
            },
            body: JSON.stringify(userInfo) 
        })
        
        
        if (response.status === 201) {
            const newUser = await response.json();
            setUsersList((usersList: UserWithoutPassword[]) => {
                return [...usersList, newUser]
            })
            setAddBtn(false)
        }
    
        else if (response.status === 403) {
            console.log(response.status)
            updateLoggedIn(LoggedIn.FALSE);
        }
    
        else if (response.status === 409) {
            setIsEmailAvailable(false)
        }
    

    }

    return (
        <>
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setAddBtn(false)}>X</span>
                    <h1>Add User</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='firstName'>First Name</label>
                            <input className={style.inpt} id='firstName' {...register("firstName", {required: true})} />
                            {errors.firstName && <span className={style.fieldError}>First Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='lastName'>Last Name</label>
                            <input className={style.inpt} id='lastName' {...register("lastName", {required: true})} />
                            {errors.lastName && <span className={style.fieldError}>Last Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='email'>Email</label>
                            <input className={style.inpt} id='email' {...register("email", {required: true, pattern: /^[A-Za-z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$$/})} />
                            {errors.email?.type == 'required' && <span className={style.fieldError}>Email is required</span>}
                            {errors.email?.type == 'pattern' && <span className={style.fieldError}>The Email is not valid</span>}
                            {!isEmailAvailable && <span className={style.fieldError}>This Email isn't available</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='password'>Password</label>
                            <input className={style.inpt} id='password' {...register("password", {required: true, minLength: 8})} />
                            {errors.password?.type == 'required' && <span className={style.fieldError}>Password is required</span>}
                            {errors.password?.type == 'minLength' && <span className={style.fieldError}>Must be consist of atleast 8 characters</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='role'>Role</label>
                            {(authenticatedUser?.role === Role.SUPER_ADMIN &&
                                <select id="role" {...register('role')}>
                                    <option value="" disabled>
                                        Please select one option
                                    </option>
                                    {roles.map((role, index) =>
                                        <option key={index} value={role}>{role}</option> 
                                    )}
                                </select>
                            ) || <span>{Role.USER}</span> }
                        </span>
                        
                        <span className={style.boxBtn}>
                            <input type="submit" value="add user" />
                        </span>
                    </form>
                </div>
            </div>
        </>
    )
}