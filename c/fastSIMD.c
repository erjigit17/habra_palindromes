#include <node_api.h>
#include <stdbool.h>
#include <ctype.h>
#include <stdlib.h>

#if defined(__ARM_NEON) || defined(__ARM_NEON__)
#include <arm_neon.h>
#elif defined(__SSE2__)
#include <emmintrin.h>
#elif defined(__AVX2__)
#include <immintrin.h>
#endif

// Функция для проверки, является ли символ буквенно-цифровым
bool isAlphanumeric(char c) {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

// Функция для проверки палиндрома с использованием векторизации
bool isPalindromeFastSIMD(const char* s, size_t length) {
    size_t left = 0;
    size_t right = length - 1;

    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }

#if defined(__ARM_NEON) || defined(__ARM_NEON__)
        // Используем NEON для обработки 16 символов за раз
        uint8x16_t v_left = vld1q_u8((const uint8_t*)&s[left]);
        uint8x16_t v_right = vld1q_u8((const uint8_t*)&s[right]);

        // Преобразуем символы к нижнему регистру
        uint8x16_t v_tolower = vdupq_n_u8(32);
        uint8x16_t v_left_lower = vorrq_u8(v_left, v_tolower);
        uint8x16_t v_right_lower = vorrq_u8(v_right, v_tolower);

        // Сравним символы
        uint8x16_t v_cmp = vceqq_u8(v_left_lower, v_right_lower);

        // Если есть несовпадения
        uint64x2_t v_cmp_reduction = vreinterpretq_u64_u8(v_cmp);
        if (vgetq_lane_u64(v_cmp_reduction, 0) != 0xFFFFFFFFFFFFFFFF || vgetq_lane_u64(v_cmp_reduction, 1) != 0xFFFFFFFFFFFFFFFF) {
            return false;
        }

        left += 16;
        right -= 16;
#elif defined(__SSE2__) || defined(__AVX2__)
        // Используем SSE2/AVX2 для обработки 16 или 32 символов за раз
        __m128i v_left = _mm_loadu_si128((__m128i*)&s[left]);
        __m128i v_right = _mm_loadu_si128((__m128i*)&s[right]);

        // Преобразуем символы к нижнему регистру
        __m128i v_tolower = _mm_set1_epi8(32);
        __m128i v_left_lower = _mm_or_si128(v_left, v_tolower);
        __m128i v_right_lower = _mm_or_si128(v_right, v_tolower);

        // Сравним символы
        __m128i v_cmp = _mm_cmpeq_epi8(v_left_lower, v_right_lower);

        // Если есть несовпадения
        if (_mm_movemask_epi8(v_cmp) != 0xFFFF) {
            return false;
        }

        left += 16;
        right -= 16;
#else
        // Если векторизация не поддерживается, используем обычный цикл
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        left++;
        right--;
#endif
    }

    return true;
}

// Обертка для Node.js
napi_value IsPalindromeFastSIMD(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    size_t length;
    napi_get_value_string_utf8(env, args[0], NULL, 0, &length);

    char* str = (char*)malloc(length + 1);
    napi_get_value_string_utf8(env, args[0], str, length + 1, &length);

    bool result = isPalindromeFastSIMD(str, length);
    free(str);

    napi_value returnValue;
    napi_get_boolean(env, result, &returnValue);

    return returnValue;
}

napi_value InitVector(napi_env env, napi_value exports) {
    napi_value isPalindromeFunction;
    napi_create_function(env, NULL, 0, IsPalindromeFastSIMD, NULL, &isPalindromeFunction);
    napi_set_named_property(env, exports, "isPalindromeFastSIMD", isPalindromeFunction);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, InitVector)
