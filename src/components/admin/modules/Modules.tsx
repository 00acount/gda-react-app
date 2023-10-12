import { faEraser, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import Header from '../../common/header/Header'
import style from './modules.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react';
import AddModule from './AddModule';
import { Module } from '../../../types/global';
import UpdateModule from './UpdateModule';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { getToken } from '../../../utilities/authToken';
import { ModuleWrapperLoader } from './ModuleLoader';

export default function Modules() {
    const [dataFetched, setDataFetched] = useState(false)
    const [addBtn, setAddBtn] = useState(false);
    const [updateBtn, setUpdateBtn] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module>();
    const [modulesList, setModulesList] = useState<Module []>([]);
    const { updateLoggedIn } = useAuth();
    
    useEffect(() =>{
        (async () => {
            const response = await fetch(`${API_URL}/admin/modules`, {
                    method: 'GET',
                    headers: {
                        'Authorization': getToken()
                    }
                })

            if (response.ok) {
                const modulesList = await response.json()
                setModulesList(modulesList)
                setDataFetched(true)
            }
        
            if (response.status === 403)
                updateLoggedIn(false);
        })()
    }, [])
    
    const deleteModule = async (id: number) => {
        const response = await fetch(`${API_URL}/admin/modules/${id}`, {
                method: 'DELETE',
                headers: {
                   'Authorization': getToken()
                }
            })

        if (response.status === 204) {
            setModulesList(modulesList => {
                return modulesList.filter(module => module.id !== id);
            })            
        }

        if (response.status === 403)
            updateLoggedIn(false)

    }
    return (
        <>
            <div className={style.container}>
                <Header /> 
                <section className={style.section}>
                    <div className={style.heading}>
                        <span>The list of modules</span>
                        <button onClick={() => setAddBtn(true)} className={style.addBtn}><FontAwesomeIcon className={style.addBtnIcon} icon={faPlus} /></button>
                    </div>
                    {!dataFetched && <ModuleWrapperLoader />}
                    {dataFetched && 
                    <div className={style.wrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Sector</th>
                                    <th>Semester</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {modulesList.map((module, index) => 
                                    <tr key={index}>
                                        <td><button onClick={() => {setUpdateBtn(true); setSelectedModule(module)}}><FontAwesomeIcon icon={faPencil} /></button></td>
                                        <td>{module.name}</td>
                                        <td>{module.sectors.map((sector, index) => {
                                                if (index !== module.sectors.length-1)
                                                    return sector.abbr + ','
                                                return sector.abbr 
                                            })}
                                        </td>
                                        <td>{module.semesters.map((semester, index) => {
                                                if (index !== module.semesters.length-1)
                                                    return semester + ','
                                                return semester 
                                        })}
                                        </td>
                                        <td><button onClick={() => deleteModule(module.id)}><FontAwesomeIcon icon={faEraser} /></button></td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </div>
                    }
                </section>
            {addBtn && <AddModule setAddBtn={setAddBtn} setModulesList={setModulesList} />}
            {updateBtn && <UpdateModule setUpdateBtn={setUpdateBtn} setModulesList={setModulesList} selectedModule={selectedModule!} />}
            </div>
        </>
    )
}