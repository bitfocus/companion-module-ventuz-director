import DRModuleInstance = require('.')
import { CompanionFeedbackEvent, InputValue, SomeCompanionInputField } from '../../../instance_skel_types'
import { DrFeedbackInfo } from './drCompanionInfo'
import { ActionNames, CompanionLabels, DRProperties, FeedbackTypes, Types } from './labels'

export function createOption(
	type,
	id,
	label = undefined,
	defaultValue = undefined,
	tooltip = undefined,
	required = true,
	min = undefined
) {
	if (!label) label = id
	if (!tooltip) tooltip = label
	return {
		type: type,
		id: id,
		label: label,
		default: defaultValue && defaultValue,
		tooltip: tooltip,
		required: required,
		min: min,
	}
}

export function getShowTakeOptions(): SomeCompanionInputField[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			undefined,
			undefined,
			false,
			0
		),
	]
}

export function getShowRecueOnAirOptions(): SomeCompanionInputField[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			undefined,
			undefined,
			false,
			0
		),
	]
}

export function getShowClearOptions(): SomeCompanionInputField[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			undefined,
			undefined,
			false,
			0
		),
	]
}

export function getShowTakeOutOptions(): SomeCompanionInputField[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			undefined,
			undefined,
			false,
			0
		),
	]
}

export function getShowCueOptions(): SomeCompanionInputField[] {
	return [
		createOption(Types.textwithvariables, DRProperties.templateData, CompanionLabels.templateData),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.uri),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.templateDisplayName, CompanionLabels.templateDisplayName),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.pageDisplayName, CompanionLabels.pageDisplayName),
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			undefined,
			undefined,
			false,
			0
		),
		createOption(
			Types.checkbox,
			DRProperties.ignoreChannelRules,
			CompanionLabels.ignoreChannelRules,
			false,
			undefined,
			false
		),
		createOption(
			Types.textwithvariables,
			DRProperties.timeOut,
			CompanionLabels.timeOut,
			undefined,
			undefined,
			false,
			0
		),
	]
}

export function getPlaylistRestartOptions(): SomeCompanionInputField[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			0,
			undefined,
			false,
			0
		),
	]
}

export function getPlaylistActivateOptions(): SomeCompanionInputField[] {
	return [
		createOption(Types.textwithvariables, DRProperties.index),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.id),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.name),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.displayName, CompanionLabels.displayName),
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			0,
			undefined,
			true,
			0
		),
		createOption(
			Types.textwithvariables,
			DRProperties.timeOut,
			CompanionLabels.timeOut,
			undefined,
			undefined,
			false,
			0
		),
	]
}

export function getMacroExecuteOptions(): SomeCompanionInputField[] {
	return [
		createOption(Types.textwithvariables, DRProperties.id),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.name),
	]
}

export function getWindowSetLayoutOptions(): SomeCompanionInputField[] {
	return [
		createOption(Types.textwithvariables, DRProperties.index),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.name),
	]
}

function createOrOption(): SomeCompanionInputField {
	return createOption(Types.text, CompanionLabels.or)
}

export function startStatusTimer(
	drModuleInstance: DRModuleInstance,
	feedback: CompanionFeedbackEvent,
	statusCommand: string,
	requestId: number
) {
	const sendTimer = setInterval(() => {
		const message = JSON.stringify(
			buildRequestMsg(feedback.type, feedback.options, statusCommand, requestId, drModuleInstance)
		)
		// 1 === WebSocket OPEN
		if (drModuleInstance.wsClient && drModuleInstance.wsClient.readyState === 1) {
			drModuleInstance.wsClient.send(message)
		}
	}, drModuleInstance.config.intervalStatus * 1000)

	return sendTimer
}

export function stopStatusTimer(drFeedbackInfoFound: DrFeedbackInfo) {
	if (drFeedbackInfoFound) {
		clearInterval(drFeedbackInfoFound.statusTimer)
		drFeedbackInfoFound.statusTimer = null
	}
}

export function buildRequestMsg(
	actionNameOrFeedbackType: string,
	options: { [key: string]: InputValue | undefined },
	command: string,
	requestId: number,
	drModuleInstance: DRModuleInstance
) {
	let msg = {
		[DRProperties.requestId]: requestId,
		[DRProperties.command]: command,
	}
	//Setting more request properties if needed:
	switch (actionNameOrFeedbackType) {
		case ActionNames.windowSetLayout:
		case FeedbackTypes.windowCanSetLayout: {
			addOptionToRequest(options, msg, DRProperties.index)
			addOptionToRequest(options, msg, DRProperties.name)
			break
		}
		case ActionNames.topologySet: {
			addOptionToRequest(options, msg, DRProperties.name)
			addOptionToRequest(options, msg, DRProperties.saveTopology)
			addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.remotePlaylistOpen: {
			addOptionToRequest(options, msg, DRProperties.playlistId)
			addOptionToRequest(options, msg, DRProperties.specialAction, true)
			addOptionToRequest(options, msg, DRProperties.publishContextName)
			addOptionToRequest(options, msg, DRProperties.publishContextId)
			addOptionToRequest(options, msg, DRProperties.uri)
			addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.showOpen: {
			addOptionToRequest(options, msg, DRProperties.uri)
			addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.showClose: {
			addOptionToRequest(options, msg, DRProperties.clearRenderer)
			addOptionToRequest(options, msg, DRProperties.saveShow)
			break
		}
		case ActionNames.showCue:
		case FeedbackTypes.showCanCue: {
			addOptionToRequest(options, msg, DRProperties.uri)
			addOptionToRequest(options, msg, DRProperties.templateData)
			addOptionToRequest(options, msg, DRProperties.templateDisplayName)
			addOptionToRequest(options, msg, DRProperties.pageDisplayName)
			addOptionToRequest(options, msg, DRProperties.channelIndex)
			addOptionToRequest(options, msg, DRProperties.ignoreChannelRules)
			addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.showTake:
		case ActionNames.showTakeRecue:
		case FeedbackTypes.showCanTake:
		case FeedbackTypes.showCanTakeRecue:
		case ActionNames.showRecueOnAir:
		case FeedbackTypes.showCanRecueOnAir:
		case ActionNames.showTakeOut:
		case ActionNames.showTakeOutRecue:
		case FeedbackTypes.showCanTakeOut:
		case FeedbackTypes.showCanTakeOutRecue:
		case ActionNames.showClear:
		case FeedbackTypes.showCanClear: {
			addOptionToRequest(options, msg, DRProperties.channelIndex)
			addOptionToRequest(options, msg, DRProperties.ignoreChannelRules)
			break
		}
		case ActionNames.showCreatePage: {
			addOptionToRequest(options, msg, DRProperties.name)
			addOptionToRequest(options, msg, DRProperties.description)
			addOptionToRequest(options, msg, DRProperties.keywords)
			addOptionToRequest(options, msg, DRProperties.category)
			addOptionToRequest(options, msg, DRProperties.channelIds)
			addOptionToRequest(options, msg, DRProperties.level)
			addOptionToRequest(options, msg, DRProperties.templateData)
			break
		}
		case ActionNames.showSetProjectDataEvent: {
			addOptionToRequest(options, msg, DRProperties.dataPath)
			break
		}
		case ActionNames.showSetProjectDataBoolean: {
			addOptionToRequest(options, msg, DRProperties.dataPath)
			if (options[DRProperties.toggle]) msg[DRProperties.specialAction] = DRProperties.toggle //This is special because the option name is not the same as the message property name
			addOptionToRequest(options, msg, DRProperties.valueToSet)
			break
		}
		case ActionNames.showSetProjectDataNumber: {
			addOptionToRequest(options, msg, DRProperties.dataPath)
			addOptionToRequest(options, msg, DRProperties.valueToSet)
			addOptionToRequest(options, msg, DRProperties.setRelative)
			break
		}
		case ActionNames.showSetProjectData: {
			addOptionToRequest(options, msg, DRProperties.dataPath)
			addOptionToRequest(options, msg, DRProperties.valueToSet)
			break
		}
		case ActionNames.showReloadTemplates: {
			addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.playlistActivate:
		case FeedbackTypes.playlistCanActivate: {
			addOptionToRequest(options, msg, DRProperties.index)
			addOptionToRequest(options, msg, DRProperties.id)
			addOptionToRequest(options, msg, DRProperties.name)
			addOptionToRequest(options, msg, DRProperties.displayName)
			addOptionToRequest(options, msg, DRProperties.channelIndex)
			addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.playlistRestart:
		case FeedbackTypes.playlistCanRestart:
		case FeedbackTypes.showCanCueChannel: {
			addOptionToRequest(options, msg, DRProperties.channelIndex)
			break
		}
		case ActionNames.macroExecute:
		case FeedbackTypes.macroCanExecute: {
			addOptionToRequest(options, msg, DRProperties.id)
			addOptionToRequest(options, msg, DRProperties.name)
			break
		}
		case ActionNames.logWrite: {
			addOptionToRequest(options, msg, DRProperties.level, true)
			addOptionToRequest(options, msg, DRProperties.message)
			addOptionToRequest(options, msg, DRProperties.instanceId)
			addOptionToRequest(options, msg, DRProperties.sourceModule)
			addOptionToRequest(options, msg, DRProperties.messageId)
			addOptionToRequest(options, msg, DRProperties.popup)
			addOptionToRequest(options, msg, DRProperties.exceptionMessage)
			break
		}
		default: {
			break
		}
	}

	return msg

	function getTextWithVariableValue(inputValue: InputValue): string {
		let value: string = undefined
		drModuleInstance.parseVariables(inputValue.toString(), (v) => (value = v))
		return value
	}

	//Adds options to the Director Remoting request, important Director Remoting will convert each of the values to the according type (boolean, int, float, etc )
	function addOptionToRequest(
		options: { [key: string]: InputValue | undefined },
		msg: any,
		optionId: string,
		isDropdown: boolean = false
	): void {
		const optionValue = options[optionId]
		if (optionValue !== null) {
			//Only including options that are not null (undefined is included when checking for null)
			if (typeof optionValue === 'string') {
				if (optionValue != '') {
					//Only adding the option if the value is not an empty string
					msg[optionId] = isDropdown ? optionValue : getTextWithVariableValue(optionValue) //is Dropdown means it is dropdown type in gui (it always has a value and no variable can be written there, therefore no variable parsing is needed).
				}
			} else {
				//booleans and othertypoes are set if they are not null
				msg[optionId] = optionValue
			}
		}
	}
}

export function getFeedbackFromRequestId(
	requestId: number,
	drFeedbackInfos: DrFeedbackInfo[],
	companionFeedbacks: CompanionFeedbackEvent[]
) {
	const drFeedbackInfoFound = drFeedbackInfos.find((fd) => fd.requestId === requestId)
	if (drFeedbackInfoFound) {
		//Feedback with that id exists
		const feedbackFound = companionFeedbacks.find((fd) => fd.id === drFeedbackInfoFound.id)
		return feedbackFound
	}
	return undefined
}

export function isNumber(value: string | number): boolean {
	return value != null && value !== '' && !isNaN(Number(value.toString()))
}
