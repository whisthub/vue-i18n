// # pick-plural.js
export default function pickPlural(array, nr) {
	if (array.length === 2) {
		return nr === 1 ? array[0] : array[1];
	} else if (array.length === 3) {
		return array[nr >= 2 ? 2 : Math.max(0, nr)];
	} else {
		return array[0];
	}
}
