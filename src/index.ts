// import instance_skel = require('../../../instance_skel')
// import {
// 	CompanionConfigField,
// 	CompanionSystem,
// } from '../../../instance_skel_types'
import { CompanionConfigField, InstanceBase, InstanceStatus, SomeCompanionConfigField, runEntrypoint } from '@companion-module/base'
import { ActionsProvider } from './actionsProvider'
import { DRModuleConfig, getConfigFields } from './config'
import { DrCompanionInfo } from './drCompanionInfo'
import { FeedbacksProvider } from './feedbacksProvider'
import { startStatusTimer } from './helpers'
import { PresetsProvider } from './presetsProvider'
import WebSocket = require('ws')

export class DRModuleInstance extends InstanceBase<DRModuleConfig> {
	config: DRModuleConfig
	requestIdCounter: number
	wsClient: WebSocket
	drCompanionInfoDict: DrCompanionInfo
	actionsProvider: ActionsProvider
	feedbacksProvider: FeedbacksProvider
	presetsProvider: PresetsProvider
	reconectionTimer: NodeJS.Timer
	timers: NodeJS.Timer[]
	//Constrtuctor
	//See https://github.com/bitfocus/companion/wiki/instance_skel
	constructor(internal: unknown) {
		super(internal)
		this.drCompanionInfoDict = {}
		this.requestIdCounter = 0
		this.actionsProvider = new ActionsProvider(this)
		this.feedbacksProvider = new FeedbacksProvider(this)
		this.presetsProvider = new PresetsProvider(this)
		this.config = {};
		this.timers = [];
		// console.log('VENTUZ: Create Instance')
		// setInterval(() => {
		// 	this.log("debug", `COmpanionInfos ==============================================`);
		// 	for (const prop in this.drCompanionInfoDict) {
		// 		this.log("debug", `${prop}: actionId -> ${this.drCompanionInfoDict[prop].drActionInfo.requestId} feedbackId -> ${this.drCompanionInfoDict[prop].drFeedbackInfo.requestId}`);
		// 	}
		// 	this.log("debug", `drFeedbacks ==============================================`);
		// 	for (const prop in this.feedbacksProvider.drFeedbackInfos) {
		// 		this.log("debug", `${prop}`);
		// 	}
		// 	this.log("debug", `drActions ==============================================`);
		// 	for (const prop in this.actionsProvider.drActionInfos) {
		// 		this.log("debug", `${prop}`);
		// 	}


		// }, 5000);
	}
	//Main initialization function called once the module is OK to start doing things. Principally, this is when the module should establish a connection to the device.
	async init(config: DRModuleConfig, _: boolean) {
		console.log('VENTUZ: Init')
		this.config = config;
		this.initActions()
		this.initFeedbacks()
		this.initPresets()
		this.initWebSocket()
		this.startReconnectionTimer(this.config.intervalReconnection)

	}

	initActions() {
		this.setActionDefinitions(this.actionsProvider.getActions())
	}
	initFeedbacks() {
		this.setFeedbackDefinitions(this.feedbacksProvider.getFeedbacks())
	}
	initPresets() {
		this.setPresetDefinitions(this.presetsProvider.getPresets())
	}

	initWebSocket() {
		console.log('VENTUZ: Create Websocket')
		this.updateStatus(InstanceStatus.Connecting, 'Connecting...')
		this.wsClient = new WebSocket(
			`ws://${this.config.host}:${this.config.port}/DirectorRemoting_Service/1.0/commands/ws`
		)

		this.wsClient.onopen = (event) => {
			console.log('VENTUZ: Connected')
			this.updateStatus(InstanceStatus.Ok)
			this.subscribeActionsAndFeedbacks()
		}
		this.wsClient.onerror = (event: WebSocket.ErrorEvent) => {
			//this.updateStatus(this.STATUS_ERROR, `Disconnected, reconnection will be attempted in ${this.config.intervalReconnection} second(s)`)
			console.log(event)
		}
		this.wsClient.onclose = (event) => {
			//console.log('VENTUZ: Connection Closed: ' + JSON.stringify(event))
			//this.updateStatus(this)
			console.log('VENTUZ: Connection Closed')
			this.unsubscribeActionsAndFeedbacks()
			this.updateStatus(
				InstanceStatus.ConnectionFailure,
				`Disconnected, reconnection will be attempted in ${this.config.intervalReconnection} second(s)`
			)
		}
		this.wsClient.onmessage = (event) => {
			// console.log("VENTUZ: Received: '" + event.data.toString() + "'")
			const json = JSON.parse(event.data.toString())

			//Change status if websocket is disabled in Director.
			if ((json.Errors as any[]).some((e) => e.Message === "'Websocket' connection is disabled")) {
				this.updateStatus(InstanceStatus.ConnectionFailure, `'Websocket' connection is disabled in Director`)
			} else {
				this.updateStatus(InstanceStatus.Ok)
			}


			this.processMessageForFeedback(json)

			this.processMessageForAction(json)
		}
	}
	
	private processMessageForAction(json: any) {
		let controlIdFound: string = undefined
		for (const controlId in this.drCompanionInfoDict) {
			if (this.drCompanionInfoDict[controlId].drActionInfo?.requestId === json.RequestID && this.drCompanionInfoDict[controlId].drActionInfo?.isRunning) {
				controlIdFound = controlId
				break
			}
		}

		if (controlIdFound) {
			const drCompanionInfo = this.drCompanionInfoDict[controlIdFound]
			drCompanionInfo.drActionInfo.isRunning = false
			if (drCompanionInfo.drFeedbackInfo) {
				//If it already has a feedback created then restart the timer
				drCompanionInfo.drFeedbackInfo.statusTimer = startStatusTimer(
					this,
					drCompanionInfo.drFeedbackInfo.feedbackId,
					drCompanionInfo.drFeedbackInfo.options,
					drCompanionInfo.drFeedbackInfo.statusCommand,
					drCompanionInfo.drFeedbackInfo.requestId
				)
			}
		}
	}

	private processMessageForFeedback(json: any) {
		let controlIdFound: string = undefined
		for (const controlId in this.drCompanionInfoDict) {
			if (this.drCompanionInfoDict[controlId].drFeedbackInfo?.requestId === +(json.RequestID as string)) {
				controlIdFound = controlId
				break
			}
		}

		if (this.drCompanionInfoDict[controlIdFound]?.drFeedbackInfo) {
			this.drCompanionInfoDict[controlIdFound].drFeedbackInfo.responseCode = json.Code as number
			this.checkFeedbacksById(this.drCompanionInfoDict[controlIdFound].drFeedbackInfo.id)
		}
	}

	//Clean up the instance before it is destroyed. This is called both on shutdown and when an instance is disabled or deleted. Destroy any timers and socket connections here.
	async destroy() {
		console.log('VENTUZ: Destroy')
		//Stop all remaining timers if any
		for (const timer of this.timers) {
			clearInterval(timer);
		}

		this.stopReconectionTimer()
		this.closeWebSocket()
	}

	private closeWebSocket() {
		this.unsubscribeActionsAndFeedbacks()
		if (this.wsClient) {
			this.wsClient.close(1000)
			delete this.wsClient
		}
	}

	//Provide a simple return of the necessary fields for the instance configuration screen.
	getConfigFields(): SomeCompanionConfigField[] {
		console.log('VENTUZ: Get Config')
		return getConfigFields()
	}
	//When the instance configuration is saved by the user, this update will fire with the new configuration passed. The configuration should be saved to the module, as shown below. This is also a good time to check for any important changes, such as the device IP, which require runtime changes or updates based on the new configuration. An example of resetting a TCP connection is shown in the full sample below.

	async configUpdated(config: DRModuleConfig) {

		if (this.config.intervalReconnection != config.intervalReconnection) {
			//Resets timer if the interval reconnection changed
			this.stopReconectionTimer()
			this.startReconnectionTimer(config.intervalReconnection)
		}
		this.closeWebSocket()
		this.config = config
		console.log('VENTUZ: Update Config')
		this.initWebSocket()
	}

	getRequestId(): number {
		const newRequestId = this.requestIdCounter++
		return newRequestId
	}

	private unsubscribeActionsAndFeedbacks() {
		this.unsubscribeActions()
		this.unsubscribeFeedbacks() //This will also stop the timers, see the unsubscribeFeedback function
	}

	private subscribeActionsAndFeedbacks() {
		this.subscribeActions()
		this.subscribeFeedbacks()
	}

	private startReconnectionTimer(intervalReconnectionSeconds: number) {
		this.reconectionTimer = setInterval(() => {
			//3 == CLOSED
			if (this.wsClient && this.wsClient.readyState === 3) {
				this.initWebSocket()
			}
		}, intervalReconnectionSeconds * 1000)
	}

	private stopReconectionTimer() {
		if (this.reconectionTimer) {
			clearInterval(this.reconectionTimer)
			this.reconectionTimer = null
		}
	}
}

runEntrypoint(DRModuleInstance, [])
