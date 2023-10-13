import style from './dashboard.module.scss';

export function OverviewLoader() {
    return (
        <>
            <div className={`${style.overviewContentSekeleton} ${style.overviewContent}`}>
                <span className={style.outerBox}></span>
                <span className={style.outerBox}></span>
                <span className={style.outerBox}></span>
                <span className={style.outerBox}></span>
                <span className={style.outerBox}></span>
            </div>
        </>
    )
}

export function LatestUsersLoader() {
    return (
        <table className={style.latestUsersSekeleton}>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    )
}