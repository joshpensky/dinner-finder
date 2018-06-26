export default str => {
  return str.split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.substr(1))
    .join(' ');
}