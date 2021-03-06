import InstanceSkel = require('../../../instance_skel')
import { SomeCompanionConfigField } from '../../../instance_skel_types'
import { CompanionLabels, Types } from './labels'

export interface DRModuleConfig {
	host?: string
	port?: number
	intervalReconnection?: number
	intervalStatus?: number
}

export function getConfigFields(self: InstanceSkel<DRModuleConfig>): SomeCompanionConfigField[] {
	return [
		{
			type: Types.text,
			id: 'info',
			width: 12,
			label: CompanionLabels.infoLabel,
			value: CompanionLabels.infoValue,
		},
		{
			type: Types.textInput,
			id: 'host',
			label: CompanionLabels.hostValue,
			default: '127.0.0.1',
			required: true,
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: Types.number,
			id: 'port',
			label: CompanionLabels.portValue,
			min: 1,
			max: 65535,
			required: true,
			default: 20404,
			width: 6,
		},
		{
			type: Types.number,
			id: 'intervalReconnection',
			label: CompanionLabels.intervalReconnectionLabel,
			tooltip: CompanionLabels.intervalReconnectionTooltip,
			min: 5,
			max: 65535,
			required: true,
			default: 5,
			width: 6,
		},
		{
			type: Types.number,
			id: 'intervalStatus',
			label: CompanionLabels.intervalStatusLabel,
			tooltip: CompanionLabels.intervalStatusTooltip,
			min: 1,
			max: 65535,
			required: true,
			default: 1,
			width: 6,
		},
	]
}
