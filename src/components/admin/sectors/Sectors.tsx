import { faEraser, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import Header from '../../common/header/Header'
import style from './sectors.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Sector } from '../../../types/global'
import AddSector from './AddSector'
import UpdateSector from './UpdateSector'
import { useAuth } from '../../../utilities/Auth'
import { getToken } from '../../../utilities/authToken'
import { API_URL } from '../../../utilities/backend-api'
import { LoggedIn } from '../../common/context-provider'
import { SectorWrapperLoader } from './SectorLoader'
import TopBarProgress from '../../common/topbar-progress/TopBarProgress'

export default function Sectors() {
    const [dataFetched, SetDataFetched] = useState(false);
    const [updateBtn, setUpdateBtn] = useState(false);
    const [addBtn, setAddBtn] = useState(false);
    const [selectedSector, setSelectedSector] = useState<Sector>();
    const [sectorsList, setSectorsList] = useState<Sector []>([]);
    const [progress, setProgress] = useState(false);
    const { updateLoggedIn } = useAuth();

    useEffect(() => {
        (async () => {

            const respones = await fetch(`${API_URL}/admin/sectors`, {
                    method: 'GET',
                    headers: {
                        'Authorization': getToken()
                    }
                });
            
            if (respones.ok) {
                const sectorsList = await respones.json();
                setSectorsList(sectorsList);
                SetDataFetched(true);
            }

            else if (respones.status === 403)
                updateLoggedIn(LoggedIn.FALSE);
        
        })()
    }, [])

    const deleteSector = async (id: number) => {
        setProgress(true);
        const response = await fetch(`${API_URL}/admin/sectors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getToken()
                }
            });

        if (response.status === 204) {
            setSectorsList(sectorsList => {
                return sectorsList.filter(sector => sector.id !== id);
            })
        }

        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE);
        
        setProgress(false);
    }

    return (
        <>
            {progress && <TopBarProgress/>}
            <div className={style.container}>
                <Header /> 
                <section className={style.section}>
                    <div className={style.heading}>
                        <span>The list of sectors</span>
                        <button onClick={() => setAddBtn(true)} className={style.addBtn}><FontAwesomeIcon className={style.addBtnIcon} icon={faPlus} /></button>
                    </div>
                    {!dataFetched && <SectorWrapperLoader />}
                    {dataFetched && 
                    <div className={style.wrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th></th>
                                    <th>Abbreviation</th>
                                    <th>Full Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectorsList.map((sector, index) => 
                                    <tr key={index}>
                                        <td><button onClick={() => {setUpdateBtn(true); setSelectedSector(sector)}}><FontAwesomeIcon icon={faPencil} /></button></td>
                                        <td>{sector.abbr}</td>
                                        <td>{sector.name}</td>
                                        <td><button onClick={() => deleteSector(sector.id)}><FontAwesomeIcon icon={faEraser} /></button></td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </div>
                    }  
                </section>
            {addBtn && <AddSector setSectorsList={setSectorsList} setAddBtn={setAddBtn} />}
            {updateBtn && <UpdateSector selectedSector={selectedSector} setSectorsList={setSectorsList} setUpdateBtn={setUpdateBtn} />}
            </div>
        </>
    )
}
    // const [progress, setProgress] = useState(false);
    //     setProgress(true);
    //     setProgress(false);
    //         {progress && <TopBarProgress/>}