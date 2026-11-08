export function makeFirstLetterSmall(str) {
	if (!str) return "";
	return str.charAt(0).toLowerCase() + str.slice(1);
}
