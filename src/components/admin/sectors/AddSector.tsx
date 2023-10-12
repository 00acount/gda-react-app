import { SubmitHandler, useForm } from 'react-hook-form'
import style from './add-update-sector.module.scss'
import { Sector } from '../../../types/global';
import { API_URL } from '../../../utilities/backend-api';
import { getToken } from '../../../utilities/authToken';
import { useAuth } from '../../../utilities/Auth';
import { LoggedIn } from '../../common/context-provider';

export default function AddSector({setSectorsList, setAddBtn}: any) {
    const { updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Sector>();

    const onSubmit: SubmitHandler<Sector> = async (sectorInfo) => {
        
        const response = await fetch(`${API_URL}/admin/sectors`, {
            method: 'POST', 
            headers: {
                'content-type': 'application/json',
                'Authorization': getToken()
            },
            body: JSON.stringify(sectorInfo)
        })
       
        if (response.status === 201) {
            const newSector = await response.json();
            setSectorsList((sectorsList: Sector[]) => {
                return [...sectorsList, newSector]
            })
            setAddBtn(false)
        }
        
        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE);

    }

    return (
        <>
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setAddBtn(false)}>X</span>
                    <h1>Add Sector</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='abbr'>Abbr (Abbreviation)</label>
                            <input className={style.inpt} id='abbr' {...register("abbr", {required: true})} />
                            {errors.abbr && <span className={style.fieldError}>Abbreviation is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='name'>Name</label>
                            <input className={style.inpt} id='name' {...register("name", {required: true})} />
                            {errors.name && <span className={style.fieldError}>Name is required</span>}
                        </span>
                        
                        <span className={style.boxBtn}>
                        </span>
                        <span className={style.boxBtn}>
                            <input type="submit" value="add sector" />
                        </span>
                    </form>
                </div>
            </div>
        </>
    )
}