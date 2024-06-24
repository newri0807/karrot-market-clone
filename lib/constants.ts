export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
export const PASSWORD_REGEX_ERROR = "비밀번호는 최소 하나의 문자, 하나의 숫자, 하나의 특수문자를 포함해야 하며, 최소 6자리 이상이어야 합니다.";
