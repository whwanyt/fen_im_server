import bcrypt = require("bcryptjs");

export function passwordHash(password:string){
  return bcrypt.hashSync(password, 10)
}

export function passwordVerify(inputPassword:string,password:string){
  return bcrypt.compareSync(inputPassword, password)
}