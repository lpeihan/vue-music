function serialize(val) {
  return JSON.stringify(val);
}

function deserialize(val) {
  try {
    return JSON.parse(val);
  } catch (e) {}
}

const store = {
  storage: window.localStorage,
  setItem(key, val) {
    this.storage.setItem(key, serialize(val));
  },
  getItem(key) {
    return deserialize(this.storage.getItem(key));
  },
  removeItem(key) {
    this.storage.removeItem(key);
  },
  clear() {
    this.storage.clear();
  }
};

export default store;