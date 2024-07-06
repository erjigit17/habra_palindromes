'use strict';

// Функция проверки палиндрома на JavaScript, встроеными методами
export const isPalindromeJSbase = (s) => {
    const clear = s.replace(/[^a-zA-a0-9]/g, '').toLowerCase();

    return clear === [...clear].reverse().join('')
}