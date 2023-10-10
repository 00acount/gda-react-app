import style from './sidebar.module.scss'
import logo from './../../../assets/images/logo.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faDoorOpen, faGraduationCap, faSchool, faTableColumns, faTableList, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../../utilities/Auth'
import { API_URL } from '../../../utilities/backend-api'
import { getCookie } from '../../../utilities/getCookie'

export default function Sidebar() {
    const refs: (HTMLSpanElement | null)[] = [];
    const location = useLocation();
    const { authenticatedUser } = useAuth();
    const { updateLoggedIn } = useAuth();

    useEffect(() => {
        switch(location.pathname)  {
                case '/dashboard':
                    changeMarkForPath(0)
                    break
                case '/students':
                    changeMarkForPath(1)
                    break
                case '/users':
                    changeMarkForPath(2)
                    break
                case '/modules':
                    changeMarkForPath(3)
                    break
                case '/sectors':
                    changeMarkForPath(4)
                    break
                case '/sessions':
                    changeMarkForPath(5)
                    break
        }

   })
    
    const changeMark = (event: React.MouseEvent<HTMLSpanElement>) => {
        refs.forEach(ref => {
            if (ref) ref.className = ''
        })
        event.currentTarget.className = style.active;
    }

    const changeMarkForPath = (idx: number) => {
        refs.forEach((ref, index) => {
            if (ref !== null) {
                ref.className = ''
                if (index === idx) 
                    ref.className = style.active
            }
        })
    }

    const logout = async () => {

        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            }
        })
        
        if (response.ok) 
            updateLoggedIn(false);

    }

    return (
        <>
            <aside className={style.sidebar}>
                <div className={style.logo}>
                    <img src={logo} alt="" />
                    <h2>ADMIN ACCOUNT</h2>
                    <span>Hello, {authenticatedUser.name}</span>
                </div>
                <div className={style.categories}>
                    <Link ref={e => refs.push(e)} onClick={e => changeMark(e)} to='/dashboard'><FontAwesomeIcon className={style.icon} icon={faTableColumns} />Dashboard</Link>
                    <Link ref={e => refs.push(e)} onClick={e => changeMark(e)} to='/students'><FontAwesomeIcon className={style.icon} icon={faGraduationCap} />Students</Link>
                    <Link ref={e => refs.push(e)} onClick={e => changeMark(e)} to='/users'><FontAwesomeIcon className={style.icon} icon={faUser} />Users</Link>
                    <Link ref={e => refs.push(e)} onClick={e => changeMark(e)} to='/modules'><FontAwesomeIcon className={style.icon} icon={faSchool} />Modules</Link>
                    <Link ref={e => refs.push(e)} onClick={e => changeMark(e)} to='/sectors'><FontAwesomeIcon className={style.icon} icon={faTableList} />Sectors</Link>
                    <Link ref={e => refs.push(e)} onClick={e => changeMark(e)} to='/sessions'><FontAwesomeIcon className={style.icon} icon={faBook} />Sessions</Link>
                    <button className={style.logout} onClick={logout}><FontAwesomeIcon className={style.icon} icon={faDoorOpen} />Logout</button>
                </div>
            </aside>
        </>
    )
}