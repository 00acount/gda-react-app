import style from './sectors.module.scss'

export function SectorWrapperLoader() {
    return (
        <div className={`${style.wrapper} ${style.wrapperSkeleton}`}></div>
    )
}