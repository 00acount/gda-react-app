import style from './log-loader.module.scss'

export function LogLoader({ logging = 'login' }: any) {
    const loggingSyle =  logging === 'login'? style.login : style.logout;
    return (
        <div className={style.logLoader}>
            <div className={`${style['lds-spinner']} ${loggingSyle}`}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                </div>
        </div>
    )
}