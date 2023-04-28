//Director Remoting properties: http://trac.hamburg.ventuz.com:8000/Ventuz/wiki/Development/DirectorRemoting
export const DRProperties = {
	requestId: 'RequestID',
	command: 'Command',
	index: 'Index',
	name: 'Name',
	uri: 'Uri',
	templateData: 'TemplateData',
	saveTopology: 'SaveTopology',
	saveShow: 'SaveShow',
	clearRenderer: 'ClearRenderer',
	timeOut: 'TimeOut',
	channelIndex: 'ChannelIndex',
	ignoreChannelRules: 'IgnoreChannelRules',
	description: 'Description',
	keywords: 'Keywords',
	category: 'Category',
	channelIds: 'ChannelIds',
	level: 'Level',
	dataPath: 'DataPath',
	toggle: 'Toggle',
	valueToSet: 'ValueToSet',
	specialAction: 'SpecialAction',
	setRelative: 'SetRelative',
	id: 'Id',
	displayName: 'DisplayName',
	message: 'Message',
	sourceModule: 'SourceModule',
	instanceId: 'InstanceId',
	messageId: 'MessageId',
	popup: 'PopUp',
	exceptionMessage: 'ExceptionMessage',
	playlistId: 'PlaylistId',
	publishContextName: 'PublishContextName',
	publishContextId: 'PublishContextId',
	useBlankShow: 'UseBlankShow',
	useShowUri: 'UseShowUri',
	useDefaultShow: 'UseDefaultShow',
	useCurrentShow: 'UseCurrentShow',
	verbose: 'Verbose',
	info: 'Info',
	warning: 'Warning',
	error: 'Error',
	fatal: 'Fatal',
	templateDisplayName: 'TemplateDisplayName',
	pageDisplayName: 'PageDisplayName',
} as const
//Director Remoting Commands
export const DRCommands = {
	windowFullscreen: 'window.fullscreen',
	windowReverse: 'window.reverse',
	windowSetLayout: 'window.setlayout',
	topologySet: 'topology.set',
	remotePlaylistOpen: 'remoteplaylist.open',
	showOpen: 'show.open',
	showClose: 'show.close',
	showCue: 'show.cue',
	showTake: 'show.take',
	showTakeRecue: 'show.takerecue',
	showRecueOnAir: 'show.recueonair',
	showTakeOut: 'show.takeout',
	showTakeOutRecue: 'show.takeoutrecue',
	showClear: 'show.clear',
	showCreatePage: 'show.createpage',
	showSetProjectData: 'show.setprojectdata',
	showPreloadTemplates: 'show.preloadtemplates',
	showPreloadTemplatesPlaylist: 'show.preloadtemplates_playlist',
	showPreloadTemplatesTimeline: 'show.preloadtemplates_timeline',
	showReloadTemplates: 'show.reloadtemplates',
	playlistActivate: 'playlist.activate',
	playlistRestart: 'playlist.restart',
	macroExecute: 'macro.execute',
	timelinePlay: 'timeline.play',
	timelinePause: 'timeline.pause',
	timelineRewind: 'timeline.rewind',
	timelineForward: 'timeline.forward',
	timelineJumpStart: 'timeline.jumpstart',
	timelineJumpEnd: 'timeline.jumpend',
	logWrite: 'log.write',
	showCanTake: 'show.can.take',
	showCanCue: 'show.can.cue',
	showCanCueChannel: 'show.can.cuechannel',
	showCanRecueOnAir: 'show.can.recueonair',
	showCanClear: 'show.can.clear',
	showCanTakeOut: 'show.can.takeout',
	playlistCanRestart: 'playlist.can.restart',
	playlistCanActivate: 'playlist.can.activate',
	macroCanExecute: 'macro.can.execute',
	windowCanSetLayout: 'window.can.setlayout',
} as const

//Names of actions
export const ActionNames = {
	windowFullscreen: 'windowFullscreen',
	windowReverse: 'windowReverse',
	windowSetLayout: 'windowSetLayout',
	topologySet: 'topologySet',
	remotePlaylistOpen: 'remoteplaylistOpen',
	showOpen: 'showOpen',
	showClose: 'showClose',
	showCue: 'showCue',
	showTake: 'showTake',
	showTakeRecue: 'showTakeRecue',
	showRecueOnAir: 'showRecueOnAir',
	showTakeOut: 'showTakeOut',
	showTakeOutRecue: 'showTakeOutRecue',
	showClear: 'showClear',
	showCreatePage: 'showCreatePage',
	showSetProjectDataEvent: 'showSetProjectDataEvent',
	showSetProjectDataBoolean: 'showSetProjectDataBoolean',
	showSetProjectDataNumber: 'showSetProjectDataNumber',
	showSetProjectData: 'showSetProjectData',
	showPreloadTemplates: 'showPreloadTemplates',
	showPreloadTemplatesPlaylist: 'showPreloadTemplatesPlaylist',
	showPreloadTemplatesTimeline: 'showPreloadTemplatesTimeline',
	showReloadTemplates: 'showReloadTemplates',
	playlistActivate: 'playlistActivate',
	playlistRestart: 'playlistRestart',
	macroExecute: 'macroExecute',
	timelinePlay: 'timelinePlay',
	timelinePause: 'timelinePause',
	timelineRewind: 'timelineRewind',
	timelineForward: 'timelineForward',
	timelineJumpStart: 'timelineJumpStart',
	timelineJumpEnd: 'timelineJumpEnd',
	logWrite: 'logWrite',
} as const

//Names of feedbacks
export const FeedbackTypes = {
	showCanTake: 'showCanTake',
	showCanTakeRecue: 'showCanTakeRecue',
	showCanCue: 'showCanCue',
	showCanCueChannel: 'showCanCueChannel',
	showCanRecueOnAir: 'showCanRecueOnAir',
	showCanTakeOut: 'showCanTakeOut',
	showCanTakeOutRecue: 'showCanTakeOutRecue',
	showCanClear: 'showCanClear',
	playlistCanRestart: 'playlistCanRestart',
	playlistCanActivate: 'playlistCanActivate',
	macroCanExecute: 'macroCanExecute',
	windowCanSetLayout: 'windowCanSetLayout',
} as const

//Companion labels that are displayed to the user in the Companion WebUi
export const CompanionLabels = {
	windowFullScreen: 'Window: fullscreen',
	windowReverse: 'Window: reverse',
	windowSetLayout: 'Window: set Layout',
	topologySet: 'Topology: set',
	remotePlaylistOpen: 'Remote playlist: open',
	showOpen: 'Show: open',
	showClose: 'Show: close',
	showCue: 'Show: cue',
	showTake: 'Show: take',
	showTakeRecue: 'Show: take and recue',
	showRecueOnAir: 'Show: recue on-air',
	showTakeOut: 'Show: take out',
	showTakeOutRecue: 'Show: take out and recue',
	showClear: 'Show: clear',
	showCreatePage: 'Show: create Page',
	showSetProjectDataEvent: 'Show: set event in Project Data',
	showSetProjectDataBoolean: 'Show: set boolean in Project Data',
	showSetProjectDataNumber: 'Show: set single, double or integer in Project Data',
	showSetProjectData: 'Show: set enum, asset, array, color or string in Project Data',
	showPreloadTemplates: 'Show: preload Templates',
	showPreloadTemplatesPlaylist: 'Show: preload Templates in Playlist',
	showPreloadTemplatesTimeline: 'Show: preload Templates in Timeline',
	showReloadTemplates: 'Show: reload Templates',
	playlistActivate: 'Playlist: activate',
	playlistRestart: 'Playlist: restart',
	macroExecute: 'Macro: execute',
	timelinePlay: 'Timeline: play',
	timelinePause: 'Timeline: pause',
	timelineRewind: 'Timeline: rewind',
	timelineForward: 'Timeline: forward',
	timelineJumpStart: 'Timeline: jump start',
	timelineJumpEnd: 'Timeline: jump end',
	logWrite: 'Log: write',
	saveTopology: 'Save Topology',
	timeOut: 'Timeout (ms)',
	publishContextName: 'Publish Context Name',
	publishContextId: 'Publish Context Id',
	saveShow: 'Save Show',
	clearRenderer: 'Clear Renderer',
	channelIds: 'Channel ids',
	channelIndex: 'Channel index',
	displayName: 'Display name',
	path: 'Path',
	value: 'Value',
	relative: 'Relative',
	sourceModule: 'Source module',
	instanceId: 'Instance id',
	messageId: 'Message id',
	exceptionMessage: 'Exception message',
	specialAction: 'Special action',
	useBlankShow: 'Use blank Show',
	useShowUri: 'Use Show uri',
	useDefaultShow: 'Use default Show',
	useCurrentShow: 'Use current Show',
	infoLabel: 'Information',
	infoValue:
		'Module to control the Director application, please enter the Ip and the VMS Port to establish a connection via Websocket, if you need to configure any interval you can do it through the according fields.',
	hostValue: 'Target IP',
	portValue: 'VMS Port',
	intervalReconnectionLabel: 'Interval for re-connection',
	intervalReconnectionTooltip: 'In case the connection is lost, interval in seconds to attempt a reconnection.',
	intervalStatusLabel: 'Interval for status in Feedbacks',
	intervalStatusTooltip:
		'Interval in seconds in which each of the Feedbacks will send their request to the Remoting Director to obtain their status.',
	showCanTake: 'Show: can take',
	showCanTakeDescription: 'Checks if a take with the according options can be performed',
	showCanTakeRecue: 'Show: can take and recue',
	showCanTakeRecueDescription: 'Checks if a take and recue with the according options can be performed',
	showCanCue: 'Show: can cue',
	showCanCueDescription: 'Checks if template or page can be cued.',
	showCanCueChannel: 'Show: can cue Channel',
	showCanCueChannelDescription: 'Checks if a cue on Channel(s) can be performed (Channel Rules are ignored).',
	showCanRecueOnAir: 'Show: can recue on air',
	showCanRecueOnAirDescription: 'Checks if a recue on air to the active Template or Page can be performed.',
	showCanClear: 'Show: can clear',
	showCanClearDescription: 'Checks if a clear to the active Template or Page can be performed.',
	showCanTakeOut: 'Show: can take out',
	showCanTakeOutDescription: 'Checks if a take out and recue to the active Template or Page can be performed',
	showCanTakeOutRecue: 'Show: can take out and recue',
	showCanTakeOutRecueDescription: 'Show: can take out and recue',
	playlistCanRestart: 'Playlist: can restart',
	playlistCanRestartDescription: 'Checks if a Playlist can be restarted',
	playlistCanActivate: 'Playlist: can activate',
	playlistCanActivateDescription: 'Checks if an item on a Playlist can be activated',
	macroCanExecute: 'Macro: can execute',
	macroCanExecuteDescription: 'Checks if the macro given by its id or name can be executed',
	windowCanSetLayout: 'Window: can set Layout',
	windowCanSetLayoutDescription: 'Checks if the Layout given by its index or name can be set',
	ignoreChannelRules: 'Ignore Channel rules',
	templateData: 'Template Data',
	templateDisplayName: 'Template display name',
	pageDisplayName: 'Page display name',
	showTakePreset: 'Take Preset',
	showTakeRecuePreset: 'Take and recue Preset',
	showCuePreset: 'Cue Preset',
	showRecueOnAirPreset: 'Recue On Air Preset',
	showClearPreset: 'Clear Preset',
	showTakeOutPreset: 'Take out Preset',
	showTakeOutRecuePreset: 'Take out Recue Preset',
	playlistRestartPreset: 'Playlist restart Preset',
	playlistActivatePreset: 'Playlist activate Preset',
	macroExecutePreset: 'Macro execute Preset',
	windowSetLayoutPreset: 'Window set Layout Preset',
	showTakePresetBank: 'take',
	showTakeRecuePresetBank: 'take recue',
	showCuePresetBank: 'cue',
	showRecueOnAirPresetBank: 'recue on air',
	showClearPresetBank: 'clear',
	showTakeOutPresetBank: 'take out',
	showTakeOutRecuePresetBank: 'take out recue',
	playlistRestartPresetBank: 'playlist restart',
	playlistActivatePresetBank: 'playlist activate',
	macroExecutePresetBank: 'macro execute',
	windowSetLayoutPresetBank: 'window set layout',
	directorRemotingCommands: 'Director Remoting Commands',
	or: 'Or',
	saveStateInCustomVarible: 'Save state in custom variable',
	saveStateInCustomVaribleTooltip:
		'Save state in custom variable, the Director module will set a number suffix to ensure uniqueness',
	required: "Required",
	onlyNeededIfToggle: "Only needed if \"Toggle\" is not checked, \"Toggle\" has priority over \"Path\"",
	playlistRestartAdvice: "Note that the restart for playlist will only execute when in Director: user interaction is enabled, playlist has at least one item and timeline is deactivated.",
	requiredWhen: "Required when",
	isNotProvided: "is not provided",
} as const

//Types of Companion options, presets or feedbacks
export const Types = {
	textInput: 'textinput',
	checkbox: 'checkbox',
	number: 'number',
	dropdown: 'dropdown',
	staticText: 'static-text',
	textwithvariables: 'textwithvariables',
	advanced: 'advanced',
} as const

export const Others = {
	feedbackCustomVarIdOption: 'feedbackCustomVarIdOption', // Id of option to save feedback state in a custom variable
} as const
