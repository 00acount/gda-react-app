export const getToken = (): string => {
    const token = localStorage.getItem('Authorization') ?? '';
    return `Bearer ${token}`;
}