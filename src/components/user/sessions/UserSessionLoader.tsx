import style from './absences-list.module.scss'
import  userSessionStyle from './user-sessions.module.scss'

export function AbsenceLoader() {
    return (
        <div className={`${style.outerBox} ${style.outerBoxSkeleton}`}></div>
    )
}

export function UserSessionLoader() {
    return (
        <div className={`${userSessionStyle.wrapper} ${userSessionStyle.wrapperSkeleton}`}></div>
    )
}

export function SessionHeading() {
    return (
        <div className={userSessionStyle.borderSkeleton}></div>
    )
}