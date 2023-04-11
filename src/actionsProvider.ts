import { CompanionActionDefinitions, CompanionActionEvent, CompanionInputFieldDropdown } from '@companion-module/base'
import { DrActionInfo, DrFeedbackInfo } from './drCompanionInfo'
import {
	buildRequestMsg,
	createOption,
	getFeedbackIdFromControlId,
	getMacroExecuteOptions,
	getPlaylistActivateOptions,
	getPlaylistRestartOptions,
	getShowClearOptions,
	getShowCueOptions,
	getShowRecueOnAirOptions,
	getShowTakeOptions,
	getShowTakeOutOptions,
	getWindowSetLayoutOptions,
	stopStatusTimer,
} from './helpers'
import { DRProperties, DRCommands, ActionNames, CompanionLabels, Types } from './labels'
import { DRModuleInstance } from '.'

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
	] //An advanced callback will be applied to this commands.

	private drModuleInstance: DRModuleInstance

	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
	}

	getActions(): CompanionActionDefinitions {
		return {
			[ActionNames.windowFullscreen]: {
				name: CompanionLabels.windowFullScreen,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.windowFullscreen)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.windowReverse]: {
				name: CompanionLabels.windowReverse,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.windowReverse)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.windowSetLayout]: {
				name: CompanionLabels.windowSetLayout,
				options: getWindowSetLayoutOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.windowSetLayout)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.topologySet]: {
				name: CompanionLabels.topologySet,
				options: [
					createOption(Types.textwithvariables, DRProperties.name),
					createOption(
						Types.checkbox,
						DRProperties.saveTopology,
						CompanionLabels.saveTopology,
						false,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						null,
						null,
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
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.remotePlaylistOpen]: {
				name: CompanionLabels.remotePlaylistOpen,
				options: [
					createOption(Types.textwithvariables, DRProperties.playlistId),
					this.createSpecialActionOption(),
					createOption(
						Types.textwithvariables,
						DRProperties.publishContextName,
						CompanionLabels.publishContextName,
						null,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.publishContextId,
						CompanionLabels.publishContextId,
						null,
						null,
						false
					),
					createOption(Types.textwithvariables, DRProperties.uri, DRProperties.uri, null, null, false),
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						null,
						null,
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
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showOpen]: {
				name: CompanionLabels.showOpen,
				options: [
					createOption(Types.textwithvariables, DRProperties.uri),
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						null,
						null,
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
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showClose]: {
				name: CompanionLabels.showClose,
				options: [
					createOption(Types.checkbox, DRProperties.saveShow, CompanionLabels.saveShow, false, null, false),
					createOption(
						Types.checkbox,
						DRProperties.clearRenderer,
						CompanionLabels.clearRenderer,
						false,
						null,
						false
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showClose)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showCue]: {
				name: CompanionLabels.showCue,
				options: getShowCueOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showCue)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showTake]: {
				name: CompanionLabels.showTake,
				options: getShowTakeOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTake)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showTakeRecue]: {
				name: CompanionLabels.showTakeRecue,
				options: getShowTakeOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTakeRecue)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showRecueOnAir]: {
				name: CompanionLabels.showRecueOnAir,
				options: getShowRecueOnAirOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showRecueOnAir)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showTakeOut]: {
				name: CompanionLabels.showTakeOut,
				options: getShowTakeOutOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTakeOut)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showTakeOutRecue]: {
				name: CompanionLabels.showTakeOutRecue,
				options: getShowTakeOutOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showTakeOutRecue)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showClear]: {
				name: CompanionLabels.showClear,
				options: getShowClearOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showClear)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showCreatePage]: {
				name: CompanionLabels.showCreatePage,
				options: [
					createOption(Types.textwithvariables, DRProperties.name),
					createOption(
						Types.textwithvariables,
						DRProperties.description,
						DRProperties.description,
						null,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.keywords,
						DRProperties.keywords,
						null,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.category,
						DRProperties.category,
						null,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.channelIds,
						CompanionLabels.channelIds,
						null,
						null,
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
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showSetProjectDataEvent]: {
				name: CompanionLabels.showSetProjectDataEvent,
				options: [createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path)],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showSetProjectDataBoolean]: {
				name: CompanionLabels.showSetProjectDataBoolean,
				options: [
					createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path),
					createOption(Types.checkbox, DRProperties.toggle, DRProperties.toggle, false, null, false),
					createOption(Types.checkbox, DRProperties.valueToSet, CompanionLabels.value, false, null, false),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showSetProjectDataNumber]: {
				name: CompanionLabels.showSetProjectDataNumber,
				options: [
					createOption(Types.textwithvariables, DRProperties.dataPath, CompanionLabels.path),
					createOption(
						Types.textwithvariables,
						DRProperties.valueToSet,
						CompanionLabels.value,
						null,
						null,
						true,
						0
					),
					createOption(Types.checkbox, DRProperties.setRelative, CompanionLabels.relative, false, null, false),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showSetProjectData)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showSetProjectData]: {
				name: CompanionLabels.showSetProjectData,
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
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showPreloadTemplates]: {
				name: CompanionLabels.showPreloadTemplates,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showPreloadTemplates)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showPreloadTemplatesPlaylist]: {
				name: CompanionLabels.showPreloadTemplatesPlaylist,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showPreloadTemplatesPlaylist)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showPreloadTemplatesTimeline]: {
				name: CompanionLabels.showPreloadTemplatesTimeline,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.showPreloadTemplatesTimeline)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.showReloadTemplates]: {
				name: CompanionLabels.showReloadTemplates,
				options: [
					createOption(
						Types.textwithvariables,
						DRProperties.timeOut,
						CompanionLabels.timeOut,
						null,
						null,
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
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.playlistActivate]: {
				name: CompanionLabels.playlistActivate,
				options: getPlaylistActivateOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.playlistActivate)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.playlistRestart]: {
				name: CompanionLabels.playlistRestart,
				options: getPlaylistRestartOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.playlistRestart)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.macroExecute]: {
				name: CompanionLabels.macroExecute,
				options: getMacroExecuteOptions(),
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.macroExecute)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.timelinePlay]: {
				name: CompanionLabels.timelinePlay,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelinePlay)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.timelinePause]: {
				name: CompanionLabels.timelinePause,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelinePause)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.timelineRewind]: {
				name: CompanionLabels.timelineRewind,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineRewind)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.timelineForward]: {
				name: CompanionLabels.timelineForward,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineForward)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.timelineJumpStart]: {
				name: CompanionLabels.timelineJumpStart,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineJumpStart)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.timelineJumpEnd]: {
				name: CompanionLabels.timelineJumpEnd,
				options: [],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.timelineJumpEnd)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
			[ActionNames.logWrite]: {
				name: CompanionLabels.logWrite,
				options: [
					this.createLevelOption(),
					createOption(Types.textwithvariables, DRProperties.message),
					createOption(
						Types.textwithvariables,
						DRProperties.sourceModule,
						CompanionLabels.sourceModule,
						null,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.instanceId,
						CompanionLabels.instanceId,
						null,
						null,
						false
					),
					createOption(
						Types.textwithvariables,
						DRProperties.messageId,
						CompanionLabels.messageId,
						null,
						null,
						false,
						0
					),
					createOption(Types.checkbox, DRProperties.popup, null, false, null, false),
					createOption(
						Types.textwithvariables,
						DRProperties.exceptionMessage,
						CompanionLabels.exceptionMessage,
						null,
						null,
						false
					),
				],
				subscribe: (action: CompanionActionEvent) => {
					this.subscribeAction(action, DRCommands.logWrite)
				},
				unsubscribe: (action: CompanionActionEvent) => {
					this.unsubscribeAction(action)
				},
				callback: async (action) => {
					await this.handleActionCallback(action)
				},
			},
		}
	}

	private unsubscribeAction(action: CompanionActionEvent) {
		this.drModuleInstance.drActionInfoMap.delete(action.id)
	}

	private subscribeAction(action: CompanionActionEvent, command: string) {
		//Creating new drAction
		const newDrAction: DrActionInfo = {
			controlId: action.controlId,
			command: command,
			isRunning: false,
			requestId: this.drModuleInstance.getRequestId(),
		}

		this.drModuleInstance.drActionInfoMap.set(action.id, newDrAction)
	}

	async handleActionCallback(action: CompanionActionEvent) {
		const drActionInfoFound = this.drModuleInstance.drActionInfoMap.get(action.id)
		if (drActionInfoFound) {
			if (this.commandsWithStatus.includes(drActionInfoFound.command)) await this.handleAdvancedActionCallback(action)
			else await this.handleSimpleActionCallback(action, drActionInfoFound)
		}
	}

	private async handleSimpleActionCallback(action: CompanionActionEvent, drActionInfo: DrActionInfo) {
		await this.processAction(action, drActionInfo)
	}

	private async handleAdvancedActionCallback(action: CompanionActionEvent) {
		const canProcess = (drFeedbackInfo: DrFeedbackInfo) => {
			if (drFeedbackInfo) {
				if (drFeedbackInfo.can) {
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
		const drActionInfoFound = this.drModuleInstance.drActionInfoMap.get(action.id)

		if (drActionInfoFound) {
			console.log(`VENTUZ: Processing action with id: ${action.id}`)
			const feedbackId = getFeedbackIdFromControlId(this.drModuleInstance.drFeedbackInfoMap, action.controlId)
			const drFeedbackInfo = this.drModuleInstance.drFeedbackInfoMap.get(feedbackId)
			const canPro = canProcess(drFeedbackInfo)
			if (canPro) {
				drActionInfoFound.isRunning = true
				if (drFeedbackInfo) {
					stopStatusTimer(drFeedbackInfo)
					this.drModuleInstance.checkFeedbacksById(feedbackId)
				}
				await this.processAction(action, drActionInfoFound)
			}
		}
	}

	private async processAction(action: CompanionActionEvent, drActionInfo: DrActionInfo) {
		try {
			this.drModuleInstance.wsClient.send(
				JSON.stringify(
					await buildRequestMsg(
						action.actionId,
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
