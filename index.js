'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isPalindromeJSbase } from './js/base.js';
import { isPalindromeJSFast } from './js/fast.js';
import { isPalindromeJSSuperFast } from './js/superFast.js';
import { isPalindromeCFast } from './c/fastC.js';
import { isPalindromeFastSIMD } from './c/fastSIMD.js';
import { isPalindromeSuperFastС } from './c/superFastC.js';


// Установка количества итераций
const iterations = +process.env.ITERATIONS;

if (!iterations) throw 'количество итераций не задано, проверьте что вы используете .env';

function measureBaseExecutionTime(iterations, isPalindromeFn, methodName) {
    console.log(`\nЗапуск тестирования для метода: ${methodName}`);
    const strings = readStringsFromFile();

    // Прогрев оптимизаторов движка v8
    for (let i = 0; i < iterations; i++) {
        isPalindromeFn(strings[i]);
    }

    // Замер времени выполнения для функции
    const startTime = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        isPalindromeFn(strings[i]);
    }

    const endTime = process.hrtime.bigint();
    const executionTime = endTime - startTime;
    console.log(`Время выполнения для ${iterations.toLocaleString()} итераций (${methodName}): ${executionTime.toLocaleString()} наносекунд`);
    return executionTime;
}

function measureExecutionTime(iterations, isPalindromeFn, methodName, baseTime) {
    console.log(`\nЗапуск тестирования для метода: ${methodName}`);
    const strings = readStringsFromFile();

    // Прогрев оптимизаторов движка v8
    for (let i = 0; i < iterations; i++) {
        isPalindromeFn(strings[i]);
    }

    // Замер времени выполнения для функции
    const startTime = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
        isPalindromeFn(strings[i]);
    }

    const endTime = process.hrtime.bigint();
    const executionTime = endTime - startTime;
    const relativeSpeed = (Number(baseTime) / Number(executionTime)).toFixed(2);
    console.log(`Время выполнения для ${iterations.toLocaleString()} итераций (${methodName}): ${executionTime.toLocaleString()} наносекунд (${relativeSpeed} раз(а) быстрее базового js)`);
    return executionTime;
}

// Функция для чтения строк из файла
function readStringsFromFile() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, 'strings.txt');
    if (!fs.existsSync(filePath)) {
        throw new Error('Файл со строками не найден. Пожалуйста, запустите seed.js для генерации строк.');
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').filter(line => line.trim() !== '');
}

// Запуск замера времени выполнения для всех решений
console.log('Чтение строк из файла...');
const baseTime = measureBaseExecutionTime(iterations, isPalindromeJSbase, 'isPalindromeJSbase');
measureExecutionTime(iterations, isPalindromeJSFast, 'isPalindromeJSFast', baseTime);
measureExecutionTime(iterations, isPalindromeJSSuperFast, 'isPalindromeJSSuperFast', baseTime);
measureExecutionTime(iterations, isPalindromeCFast, 'isPalindromeCFast', baseTime);
measureExecutionTime(iterations, isPalindromeSuperFastС, 'isPalindromeSuperFastС', baseTime);
measureExecutionTime(iterations, isPalindromeFastSIMD, 'isPalindromeFastSIMD', baseTime);
