const powerSet = (str, accum = "") => {
  let uniqueValues = [];
  for (let i = 0; i < str.length; i++) {
    uniqueValues.push(accum + str[i]);
    uniqueValues = uniqueValues.concat(
      powerSet(str.slice(0, i) + str.slice(i + 1, 0), accum + str[i])
    );
  }
  return uniqueValues;
};

console.log(powerSet("abc"));
// [
//   'a',   'b',
//   'ba',  'c',
//   'ca',  'cb',
//   'cba'
// ]

const permutations = (str, accum = "") => {
  if (str.length === 0) {
    return accum;
  }
  let uniqueStrings = [];
  for (let i = 0; i < str.length; i++) {
    uniqueStrings = uniqueStrings.concat(
      permutations(str.slice(0, i) + str.slice(i + 1), accum + str[i])
    );
  }
  return uniqueStrings;
};

console.log(permutations("abcd"));
// [ 'abc', 'acb', 'bac', 'bca', 'cab', 'cba' ]

const combinations = (str, accum = "", k) => {
  if (accum.length === k) {
    return accum;
  }
  let uniqueStrings = [];
  for (let i = 0; i < str.length; i++) {
    uniqueStrings = uniqueStrings.concat(combinations(str, accum + str[i], k));
  }
  return uniqueStrings;
};

console.log(combinations("abc", "", 2));
// [
//   'aaa', 'aab', 'aac', 'aba',
//   'abb', 'abc', 'aca', 'acb',
//   'acc', 'baa', 'bab', 'bac',
//   'bba', 'bbb', 'bbc', 'bca',
//   'bcb', 'bcc', 'caa', 'cab',
//   'cac', 'cba', 'cbb', 'cbc',
//   'cca', 'ccb', 'ccc'
// ]
