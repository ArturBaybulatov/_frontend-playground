import './index.html';
import { test, test2 } from './modules/foo';


const log = function(val: any) { console.log(val) };


const getDataAsync = function(shouldReject?: Boolean): Promise<string> {
    return new Promise(function(resolve: Function, reject: Function) {
        setTimeout(function() {
            if (shouldReject)
                return reject(new Error('Sorry'));
            else
                resolve(123); // Should complain
        }, 2000);
    });
};

const handleRejection = function(err: Error) {
    console.error(err);
    alert(err.message);
};

getDataAsync()
    .then(log)
    .catch(handleRejection);
