let getSingle = (C, ...params) => {
  let result
  return function () {
    return result || (result = new C(...params))
  }
}

export default getSingle
