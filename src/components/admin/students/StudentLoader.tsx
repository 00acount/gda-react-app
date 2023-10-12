import style from './students.module.scss'

export function StudentWrapperLoader() {
    return (
        <div className={`${style.wrapperSkeleton} ${style.wrapper}`}></div>
    )
}