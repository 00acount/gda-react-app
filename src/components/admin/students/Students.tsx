import { faEraser, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import Header from '../../common/header/Header'
import style from './students.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import AddStudent from './AddStudent'
import { Student } from '../../../types/global'
import UpdateStudent from './UpdateStudent'
import { API_URL } from '../../../utilities/backend-api'
import { useAuth } from '../../../utilities/Auth'
import { getToken } from '../../../utilities/authToken'
import { LoggedIn } from '../../common/context-provider'
import { StudentWrapperLoader } from './StudentLoader'

export default function Students() {
    const [updateBtn, setUpdateBtn] = useState(false);
    const [addBtn, setAddBtn] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student>();
    const [studentsList, setStudentsList] = useState<Student []>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const { updateLoggedIn } = useAuth();
    
    useEffect(() => {
        (async () => {

            const response = await fetch(`${API_URL}/admin/students`, {
                    method: "GET",
                    headers: {
                        'Authorization': getToken()
                    }
                });

            if (response.ok) {
                const studentsList = await response.json()
                setStudentsList(studentsList);
                setDataFetched(true)
            }
            
            else if (response.status === 403)
                updateLoggedIn(LoggedIn.FALSE);

        })()
    },[])
    
    const deleteStudent = async (id: number) => {

        const response = await fetch(`${API_URL}/admin/students/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getToken()
                }
            });
        
        if (response.status === 204) {
            setStudentsList(studentsList => {
                return studentsList.filter(student => student.id !== id);
            });
        }
    
        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE);

    }

    return (
        <>
            <div className={style.container}>
                <Header /> 
                <section className={style.section}>
                    <div className={style.heading}>
                        <span>The list of students</span>
                        <button className={style.addBtn} onClick={() => {setAddBtn(true)}}><FontAwesomeIcon className={style.addBtnIcon} icon={faPlus} /></button>
                    </div>
                    {!dataFetched && <StudentWrapperLoader />}
                    {dataFetched &&  
                    <div className={style.wrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th></th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Sector</th>
                                    <th>Semester</th>
                                    <th>Apogee Code</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsList.map((student, index) =>
                                    <tr key={index}>
                                        <td><button onClick={() => {setUpdateBtn(true); setSelectedStudent(student)}} className={style.button}><FontAwesomeIcon icon={faPencil} /></button></td>
                                        <td>{student.firstName}</td>
                                        <td>{student.lastName}</td>
                                        <td>{student.sector?.abbr}</td>
                                        <td>{student.semester}</td>
                                        <td>{student.apogeeCode}</td>
                                        <td><button onClick={() => deleteStudent(student.id)} className={style.button}><FontAwesomeIcon icon={faEraser} /></button></td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </div>
                    }
                    {updateBtn && <UpdateStudent setUpdateBtn={setUpdateBtn} setStudentsList={setStudentsList} selectedStudent={selectedStudent!} />}
                    {addBtn && <AddStudent setAddBtn={setAddBtn} setStudentsList={setStudentsList} />}
                </section>
            </div>
        </>
    )
}