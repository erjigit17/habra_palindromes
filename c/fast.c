#include <node_api.h>
#include <stdbool.h>
#include <ctype.h>
#include <stdlib.h>

// Функция для проверки, является ли символ буквенно-цифровым
bool isAlphanumeric(char c) {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

// Функция для проверки палиндрома
bool isPalindrome(const char* s, size_t length) {
    size_t left = 0;
    size_t right = length - 1;

    while (left < right) {
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Обертка для Node.js
napi_value IsPalindrome(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    size_t length;
    napi_get_value_string_utf8(env, args[0], NULL, 0, &length);

    char* str = (char*)malloc(length + 1);
    napi_get_value_string_utf8(env, args[0], str, length + 1, &length);

    bool result = isPalindrome(str, length);
    free(str);

    napi_value returnValue;
    napi_get_boolean(env, result, &returnValue);

    return returnValue;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_value isPalindromeFunction;
    napi_create_function(env, NULL, 0, IsPalindrome, NULL, &isPalindromeFunction);
    napi_set_named_property(env, exports, "isPalindromeCFast", isPalindromeFunction);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
