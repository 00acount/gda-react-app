import Header from '../../common/header/Header'
import style from './user-sessions.module.scss'
import { useEffect, useState } from 'react'
import { Session } from '../../../types/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faEraser, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getDate } from '../../../utilities/dateUtility';
import AddSession from './AddSession';
import AbsenceList from './AbsenceList';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { getToken } from '../../../utilities/authToken';
import { LoggedIn } from '../../common/context-provider';
import { SessionHeading, UserSessionLoader } from './UserSessionLoader';
import TopBarProgress from '../../common/topbar-progress/TopBarProgress';

export default function UserSessions() {
    const [dataFetched, setDataFetched] = useState(false);
    const [sessionsList, setSessionsList] = useState<Session []>([]);
    const [addBtn, setAddBtn] = useState(false)
    const [updateBtn, setUpdateBtn] = useState(false) 
    const [selectedSession, setSelectedSession] = useState<Session>()
    const [progress, setProgress] = useState(false);
    const { authenticatedUser, updateLoggedIn } = useAuth();
    
    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/user/users/${authenticatedUser.id}/sessions`, {
                    method: 'GET',
                    headers: {
                        'Authorization': getToken()
                    }
                });

            if (response.ok) {
                const sessionsList = await response.json();
                setSessionsList(sessionsList);
                setDataFetched(true)
            }

            else if (response.status === 403) 
                updateLoggedIn(LoggedIn.FALSE)
            
        })()
    },[])
    
    const deleteSession = async (sessionId: number) => {
        setProgress(true)

        const response = await fetch(`${API_URL}/user/users/${authenticatedUser.id}/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getToken()
                }
            })
        
        if (response.status === 204) {
            setSessionsList((sessionsList: Session[]) => {
                return sessionsList.filter(session => session.id !== sessionId);
            })
        }

        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE)
            
        setProgress(false)
    }

    const logout = async () => {
        setProgress(true)
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': getToken()
            }
        })
        
        if (response.ok) 
            updateLoggedIn(LoggedIn.FALSE)

        setProgress(false)
    }

    return (
        <>
        {progress && <TopBarProgress />}
        <div className={style.fullContainer}>
            <button className={style.logout} onClick={logout}>
                <FontAwesomeIcon className={style.icon} icon={faDoorOpen} />
            </button>
            <div className={style.container}>
                <header>
                    <Header /> 
                    <div className={style.heading}>
                        {!dataFetched && <SessionHeading />}
                        {dataFetched && 
                        <span className={style.border}>
                            <span className={style.sessionN}>{sessionsList.length}</span>
                            <span>The list of Sessions</span>
                            <button onClick={() => setAddBtn(true)} className={style.addBtn}><FontAwesomeIcon className={style.addBtnIcon} icon={faPlus} /></button>
                        </span>
                        }
                    </div>
                </header>
                {!dataFetched && <UserSessionLoader />}
                {dataFetched && 
                <div className={style.wrapper}>
                    <section className={style.section}>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th></th>
                                    <th>Module</th>
                                    <th>Sector</th>
                                    <th>Semester</th>
                                    <th>Session Time</th>
                                    <th>Creation Time</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionsList.map((session, index) =>
                                    <tr key={index}>
                                        <td><button onClick={() => {setUpdateBtn(true); setSelectedSession(session)}}><FontAwesomeIcon icon={faPencil} /></button></td>
                                        <td>{session.module.name}</td>
                                        <td>{session.sector.abbr}</td>
                                        <td>{session.semester}</td>
                                        <td>{session.sessionTime}</td>
                                        <td>{getDate(session.createdAt, '/')}</td>
                                        <td><button onClick={() => deleteSession(session.id)}><FontAwesomeIcon icon={faEraser} /></button></td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </section>
                </div>
                }
            </div>
            {addBtn && <AddSession setSessionsList={setSessionsList} setAddBtn={setAddBtn} />}
            {updateBtn && <AbsenceList setUpdateBtn={setUpdateBtn} selectedSession={selectedSession} />}
        </div>

        </>
    )
}