import { faEraser, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import Header from '../../common/header/Header'
import style from './sectors.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Sector } from '../../../types/global'
import AddSector from './AddSector'
import UpdateSector from './UpdateSector'
import { useAuth } from '../../../utilities/Auth'
import { getCookie } from '../../../utilities/getCookie'
import { API_URL } from '../../../utilities/backend-api'

export default function Sectors() {
    const [dataFetched, SetDataFetched] = useState(false);
    const [updateBtn, setUpdateBtn] = useState(false);
    const [addBtn, setAddBtn] = useState(false);
    const [selectedSector, setSelectedSector] = useState<Sector>();
    const [sectorsList, setSectorsList] = useState<Sector []>([]);
    const { updateLoggedIn } = useAuth();

    useEffect(() => {
        (async () => {

            const respones = await fetch(`${API_URL}/admin/sectors`, {
                    method: 'GET',
                    credentials: 'include'
                });
            
            if (respones.ok) {
                const sectorsList = await respones.json();
                setSectorsList(sectorsList);
                SetDataFetched(true);
            }

            else if (respones.status === 403)
                updateLoggedIn(false);
        
        })()
    }, [])

    const deleteSector = async (id: number) => {
        const response = await fetch(`${API_URL}/admin/sectors/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                }
            });

        if (response.status === 204) {
            setSectorsList(sectorsList => {
                return sectorsList.filter(sector => sector.id !== id);
            })
        }

        else if (response.status === 403)
            updateLoggedIn(false)

    }

    return (
        <>
            <div className={style.container}>
                <Header /> 
                <section className={style.section}>
                    <div className={style.heading}>
                        <span>The list of sectors</span>
                        <button onClick={() => setAddBtn(true)} className={style.addBtn}><FontAwesomeIcon className={style.addBtnIcon} icon={faPlus} /></button>
                    </div>
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
                            {dataFetched && 
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
                            }  
                        </table>
                    </div>
                </section>
            {addBtn && <AddSector setSectorsList={setSectorsList} setAddBtn={setAddBtn} />}
            {updateBtn && <UpdateSector selectedSector={selectedSector} setSectorsList={setSectorsList} setUpdateBtn={setUpdateBtn} />}
            </div>
        </>
    )
}