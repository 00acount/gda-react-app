import { SubmitHandler, useForm } from "react-hook-form"
import style from "./add-update-module.module.scss"
import { Module, Sector } from "../../../types/global";
import { semesters } from "../../../utilities/semesters";
import { useEffect, useState } from "react";
import MultiSelect from "../../common/multi-select/MultiSelect";
import { API_URL } from "../../../utilities/backend-api";
import { useAuth } from "../../../utilities/Auth";
import { getCookie } from "../../../utilities/getCookie";


export default function AddModule({ setAddBtn, setModulesList }: any) {
    const [dataFetched, setDataFetched] = useState(false);
    const [sectorsList, SetSectorsList] = useState<Sector []>([]);
    const { updateLoggedIn } = useAuth();
    const {
        register, 
        handleSubmit,
        formState: { errors }
    } = useForm<Module>();


    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/admin/sectors`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const sectorsList = await response.json()
                SetSectorsList(sectorsList)
                setDataFetched(true)
            }
        
            else if (response.status === 403)
                updateLoggedIn(false);
        
        })()
    },[])

    const onSubmit: SubmitHandler<Module> = async (data) => {
        
        const sectors = data.sectors.map(id => ({ id: id, abbr: '', name: '' }))
        const moduleInfo = {...data, sectors} 

        const response = await fetch(`${API_URL}/admin/modules`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            body: JSON.stringify(moduleInfo)
        })
         
        if (response.status === 201) {
            const newModule = await response.json()
            
            setModulesList((modulesList: Module []) => {
                return [...modulesList, newModule]
            })
            setAddBtn(false)
        }

        else if (response.status === 403)
            updateLoggedIn(false);

    }



    return (
            <>
                <div className={style.container}>
                    <div className={style.boxForm}>
                        <span className={style.closeBtn} onClick={() => setAddBtn(false)}>X</span>
                        <h1>Add Module</h1>
                        {dataFetched && 
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <span className={style.boxFields}>
                                <label className={style.label} htmlFor='name'>Name</label>
                                <input className={style.inpt} id='name' {...register("name", {required: true})} />
                                {errors.name && <span className={style.fieldError}>Name is required</span>}
                            </span>

                            <span className={style.boxFields}>
                                <label className={style.label} htmlFor='sector'>Sector</label>
                                <MultiSelect className={style.multiselect} register={register('sectors', {required: true})} defaultValues={[]} labels={sectorsList.map(s => s.abbr)}  values={sectorsList.map(s => s.id)} />
                                {errors.sectors && <span className={style.fieldError}>Sector is required</span>}
                            </span>

                            <span className={style.boxFields}>
                                <label className={style.label} htmlFor='semester'>Semester</label>
                                <MultiSelect className={style.multiselect} defaultValues={[]} labels={semesters} values={semesters} register={register('semesters', {required: true})} /> 
                                {errors.semesters && <span className={style.fieldError}>Sector is required</span>}
                            </span>
                            
                            <span className={style.boxBtn}>
                            </span>
                            <span className={style.boxBtn}>
                                <input type="submit" value="add module" />
                            </span>
                        </form>
                        }
                    </div>
                </div>
            </>
    )
}