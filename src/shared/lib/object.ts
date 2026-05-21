/**
 * 객체의 Key와 Value를 뒤집어주는 유틸리티 함수
 * @template T - Key와 Value가 모두 PropertyKey(string | number | symbol)인 객체
 * @param obj - 뒤집을 원본 객체
 * @returns Key와 Value가 뒤집힌 새로운 객체
 */
export function invertObject<T extends Record<PropertyKey, PropertyKey>>(
  obj: T
): { [K in keyof T as T[K]]: K } {
  const inverted: Record<PropertyKey, PropertyKey> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value in inverted) {
      const previousKey = inverted[value];

      console.warn(
        `🚨 [invertObject Warning]: 원본 객체에 중복된 Value '${String(value)}'가 존재합니다.\n` +
          `뒤집힌 객체에서 Key '${String(value)}'의 값이 '${String(previousKey)}'에서 '${String(key)}'(으)로 덮어씌워집니다.`
      );
    }

    inverted[value] = key;
  }

  return inverted as { [K in keyof T as T[K]]: K };
}
