//import storage from 'electron-json-storage'
//import promisify from 'es6-promisify'

//const get =promisify(localStorage.getItem,localStorage)
//const set =promisify(localStorage.setItem,localStorage)

export const getStorage = key => {
  let value=localStorage.getItem(key)
  let parsedValue=JSON.parse(value);
  return parsedValue;
}

export const setStorage = (key, value) => {
  let stringifiedValue= JSON.stringify(value);
  return localStorage.setItem(key,stringifiedValue);
}
