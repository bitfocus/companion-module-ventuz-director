import {
	CompanionFeedbackDefinitions,
	CompanionFeedbackInfo,
	SomeCompanionFeedbackInputField,
	combineRgb,
} from '@companion-module/base'
import {
	createOption,
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
import { CompanionLabels, DRCommands, DRProperties, FeedbackTypes, Types } from './labels'
import { DRModuleInstance } from '.'

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
				options: getShowTakeOptions() as SomeCompanionFeedbackInputField[],
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
				options: getShowTakeOptions() as SomeCompanionFeedbackInputField[],
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
				options: getShowCueOptions() as SomeCompanionFeedbackInputField[],
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
					createOption(
						Types.textwithvariables,
						DRProperties.channelIndex,
						CompanionLabels.channelIndex,
						undefined,
						undefined,
						false,
						0
					) as SomeCompanionFeedbackInputField,
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
				options: getShowRecueOnAirOptions() as SomeCompanionFeedbackInputField[],
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
				options: getShowClearOptions() as SomeCompanionFeedbackInputField[],
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
				options: getShowTakeOutOptions() as SomeCompanionFeedbackInputField[],
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
				options: getShowTakeOutOptions() as SomeCompanionFeedbackInputField[],
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
				options: getPlaylistRestartOptions() as SomeCompanionFeedbackInputField[],
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
				options: getPlaylistActivateOptions() as SomeCompanionFeedbackInputField[],
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
				options: getMacroExecuteOptions() as SomeCompanionFeedbackInputField[],
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
				options: getWindowSetLayoutOptions() as SomeCompanionFeedbackInputField[],
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
		const drFeedbackInfoFound = this.drModuleInstance.drCompanionInfoDict[feedback.controlId]?.drFeedbackInfo
		if (drFeedbackInfoFound) {
			stopStatusTimer(drFeedbackInfoFound) //Just clearing the interval

			const drCompanionInfo = this.drModuleInstance.drCompanionInfoDict[feedback.controlId]
			drCompanionInfo.drFeedbackInfo = undefined

			if (drCompanionInfo.drActionInfo === undefined)
				delete this.drModuleInstance.drCompanionInfoDict[feedback.controlId]
		}
	}

	private subscribeFeedback(feedback: CompanionFeedbackInfo, statusCommand: string, requestId: number) {
		const newDrFeedbackInfo = {
			id: feedback.id,
			feedbackId: feedback.feedbackId,
			options: feedback.options,
			statusTimer: startStatusTimer(
				this.drModuleInstance,
				feedback.feedbackId,
				feedback.options,
				statusCommand,
				requestId
			),
			requestId: requestId,
			can: false,
			statusCommand: statusCommand,
			responseCode: -1,
		}

		if (this.drModuleInstance.drCompanionInfoDict[feedback.controlId])
			this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo = newDrFeedbackInfo
		else
			this.drModuleInstance.drCompanionInfoDict[feedback.controlId] = {
				drFeedbackInfo: newDrFeedbackInfo,
				drActionInfo: undefined,
			}
	}

	private handleStatusFeedback(feedback: CompanionFeedbackInfo) {
		if (this.drModuleInstance.drCompanionInfoDict[feedback.controlId]?.drActionInfo?.isRunning) {
			this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo.can = false
			return { bgcolor: combineRgb(255, 255, 0) } //Yellow color (aka "is running")
		} else {
			if (this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo?.responseCode === 0) {
				this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo.can = true
				return {} //No style (aka all ok, and command is not running)
			} else {
				this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo.can = false
				return { bgcolor: combineRgb(255, 0, 0) } //Red color (aka "cannot perform")
			}
		}
	}
}
