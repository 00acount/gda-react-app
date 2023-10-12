export interface Student {
    id: number,
    firstName: string,
    lastName: string,
    apogeeCode: number
    birthDate: string
    sector: Sector,
    semester: string
}

export interface Student_SectorId {
    id: number,
    firstName: string,
    lastName: string,
    apogeeCode: number
    birthDate: string
    sector: number,
    semester: string
}

export interface Sector {
    id: number,
    abbr: string,
    name: string
}

export interface UserWithoutPassword {
    id: number
    firstName: string
    lastName: string
    email: string
    registeredOn: string
    lastSeen: Date
    role: string
}

export interface User extends UserWithoutPassword {
    password: string
}

export interface Module {
    id: number
    name: string
    sectors: Sector []
    semesters: string []
    
}

export interface Session {
    id: number
    user: UserWithoutPassword
    module: Module
    sector: Sector
    semester: string
    sessionTime: string
    createdAt: string
}

export interface Absence {
    student: Student
    session: Session
    status: string
}