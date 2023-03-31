export interface DrActionInfo {
	id: string
	command: string
	isRunning: boolean
	requestId: number //Will be checked in the CheckStatusResponseFeedback callback.
}

export interface DrFeedbackInfo {
	id: string
	type: string
	requestId: number
	statusTimer: NodeJS.Timer
	can: boolean
	statusCommand: string
}

export interface DrCompanionInfo {
	controlId: string,
	drFeedbackInfo: DrFeedbackInfo
	drActionInfo: DrActionInfo
}