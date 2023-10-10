import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from '../../common/header/Header'
import style from './dashboard.module.scss'
import { faBook, faGraduationCap, faSchool, faTable, faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { API_URL } from '../../../utilities/backend-api'
import { useAuth } from '../../../utilities/Auth'

export default function Dashboard() {
    const [overview, setOverview] = useState<any>();
    const [latestUsers, setLatestUsers] = useState<any>();
    const [dataFetched, setDataFetched] = useState(false);
    const { updateLoggedIn } = useAuth();
    
    useEffect(() => {
        (async () => {

            const response = await fetch(`${API_URL}/admin/dashboard`, {
                    method: 'GET',
                    credentials: 'include'
                });

            if (response.ok) {
                const dashboardData = await response.json();
                setOverview(dashboardData.overview)
                setLatestUsers(dashboardData.latestUsers)
                setDataFetched(true)
            }
            
            if (response.status === 403)
                updateLoggedIn(false);

        })()
    }, [])
    

    return (
        <>
            <div className={style.container}>
                <Header />
            {dataFetched && 
                <section>
                    <h2>Overview</h2>
                    <div className={style.overviewContent}>
                        <span className={style.outerBox}>
                            <span className={style.iconBox}>
                                <FontAwesomeIcon icon={faGraduationCap} />
                            </span>
                            <span className={style.bubble}>{overview?.numberOfStudents}</span>
                        </span>
                        <span className={style.outerBox}>
                            <span className={style.iconBox}>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <span className={style.bubble}>{overview?.numberOfUsers}</span>
                        </span>
                        <span className={style.outerBox}>
                            <span className={style.iconBox}>
                                <FontAwesomeIcon icon={faSchool} />
                            </span>
                            <span className={style.bubble}>{overview?.numberOfModules}</span>
                        </span>
                        <span className={style.outerBox}>
                            <span className={style.iconBox}>
                                <FontAwesomeIcon icon={faTable} />
                            </span>
                            <span className={style.bubble}>{overview?.numberOfSectors}</span>
                        </span>
                        <span className={style.outerBox}>
                            <span className={style.iconBox}>
                                <FontAwesomeIcon icon={faBook} />
                            </span>
                            <span className={style.bubble}>{overview?.numberOfSessions}</span>
                        </span>
                    </div>
                    <h2>Latest Users</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestUsers?.map((user: any, index: number) => 
                                <tr key={index}>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            }
            </div>
        </>
    )
}