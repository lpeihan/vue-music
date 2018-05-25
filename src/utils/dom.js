export function getAttributeData(el, name, val) {
  const prefix = 'data-';
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
}

export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }

  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}
