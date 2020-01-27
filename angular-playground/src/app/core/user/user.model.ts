export enum Genders {
    Male,
    Female,
}

export interface User {
    id: number,
    gender: Genders,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    rating: number,
}
