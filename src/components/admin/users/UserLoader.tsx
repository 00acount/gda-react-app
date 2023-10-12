import style from './users.module.scss'

export function UserWrapperLoader() {
    return (
        <div className={`${style.wrapperSkeleton} ${style.wrapper}`}></div>
    )
}