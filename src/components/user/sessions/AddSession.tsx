import { SubmitHandler, useForm } from 'react-hook-form'
import style from './add-session.module.scss'
import { Module, Sector } from '../../../types/global';
import { Session } from '../../../types/global';
import { semesters } from '../../../utilities/semesters';
import { sessionTimes } from '../../../utilities/sessionTimes';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { getToken } from '../../../utilities/authToken';
import { LoggedIn } from '../../common/context-provider';

export default function AddSession({setSessionsList, setAddBtn}: any) {
    const [modulesList, setModulesList] = useState<Module []>([]);
    const [sectorsList, setSectorsList] = useState<Sector []>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const { authenticatedUser, updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit
    } = useForm<Session>();


    useEffect(() => {
        (async () => {
            const responses = await Promise.all([
                fetch(`${API_URL}/user/sectors`, {
                        method: 'GET',
                        headers: {
                            'Authorization': getToken()
                        }
                    }),
                fetch(`${API_URL}/user/modules`, {
                        method: 'GET',
                        headers: {
                            'Authorization': getToken()
                        }
                    })
            ])

            if (responses.every(response => response.ok)) {
                const sectors = await responses[0]?.json();
                const modules = await responses[1]?.json();

                setModulesList(modules);
                setSectorsList(sectors);
                setDataFetched(true);
            } 

            else if (responses[0].status === 403) {
                updateLoggedIn(LoggedIn.FALSE)
            }
        })()
    }, [])

    const onSubmit: SubmitHandler<Session> = async (data) => {

        const module = { id: data.module }
        const sector = { id: data.sector }
        const sessionInfo = {...data, module, sector}
        
        const response = await fetch(`${API_URL}/user/users/${authenticatedUser.id}/sessions`, {
                method: 'POST', 
                headers: {
                    'content-type': 'application/json',
                    'Authorization': getToken()
                },
                body: JSON.stringify(sessionInfo)
            })
    
        if (response.status === 201) {
            const newSession = await response.json();
            setSessionsList((sessionsList: Sector[]) => {
                return [...sessionsList, newSession]
            })
            setAddBtn(false)
        }

        else if (response.status === 403) {
            updateLoggedIn(LoggedIn.FALSE)
        }
    }

    return (
        <>
            {dataFetched && 
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setAddBtn(false)}>X</span>
                    <h1>Add Session</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='module'>Module</label>
                            <select className={style.inpt} id='module' {...register("module", {required: true})}>
                                {modulesList.map((module, index) => 
                                    <option key={index} value={module.id}>{module.name}</option>
                                )}
                             </select>
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='semester'>Semester</label>
                            <select className={style.inpt} id='semester' {...register("semester", {required: true})}>
                                {semesters.map((semester, index) => 
                                    <option key={index} value={semester}>{semester}</option>
                                )}
                            </select>
                        </span>
                        <span className={style.boxFields}>
                            <label htmlFor='sector'>Sector</label>
                            <select className={style.inpt} id='sector' {...register("sector", {required: true})}>
                                {sectorsList.map((sector, index) => 
                                    <option key={index} value={sector.id}>{sector.abbr}</option>
                                )}

                            </select>
                        </span>
                        <span className={style.boxFields}>
                            <label htmlFor='sessionTime'>Session Time</label>
                            <select className={style.inpt} id='sessionTime' {...register("sessionTime", {required: true})}>
                                {sessionTimes.map((sessionTime, index) => 
                                <option key={index} value={sessionTime}>{sessionTime}</option>
                                )}
                            </select>
                        </span>
                        
                        <span className={style.boxBtn}>
                        </span>
                        <span className={style.boxBtn}>
                            <input type="submit" value="add session" />
                        </span>
                    </form>
                </div>
            </div>
        }
        </>
    )
}