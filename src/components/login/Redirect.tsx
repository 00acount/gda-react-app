import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

type Props = {
    to: string 
}
export default function({ to }: Props) {
    const navigateTo = useNavigate();

    useEffect(() => {
        navigateTo(to)
    }, [])
    return <></>
}