'use strict';

// Функция проверки палиндрома на JavaScript
export function isPalindromeJSFast(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
      // Игнорируем не буквенно-цифровые символы слева
      while (left < right && !isAlphanumeric(s[left])) {
          left++;
      }
      // Игнорируем не буквенно-цифровые символы справа
      while (left < right && !isAlphanumeric(s[right])) {
          right--;
      }
      // Сравнение символов, с учетом регистра
      if (s[left].toLowerCase() !== s[right].toLowerCase()) {
          return false;
      }
      left++;
      right--;
  }
  return true;
}

// Функция для проверки, является ли символ буквенно-цифровым
function isAlphanumeric(c) {
  return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}