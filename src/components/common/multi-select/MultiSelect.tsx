import { useRef, useState } from 'react';
import style from './multi-select.module.scss'

type Props = {
    labels: (string | number) []
    values: (string | number) []
    defaultValues: (string | number) [] 
    register: any
    className?: any
}

export default function MultiSelect({className='', labels, values, defaultValues = [], register}: Props) {
    const optionsRef = useRef<HTMLDivElement>(null);
    const [checkedInputs, setCheckedInputs] = useState<number>(defaultValues.length);

    const selectDropDown = () => {
        if (optionsRef.current) {
            if (optionsRef.current.className === style.options)
                optionsRef.current.className = `${style.options} ${style.show}`
            else 
                optionsRef.current.className = style.options
        }
    }
    const handleCheckInputs = (e: React.MouseEvent<HTMLInputElement>) => {
        const event = e.target as HTMLInputElement
        if (event.checked)
            setCheckedInputs(prev => prev + 1)
        else 
            setCheckedInputs(prev => prev - 1)
    }

    return (
        <>
            <div className={style.container}>
                <div className={`${className} ${style.select}`} onClick={selectDropDown} >
                    {checkedInputs === 0 &&  `select at least one option`}
                    {checkedInputs === 1 &&  `${checkedInputs} options is selected`}
                    {checkedInputs > 1 &&  `${checkedInputs} options are selected`}
                </div>
                <div ref={optionsRef} className={style.options}>
                    {values.map((value: any , index: number) => {
                        if (defaultValues.includes(value))
                            return <div key={index} className={style.box}>
                                        <label className={style.checkboxContainer}>{labels[index]}
                                            <input onClick={handleCheckInputs} defaultChecked={true} className={style.inpt} type="checkbox" id={value} {...register} value={value} />
                                            <span className={style.checkmark}></span>
                                        </label>
                                    </div>
                        return <div key={index} className={style.box}>
                                    <label className={style.checkboxContainer}>{labels[index]}
                                        <input onClick={handleCheckInputs} className={style.inpt} type="checkbox" id={value} {...register} value={value} />
                                        <span className={style.checkmark}></span>
                                    </label>
                                </div>
                    })}
                </div>
            </div>
        </>
    )
}