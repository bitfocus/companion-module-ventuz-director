import DRModuleInstance = require('.')
import { CompanionBankPreset, CompanionPreset, InputValue } from '../../../instance_skel_types'
import { ActionNames, CompanionLabels, FeedbackTypes, Types } from './labels'

export class PresetsProvider {
	private drModuleInstance: DRModuleInstance

	constructor(drModuleInstance: DRModuleInstance) {
		this.drModuleInstance = drModuleInstance
	}
	getPresets(): CompanionPreset[] {
		return [
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showTakePreset,
				bank: this.getBankOptions(CompanionLabels.showTakePresetBank),
				actions: [
					{
						action: ActionNames.showTake,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanTake,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showTakeRecuePreset,
				bank: this.getBankOptions(CompanionLabels.showTakeRecuePresetBank),
				actions: [
					{
						action: ActionNames.showTakeRecue,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanTakeRecue,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showCuePreset,
				bank: this.getBankOptions(CompanionLabels.showCuePresetBank),
				actions: [
					{
						action: ActionNames.showCue,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanCue,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showRecueOnAirPreset,
				bank: this.getBankOptions(CompanionLabels.showRecueOnAirPresetBank),
				actions: [
					{
						action: ActionNames.showRecueOnAir,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanRecueOnAir,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showClearPreset,
				bank: this.getBankOptions(CompanionLabels.showClearPresetBank),
				actions: [
					{
						action: ActionNames.showClear,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanClear,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showTakeOutPreset,
				bank: this.getBankOptions(CompanionLabels.showTakeOutPresetBank),
				actions: [
					{
						action: ActionNames.showTakeOut,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanTakeOut,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.showTakeOutRecuePreset,
				bank: this.getBankOptions(CompanionLabels.showTakeOutRecuePresetBank),
				actions: [
					{
						action: ActionNames.showTakeOutRecue,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.showCanTakeOutRecue,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.playlistRestartPreset,
				bank: this.getBankOptions(CompanionLabels.playlistRestartPresetBank),
				actions: [
					{
						action: ActionNames.playlistRestart,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.playlistCanRestart,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.playlistActivatePreset,
				bank: this.getBankOptions(CompanionLabels.playlistActivatePresetBank),
				actions: [
					{
						action: ActionNames.playlistActivate,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.playlistCanActivate,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.macroExecutePreset,
				bank: this.getBankOptions(CompanionLabels.macroExecutePresetBank),
				actions: [
					{
						action: ActionNames.macroExecute,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.macroCanExecute,
						options: this.getFakeOption(),
					},
				],
			},
			{
				category: CompanionLabels.directorRemotingCommands,
				label: CompanionLabels.windowSetLayoutPreset,
				bank: this.getBankOptions(CompanionLabels.windowSetLayoutPresetBank),
				actions: [
					{
						action: ActionNames.windowSetLayout,
						options: this.getFakeOption(),
					},
				],
				feedbacks: [
					{
						type: FeedbackTypes.windowCanSetLayout,
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

	getBankOptions(text: string): CompanionBankPreset {
		return {
			style: Types.text,
			text: text,
			size: 'auto',
			color: 16777215,
			bgcolor: this.drModuleInstance.rgb(0, 204, 0),
		}
	}
}
