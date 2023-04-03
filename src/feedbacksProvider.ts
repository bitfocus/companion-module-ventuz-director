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
			stopStatusTimer(drFeedbackInfoFound) //Just clearing the interval
			//Delete from feedbacks infos array:
			this.drFeedbackInfos.splice(feedbackIndex, 1)

			const drCompanionInfoIndex = this.drModuleInstance.drCompanionInfos.findIndex(
				(dc) => dc.drFeedbackInfo && dc.drFeedbackInfo.id === feedback.id
			)
			if (drCompanionInfoIndex !== -1) {
				const drCompanionInfoFound = this.drModuleInstance.drCompanionInfos[drCompanionInfoIndex]
				drCompanionInfoFound.drFeedbackInfo = undefined
				//Delete drCompanionInfo if drActionInfo is undefined too
				if (drCompanionInfoFound.drActionInfo === undefined)
					this.drModuleInstance.drCompanionInfos.splice(drCompanionInfoIndex, 1)
			}
		}
	}

	private subscribeFeedback(feedback: CompanionFeedbackInfo, statusCommand: string, requestId: number) {
		this.drFeedbackInfos.push({
			//Always creating new drFeedbackInfo
			id: feedback.id,
			feedbackId: feedback.feedbackId,
			options: feedback.options,
			statusTimer: startStatusTimer(this.drModuleInstance, feedback.feedbackId, feedback.options, statusCommand, requestId),
			requestId: requestId,
			can: false,
			statusCommand: statusCommand,
			responseCode: -1 //By default -1, Director Remoting accepts range from 0 - 5
		})
	}

	private handleStatusFeedback(feedback: CompanionFeedbackInfo) {
		let can: boolean
		const processFeedback = (drCompanionInfo: DrCompanionInfo) => {
			//debugger;
			if (drCompanionInfo?.drActionInfo?.isRunning) {
				can = false
				return { bgcolor: combineRgb(255, 255, 0) } //Yellow color (aka "is running")
			} else {
				const drFeedbackInfoFound = drCompanionInfo?.drFeedbackInfo
				if (drFeedbackInfoFound) {	
					if (drFeedbackInfoFound.responseCode === 0) {
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
						//const index = this.drFeedbackInfos.findIndex(df => df.id === drFeedbackInfoFound.id);
						// if (index !== -1) {
						// 	this.drFeedbackInfos[index].responseCode = -1;
						// }
						can = false
						return { bgcolor: combineRgb(255, 0, 0) } //Red color (aka "cannot perform")
					}
				}

			}
		}
		//This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
		//Creating a feedback Info always
		const drFeedbackInfoFound = this.drFeedbackInfos.find((f) => f.id === feedback.id)
		if (drFeedbackInfoFound) {
			//When dropping Presets, callback is called before subscription, thats why here we check for drFeedbackInfo to be truthy so that we don't add drCompanionInfo with both drActionInfo and drFeedbackInfo as undefined.

			const drCompanionInfoFound = this.drModuleInstance.drCompanionInfos.find(
				(d) => d.controlId === feedback.controlId
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
				console.log("Create")

				const newDrCompanionInfo: DrCompanionInfo = {
					controlId: feedback.controlId,
					drActionInfo: undefined,
					drFeedbackInfo: drFeedbackInfoFound,
				}
				this.drModuleInstance.drCompanionInfos.push(newDrCompanionInfo)
                // console.log(newDrCompanionInfo)
				const styledObj = processFeedback(drCompanionInfoFound)
				// drCompanionInfoFound.drFeedbackInfo.can = can
				return styledObj
			}
			
		}
	}
}
