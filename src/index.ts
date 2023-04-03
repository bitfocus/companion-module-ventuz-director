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
import { getFeedbackFromRequestId, startStatusTimer } from './helpers'
import { PresetsProvider } from './presetsProvider'
import WebSocket = require('ws')

export class DRModuleInstance extends InstanceBase<DRModuleConfig> {
	config: DRModuleConfig
	requestIdCounter: number
	wsClient: WebSocket
	drCompanionInfos: DrCompanionInfo[]
	actionsProvider: ActionsProvider
	feedbacksProvider: FeedbacksProvider
	presetsProvider: PresetsProvider
	reconectionTimer: NodeJS.Timer
	//Constrtuctor
	//See https://github.com/bitfocus/companion/wiki/instance_skel
	constructor(internal: unknown) {
		super(internal)
		this.drCompanionInfos = []
		this.requestIdCounter = 0
		this.actionsProvider = new ActionsProvider(this)
		this.feedbacksProvider = new FeedbacksProvider(this)
		this.presetsProvider = new PresetsProvider(this)
		this.config = {};
		console.log('VENTUZ: Create Instance')
	}
	//Main initialization function called once the module is OK to start doing things. Principally, this is when the module should establish a connection to the device.
	async init(config: DRModuleConfig, isFirstInit: boolean) {
		this.config = config;
		if (isFirstInit) {
			this.initActions()
			this.initFeedbacks()
			this.initPresets()
		}
		else {
			console.log('VENTUZ: Init')
			this.initWebSocket()
			this.startReconnectionTimer(this.config.intervalReconnection)
		}
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
			console.log("VENTUZ: Received: '" + event.data.toString() + "'")
			const json = JSON.parse(event.data.toString())

			//Change status if websocket is disabled in Director.
			if ((json.Errors as any[]).some((e) => e.Message === "'Websocket' connection is disabled")) {
				this.updateStatus(InstanceStatus.ConnectionFailure, `'Websocket' connection is disabled in Director`)
			} else {
				this.updateStatus(InstanceStatus.Ok)
			}

			const feedbackFound = getFeedbackFromRequestId(
				+(json.RequestID as string),
				this.feedbacksProvider.drFeedbackInfos,
				[] //TODO
			) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus
			if (feedbackFound) {
				feedbackFound.options.currentStatus = json.Code.toString()
				this.checkFeedbacksById(feedbackFound.id)
			}

			//Check if drCompanionInfos Has this RequestId
			const drCompanionInfo = this.drCompanionInfos.find(
				(dc) => dc.drActionInfo && dc.drActionInfo.requestId === json.RequestID && dc.drActionInfo.isRunning
			)
			if (drCompanionInfo) {
				drCompanionInfo.drActionInfo.isRunning = false
				if (drCompanionInfo.drFeedbackInfo) {
					//If it already has a feedback created then restart the timer
					const ff = [].find((fd) => fd.id === drCompanionInfo.drFeedbackInfo.id)
					if (ff) {
						drCompanionInfo.drFeedbackInfo.statusTimer = startStatusTimer(
							this,
							ff,
							drCompanionInfo.drFeedbackInfo.statusCommand,
							drCompanionInfo.drFeedbackInfo.requestId
						)
					}
				}
			}
		}
	}
	//Clean up the instance before it is destroyed. This is called both on shutdown and when an instance is disabled or deleted. Destroy any timers and socket connections here.
	async destroy() {
		console.log('VENTUZ: Destroy')
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
