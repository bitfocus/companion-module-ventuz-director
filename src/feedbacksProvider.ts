import DRModuleInstance = require('.')
import { CompanionFeedbackEvent, CompanionFeedbackEventInfo, CompanionFeedbacks } from '../../../instance_skel_types'
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

export class FeedbacksProvider {
	private drModuleInstance: DRModuleInstance
	drFeedbackInfos: DrFeedbackInfo[]
	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
		this.drFeedbackInfos = []
	}
	getFeedbacks(): CompanionFeedbacks {
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
				label: CompanionLabels.showCanTake,
				description: CompanionLabels.showCanTakeDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take
				options: getShowTakeOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTake, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanTakeRecue]: {
				type: Types.advanced,
				label: CompanionLabels.showCanTakeRecue,
				description: CompanionLabels.showCanTakeRecueDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take
				options: getShowTakeOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTake, this.drModuleInstance.getRequestId()) // Note that it also uses the "show.can.take" status command, as there is no "show.can.takerecue" command in Director Remoting it is not necessary
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanCue]: {
				type: Types.advanced,
				label: CompanionLabels.showCanCue,
				description: CompanionLabels.showCanCueDescription,
				// options is how the user can choose the condition the feedback activates for
				options: getShowCueOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanCue, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanCueChannel]: {
				type: Types.advanced,
				label: CompanionLabels.showCanCueChannel,
				description: CompanionLabels.showCanCueChannelDescription,
				// options is how the user can choose the condition the feedback activates for
				options: [
					createOption(
						Types.textwithvariables,
						DRProperties.channelIndex,
						CompanionLabels.channelIndex,
						undefined,
						undefined,
						false,
						0
					),
				],
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanCueChannel, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanRecueOnAir]: {
				type: Types.advanced,
				label: CompanionLabels.showCanRecueOnAir,
				description: CompanionLabels.showCanRecueOnAirDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take
				options: getShowRecueOnAirOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanRecueOnAir, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanClear]: {
				type: Types.advanced,
				label: CompanionLabels.showCanClear,
				description: CompanionLabels.showCanClearDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take
				options: getShowClearOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanClear, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanTakeOut]: {
				type: Types.advanced,
				label: CompanionLabels.showCanTakeOut,
				description: CompanionLabels.showCanTakeOutDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take out
				options: getShowTakeOutOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTakeOut, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.showCanTakeOutRecue]: {
				type: Types.advanced,
				label: CompanionLabels.showCanTakeOutRecue,
				description: CompanionLabels.showCanTakeOutRecueDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take out
				options: getShowTakeOutOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.showCanTakeOut, this.drModuleInstance.getRequestId()) // Note that it also uses the "show.can.takeout" status command, as there is no "show.can.takeoutrecue" command in Director Remoting it is not necessary
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.playlistCanRestart]: {
				type: Types.advanced,
				label: CompanionLabels.playlistCanRestart,
				description: CompanionLabels.playlistCanRestartDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take
				options: getPlaylistRestartOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.playlistCanRestart, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.playlistCanActivate]: {
				type: Types.advanced,
				label: CompanionLabels.playlistCanActivate,
				description: CompanionLabels.playlistCanActivateDescription,
				// options is how the user can choose the condition the feedback activates for
				options: getPlaylistActivateOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.playlistCanActivate, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.macroCanExecute]: {
				type: Types.advanced,
				label: CompanionLabels.macroCanExecute,
				description: CompanionLabels.macroCanExecuteDescription,
				// options is how the user can choose the condition the feedback activates for
				options: getMacroExecuteOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.macroCanExecute, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			[FeedbackTypes.windowCanSetLayout]: {
				type: Types.advanced,
				label: CompanionLabels.windowCanSetLayout,
				description: CompanionLabels.windowCanSetLayoutDescription,
				// options is how the user can choose the condition the feedback activates for
				// Getting the same options as the show take
				options: getWindowSetLayoutOptions(),
				subscribe: (feedback: CompanionFeedbackEvent) => {
					this.subscribeFeedback(feedback, DRCommands.windowCanSetLayout, this.drModuleInstance.getRequestId())
				},
				unsubscribe: (feedback: CompanionFeedbackEvent) => {
					this.unsubscribeFeedback(feedback)
				},
				callback: (feedback: CompanionFeedbackEvent, bank, info: CompanionFeedbackEventInfo) => {
					return this.handleStatusFeedback(feedback, info)
				},
			},
			//TODO: make other feedbacks.
		}
	}

	private unsubscribeFeedback(feedback: CompanionFeedbackEvent) {
		const feedbackIndex = this.drFeedbackInfos.findIndex((fd) => fd.id === feedback.id)
		if (feedbackIndex != -1) {
			const drFeedbackInfoFound = this.drFeedbackInfos[feedbackIndex]
			stopStatusTimer(drFeedbackInfoFound) //Just clearing the interval
			//Delete it:
			//Delete from feedbacks infos array:
			this.drFeedbackInfos.splice(feedbackIndex, 1)

			const drCompanionInfoIndex = this.drModuleInstance.drCompanionInfos.findIndex(
				(dc) => dc.drFeedbackInfo && dc.drFeedbackInfo.id === feedback.id
			)
			if (drCompanionInfoIndex != -1) {
				const drCompanionInfoFound = this.drModuleInstance.drCompanionInfos[drCompanionInfoIndex]
				drCompanionInfoFound.drFeedbackInfo = undefined
				//Delete drCompanionInfo if drActionInfo is undefined too
				if (drCompanionInfoFound.drActionInfo === undefined)
					this.drModuleInstance.drCompanionInfos.splice(drCompanionInfoIndex, 1)
			}
		}
	}

	private subscribeFeedback(feedback: CompanionFeedbackEvent, statusCommand: string, requestId: number) {
		this.drFeedbackInfos.push({
			//Always creating new drFeedbackInfo
			id: feedback.id,
			type: feedback.type,
			statusTimer: startStatusTimer(this.drModuleInstance, feedback, statusCommand, requestId),
			requestId: requestId,
			can: false,
			statusCommand: statusCommand,
		})
	}

	private handleStatusFeedback(feedback: CompanionFeedbackEvent, info: CompanionFeedbackEventInfo) {
		let can: boolean
		const processFeedback = (drCompanionInfo: DrCompanionInfo) => {
			//debugger;
			if (drCompanionInfo?.drActionInfo?.isRunning) {
				can = false
				return { bgcolor: this.drModuleInstance.rgb(255, 255, 0) } //Yellow color (aka "is running")
			} else {
				if (feedback.options.currentStatus === '0') {
					can = true
					//If action has not been created
					return {} //No style (aka all ok, and command is not running)
					// if (drCompanionInfo.drActionInfo && !drCompanionInfo.drActionInfo.isRunning) {//If there is an action and is not running then true
					// 	console.log('Feedback true here!') //disabled style
					// 	return true
					// }
					// return false;
				} else {
					// cannot be performed because status code is not "0"
					feedback.options.currentCode = undefined
					can = false
					return { bgcolor: this.drModuleInstance.rgb(255, 0, 0) } //Red color (aka "cannot perform")
				}
			}
		}
		// This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
		//Creating a feedback Info always
		const drFeedbackInfoFound = this.drFeedbackInfos.find((f) => f.id === feedback.id)
		if (drFeedbackInfoFound) {
			//When dropping Presets, callback is called before subscription, thats why here we check for drFeedbackInfo to be truthy so that we don't add drCompanionInfo with both drActionInfo and drFeedbackInfo as undefined.
			// IMPORTANT!
			// Always convert the value of the bank and page to number because it can come as a string, if you don't do it you can have duplicates in the drCompanionInfos.
			if (isNumber(info.bank) && isNumber(info.page)) {
				const numberBank: number = Number(info.bank)
				const numberPage: number = Number(info.page)

				const drCompanionInfoFound = this.drModuleInstance.drCompanionInfos.find(
					(d) => d.bank === numberBank && d.page === numberPage
				)
				if (drCompanionInfoFound) {
					//Only add
					if (!drCompanionInfoFound.drFeedbackInfo) {
						drCompanionInfoFound.drFeedbackInfo = drFeedbackInfoFound
					} else {
						//console.log(`VENTUZ: The following drFeedbackInfo already exists  in drCompanionInfo:`, drCompanionInfoFound) //Printing the entire object so that we can catch errors better - COMMENTED TO AVOID EXTRA TRAFFIC
					}
					const styledObj = processFeedback(drCompanionInfoFound)
					drCompanionInfoFound.drFeedbackInfo.can = can
					return styledObj
				} else {
					//Create one
					const newDrCompanionInfo: DrCompanionInfo = {
						page: numberPage,
						bank: numberBank,
						drActionInfo: undefined,
						drFeedbackInfo: drFeedbackInfoFound,
					}
					this.drModuleInstance.drCompanionInfos.push(newDrCompanionInfo)
					const styledObj = processFeedback(drCompanionInfoFound)
					drCompanionInfoFound.drFeedbackInfo.can = can
					return styledObj
				}
			}
		}
	}
}
