class LocalStorage {
	storeData(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	getData(key) {
		return JSON.parse(localStorage.getItem(key));
	}

	removeData(key) {
		localStorage.removeItem(key);
	}

	clearData() {
		localStorage.clear();
	}
}
