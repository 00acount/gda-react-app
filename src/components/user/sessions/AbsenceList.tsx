import { useEffect, useRef, useState } from 'react'
import style from './absences-list.module.scss'
import { Absence } from '../../../types/global';
import { faFilePdf, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from '../../../utilities/backend-api';
import { getToken } from '../../../utilities/authToken';
import { useAuth } from '../../../utilities/Auth';
import { LoggedIn } from '../../common/context-provider';
import { AbsenceLoader } from './UserSessionLoader';
import TopBarProgress from '../../common/topbar-progress/TopBarProgress';

enum Status {
    PRESENT = 'PRESENT',
    ABSENT = 'ABSENT'
}

export default function AbsenceList( {setUpdateBtn, selectedSession }: any) {
    const [dataFetched, setDataFetched] = useState(false);
    const [absenceList, setAbsenceList] = useState<Absence []>([]);
    const [renderStatus, setRenderStatus] = useState(false);
    const [progress, setProgress] = useState(false);
    const absenceListRef = useRef(absenceList);
    const { updateLoggedIn } = useAuth();

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/user/users/${selectedSession.user.id}/sessions/${selectedSession.id}/absence`, {
                method: 'GET',
                headers: {
                    'Authorization': getToken()
                }
            })
            
            if (response.ok) {
                const absenceList = await response.json()
                setAbsenceList(absenceList)
                setDataFetched(true)
            }

            else if (response.status === 403) {
                updateLoggedIn(LoggedIn.FALSE)
            }
        })()
    }, [])

    const switchStatus = (absence: Absence) =>  {
        const isPresent = absence.status === Status.PRESENT;
        absence.status = isPresent? Status.ABSENT: Status.PRESENT;
        setRenderStatus(!renderStatus)
        absenceListRef.current = absenceList;
    }
    
    const onClose = async () => {
        setProgress(true)
        if (absenceListRef.current.length) {
                const response = await fetch(`${API_URL}/user/users/${selectedSession.user.id}/sessions/${selectedSession.id}/absence`, {
                        method: 'PUT',
                        headers: {
                            'content-type' : 'application/json',
                            'Authorization': getToken()
                        },
                        body: JSON.stringify(absenceListRef.current)
                    })
                
                if (response.ok)
                    setUpdateBtn(false);
                
                else if (response.status === 403)
                    updateLoggedIn(LoggedIn.FALSE)

            return; 
        }
        setUpdateBtn(false);
        setProgress(false);
    }
    
    
    const exportPDF = async () => {
        setProgress(true)
        const response = await fetch(`${API_URL}/user/users/${selectedSession.user.id}/sessions/${selectedSession.id}/absence/generatePDF`, {
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
            anchor.download = `session_${selectedSession.createdAt}.pdf`
            anchor.click()
            setProgress(false);
        }

        if (response.status === 403)
            updateLoggedIn(false);

    }
    
    return (
        <>
            <div className={style.container}>
                {progress && <TopBarProgress/>}
                {!dataFetched && <AbsenceLoader />}
                {dataFetched && 
                <div className={style.outerBox}>
                    <div className={style.innerBox}>
                        <div className={style.topSide}>
                            <span className={style.closeBtn} onClick={() => onClose()}>X</span>
                            <span className={style.borderBox}>
                                <span className={style.innerBox}>
                                    <span className={style.studentN}>{absenceList.length}</span> 
                                    <h1>Absence List</h1>
                                    <FontAwesomeIcon onClick={exportPDF} className={style.icon} icon={faFilePdf} />
                                </span>
                            </span>
                            <span className={style.note}>NOTE*: Changes are not committed unless you close the tab</span>
                        </div>
                        <div className={style.tableBox}>
                            <table>
                                <thead>
                                    <tr className={style.tableHead}>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Apogee Code</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                {dataFetched && 
                                <tbody>
                                    {absenceList.map((absence, index) => 
                                        <tr key={index}>
                                            <td>{absence.student.firstName}</td>
                                            <td>{absence.student.lastName}</td>
                                            <td>{absence.student.apogeeCode}</td>
                                            <td>
                                                <span className={style.status}>
                                                    {absence.status === Status.ABSENT && <span className={style.absent}>{absence.status}</span>}
                                                    {absence.status === Status.PRESENT && <span className={style.present}>{absence.status}</span>}
                                                    <FontAwesomeIcon className={style.switchBtn} onClick={() => switchStatus(absence)} icon={faRepeat} /> 
                                                </span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
    )
}