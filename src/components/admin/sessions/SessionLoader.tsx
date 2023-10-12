import style from './sessions.module.scss'

export function SessionWrapperLoader() {
    return (
        <div className={`${style.wrapper} ${style.wrapperSkeleton}`}></div>
    )
}