import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';


interface ITodo {
    id: number;
    name: string;
    done: boolean;
}


const words = 'foo bar baz qux quux corge grault garply waldo fred plugh xyzzy thud'.split(' ');


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    todos: ITodo[] = _.times(8, () => ({
        id: id(),
        name: _.chain(words).sampleSize(_.random(1, 5)).join(' ').upperFirst().value(),
        //done: _.sample([true, false, false]),
        done: false,
    }));

    ngOnInit() { this.todos.sort(compareTodo) }

    addTodo(name: string): void { this.todos.unshift({ id: id(), name, done: false }) }

    removeTodo(id: number): void { this.todos = this.todos.filter(x => x.id !== id) }

    toggleTodo(todo: ITodo, done: boolean): void { todo.done = done; this.todos.sort(compareTodo) }

    markAllTodosDone(): void { this.todos.forEach(x => x.done = true) }

    clearDoneTodos(): void { this.todos = this.todos.filter(x => !x.done) }
}


function id(): number { return Number(_.uniqueId()) }

function compareTodo(a: ITodo, b: ITodo): number {
    if (a.done === b.done) return 0;
    else if (a.done === false) return -1;

    return 0;
}

function isNumber(val: any): boolean { return typeof val === 'number' && isFinite(val) }

function random(min: number, max: number): number {
    if (!(isNumber(min) && isNumber(max))) throw new Error('Numbers expected');

    if (!(min <= max)) throw new Error('"min" <= "max" expected');

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample<T>(arr: T[]): T { return arr[random(0, arr.length - 1)] }

// function test(x: string): void { console.log(x) }
//
// test(null);
