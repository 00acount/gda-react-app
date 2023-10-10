import Header from '../../common/header/Header'
import style from './sessions.module.scss'
import { useEffect, useState } from 'react'
import { Session } from '../../../types/global'
import { getDate } from '../../../utilities/dateUtility';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Sessions() {
    const [dataFetched, setDataFetched] = useState(false); 
    const [sessionsList, setSessionsList] = useState<Session []>([]);
    const { updateLoggedIn } = useAuth();
    
    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/admin/users/sessions`, {
                    method: 'GET',
                    credentials: 'include'
                });
            
            if (response.ok) {
                const sessionsList = await response.json()
                setSessionsList(sessionsList)
                setDataFetched(true)
            }
            
            else if (response.status === 403)
                updateLoggedIn(false)
        })()
    },[])
    
    const exportPDF = async (session: Session) => {
        const response = await fetch(`${API_URL}/admin/users/${session.user.id}/sessions/${session.id}/absence/generatePDF`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    accept : 'application/pdf'
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
            updateLoggedIn(false);

    }

    return (
        <>
            <div className={style.container}>
                <Header /> 
                <div className={style.heading}>
                    <span>The list of Sessions</span>
                </div>
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
                            {dataFetched &&
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
                            }
                        </table>
                    </section>
                </div>
            </div>
        </>
    )
}