'use strict';

// Функция проверки палиндрома на JavaScript
export function isPalindromeJSSuperFast(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
      // Игнорируем не буквенно-цифровые символы слева
      while (left < right && !((s[left] >= '0' && s[left] <= '9') || (s[left] >= 'a' && s[left] <= 'z') || (s[left] >= 'A' && s[left] <= 'Z'))) {
          left++;
      }
      // Игнорируем не буквенно-цифровые символы справа
      while (left < right && !((s[right] >= '0' && s[right] <= '9') || (s[right] >= 'a' && s[right] <= 'z') || (s[right] >= 'A' && s[right] <= 'Z'))) {
          right--;
      }
      // Сравнение символов
      if (s[left] !== s[right]) {
          // Сравнение символов, с учетом регистра
          if (s[left].toLowerCase() !== s[right].toLowerCase()) {
              return false;
          }
      }
      left++;
      right--;
  }
  return true;
}
