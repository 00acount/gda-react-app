export const getCookie = (name: string): string => {

    const cookieRegex = new RegExp(`(?:^|;)\\s*${name}=([^;]*)`);
    const token = document.cookie.match(cookieRegex)?.at(1);
    return token ?? ''
}