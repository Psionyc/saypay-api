export function autoCorrelate(
	buffer: Float32Array,
	sampleRate: number,
): number {
	const SIZE = buffer.length;
	let rms = 0;

	// Root mean square to check if signal is strong enough
	for (let i = 0; i < SIZE; i++) {
		const val = buffer[i];
		rms += val * val;
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01) return -1; // Too quiet

	let r1 = 0;
	let r2 = SIZE - 1;
	const threshold = 0.2;

	// Trim leading silence
	for (let i = 0; i < SIZE / 2; i++) {
		if (Math.abs(buffer[i]) < threshold) {
			r1 = i;
			break;
		}
	}

	// Trim trailing silence
	for (let i = 1; i < SIZE / 2; i++) {
		if (Math.abs(buffer[SIZE - i]) < threshold) {
			r2 = SIZE - i;
			break;
		}
	}

	const trimmed = buffer.slice(r1, r2);
	const trimmedSize = trimmed.length;
	const autocorr = new Array<number>(trimmedSize).fill(0);

	// Autocorrelation calculation
	for (let lag = 0; lag < trimmedSize; lag++) {
		for (let i = 0; i < trimmedSize - lag; i++) {
			autocorr[lag] += trimmed[i] * trimmed[i + lag];
		}
	}

	// Find the first valley
	let d = 0;
	while (autocorr[d] > autocorr[d + 1]) d++;

	// Find peak after the valley
	let maxval = -1;
	let maxpos = -1;
	for (let i = d; i < trimmedSize; i++) {
		if (autocorr[i] > maxval) {
			maxval = autocorr[i];
			maxpos = i;
		}
	}

	if (maxval > 0 && maxpos > 0) {
		const T0 = maxpos;
		const pitch = sampleRate / T0;
		return pitch;
	}

	return -1;
}
