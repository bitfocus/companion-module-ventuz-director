import {
	CompanionFeedbackDefinitions,
	CompanionFeedbackInfo,
	CompanionVariableDefinition,
	SomeCompanionFeedbackInputField,
	combineRgb,
} from '@companion-module/base'
import {
	createOption,
	getActionIdFromControlId,
	getFeedbackCustomVariableOption,
	getMacroExecuteOptions,
	getPlaylistActivateOptions,
	getPlaylistRestartOptions,
	getShowClearOptions,
	getShowCueOptions,
	getShowRecueOnAirOptions,
	getShowTakeOptions,
	getShowTakeOutOptions,
	getWindowSetLayoutOptions,
	startStatusTimer,
	stopStatusTimer,
} from './helpers'
import { CompanionLabels, DRCommands, DRProperties, FeedbackTypes, Others, Types } from './labels'
import { DRModuleInstance } from '.'
import { DrFeedbackInfo } from './drCompanionInfo'

export class FeedbacksProvider {
	private drModuleInstance: DRModuleInstance
	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
	}
	getFeedbacks(): CompanionFeedbackDefinitions {
		return {
			[FeedbackTypes.showCanTake]: {
				type: Types.advanced,
				name: CompanionLabels.showCanTake,
				description: CompanionLabels.showCanTakeDescription,
				options: [...(getShowTakeOptions() as SomeCompanionFeedbackInputField[]), getFeedbackCustomVariableOption()],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					const rid = this.drModuleInstance.getRequestId()
					this.subscribeFeedback(feedback, DRCommands.showCanTake, rid)
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanTakeRecue]: {
				type: Types.advanced,
				name: CompanionLabels.showCanTakeRecue,
				description: CompanionLabels.showCanTakeRecueDescription,
				options: [...(getShowTakeOptions() as SomeCompanionFeedbackInputField[]), getFeedbackCustomVariableOption()],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTake, this.drModuleInstance.getRequestId()) // Note that it also uses the "show.can.take" status command, as there is no "show.can.takerecue" command in Director Remoting it is not necessary
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanCue]: {
				type: Types.advanced,
				name: CompanionLabels.showCanCue,
				description: CompanionLabels.showCanCueDescription,
				options: [...(getShowCueOptions() as SomeCompanionFeedbackInputField[]), getFeedbackCustomVariableOption()],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanCue, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanCueChannel]: {
				type: Types.advanced,
				name: CompanionLabels.showCanCueChannel,
				description: CompanionLabels.showCanCueChannelDescription,
				options: [
					...[
						createOption(
							Types.textwithvariables,
							DRProperties.channelIndex,
							CompanionLabels.channelIndex,
							undefined,
							undefined,
							false,
							0
						) as SomeCompanionFeedbackInputField,
						getFeedbackCustomVariableOption(),
					],
				],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanCueChannel, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanRecueOnAir]: {
				type: Types.advanced,
				name: CompanionLabels.showCanRecueOnAir,
				description: CompanionLabels.showCanRecueOnAirDescription,
				options: [
					...(getShowRecueOnAirOptions() as SomeCompanionFeedbackInputField[]),
					getFeedbackCustomVariableOption(),
				],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanRecueOnAir, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanClear]: {
				type: Types.advanced,
				name: CompanionLabels.showCanClear,
				description: CompanionLabels.showCanClearDescription,
				options: [...(getShowClearOptions() as SomeCompanionFeedbackInputField[]), getFeedbackCustomVariableOption()],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanClear, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanTakeOut]: {
				type: Types.advanced,
				name: CompanionLabels.showCanTakeOut,
				description: CompanionLabels.showCanTakeOutDescription,
				options: [...(getShowTakeOutOptions() as SomeCompanionFeedbackInputField[]), getFeedbackCustomVariableOption()],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTakeOut, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.showCanTakeOutRecue]: {
				type: Types.advanced,
				name: CompanionLabels.showCanTakeOutRecue,
				description: CompanionLabels.showCanTakeOutRecueDescription,
				options: [...(getShowTakeOutOptions() as SomeCompanionFeedbackInputField[]), getFeedbackCustomVariableOption()],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTakeOut, this.drModuleInstance.getRequestId()) // Note that it also uses the "show.can.takeout" status command, as there is no "show.can.takeoutrecue" command in Director Remoting it is not necessary
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.playlistCanRestart]: {
				type: Types.advanced,
				name: CompanionLabels.playlistCanRestart,
				description: CompanionLabels.playlistCanRestartDescription,
				options: [
					...(getPlaylistRestartOptions() as SomeCompanionFeedbackInputField[]),
					getFeedbackCustomVariableOption(),
				],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.playlistCanRestart, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.playlistCanActivate]: {
				type: Types.advanced,
				name: CompanionLabels.playlistCanActivate,
				description: CompanionLabels.playlistCanActivateDescription,
				options: [
					...(getPlaylistActivateOptions() as SomeCompanionFeedbackInputField[]),
					getFeedbackCustomVariableOption(),
				],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.playlistCanActivate, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.macroCanExecute]: {
				type: Types.advanced,
				name: CompanionLabels.macroCanExecute,
				description: CompanionLabels.macroCanExecuteDescription,
				options: [
					...(getMacroExecuteOptions() as SomeCompanionFeedbackInputField[]),
					getFeedbackCustomVariableOption(),
				],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.macroCanExecute, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
			[FeedbackTypes.windowCanSetLayout]: {
				type: Types.advanced,
				name: CompanionLabels.windowCanSetLayout,
				description: CompanionLabels.windowCanSetLayoutDescription,
				options: [
					...(getWindowSetLayoutOptions() as SomeCompanionFeedbackInputField[]),
					getFeedbackCustomVariableOption(),
				],
				subscribe: (feedback: CompanionFeedbackInfo) => {
					this.subscribeFeedback(feedback, DRCommands.windowCanSetLayout, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackInfo) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackInfo) => {
					return this.handleStatusFeedback(feedback)
				},
			},
		}
	}

	private unsubscribeFeedback(feedback: CompanionFeedbackInfo) {
		const drFeedbackInfoFound = this.drModuleInstance.drFeedbackInfoMap.get(feedback.id)
		if (drFeedbackInfoFound) {
			stopStatusTimer(drFeedbackInfoFound) //Just clearing the interval

			this.drModuleInstance.drFeedbackInfoMap.delete(feedback.id)

			this.setVariableDefinitionsInCompanion()
		}
	}

	private subscribeFeedback(feedback: CompanionFeedbackInfo, statusCommand: string, requestId: number) {
		const varNameRaw = feedback.options[Others.feedbackCustomVarIdOption]
		const varName = varNameRaw ? varNameRaw.toString() : undefined
		let variableId: string = undefined
		if (varName) {
			//The user wants a customvariable
			variableId = `${varName}_${requestId.toString()}`
		}

		const newDrFeedbackInfo: DrFeedbackInfo = {
			controlId: feedback.controlId,
			feedbackId: feedback.feedbackId,
			options: feedback.options,
			statusTimer: undefined,
			requestId: requestId,
			can: false,
			statusCommand: statusCommand,
			drVariableInfo: variableId ? { variableId: variableId, name: varName, value: undefined } : undefined,
			responseCode: -1,
		}

		this.drModuleInstance.drFeedbackInfoMap.set(feedback.id, newDrFeedbackInfo)

		newDrFeedbackInfo.statusTimer = startStatusTimer(
			//Startus timer must be set here (after the map set) so that it is not deleted automatically by the clear mechanism inside the "startStatusTimer" funciton
			this.drModuleInstance,
			feedback.feedbackId,
			feedback.options,
			statusCommand,
			requestId
		)
		this.setVariableDefinitionsInCompanion()
	}

	private setVariableDefinitionsInCompanion() {
		const varaibleDefinitions: CompanionVariableDefinition[] = []
		for (const [key] of this.drModuleInstance.drFeedbackInfoMap) {
			const drFeedbackInfo = this.drModuleInstance.drFeedbackInfoMap.get(key)
			const drVariableInfo = drFeedbackInfo.drVariableInfo
			if (drVariableInfo) {
				// can be falsy if the user had not set a variable.
				varaibleDefinitions.push({ variableId: drVariableInfo.variableId, name: drFeedbackInfo.drVariableInfo.name })
			}
		}
		this.drModuleInstance.log('debug', `Inserting ${varaibleDefinitions.length} variables`)
		this.drModuleInstance.setVariableDefinitions(varaibleDefinitions)
	}

	private handleStatusFeedback(feedback: CompanionFeedbackInfo) {
		const actionId = getActionIdFromControlId(this.drModuleInstance.drActionInfoMap, feedback.controlId)
		const drActionInfo = this.drModuleInstance.drActionInfoMap.get(actionId)
		const drFeedbackInfo = this.drModuleInstance.drFeedbackInfoMap.get(feedback.id)

		if (drActionInfo?.isRunning) {
			drFeedbackInfo.can = false
			this.setVariableValueInCompanion(drFeedbackInfo)
			return { bgcolor: combineRgb(255, 255, 0) } //Yellow color (aka "is running")
		} else {
			if (drFeedbackInfo?.responseCode === 0) {
				drFeedbackInfo.can = true
				this.setVariableValueInCompanion(drFeedbackInfo)
				return {} //No style (aka all ok, and command is not running)
			} else {
				drFeedbackInfo.can = false
				this.setVariableValueInCompanion(drFeedbackInfo)
				return { bgcolor: combineRgb(255, 0, 0) } //Red color (aka "cannot perform")
			}
		}
	}

	private setVariableValueInCompanion(drFeedbackInfo: DrFeedbackInfo) {
		const drVariableInfo = drFeedbackInfo.drVariableInfo
		if (drVariableInfo) {
			this.drModuleInstance.setVariableValues({ [drVariableInfo.variableId]: drFeedbackInfo.can })
		}
	}
}
