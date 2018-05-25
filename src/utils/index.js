export function leftpad(num, n = 2) {
  let len = num.toString().length;
  while (len < n) {
    num = '0' + num;
    len++;
  }
  return num;
}

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export function shuffle(arr) {
  let tmp = arr.slice();
  for (let i = 0; i < tmp.length; i++) {
    let j = getRandom(0, i);
    let t = tmp[i];
    tmp[i] = tmp[j];
    tmp[j] = t;
  }
  return tmp;
}
