import { CompanionFeedbackDefinitions, CompanionFeedbackInfo, SomeCompanionFeedbackInputField, combineRgb } from '@companion-module/base'
// import { CompanionFeedbackEvent, CompanionFeedbackEventInfo, CompanionFeedbacks } from '../../../instance_skel_types'
import { DrCompanionInfo, DrFeedbackInfo } from './drCompanionInfo'
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
	isNumber,
	startStatusTimer,
	stopStatusTimer,
} from './helpers'
import { CompanionLabels, DRCommands, DRProperties, FeedbackTypes, Types } from './labels'
import { DRModuleInstance } from '.'

export class FeedbacksProvider {
	private drModuleInstance: DRModuleInstance
	drFeedbackInfos: DrFeedbackInfo[]
	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
		this.drFeedbackInfos = []
	}
	getFeedbacks(): CompanionFeedbackDefinitions {
		return {
			// CheckStatusResponse: {
			//     type: 'boolean',
			//     label: 'Check status response feedback',
			//     description: 'Longer description of the feedback',
			//     style: {
			//         // The default style change for a boolean feedback
			//         // The user will be able to customise these values as well as the fields that will be changed
			//         bgcolor: this.drModuleInstance.rgb(138, 143, 138),
			//     },
			//     // options is how the user can choose the condition the feedback activates for
			//     options: [
			//         {
			//             type: 'number',
			//             label: 'Desired response status:',
			//             id: 'desiredResponseStatus',
			//             default: 0,
			//             min: 0,
			//             max: 5,
			//             tooltip: 'Desired response status when the feedback will change',
			//             required: true,
			//         },
			//     ],
			//     callback: (feedback) => {
			//         // This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
			//         console.log('Feedback true here!') //disabled style
			//         console.log(feedback.options)
			//         if (feedback.options.currentStatus !== feedback.options.desiredResponseStatus.toString()) {
			//             console.log('Feedback true here!') //disabled style
			//             return true
			//         } else {
			//             console.log('Feedback false here!')
			//             feedback.options.currentStatus = undefined
			//             return false
			//         }
			//     },
			// },
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
			}
		}
	}

	private unsubscribeFeedback(feedback: CompanionFeedbackInfo) {
		const feedbackIndex = this.drFeedbackInfos.findIndex((fd) => fd.id === feedback.id)
		if (feedbackIndex != -1) {
			const drFeedbackInfoFound = this.drFeedbackInfos[feedbackIndex]
			this.drModuleInstance.log('debug', `from unsubscribe  ${drFeedbackInfoFound.requestId.toString()}`)
			stopStatusTimer(drFeedbackInfoFound) //Just clearing the interval
			//Delete from feedbacks infos array:
			this.drFeedbackInfos.splice(feedbackIndex, 1)

			const drCompanionInfo = this.drModuleInstance.drCompanionInfoDict[feedback.controlId]
			//Assign undefined in the drCompanionInfoFound
			drCompanionInfo.drFeedbackInfo = undefined;

			if (drCompanionInfo.drActionInfo === undefined)
				delete this.drModuleInstance.drCompanionInfoDict[feedback.controlId]
		}
	}

	private subscribeFeedback(feedback: CompanionFeedbackInfo, statusCommand: string, requestId: number) {
		const newDrFeedbackInfo = {
			id: feedback.id,
			feedbackId: feedback.feedbackId,
			options: feedback.options,
			statusTimer: startStatusTimer(this.drModuleInstance, feedback.feedbackId, feedback.options, statusCommand, requestId),
			requestId: requestId,
			can: false,
			statusCommand: statusCommand,
			responseCode: -1
		}

		this.drFeedbackInfos.push(newDrFeedbackInfo)

		if (this.drModuleInstance.drCompanionInfoDict[feedback.controlId])
			this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo = newDrFeedbackInfo;
		else
			this.drModuleInstance.drCompanionInfoDict[feedback.controlId] = { drFeedbackInfo: newDrFeedbackInfo, drActionInfo: undefined }

	}

	private handleStatusFeedback(feedback: CompanionFeedbackInfo) {
		// console.log(feedback.options, "feedback.options");


		// const info = this.drModuleInstance.drCompanionInfoDict[feedback.controlId];
		// console.log(this.drModuleInstance.drCompanionInfoDict[feedback.controlId]?.drActionInfo?.isRunning, "isRunning");
		if (this.drModuleInstance.drCompanionInfoDict[feedback.controlId]?.drActionInfo?.isRunning) {
			this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo.can = false
			return { bgcolor: combineRgb(255, 255, 0) } //Yellow color (aka "is running")
		} else {
			if (this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo?.responseCode === 0) {
				this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo.can = true;
				return {} //No style (aka all ok, and command is not running)
				//If action has not been created
				// if (drCompanionInfo.drActionInfo && !drCompanionInfo.drActionInfo.isRunning) {//If there is an action and is not running then true
				// 	console.log('Feedback true here!') //disabled style
				// 	return true
				// }
				// return false;
			} else {
				// cannot be performed because status code is not "0"
				//const index = this.drFeedbackInfos.findIndex(df => df.id === drFeedbackInfoFound.id);
				// if (index !== -1) {
				// 	this.drFeedbackInfos[index].responseCode = -1;
				// }
				this.drModuleInstance.drCompanionInfoDict[feedback.controlId].drFeedbackInfo.can = false
				return { bgcolor: combineRgb(255, 0, 0) } //Red color (aka "cannot perform")
			}
		}
	}
}
