import { CompanionOptionValues, InputValue } from '@companion-module/base'
import { DrActionInfo, DrFeedbackInfo } from './drCompanionInfo'
import { ActionNames, CompanionLabels, DRProperties, FeedbackTypes, Others, Types } from './labels'
import { DRModuleInstance } from '.'

export function createOption(
	type: string,
	id: string,
	label = null,
	defaultValue = null,
	tooltip = null,
	required = true,
	min = null
): any {
	if (!label) label = id
	if (type === Types.textwithvariables) {
		return {
			type: Types.textInput,
			id: id,
			label: label,
			default: defaultValue && defaultValue,
			tooltip: tooltip,
			required: required,
			useVariables: true,
		}
	}
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

export function getShowTakeOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			null,
			null,
			false,
			0
		),
	]
}

export function getShowRecueOnAirOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			null,
			null,
			false,
			0
		),
	]
}

export function getShowClearOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			null,
			null,
			false,
			0
		),
	]
}

export function getShowTakeOutOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			null,
			null,
			false,
			0
		),
	]
}

export function getShowCueOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.templateData,
			CompanionLabels.templateData,
			null,
			createRequiredWhenNotLabel([
				DRProperties.uri,
				CompanionLabels.templateDisplayName,
				CompanionLabels.pageDisplayName,
			])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.uri,
			null,
			null,
			createRequiredWhenNotLabel([
				CompanionLabels.templateData,
				CompanionLabels.templateDisplayName,
				CompanionLabels.pageDisplayName,
			])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.templateDisplayName,
			CompanionLabels.templateDisplayName,
			null,
			createRequiredWhenNotLabel([CompanionLabels.templateData, DRProperties.uri, CompanionLabels.pageDisplayName])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.pageDisplayName,
			CompanionLabels.pageDisplayName,
			null,
			createRequiredWhenNotLabel([CompanionLabels.templateData, DRProperties.uri, CompanionLabels.templateDisplayName])
		),
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			null,
			null,
			false,
			0
		),
		createOption(
			Types.checkbox,
			DRProperties.ignoreChannelRules,
			CompanionLabels.ignoreChannelRules,
			false,
			null,
			false
		),
		createOption(Types.textwithvariables, DRProperties.timeOut, CompanionLabels.timeOut, null, null, false, 0),
	]
}

export function getPlaylistRestartOptions(): any[] {
	return [
		createOption(Types.textwithvariables, DRProperties.channelIndex, CompanionLabels.channelIndex, 0, null, false, 0),
	]
}

export function getPlaylistActivateOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.index,
			null,
			null,
			createRequiredWhenNotLabel([DRProperties.id, DRProperties.name, DRProperties.displayName])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.id,
			null,
			null,
			createRequiredWhenNotLabel([DRProperties.index, DRProperties.name, DRProperties.displayName])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.name,
			null,
			null,
			createRequiredWhenNotLabel([DRProperties.id, DRProperties.index, DRProperties.displayName])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.displayName,
			CompanionLabels.displayName,
			null,
			createRequiredWhenNotLabel([DRProperties.id, DRProperties.name, DRProperties.index])
		),
		createOption(
			Types.textwithvariables,
			DRProperties.channelIndex,
			CompanionLabels.channelIndex,
			0,
			CompanionLabels.required,
			true,
			0
		),
		createOption(Types.textwithvariables, DRProperties.timeOut, CompanionLabels.timeOut, null, null, false, 0),
	]
}

export function getMacroExecuteOptions(): any[] {
	return [
		createOption(Types.textwithvariables, DRProperties.id, null, null, createRequiredWhenNotLabel([DRProperties.name])),
		createOrOption(),
		createOption(Types.textwithvariables, DRProperties.name, null, null, createRequiredWhenNotLabel([DRProperties.id])),
	]
}

export function getWindowSetLayoutOptions(): any[] {
	return [
		createOption(
			Types.textwithvariables,
			DRProperties.index,
			null,
			null,
			createRequiredWhenNotLabel([DRProperties.name])
		),
		createOrOption(),
		createOption(
			Types.textwithvariables,
			DRProperties.name,
			null,
			null,
			createRequiredWhenNotLabel([DRProperties.index])
		),
	]
}

function createOrOption(): any {
	return createOption(Types.staticText, CompanionLabels.or)
}

export function getFeedbackCustomVariableOption(): any {
	return createOption(
		Types.textInput,
		Others.feedbackCustomVarIdOption,
		CompanionLabels.saveStateInCustomVarible,
		null,
		CompanionLabels.saveStateInCustomVaribleTooltip
	)
}

export function startStatusTimer(
	drModuleInstance: DRModuleInstance,
	feedbackId: string,
	options: CompanionOptionValues,
	statusCommand: string,
	requestId: number
) {
	const sendTimer = setInterval(async () => {
		const feedbackIdFromRequestId = getFeedbackIdFromRequestId(drModuleInstance.drFeedbackInfoMap, requestId)
		// drModuleInstance.log("debug", `${feedbackIdFromRequestId}: feedbackIdFromRequestId`);
		// drModuleInstance.log("debug", `${requestId}: requestId`);
		// console.log(drModuleInstance.drFeedbackInfoMap);
		if (!feedbackIdFromRequestId) {
			// If feedback does not exists anymore or does not belong to the same feedbackId then force stop
			clearIntervalAndUnassign(sendTimer)
			drModuleInstance.log('warn', `timer from ${requestId} terminated`)
		}

		const message = JSON.stringify(
			await buildRequestMsg(feedbackId, options, statusCommand, requestId, drModuleInstance)
		)
		// 1 === WebSocket OPEN
		if (drModuleInstance.wsClient && drModuleInstance.wsClient.readyState === 1) {
			drModuleInstance.wsClient.send(message)
		}
	}, drModuleInstance.config.intervalStatus * 1000)

	drModuleInstance.timers.push(sendTimer)
	return sendTimer
}

export function stopStatusTimer(drFeedbackInfoFound: DrFeedbackInfo) {
	if (drFeedbackInfoFound) clearIntervalAndUnassign(drFeedbackInfoFound.statusTimer)
}

export async function buildRequestMsg(
	actionNameOrFeedbackType: string,
	options: { [key: string]: InputValue | null },
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
			await addOptionToRequest(options, msg, DRProperties.index)
			await addOptionToRequest(options, msg, DRProperties.name)
			break
		}
		case ActionNames.topologySet: {
			await addOptionToRequest(options, msg, DRProperties.name)
			await addOptionToRequest(options, msg, DRProperties.saveTopology)
			await addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.remotePlaylistOpen: {
			await addOptionToRequest(options, msg, DRProperties.playlistId)
			await addOptionToRequest(options, msg, DRProperties.specialAction, true)
			await addOptionToRequest(options, msg, DRProperties.publishContextName)
			await addOptionToRequest(options, msg, DRProperties.publishContextId)
			await addOptionToRequest(options, msg, DRProperties.uri)
			await addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.showOpen: {
			await addOptionToRequest(options, msg, DRProperties.uri)
			await addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.showClose: {
			await addOptionToRequest(options, msg, DRProperties.clearRenderer)
			await addOptionToRequest(options, msg, DRProperties.saveShow)
			break
		}
		case ActionNames.showCue:
		case FeedbackTypes.showCanCue: {
			await addOptionToRequest(options, msg, DRProperties.uri)
			await addOptionToRequest(options, msg, DRProperties.templateData)
			await addOptionToRequest(options, msg, DRProperties.templateDisplayName)
			await addOptionToRequest(options, msg, DRProperties.pageDisplayName)
			await addOptionToRequest(options, msg, DRProperties.channelIndex)
			await addOptionToRequest(options, msg, DRProperties.ignoreChannelRules)
			await addOptionToRequest(options, msg, DRProperties.timeOut)
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
			await addOptionToRequest(options, msg, DRProperties.channelIndex)
			await addOptionToRequest(options, msg, DRProperties.ignoreChannelRules)
			break
		}
		case ActionNames.showCreatePage: {
			await addOptionToRequest(options, msg, DRProperties.name)
			await addOptionToRequest(options, msg, DRProperties.description)
			await addOptionToRequest(options, msg, DRProperties.keywords)
			await addOptionToRequest(options, msg, DRProperties.category)
			await addOptionToRequest(options, msg, DRProperties.channelIds)
			await addOptionToRequest(options, msg, DRProperties.level)
			await addOptionToRequest(options, msg, DRProperties.templateData)
			break
		}
		case ActionNames.showSetProjectDataEvent: {
			await addOptionToRequest(options, msg, DRProperties.dataPath)
			break
		}
		case ActionNames.showSetProjectDataBoolean: {
			await addOptionToRequest(options, msg, DRProperties.dataPath)
			if (options[DRProperties.toggle]) msg[DRProperties.specialAction] = DRProperties.toggle //This is special because the option name is not the same as the message property name
			await addOptionToRequest(options, msg, DRProperties.valueToSet)
			break
		}
		case ActionNames.showSetProjectDataNumber: {
			await addOptionToRequest(options, msg, DRProperties.dataPath)
			await addOptionToRequest(options, msg, DRProperties.valueToSet)
			await addOptionToRequest(options, msg, DRProperties.setRelative)
			break
		}
		case ActionNames.showSetProjectData: {
			await addOptionToRequest(options, msg, DRProperties.dataPath)
			await addOptionToRequest(options, msg, DRProperties.valueToSet)
			break
		}
		case ActionNames.showReloadTemplates: {
			await addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.playlistActivate:
		case FeedbackTypes.playlistCanActivate: {
			await addOptionToRequest(options, msg, DRProperties.index)
			await addOptionToRequest(options, msg, DRProperties.id)
			await addOptionToRequest(options, msg, DRProperties.name)
			await addOptionToRequest(options, msg, DRProperties.displayName)
			await addOptionToRequest(options, msg, DRProperties.channelIndex)
			await addOptionToRequest(options, msg, DRProperties.timeOut)
			break
		}
		case ActionNames.playlistRestart:
		case FeedbackTypes.playlistCanRestart:
		case FeedbackTypes.showCanCueChannel: {
			await addOptionToRequest(options, msg, DRProperties.channelIndex)
			break
		}
		case ActionNames.macroExecute:
		case FeedbackTypes.macroCanExecute: {
			await addOptionToRequest(options, msg, DRProperties.id)
			await addOptionToRequest(options, msg, DRProperties.name)
			break
		}
		case ActionNames.logWrite: {
			await addOptionToRequest(options, msg, DRProperties.level, true)
			await addOptionToRequest(options, msg, DRProperties.message)
			await addOptionToRequest(options, msg, DRProperties.instanceId)
			await addOptionToRequest(options, msg, DRProperties.sourceModule)
			await addOptionToRequest(options, msg, DRProperties.messageId)
			await addOptionToRequest(options, msg, DRProperties.popup)
			await addOptionToRequest(options, msg, DRProperties.exceptionMessage)
			break
		}
		default: {
			break
		}
	}

	return msg

	async function getTextWithVariableValue(inputValue: InputValue): Promise<string> {
		const value = await drModuleInstance.parseVariablesInString(inputValue.toString())
		return value
	}

	//Adds options to the Director Remoting request, important Director Remoting will convert each of the values to the according type (boolean, int, float, etc )
	async function addOptionToRequest(
		options: { [key: string]: InputValue | null },
		msg: any,
		optionId: string,
		isDropdown: boolean = false
	): Promise<void> {
		const optionValue = options[optionId]
		if (optionValue !== null) {
			//Only including options that are not null (undefined is included when checking for null)
			if (typeof optionValue === 'string') {
				if (optionValue != '') {
					//Only adding the option if the value is not an empty string
					msg[optionId] = isDropdown ? optionValue : await getTextWithVariableValue(optionValue) //is Dropdown means it is dropdown type in gui (it always has a value and no variable can be written there, therefore no variable parsing is needed).
				}
			} else {
				//booleans and othertypoes are set if they are not null
				msg[optionId] = optionValue
			}
		}
	}
}

export function getFeedbackIdFromControlId(drFeedbackInfoMap: Map<string, DrFeedbackInfo>, controlId: string): string {
	for (const [key, value] of drFeedbackInfoMap) {
		if (value?.controlId === controlId) {
			return key
		}
	}
	return null
}

export function getFeedbackIdFromRequestId(drFeedbackInfoMap: Map<string, DrFeedbackInfo>, requestID: any): string {
	for (const [key, value] of drFeedbackInfoMap) {
		if (value?.requestId === requestID) {
			return key
		}
	}
	return null
}

export function getActionIdFromControlId(drActionInfoMap: Map<string, DrActionInfo>, controlId: string): string {
	for (const [key, value] of drActionInfoMap) {
		if (value?.controlId === controlId) {
			return key
		}
	}
	return null
}

export function isNumber(value: string | number): boolean {
	return value != null && value !== '' && !isNaN(Number(value.toString()))
}

export function clearIntervalAndUnassign(timer: NodeJS.Timer) {
	clearInterval(timer)
	timer = null
}

/** Creates a string that warms the user then the according value is required */
function createRequiredWhenNotLabel(paramsRaw: string[]) {
	if (!paramsRaw?.length) return null

	const params = paramsRaw.map((v) => `"${v}"`)
	const lastIndex = params.length - 1
	const lastParam = params[lastIndex]
	let final: string = null
	if (params.length > 1) {
		params.splice(lastIndex, 1)
		const first = params.join(' , ')
		final = [first, lastParam].join(` ${CompanionLabels.or.toLowerCase()} `)
	} else {
		final = lastParam
	}
	return `${CompanionLabels.requiredWhen} ${final} ${CompanionLabels.isNotProvided}`
}
