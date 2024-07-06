'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Установка количества итераций, длины строк и seed
const iterations = +process.env.ITERATIONS;
const stringLength = +process.env.STRING_LENGTH;
const seed = +process.env.SEED;

// Получение текущего пути файла
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'strings.txt');

// Линейный конгруэнтный генератор (LCG) для генерации псевдослучайных чисел с фиксированным seed
function lcg(seed) {
    return function() {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    };
}

// Функция для генерации случайной строки заданной длины с использованием LCG
function generateRandomString(length, randomFunc) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(randomFunc() * characters.length));
    }
    return result;
}

// Функция для генерации палиндрома заданной длины с использованием LCG
function generatePalindrome(length, randomFunc) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let halfLength = Math.floor(length / 2);
    let firstHalf = '';
    for (let i = 0; i < halfLength; i++) {
        firstHalf += characters.charAt(Math.floor(randomFunc() * characters.length));
    }
    let secondHalf = firstHalf.split('').reverse().join('');
    if (length % 2 !== 0) {
        secondHalf = characters.charAt(Math.floor(randomFunc() * characters.length)) + secondHalf;
    }
    return firstHalf + secondHalf;
}

// Функция для генерации строк и сохранения их в файл с использованием потоков
function generateStringsToFile(filePath, iterations, stringLength, seed) {
    const randomFunc = lcg(seed);

    // Удаление файла, если он существует
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

    // Генерация палиндромов
    for (let i = 0; i < iterations / 2; i++) {
        const palindrome = generatePalindrome(stringLength, randomFunc);
        writeStream.write(palindrome + '\n');
    }

    // Генерация непалиндромов
    for (let i = 0; i < iterations / 2; i++) {
        const randomString = generateRandomString(stringLength, randomFunc);
        writeStream.write(randomString + '\n');
    }

    writeStream.end(() => {
        console.log(`Строки сгенерированы и сохранены в файл ${filePath}`);
    });
}

// Генерация строк и сохранение в файл
generateStringsToFile(filePath, iterations, stringLength, seed);
