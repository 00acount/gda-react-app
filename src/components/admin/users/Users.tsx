import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../common/header/Header";
import style from './users.module.scss'
import { faEraser, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getDate } from "../../../utilities/dateUtility";
import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import { UserWithoutPassword } from "../../../types/global";
import UpdateUser from "./UpdateUser";
import { API_URL } from "../../../utilities/backend-api";
import { useAuth } from "../../../utilities/Auth";
import { getToken } from "../../../utilities/authToken";
import { LoggedIn } from "../../common/context-provider";
import { UserWrapperLoader } from "./UserLoader";
import TopBarProgress from "../../common/topbar-progress/TopBarProgress";

export default function Users() {
    const [dataFetched, setDataFetched] = useState(false);
    const [addBtn, setAddBtn] = useState(false);
    const [updateBtn, setUpdateBtn] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();
    const [usersList, setUsersList] = useState<UserWithoutPassword []>([])
    const { updateLoggedIn, authenticatedUser } = useAuth();
    const [progress, setProgress] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/admin/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': getToken()
                    }
                });
            
            if (response.ok) {
                const usersList = await response.json()
                setUsersList(usersList) 
                setDataFetched(true)
            }
            
            else if (response.status === 403)
                updateLoggedIn(LoggedIn.FALSE);

        })()
    }, [])

    const deleteUser = async (id: number) => {

        setProgress(true);
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': getToken()
                }
            });

        if(response.status === 204) {
            const newUsersList = usersList.filter(user => user.id !== id);
            setUsersList(newUsersList);
            
            if (id === authenticatedUser.id)
                updateLoggedIn(false);
        }
        
        else if (response.status === 403)
            updateLoggedIn(LoggedIn.FALSE);

        setProgress(false);
    }

    return (
        <>
            {progress && <TopBarProgress />}
            <div className={style.container}>
                <Header /> 
                <section className={style.section}>
                    <div className={style.heading}>
                        <span>The list of users</span>
                        <button className={style.addBtn} onClick={() => {setAddBtn(true)}}><FontAwesomeIcon className={style.addBtnIcon} icon={faPlus} /></button>
                    </div>
                    {!dataFetched && <UserWrapperLoader />}
                    {dataFetched &&
                    <div className={style.wrapper}>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th></th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Registration Date</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((user, index) => 
                                    <tr key={index}>
                                        <td><button onClick={() => {setSelectedUser(user); setUpdateBtn(true)}}><FontAwesomeIcon icon={faPencil} /></button></td>
                                        <td className={style.tdFirstName}>
                                            {user.isOnline === true && 
                                                <span className={style.currentUser}>
                                                    <span className={style.ringring}></span>
                                                    <span className={style.circle}></span>
                                                </span>
                                            }
                                            {user.firstName}
                                        </td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{getDate(user.registeredOn, '/')}</td>
                                        <td>{user.role}</td>
                                        <td><button onClick={() => deleteUser(user.id)}><FontAwesomeIcon icon={faEraser} /></button></td>
                                    </tr>    
                                )}
                            </tbody>
                        </table>
                    </div>
                    }
                {addBtn && <AddUser setAddBtn={setAddBtn} setUsersList={setUsersList} />}
                {updateBtn && <UpdateUser setUpdateBtn={setUpdateBtn} setUsersList={setUsersList} selectedUser={selectedUser} />}
                </section>
            </div>
        </>
    )
}