import { SubmitHandler, useForm } from "react-hook-form";
import { Sector } from "../../../types/global";
import style from './add-update-sector.module.scss'
import { API_URL } from "../../../utilities/backend-api";
import { getToken } from "../../../utilities/authToken";
import { useAuth } from "../../../utilities/Auth";
import { LoggedIn } from "../../common/context-provider";

export default function UpdateSector({selectedSector, setSectorsList, setUpdateBtn}: any) {
    const { updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Sector>();

    const onSubmit: SubmitHandler<Sector> = async (sectorInfo) => {

        const response = await fetch(`${API_URL}/admin/sectors/${selectedSector.id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'Authorization': getToken()
            },
            body: JSON.stringify(sectorInfo)
        })
       
        if (response.ok) {
            const updatedSector = await response.json();
            setSectorsList((sectorsList: Sector[]) => {
                const index = sectorsList.indexOf(selectedSector)
                sectorsList.splice(index, 1, updatedSector) 
                return [...sectorsList]
            })
            setUpdateBtn(false)
        }

        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE)
    }

    return (
        <>
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setUpdateBtn(false)}>X</span>
                    <h1>Update Sector</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='abbr'>Abbr (Abbreviation)</label>
                            <input className={style.inpt} defaultValue={selectedSector.abbr} id='abbr' {...register("abbr", {required: true})} />
                            {errors.abbr && <span className={style.fieldError}>Abbreviation is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='name'>Name</label>
                            <input className={style.inpt} defaultValue={selectedSector.name} id='name' {...register("name", {required: true})} />
                            {errors.name && <span className={style.fieldError}>Name is required</span>}
                        </span>
                        
                        <span className={style.boxBtn}>
                        </span>
                        <span className={style.boxBtn}>
                            <input type="submit" value="update sector" />
                        </span>
                    </form>
                </div>
            </div>
        </>
    )
}