export type Student = {
    id: number
    firstName: string
    lastName: string
    apogeeCode: number
    birthDate: string
    sector: Sector
    semester: string
}

export type Student_SectorId = {
    id: number
    firstName: string
    lastName: string
    apogeeCode: number
    birthDate: string
    sector: number
    semester: string
}

export type Student_SectorId = Omit<Student, 'sector'> 
                                    & { sector: number }

export type Sector = {
    id: number
    abbr: string
    name: string
}

export type User =  {
    id: number
    firstName: string
    lastName: string
    email: string
    registeredOn: string
    lastSeen: Date
    role: string
    password: string
    isOnline: boolean
}

export type UserWithoutPassword = Omit<User, 'password'>

export type Module = {
    id: number
    name: string
    sectors: Sector []
    semesters: string []
    
}

export type Session = {
    id: number
    user: UserWithoutPassword
    module: Module
    sector: Sector
    semester: string
    sessionTime: string
    createdAt: string
}

export type Absence = {
    student: Student
    session: Session
    status: string
}