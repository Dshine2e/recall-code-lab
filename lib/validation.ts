// 회원가입·로그인 입력 규칙(서버와 화면이 함께 쓴다)
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 8;
// bcrypt 는 72바이트까지만 쓴다. 그보다 긴 비밀번호는 받지 않는다.
export const PASSWORD_MAX = 72;

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function usernameError(username: string): string | null {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) return `아이디는 ${USERNAME_MIN}~${USERNAME_MAX}자로 해 주세요.`;
  if (!/^[a-z0-9_]+$/.test(username)) return '아이디는 영문 소문자, 숫자, 밑줄(_)만 쓸 수 있어요.';
  return null;
}

export function passwordError(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `비밀번호는 ${PASSWORD_MIN}자 이상이어야 해요.`;
  if (new TextEncoder().encode(password).length > PASSWORD_MAX) return `비밀번호가 너무 길어요(${PASSWORD_MAX}바이트 이하).`;
  return null;
}
