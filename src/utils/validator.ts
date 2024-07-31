import { RuleObject } from "antd/es/form";

export const validator = (_:RuleObject, value:string) => {
  const regex = "/^(84|85)\d{0,7}$/";
  if (!value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('O número deve começar com 84 ou 85 e ter no máximo 9 dígitos'));
};