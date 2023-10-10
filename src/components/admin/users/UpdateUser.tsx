import { useForm, SubmitHandler } from 'react-hook-form'
import style from './add-update-user.module.scss'
import { User, UserWithoutPassword } from '../../../types/global';
import { roles } from '../../../utilities/roles';
import { useRef, useState } from 'react';
import { API_URL } from '../../../utilities/backend-api';
import { getCookie } from '../../../utilities/getCookie';
import { useAuth } from '../../../utilities/Auth';


type Props = {
    setUpdateBtn: any,
    selectedUser: UserWithoutPassword,
    setUsersList: any
}

export default function UpdateUser({ setUpdateBtn, selectedUser, setUsersList }: Props) {
    const passRef = useRef<HTMLInputElement | null>(null);
    const [isPassActived, setIsPassActived] = useState(false);
    const { updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<User>()
    const {ref, ...rest} = register("password", {required: isPassActived, minLength: isPassActived? 8 : 0});

    const onSubmit: SubmitHandler<User> = async (userInfo) => {
        let { password } = userInfo;
        password = password ? password: '$$_#@!#@';
        userInfo = {...userInfo, password}

        const response = await fetch(`${API_URL}/admin/users/${selectedUser.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            body: JSON.stringify(userInfo) 
        })
        
        if (response.status === 200) {
            const updatedUser = await response.json();
            setUsersList((usersList: any) => {
                const index = usersList.indexOf(selectedUser)
                usersList.splice(index, 1, updatedUser)
                return [...usersList]
            })
            setUpdateBtn(false)
        }
    
        else if (response.status === 403)
            updateLoggedIn(false);

    }

    const disavtivePassword = (e: React.MouseEvent<HTMLSpanElement>) => {
        const active = `${style.checkbox} ${style.active}`
        const disactive = `${style.checkbox}`

        const event = e.currentTarget; 
        const passwordInput = passRef.current as HTMLInputElement;
        
        if (event.className === disactive) {
            event.className = active;
            passwordInput.disabled = isPassActived;
        } else {
            event.className = disactive;
            passwordInput.disabled = isPassActived;
        }
        setIsPassActived(!isPassActived)
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setUpdateBtn(false)}>X</span>
                    <h1>Update User</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='firstName'>First Name</label>
                            <input className={style.inpt} defaultValue={selectedUser.firstName} id='firstName' {...register("firstName", {required: true})} />
                            {errors.firstName && <span className={style.fieldError}>First Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='lastName'>Last Name</label>
                            <input className={style.inpt} defaultValue={selectedUser.lastName} id='lastName' {...register("lastName", {required: true})} />
                            {errors.lastName && <span className={style.fieldError}>Last Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='email'>Email</label>
                            <input className={style.inpt} defaultValue={selectedUser.email} id='email' {...register("email", {required: true, pattern: /^[A-Za-z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$$/})} />
                            {errors.email?.type == 'required' && <span className={style.fieldError}>Email is required</span>}
                            {errors.email?.type == 'pattern' && <span className={style.fieldError}>The Email is not valid</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='password'>Password</label>
                            <input 
                                ref={e => {
                                    ref(e);
                                    passRef.current = e
                                }}
                                className={style.inpt} id='password' {...rest} disabled 
                            />
                            {isPassActived && <>
                                {errors.password?.type == 'required' && <span className={style.fieldError}>Password is required</span>}
                                {errors.password?.type == 'minLength' && <span className={style.fieldError}>Must be consist of atleast 8 characters</span>}
                            </>}
                            <span className={style.checkbox} onClick={disavtivePassword}>
                                <span className={style.checkIcon}></span>
                            </span>
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='role'>Role</label>
                            <select id="role" defaultValue={selectedUser.role} {...register('role')}>
                                <option value="" disabled>
                                    Please select one option
                                </option>
                                {roles.map((role, index) =>
                                    <option key={index} value={role}>{role}</option> 
                                )}
                            </select>
                        </span>
                        
                        <span className={style.boxBtn}>
                            <input type="submit" value="update user" />
                        </span>
                    </form>
                </div>
            </div>
        </>
    )
}