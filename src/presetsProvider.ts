import { CompanionButtonPresetDefinition, CompanionButtonStyleProps, CompanionPresetDefinitions, InputValue, combineRgb } from '@companion-module/base'
import DRModuleInstance = require('.')
// import { CompanionBankPreset, CompanionPreset, InputValue } from '../../../instance_skel_types'
import { ActionNames, CompanionLabels, FeedbackTypes, Types } from './labels'

export class PresetsProvider {
	private drModuleInstance: DRModuleInstance

	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
	}
	getPresets(): CompanionButtonPresetDefinition[]  {
		return [
			{
				
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakePreset,
				style: this.getBankOptions(CompanionLabels.showTakePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTake,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTake,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakeRecuePreset,
				style: this.getBankOptions(CompanionLabels.showTakeRecuePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTakeRecue,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTakeRecue,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showCuePreset,
				style: this.getBankOptions(CompanionLabels.showCuePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showCue,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanCue,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showRecueOnAirPreset,
				style: this.getBankOptions(CompanionLabels.showRecueOnAirPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showRecueOnAir,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanRecueOnAir,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showClearPreset,
				style: this.getBankOptions(CompanionLabels.showClearPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showClear,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanClear,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakeOutPreset,
				style: this.getBankOptions(CompanionLabels.showTakeOutPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTakeOut,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTakeOut,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.showTakeOutRecuePreset,
				style: this.getBankOptions(CompanionLabels.showTakeOutRecuePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.showTakeOutRecue,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.showCanTakeOutRecue,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.playlistRestartPreset,
				style: this.getBankOptions(CompanionLabels.playlistRestartPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.playlistRestart,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.playlistCanRestart,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.playlistActivatePreset,
				style: this.getBankOptions(CompanionLabels.playlistActivatePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.playlistActivate,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.playlistCanActivate,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.macroExecutePreset,
				style: this.getBankOptions(CompanionLabels.macroExecutePresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.macroExecute,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.macroCanExecute,
						options: this.getFakeOption(),
					},
				],
			},
			{
				type: 'button',
				category: CompanionLabels.directorRemotingCommands,
				name: CompanionLabels.windowSetLayoutPreset,
				style: this.getBankOptions(CompanionLabels.windowSetLayoutPresetBank),
				steps: [
					{
						down: [
							{
								actionId: ActionNames.windowSetLayout,
								options: this.getFakeOption(),
							}
						],
						up: []
					},
				],
				feedbacks: [
					{
						feedbackId: FeedbackTypes.windowCanSetLayout,
						options: this.getFakeOption(),
					},
				],
			},
		]
	}
	// This fake option is a hack because it is mandatory to provide a value in the options array.
	getFakeOption(): { [key: string]: InputValue } {
		return {
			_: '',
		}
	}

	getBankOptions(text: string): CompanionButtonStyleProps {
		return {
			text: text,
			size: 'auto',
			color: 16777215,
			bgcolor: combineRgb(0, 204, 0),
		}
	}
}
