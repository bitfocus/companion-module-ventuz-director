import { CompanionButtonStyleProps, CompanionPresetDefinitions, InputValue, combineRgb } from '@companion-module/base'
// import { CompanionBankPreset, CompanionPreset, InputValue } from '../../../instance_skel_types'
import { ActionNames, CompanionLabels, FeedbackTypes, Types } from './labels'
import { DRModuleInstance } from '.'
import {
	getMacroExecuteOptions,
	getPlaylistActivateOptions,
	getPlaylistRestartOptions,
	getShowClearOptions,
	getShowCueOptions,
	getShowRecueOnAirOptions,
	getShowTakeOptions,
	getShowTakeOutOptions,
	getWindowSetLayoutOptions,
} from './helpers'

export class PresetsProvider {
	private drModuleInstance: DRModuleInstance

	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
	}
	getPresets(): CompanionPresetDefinitions {
		return {
			[CompanionLabels.showTakePreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakePreset,
				style: this.getBankOptions(CompanionLabels.showTakePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTake,
								options: getShowTakeOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTake,
						options: getShowTakeOptions()[0],
					},
				],
			},
			[CompanionLabels.showTakeRecuePreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakeRecuePreset,
				style: this.getBankOptions(CompanionLabels.showTakeRecuePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTakeRecue,
								options: getShowTakeOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTakeRecue,
						options: getShowTakeOptions()[0],
					},
				],
			},
			[CompanionLabels.showCuePreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showCuePreset,
				style: this.getBankOptions(CompanionLabels.showCuePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showCue,
								options: getShowCueOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanCue,
						options: getShowCueOptions()[0],
					},
				],
			},
			[CompanionLabels.showRecueOnAirPreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showRecueOnAirPreset,
				style: this.getBankOptions(CompanionLabels.showRecueOnAirPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showRecueOnAir,
								options: getShowRecueOnAirOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanRecueOnAir,
						options: getShowRecueOnAirOptions()[0],
					},
				],
			},
			[CompanionLabels.showClearPreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showClearPreset,
				style: this.getBankOptions(CompanionLabels.showClearPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showClear,
								options: getShowClearOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanClear,
						options: getShowClearOptions()[0],
					},
				],
			},
			[CompanionLabels.showTakeOutPreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakeOutPreset,
				style: this.getBankOptions(CompanionLabels.showTakeOutPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTakeOut,
								options: getShowTakeOutOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTakeOut,
						options: getShowTakeOutOptions()[0],
					},
				],
			},
			[CompanionLabels.showTakeOutRecuePreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakeOutRecuePreset,
				style: this.getBankOptions(CompanionLabels.showTakeOutRecuePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTakeOutRecue,
								options: getShowTakeOutOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTakeOutRecue,
						options: getShowTakeOutOptions()[0],
					},
				],
			},
			[CompanionLabels.playlistRestartPreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.playlistRestartPreset,
				style: this.getBankOptions(CompanionLabels.playlistRestartPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.playlistRestart,
								options: getPlaylistRestartOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.playlistCanRestart,
						options: getPlaylistRestartOptions()[0],
					},
				],
			},
			[CompanionLabels.playlistActivatePreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.playlistActivatePreset,
				style: this.getBankOptions(CompanionLabels.playlistActivatePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.playlistActivate,
								options: getPlaylistActivateOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.playlistCanActivate,
						options: getPlaylistActivateOptions()[0],
					},
				],
			},
			[CompanionLabels.macroExecutePreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.macroExecutePreset,
				style: this.getBankOptions(CompanionLabels.macroExecutePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.macroExecute,
								options: getMacroExecuteOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.macroCanExecute,
						options: getMacroExecuteOptions()[0],
					},
				],
			},
			[CompanionLabels.windowSetLayoutPreset]: {
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.windowSetLayoutPreset,
				style: this.getBankOptions(CompanionLabels.windowSetLayoutPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.windowSetLayout,
								options: getWindowSetLayoutOptions()[0],
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.windowCanSetLayout,
						options: getWindowSetLayoutOptions()[0],
					},
				],
			},
		}
	}
	// This fake option is a hack because it is mandatory to provide a value in the options array.
	// getFakeOption(): { [key: string]: InputValue } {
	// 	return {
	// 		_: '',
	// 	}
	// }

	getBankOptions(text: string): CompanionButtonStyleProps {
		return {
			text: text,
			size: 'auto',
			color: 16777215,
			bgcolor: combineRgb(0, 204, 0),
		}
	}
}
