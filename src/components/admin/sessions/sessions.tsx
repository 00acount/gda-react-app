import Header from '../../common/header/Header'
import style from './sessions.module.scss'
import { useEffect, useState } from 'react'
import { Session } from '../../../types/global'
import { getDate } from '../../../utilities/dateUtility';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../../utilities/authToken';
import { LoggedIn } from '../../common/context-provider';
import { SessionWrapperLoader } from './SessionLoader';

export default function Sessions() {
    const [dataFetched, setDataFetched] = useState(false); 
    const [sessionsList, setSessionsList] = useState<Session []>([]);
    const { updateLoggedIn } = useAuth();
    
    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/admin/users/sessions`, {
                    method: 'GET',
                    headers: {
                        'Authorization': getToken()
                    }
                });
            
            if (response.ok) {
                const sessionsList = await response.json()
                setSessionsList(sessionsList)
                setDataFetched(true)
            }
            
            else if (response.status === 403)
                updateLoggedIn(LoggedIn.FALSE)
        })()
    },[])
    
    const exportPDF = async (session: Session) => {
        const response = await fetch(`${API_URL}/admin/users/${session.user.id}/sessions/${session.id}/absence/generatePDF`, {
                method: 'GET',
                headers: {
                    accept : 'application/pdf',
                    'Authorization': getToken()
                },
            })
        
        if (response.ok) {
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = `session_${session.createdAt}.pdf`
            anchor.click()
        }

        if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE)

    }

    return (
        <>
            <div className={style.container}>
                <Header /> 
                <div className={style.heading}>
                    <span>The list of Sessions</span>
                </div>
                {!dataFetched && <SessionWrapperLoader />}
                {dataFetched &&
                <div className={style.wrapper}>
                    <section className={style.section}>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th>Last Name</th>
                                    <th>Module</th>
                                    <th>Sector</th>
                                    <th>Semester</th>
                                    <th>Session Time</th>
                                    <th>Creation Time</th>
                                    <th>
                                        <FontAwesomeIcon className={style.icon} icon={faFilePdf} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessionsList.map((session, index) =>
                                    <tr key={index}>
                                        <td>{session.user.lastName}</td>
                                        <td>{session.module.name}</td>
                                        <td>{session.sector.abbr}</td>
                                        <td>{session.semester}</td>
                                        <td>{session.sessionTime}</td>
                                        <td>{getDate(session.createdAt, '/')}</td>
                                        <td className={style.pdfBtn}>
                                            <button onClick={() => exportPDF(session)}>
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        </td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </section>
                </div>
                }
            </div>
        </>
    )
}