import { useForm, SubmitHandler } from 'react-hook-form'
import style from './add-update-student.module.scss'
import { Sector, Student } from '../../../types/global';
import { useEffect, useState } from 'react';
import { semesters } from '../../../utilities/semesters';
import { API_URL } from '../../../utilities/backend-api';
import { useAuth } from '../../../utilities/Auth';
import { getToken } from '../../../utilities/authToken';
import { LoggedIn } from '../../common/context-provider';

type Props = {
    selectedStudent: Student,
    setUpdateBtn: any,
    setStudentsList: any
}


export default function UpdateStudent({ selectedStudent, setUpdateBtn, setStudentsList }: Props) {
    const [sectorsList, SetSectorsList] = useState<Sector []>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const { updateLoggedIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Student>()
    
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
                updateLoggedIn(LoggedIn.FALSE);

        })()
    }, [])

    const onSubmit: SubmitHandler<Student> = async (data) => {
        
        const studentInfo = {...data, sector: {id : data.sector}}
        const response = await fetch(`${API_URL}/admin/students/${selectedStudent.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            },
            body: JSON.stringify(studentInfo) 
        });
        
        if (response.ok) {
            const updatedStudent = await response.json()
            setStudentsList((studentsList: Student []) => {
                const index = studentsList.indexOf(selectedStudent)
                studentsList.splice(index, 1, updatedStudent);
                return [...studentsList]
            })
            setUpdateBtn(false)
        }

        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE);

    }

    return (
        <>
            {dataFetched &&
            <div className={style.container}>
                <div className={style.boxForm}>
                    <span className={style.closeBtn} onClick={() => setUpdateBtn(false)}>X</span>
                    <h1>Update Student</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <span className={style.boxFields}>
                            <label htmlFor='firstName'>First Name</label>
                            <input className={style.inpt} id='firstName' defaultValue={selectedStudent.firstName} {...register("firstName", {required: true})} />
                            {errors.firstName && <span className={style.fieldError}>First Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='lastName'>Last Name</label>
                            <input className={style.inpt} id='lastName' defaultValue={selectedStudent.lastName} {...register("lastName", {required: true})} />
                            {errors.lastName && <span className={style.fieldError}>Last Name is required</span>}
                        </span>

                        <span className={style.boxFields}>
                            <label htmlFor='apogeeCode'>Apogee Code</label>
                            <input className={style.inpt} id='apogeeCode' defaultValue={selectedStudent.apogeeCode} {...register("apogeeCode", {required: true, pattern: /^[0-9]+$/})} />
                            {errors.apogeeCode?.type == 'required' && <span className={style.fieldError}>Apogee Code is required</span>}
                            {errors.apogeeCode?.type == 'pattern' && <span className={style.fieldError}>Must only consists of numbers</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='birthDate'>Birth Date</label>
                            <input className={style.inpt} type='date' id='birthDate' defaultValue={new Date(selectedStudent.birthDate).toISOString().split('T')[0]} {...register("birthDate", {required: true})} />
                            {errors.birthDate && <span className={style.fieldError}>Birth Date is required</span>}
                        </span>
                        
                        <span className={style.boxFields}>
                            <label htmlFor='sector'>Sector</label>
                            <select id='sector' defaultValue={selectedStudent.sector.id} {...register('sector')}>
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
                            <select id="semester" defaultValue={selectedStudent.semester} {...register('semester')}>
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
                            <input type="submit" value="Update Student" />
                        </span>
                    </form>
                </div>
            </div>
        }
        </>
    )
}