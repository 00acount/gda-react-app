import { useForm, SubmitHandler } from 'react-hook-form'
import style from './add-update-student.module.scss'
import { Sector, Student, Student_SectorId } from '../../../types/global';
import { useEffect, useState } from 'react';
import { semesters } from '../../../utilities/semesters';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { getToken } from '../../../utilities/authToken';
import { LoggedIn } from '../../common/context-provider';


export default function AddStudent({ setAddBtn, setStudentsList }: any) {
    const [sectorsList, SetSectorsList] = useState<Sector []>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const { updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Student_SectorId>()

    useEffect(() => {
        (async () => {

            const response = await fetch(`${API_URL}/admin/sectors`, {
                    method: "GET",
                    headers: {
                        'Authorization': getToken()
                    }
                });

            if (response.ok) {
                const sectorsList = await response.json()
                SetSectorsList(sectorsList)
                setDataFetched(true)
            }
            
            else if (response.status === 403)
                updateLoggedIn(LoggedIn.FALSE)

        })()
    }, [])
    
    const onSubmit: SubmitHandler<Student_SectorId> = async (data) => {
        const sector = {id : data.sector}
        const studentInfo = {...data, sector}
        
        const response = await fetch(`${API_URL}/admin/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
                
            },
            body: JSON.stringify(studentInfo) 
        });
        
        if (response.status === 201) {
            const newStudent = await response.json();
            setStudentsList((studentsList: Student []) => {
                return [...studentsList, newStudent] 
            })
            setAddBtn(false)
        }
    
        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE);

    }

    return (
        <>
            {dataFetched &&
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setAddBtn(false)}>X</span>
                    <h1>Add Student</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='firstName'>First Name</label>
                            <input className={style.inpt} id='firstName' {...register("firstName", {required: true})} />
                            {errors.firstName && <span className={style.fieldError}>First Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='lastName'>Last Name</label>
                            <input className={style.inpt} id='lastName' {...register("lastName", {required: true})} />
                            {errors.lastName && <span className={style.fieldError}>Last Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='apogeeCode'>Apogee Code</label>
                            <input className={style.inpt} id='apogeeCode' {...register("apogeeCode", {required: true, pattern: /^[0-9]+$/})} />
                            {errors.apogeeCode?.type == 'required' && <span className={style.fieldError}>Apogee Code is required</span>}
                            {errors.apogeeCode?.type == 'pattern' && <span className={style.fieldError}>Must only consists of numbers</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='birthDate'>Birth Date</label>
                            <input className={style.inpt} type='date' id='birthDate' {...register("birthDate", {required: true})} />
                            {errors.birthDate && <span className={style.fieldError}>Birth Date is required</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='sector'>Sector</label>
                            <select id='sector' {...register('sector')}>
                                <option value="" disabled>
                                    Please select one option
                                </option>
                                {sectorsList.map((sector, index) => 
                                    <option key={index} value={sector.id}>{sector.abbr}</option> 
                                )}
                            </select>
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='semester'>Semester</label>
                            <select id="semester" {...register('semester')}>
                                <option value="" disabled>
                                    Please select one option
                                </option>
                                {semesters.map((semester, index) =>
                                    <option key={index} value={semester}>{semester}</option> 
                                )}
                            </select>
                        </span>
                        
                        <span className={style.boxBtn}>
                        </span>
                        <span className={style.boxBtn}>
                            <input type="submit" value="add student" />
                        </span>
                    </form>
                </div>
            </div>
        }
        </>
    )
}