import style from './modules.module.scss'

export function ModuleWrapperLoader() {
    return (
        <div className={`${style.wrapper} ${style.wrapperSkeleton}`}></div>
    )
}