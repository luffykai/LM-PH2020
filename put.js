/*!
 * Add items to an object at a specific path
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Object}       obj  The object
 * @param  {String|Array} path The path to assign the value to
 * @param  {*}            val  The value to assign
 */
const put = function (obj, path, val) {

	/**
	 * If the path is a string, convert it to an array
	 * @param  {String|Array} path The path
	 * @return {Array}             The path array
	 */
	var stringToPath = function (path) {

		// If the path isn't a string, return it
		if (typeof path !== 'string') return path;
		return path.split('.');

	};

	// Convert the path to an array if not already
	path = stringToPath(path);

	// Cache the path length and current spot in the object
	var length = path.length;
	var current = obj;

	// Loop through the path
	path.forEach(function (key, index) {

		// Check if the assigned key should be an array
		// var isArray = key.slice(-2) === '[]';
		let isArray = false;
		const isArrayMatch = /\[(0|[1-9][0-9]*)?\]/.exec(key);
		if(isArrayMatch != null) {
			isArray = true;
		}

		// If so, get the true key name by removing the trailing []
		// of the trailing [{SOME_RANDOM_INDEX}]
		key = isArray ? key.substring(0, isArrayMatch.index) : key;

		// If the key should be an array and isn't, create an array
		if (isArray && Object.prototype.toString.call(current[key]) !== '[object Array]') {
			current[key] = [];
		}

		// If this is the last item in the loop, assign the value
		if (index === length -1) {

			// If it's an array, push the value
			// Otherwise, assign it
			if (isArray) {
				// depending on whether the index is specified
				if (isArrayMatch != null && isArrayMatch[1] != null) {
					current[key][Number(isArrayMatch[1])] = val;
				} else {
					current[key].push(val);
				}

			} else {
				if( current == null) {
					current = {};
					current
				}
				current[key] = val;
			}
		}

		// Otherwise, update the current place in the object
		else {

			// If the key doesn't exist, create it
			if (!current[key]) {
				current[key] = {};
			}

			// Update the current place in the object
			current = current[key];
			if (isArray && isArrayMatch[1] != null) {
				if(current[Number(isArrayMatch[1])] == null) {
					current[Number(isArrayMatch[1])] = {};
				}
				current = current[Number(isArrayMatch[1])];
			}

		}

	});

};

module.exports = put;
