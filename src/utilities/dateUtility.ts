export function getDate(date: string, separator: string, reverse = false): string {
    const arrDate = date.split('-')
    const day = arrDate.at(2)
    const month = arrDate.at(1)
    const year =  arrDate.at(0)
    if (reverse)
        return `${year}${separator}${month}${separator}${day}`
    return `${day}${separator}${month}${separator}${year}`
}