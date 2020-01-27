import * as _ from 'lodash';
import { isValid, isBefore, startOfDay, endOfDay } from 'date-fns';

import { Genders, User } from '@app/core/user/user.model';


export function sample<T>(arr: T[]): T {
    return arr[_.random(arr.length - 1)];
}


export function randomDate(from: Date, to: Date): Date {
    if (!(isValid(from) && isValid(to) && isBefore(from, to)))
        throw new Error('Valid dates expected');

    return new Date(_.random(startOfDay(from).getTime(), endOfDay(to).getTime()));
}


export function generateUser(): User {
    const gender = sample([Genders.Male, Genders.Male, Genders.Male, Genders.Female]);

    const maleNames = 'John Jack Pete Rob Phil Mike Tom Fred'.split(' ');
    const femaleNames = 'Megan Alice Kate Rose Diana Marie'.split(' ');

    return {
        id: Number(_.uniqueId()),
        gender,
        firstName: sample(gender === Genders.Male ? maleNames : femaleNames),
        lastName: sample('Johnson Peterson Doe Philips Daniels Anderson Fox Benson'.split(' ')),
        dateOfBirth: randomDate(new Date('1960-01-01'), new Date('2000-01-01')),
        rating: _.random(1, 10),
    };
}


export function ensure(cond: boolean, errMsg: string): void {
    if (!cond) throw new Error(errMsg);
}


export function isNumber(val: any): boolean {
    return typeof val === 'number' && isFinite(val);
}


export function isNumeric(val: any): boolean {
    if (isNumber(val)) return true;

    if (typeof val !== 'string') return false;

    val = val.trim();

    if (val === '') return false;

    return isNumber(Number(val));
}


export function colorToRgb(color: string) {
    const span = document.createElement('span');

    span.style.color = color;
    span.style.display = 'none';

    document.body.appendChild(span);

    const rgbColorStr = window.getComputedStyle(span).color;

    document.body.removeChild(span);

    const [, r, g, b] = (rgbColorStr as string).match(/rgba?\((\d+), (\d+), (\d+)/);

    return [r, g, b].map(Number);
}
