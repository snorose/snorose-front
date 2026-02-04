import { isNumber } from '@/shared/lib';

export function validateUserName(value = '') {
  const format = /^[A-Za-z가-힣ㄱ-ㅎ]+$/;

  if (value.length === 0) {
    return 'default';
  }

  if (format.test(value) && value.length >= 2 && value.length <= 30) {
    return 'valid';
  }

  return 'error';
}

export function validateSookmyungEmail(value = '') {
  const domain = value.split('@')[1];

  if (value.length === 0) {
    return 'default';
  }

  if (domain === 'sookmyung.ac.kr' || domain === 'sm.ac.kr') {
    return 'valid';
  }

  return 'error';
}

export function validateId(value = '') {
  const format = /^[A-Za-z0-9]+$/;

  if (value.length === 0) {
    return 'default';
  }

  if (format.test(value) && value.length >= 5 && value.length <= 30) {
    return 'valid';
  }

  return 'error';
}

export function validatePassword(value = '') {
  const format = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#%^&*])[A-Za-z\d!@#%^&*]+$/;

  if (value.length === 0) {
    return 'default';
  }

  if (format.test(value) && value.length >= 8 && value.length <= 16) {
    return 'valid';
  }

  return 'error';
}

export function validateNickname(value = '') {
  const format = /^[A-Za-z가-힣ㄱ-ㅎ0-9]+$/;

  if (value.length === 0) {
    return 'default';
  }

  if (format.test(value) && value.length >= 2 && value.length <= 20) {
    return 'valid';
  }

  return 'error';
}

export function validateStudentNumber(value = '') {
  if (value.length === 0) {
    return 'default';
  }

  if (isNumber(value) && value.length === 7) {
    return 'valid';
  }

  return 'error';
}

export function validateBirthday(value) {
  const format = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (value.length === 0) {
    return 'default';
  }

  if (!format.test(value)) {
    return 'error';
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'error';
  }

  const today = new Date();
  if (date > today) {
    return 'error';
  }

  return 'valid';
}

export function validateEmail(value) {
  const format = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (value.length === 0) {
    return 'default';
  }

  if (format.test(value)) {
    return 'valid';
  }

  return 'error';
}
