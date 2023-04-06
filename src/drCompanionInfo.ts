import { CompanionOptionValues } from '@companion-module/base'

// Custom interface that describes Companion action properties helpful for the module workflow.
export interface DrActionInfo {
	controlId: string
	command: string
	isRunning: boolean
	requestId: number //Will be checked in the CheckStatusResponseFeedback callback.
}

// Custom interface that describes Companion feedback properties helpful for the module workflow.
export interface DrFeedbackInfo {
	controlId: string
	feedbackId: string
	requestId: number
	statusTimer: NodeJS.Timer
	can: boolean
	statusCommand: string
	responseCode: number
	drVariableInfo: DrVariableInfo
	options: CompanionOptionValues
}

// Custom interface that describes Companion variable properties helpful for the module workflow.
export interface DrVariableInfo {
	variableId: string
	name: string
	value: string
}
