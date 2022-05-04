import DRModuleInstance = require('.')
import {
	CompanionActionEvent,
	CompanionActionEventInfo,
	CompanionActions,
	CompanionInputFieldDropdown,
	SomeCompanionConfigField,
} from '../../../instance_skel_types'
import { DrActionInfo, DrCompanionInfo } from './drCompanionInfo'
import {
	buildRequestMsg,
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
	stopStatusTimer,
} from './helpers'
import { DRProperties, DRCommands, ActionNames, CompanionLabels, Types } from './labels'

export class ActionsProvider {
	private commandsWithStatus: string[] = [
		DRCommands.showTake,
		DRCommands.showTakeRecue,
		DRCommands.showCue,
		DRCommands.showRecueOnAir,
		DRCommands.showClear,
		DRCommands.showTakeOut,
		DRCommands.showTakeOutRecue,
		DRCommands.playlistRestart,
		DRCommands.playlistActivate,
		DRCommands.macroExecute,
		DRCommands.windowSetLayout,
	] //an advanced callback will be applied to this commands.

	private drModuleInstance: DRModuleInstance
	drActionInfos: DrActionInfo[]

	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
		this.drActionInfos = []
	}

	getActions(): CompanionActions {
		return {
			[ActionNames.windowFullscreen]: {
				label: CompanionLabels.windowFullScreen,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.windowFullscreen)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.windowReverse]: {
				label: CompanionLabels.windowReverse,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.windowReverse)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.windowSetLayout]: {
				label: CompanionLabels.windowSetLayout,
				options: getWindowSetLayoutOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.windowSetLayout)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			// Topology
			[ActionNames.topologySet]: {
				label: CompanionLabels.topologySet,
				options: [
					createOption(Types.textwithvariables, DRProperties.name),
					createOption(
						Types.checkbox,
						DRProperties.saveTopology,
						CompanionLabels.saveTopology,
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
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.topologySet)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			// Remote PlayList
			[ActionNames.remotePlaylistOpen]: {
				label: CompanionLabels.remotePlaylistOpen,
				options: [
					createOption(Types.textwithvariables, DRProperties.playlistId),
					this.createSpecialActionOption(),
					createOption(
						Types.textwithvariables,
						DRProperties.publishContextName,
						CompanionLabels.publishContextName,
						undefined,
						undefined,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.publishContextId,
						CompanionLabels.publishContextId,
						undefined,
						undefined,
						false
					),
					createOption(Types.textwithvariables, DRProperties.uri, DRProperties.uri, undefined, undefined, false),
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						undefined,
						undefined,
						false,
						0
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.remotePlaylistOpen)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			// Show
			[ActionNames.showOpen]: {
				label: CompanionLabels.showOpen,
				options: [
					createOption(Types.textwithvariables, DRProperties.uri),
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						undefined,
						undefined,
						false,
						0
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showOpen)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showClose]: {
				label: CompanionLabels.showClose,
				options: [
					createOption(Types.checkbox, DRProperties.saveShow, CompanionLabels.saveShow, false, undefined, false),
					createOption(
						Types.checkbox,
						DRProperties.clearRenderer,
						CompanionLabels.clearRenderer,
						false,
						undefined,
						false
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showClose)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showCue]: {
				label: CompanionLabels.showCue,
				options: getShowCueOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showCue)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showTake]: {
				label: CompanionLabels.showTake,
				options: getShowTakeOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTake)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showTakeRecue]: {
				label: CompanionLabels.showTakeRecue,
				options: getShowTakeOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTakeRecue)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showRecueOnAir]: {
				label: CompanionLabels.showRecueOnAir,
				options: getShowRecueOnAirOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showRecueOnAir)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showTakeOut]: {
				label: CompanionLabels.showTakeOut,
				options: getShowTakeOutOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTakeOut)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showTakeOutRecue]: {
				label: CompanionLabels.showTakeOutRecue,
				options: getShowTakeOutOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTakeOutRecue)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showClear]: {
				label: CompanionLabels.showClear,
				options: getShowClearOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showClear)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showCreatePage]: {
				label: CompanionLabels.showCreatePage,
				options: [
					createOption(Types.textwithvariables, DRProperties.name),
					createOption(
						Types.textwithvariables,
						DRProperties.description,
						DRProperties.description,
						undefined,
						undefined,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.keywords,
						DRProperties.keywords,
						undefined,
						undefined,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.category,
						DRProperties.category,
						undefined,
						undefined,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.channelIds,
						CompanionLabels.channelIds,
						undefined,
						undefined,
						false
					),
					createOption(Types.textwithvariables, DRProperties.level),
					createOption(Types.textwithvariables, DRProperties.templateData, CompanionLabels.templateData),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showCreatePage)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showSetProjectDataEvent]: {
				label: CompanionLabels.showSetProjectDataEvent,
				options: [createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path)],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showSetProjectDataBoolean]: {
				label: CompanionLabels.showSetProjectDataBoolean,
				options: [
					createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path),
					createOption(Types.checkbox, DRProperties.toggle, DRProperties.toggle, false, undefined, false),
					createOption(Types.checkbox, DRProperties.valueToSet, CompanionLabels.value, false, undefined, false),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showSetProjectDataNumber]: {
				label: CompanionLabels.showSetProjectDataNumber,
				options: [
					createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path),
					createOption(
						Types.textwithvariables,
						DRProperties.valueToSet,
						CompanionLabels.value,
						undefined,
						undefined,
						true,
						0
					),
					createOption(Types.checkbox, DRProperties.setRelative, CompanionLabels.relative, false, undefined, false),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showSetProjectData]: {
				label: CompanionLabels.showSetProjectData,
				options: [
					createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path),
					createOption(Types.textwithvariables, DRProperties.valueToSet, CompanionLabels.value),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showPreloadTemplates]: {
				label: CompanionLabels.showPreloadTemplates,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showPreloadTemplates)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showPreloadTemplatesPlaylist]: {
				label: CompanionLabels.showPreloadTemplatesPlaylist,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showPreloadTemplatesPlaylist)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showPreloadTemplatesTimeline]: {
				label: CompanionLabels.showPreloadTemplatesTimeline,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showPreloadTemplatesTimeline)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.showReloadTemplates]: {
				label: CompanionLabels.showReloadTemplates,
				options: [
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						undefined,
						undefined,
						false,
						0
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showReloadTemplates)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.playlistActivate]: {
				label: CompanionLabels.playlistActivate,
				options: getPlaylistActivateOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.playlistActivate)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.playlistRestart]: {
				label: CompanionLabels.playlistRestart,
				options: getPlaylistRestartOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.playlistRestart)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.macroExecute]: {
				label: CompanionLabels.macroExecute,
				options: getMacroExecuteOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.macroExecute)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			// Timeline
			[ActionNames.timelinePlay]: {
				label: CompanionLabels.timelinePlay,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelinePlay)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.timelinePause]: {
				label: CompanionLabels.timelinePause,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelinePause)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.timelineRewind]: {
				label: CompanionLabels.timelineRewind,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineRewind)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.timelineForward]: {
				label: CompanionLabels.timelineForward,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineForward)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.timelineJumpStart]: {
				label: CompanionLabels.timelineJumpStart,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineJumpStart)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.timelineJumpEnd]: {
				label: CompanionLabels.timelineJumpEnd,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineJumpEnd)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
			[ActionNames.logWrite]: {
				label: CompanionLabels.logWrite,
				options: [
					this.createLevelOption(),
					createOption(Types.textwithvariables, DRProperties.message),
					createOption(
						Types.textwithvariables,
						DRProperties.sourceModule,
						CompanionLabels.sourceModule,
						undefined,
						undefined,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.instanceId,
						CompanionLabels.instanceId,
						undefined,
						undefined,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.messageId,
						CompanionLabels.messageId,
						undefined,
						undefined,
						false,
						0
					),
					createOption(Types.checkbox, DRProperties.popup, undefined, false, undefined, false),
					createOption(
						Types.textwithvariables,
						DRProperties.exceptionMessage,
						CompanionLabels.exceptionMessage,
						undefined,
						undefined,
						false
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.logWrite)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: (action, bank) => {
					this.handleActionCallback(action, bank)
				},
			},
		}
	}

	private unsubscribeAction(action: CompanionActionEvent) {
		const index = this.drActionInfos.findIndex((a) => a.id === action.id)
		if (index != -1) {
			//Delete it:
			//Delete from action infos array:
			this.drActionInfos.splice(index, 1)
			//Assign undefined in the drCompanionInfoFound
			const drCompanionInfoIndex = this.drModuleInstance.drCompanionInfos.findIndex(
				(dc) => dc.drActionInfo && dc.drActionInfo.id === action.id
			)

			if (drCompanionInfoIndex != -1) {
				const drCompanionInfoFound = this.drModuleInstance.drCompanionInfos[drCompanionInfoIndex]
				drCompanionInfoFound.drActionInfo = undefined
				//Delete drCompanionInfo if drFeedbackInfo is undefined too
				if (drCompanionInfoFound.drFeedbackInfo === undefined)
					this.drModuleInstance.drCompanionInfos.splice(drCompanionInfoIndex, 1)
			}
		}
	}

	private subscribeAction(action: CompanionActionEvent, command: string) {
		this.drActionInfos.push({
			id: action.id,
			command: command,
			isRunning: false,
			requestId: this.drModuleInstance.getRequestId(),
		})
	}

	handleActionCallback(action: CompanionActionEvent, info: CompanionActionEventInfo) {
		const drActionInfoFound = this.drActionInfos.find((a) => a.id === action.id) //Get drActionInfoFound to use the request id

		if (this.commandsWithStatus.includes(drActionInfoFound.command))
			this.handleAdvancedActionCallback(action, info, drActionInfoFound)
		else this.handleSimpleActionCallback(action, drActionInfoFound)
	}

	private handleSimpleActionCallback(action: CompanionActionEvent, drActionInfo: DrActionInfo) {
		this.processAction(action, drActionInfo)
	}

	private handleAdvancedActionCallback(
		action: CompanionActionEvent,
		info: CompanionActionEventInfo,
		drActionInfo: DrActionInfo
	) {
		const canProcess = (drCompanionInfoFound: DrCompanionInfo) => {
			if (drCompanionInfoFound.drFeedbackInfo) {
				//drFeedbackInfo exists?
				if (drCompanionInfoFound.drFeedbackInfo.can) {
					console.log(`VENTUZ: The action with id ${action.id} can be performed as the feedback is false`)
					return true
				} else {
					console.log(`VENTUZ: The action with id ${action.id} cannot be performed as the feedback is true`)
					return false
				}
			} else {
				console.log(`VENTUZ: The action with id ${action.id} does not have Feedback, processing the action`) //PRocess Action, this action does not have feedback
				return true
			}
		}
		// IMPORTANT!
		// Always convert the value of the bank and page to number because it can come as a string, if you don't do it you can have duplicates in the drCompanionInfos.
		if (isNumber(info.bank) && isNumber(info.page)) {
			const numberBank: number = Number(info.bank)
			const numberPage: number = Number(info.page)
			//Finding action info, it should always be a result as we populate them on the subscribe callback

			let drCompanionInfoFound = this.drModuleInstance.drCompanionInfos.find(
				(d) => d.bank === numberBank && d.page === numberPage
			)
			if (drCompanionInfoFound) {
				//drCompanionInfoFound checking if it has an action or not, it should help for the feedback process in the feedback callback
				if (drCompanionInfoFound.drActionInfo) {
					//drActionInfo exists?
					if (drCompanionInfoFound.drActionInfo.id === action.id) {
						// same action id?
						console.log(`VENTUZ: Processing action with id: ${action.id}`) //Printing the entire object so that we can catch errors better
						if (canProcess(drCompanionInfoFound)) {
							drActionInfo.isRunning = true
							if (drCompanionInfoFound.drFeedbackInfo) {
								stopStatusTimer(drCompanionInfoFound.drFeedbackInfo)
								this.drModuleInstance.checkFeedbacksById(drCompanionInfoFound.drFeedbackInfo.id)
							}
							this.processAction(action, drActionInfo)
						}
					} else {
						drActionInfo.isRunning = true
						this.processAction(action, drActionInfo) //When using standard callback the command is included in the action name
					}
				} else {
					console.log(`VENTUZ: The drAction will be added`)
					drCompanionInfoFound.drActionInfo = drActionInfo //Add it as it can help the Feedback in its callback
					if (canProcess(drCompanionInfoFound)) {
						drActionInfo.isRunning = true
						stopStatusTimer(drCompanionInfoFound.drFeedbackInfo)
						this.drModuleInstance.checkFeedbacksById(drCompanionInfoFound.drFeedbackInfo.id)
						this.processAction(action, drActionInfo)
					}
				}
			} else {
				//Create one
				const newDrCompanionInfo: DrCompanionInfo = {
					page: numberPage,
					bank: numberBank,
					drActionInfo: drActionInfo,
					drFeedbackInfo: undefined,
				}
				this.drModuleInstance.drCompanionInfos.push(newDrCompanionInfo)
				drActionInfo.isRunning = true
				this.processAction(action, drActionInfo) //When using standard callback the command is included in the action name//ProcessAction as it does not have a Feedback to listen
			}
		}
	}

	private processAction(action: CompanionActionEvent, drActionInfo: DrActionInfo) {
		//TODO request id must not be optional
		try {
			this.drModuleInstance.wsClient.send(
				JSON.stringify(
					buildRequestMsg(
						action.action,
						action.options,
						drActionInfo.command,
						drActionInfo.requestId,
						this.drModuleInstance
					)
				)
			)
		} catch (err) {
			console.log('VENTUZ: Send Error', err)
		}
	}

	private createSpecialActionOption(): CompanionInputFieldDropdown {
		return {
			type: Types.dropdown,
			label: CompanionLabels.specialAction,
			id: DRProperties.specialAction,
			default: DRProperties.useBlankShow,
			choices: [
				{ id: DRProperties.useBlankShow, label: CompanionLabels.useBlankShow },
				{ id: DRProperties.useShowUri, label: CompanionLabels.useShowUri },
				{ id: DRProperties.useDefaultShow, label: CompanionLabels.useDefaultShow },
				{ id: DRProperties.useCurrentShow, label: CompanionLabels.useCurrentShow },
			],
		}
	}

	private createLevelOption(): CompanionInputFieldDropdown {
		return {
			type: Types.dropdown,
			label: DRProperties.level,
			id: DRProperties.level,
			default: DRProperties.info,
			choices: [
				{ id: DRProperties.verbose, label: DRProperties.verbose },
				{ id: DRProperties.info, label: DRProperties.info },
				{ id: DRProperties.warning, label: DRProperties.warning },
				{ id: DRProperties.error, label: DRProperties.error },
				{ id: DRProperties.fatal, label: DRProperties.fatal },
			],
		}
	}
}
