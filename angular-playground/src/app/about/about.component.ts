import * as _ from 'lodash';
import * as dateFns from 'date-fns';
import * as rx from 'rxjs';
import * as rxop from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as util from '@app/core/util';


const { ensure, isNumeric } = (window as any).util = util;

const log = (window as any).log = function(val: any, colorWithAlpha?: string | null, bgColorWithAlpha?: string | null, bold?: boolean | null) {
    const styles: string[] = [];

    if (typeof colorWithAlpha === 'string') {
        const arr: string[] = colorWithAlpha.split(/\s+/);

        ensure(arr[0] !== '', 'Non-empty string expected');
        const color = arr[0];

        if (arr.length === 1) styles.push(`color: ${ color }`);

        else if (arr.length === 2) {
            ensure(isNumeric(arr[1]), 'Numeric expected');
            const alpha = Number(arr[1]);

            styles.push(`color: rgba(${ util.colorToRgb(color).concat(alpha).join(', ') })`);
        }

        else throw new Error('Array of length 1-2 expected');
    }

    if (typeof bgColorWithAlpha === 'string') {
        const arr: string[] = bgColorWithAlpha.split(/\s+/);

        ensure(arr[0] !== '', 'Non-empty string expected');
        const color = arr[0];

        if (arr.length === 1) styles.push(`background-color: ${ color }`);

        else if (arr.length === 2) {
            ensure(isNumeric(arr[1]), 'Numeric expected');
            const alpha = Number(arr[1]);

            styles.push(`background-color: rgba(${ util.colorToRgb(color).concat(alpha).join(', ') })`);
        }

        else throw new Error('Array of length 1-2 expected');
    }

    if (bold) styles.push('font-weight: bold');

    console.log(`%c${ val }`, styles.join(';\n'));

    return val;
};

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/';


@Component({
    selector: 'c-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.less'],
})
export class AboutComponent implements OnInit {
    foo = util.sample([true, false]);

    time$ = new rx.Observable<string>(function(subscriber) {
        setInterval(() => subscriber.next(dateFns.format(new Date(), 'HH:mm:ss')), 1000);
    });

    constructor(private httpClient: HttpClient) {}

    ngOnInit() {
        const colors$ = new rx.Observable<string>(function(subscriber) {
            let i = 0;
            const colors = 'red green blue yellow purple orange pink violet teal olive gold brown maroon magenta indigo gray black white'.split(' ');
            let timeoutId: number;

            (function run() {
                subscriber.next(log(`[${ ++i }] ${ _.sample(colors) }`, 'blue 0.4'));

                // if (i === 5) throw new Error(`[${ i }] Example error [colors$]`);
                // ^ Throws, but still completes...

                timeoutId = setTimeout(run, 300);
            }());

            setTimeout(function() {
                clearTimeout(timeoutId);
                log('COLORS COMPLETE', 'blue');
                subscriber.complete(); // This (and below) required for `forkJoin(...)` to work
            }, 4000);
        });

        const animals$ = new rx.Observable<string>(function(subscriber) {
            let i = 0;
            const animals = 'cat dog monkey parrot elephant crocodile giraffe horse cow snake pigeon bear tiger wolf fox deer'.split(' ');
            let timeoutId: number;

            const run = function() {
                subscriber.next(log(`[${ ++i }] ${ _.sample(animals) }`, 'magenta 0.4'));
                timeoutId = setTimeout(run, 1000);
            };

            run();
            // setTimeout(run, 2000); // Initial delay

            setTimeout(function() {
                clearTimeout(timeoutId);
                log('ANIMALS COMPLETE', 'magenta');
                subscriber.complete();
            }, 8000);
        });


        // animals$.subscribe(
        //     x => log(`animal: ${ x }`, 'white', 'magenta 0.4'),
        //     err => log(err.message, 'red', 'yellow 0.4'),
        //     () => log('ANIMALS COMPLETE', 'white', 'magenta'),
        // );


        // colors$
        //     .pipe(
        //         rxop.takeWhile(x => !/red|green|blue/.test(x)),
        //         rxop.map(x => x.toUpperCase()),
        //     )
        //
        //     .subscribe(
        //         x => log(`color: ${ x }`, 'white', 'blue 0.4'),
        //         err => log(err.message, 'red', 'yellow 0.4'),
        //         () => log('COLORS COMPLETE', 'white', 'blue'),
        //     );


        // rx.zip(
        //     colors$.pipe(rxop.takeWhile(x => !/red|green|blue/.test(x))),
        //     animals$,
        // )
        //     .subscribe(
        //         ([color, animal]) => log(`${ color } ${ animal }`, 'white', 'black 0.4'),
        //         err => log(err.message, 'red', 'yellow 0.4'),
        //         () => log('COMPLETE', 'white', 'black'),
        //     );


        // rx.forkJoin(animals$, colors$).subscribe(
        //     ([color, animal]) => log(`${ color } ${ animal }`, 'white', 'black 0.4'),
        //     err => log(err.message, 'red', 'yellow 0.4'),
        //     () => log('COMPLETE', 'white', 'black'),
        // );


        // rx.combineLatest(animals$, colors$).subscribe(
        //     ([animal, color]) => log(`${ color } ${ animal }`, 'white', 'black 0.4'),
        //     err => log(err.message, 'red', 'yellow 0.4'),
        //     () => log('COMPLETE', 'white', 'black'),
        // );


        // animals$
        //     .pipe(rxop.withLatestFrom(colors$))
        //
        //     .subscribe(
        //         ([animal, color]) => log(`${ color } ${ animal }`, 'white', 'black 0.4'),
        //         () => {},
        //         () => log('COMPLETE', 'white', 'black'),
        //     );


        //--------------------------


        // rx.forkJoin(
        //     this.httpClient.get(`${ API_BASE_URL }todos/1`),
        //     this.httpClient.get(`${ API_BASE_URL }todos/5`),
        // )
        //     .subscribe(
        //         ([todo1, todo5]) => { log(todo5); log(todo1) },
        //         err => log(`[Error] ${ err.message }`),
        //     );


        //--------------------------


        let i = 0;

        const a$ = rx.fromEvent(document, 'keydown').pipe(
            rxop.map(evt => (evt as KeyboardEvent).key),
            rxop.filter(key => key === 'f'),
            rxop.map(key => `${ key }-${ ++i }`),
            rxop.tap(key => log(key, 'blue 0.4')),
        );


        let j = 0;

        const b$ = rx.fromEvent(document, 'keydown').pipe(
            rxop.map(evt => (evt as KeyboardEvent).key),
            rxop.filter(key => key === 'j'),
            rxop.map(key => `${ key }-${ ++j }`),
            rxop.tap(key => log(key, 'magenta 0.4')),
        );


        rx.zip(a$, b$)
            .pipe(rxop.debounceTime(500))

            .subscribe(
                ([a, b]) => log(`${ a } ${ b }`, 'white', 'black 0.4'),
                err => log(err.message, 'red', 'yellow 0.4'),
                () => log('COMPLETE', 'white', 'black'),
            );
    }
}
