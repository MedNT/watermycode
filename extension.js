// needed helpers & utilities imports
const { hydrationTypes } = require('./helpers/statics');
const { getHydrationMsg } = require("./helpers/getHydrationMsg");

// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");

let intervalId;
let statusBarItem;
let hydrationLevel = 0;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// creating a status bar item on the right
	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	const { text, tooltip } = getHydrationMsg(hydrationTypes.hydration, hydrationLevel);
	statusBarItem.text = text;
	statusBarItem.tooltip = tooltip;
	statusBarItem.command = "watermycode.showHydrationStatus";
	statusBarItem.show();

	// initialize hydration level onextention activation
	hydrationLevel = 0;

	// make sure to reset if not done
	if (context.globalState.get("reminderActive")) {
		context.globalState.update("reminderActive", false);
	}

	// start reminder commande
	const startDisposable = vscode.commands.registerCommand(
		"watermycode.startWaterReminder",
		() => {
			// Fetch user settings
			const config = vscode.workspace.getConfiguration("hydrationReminder");
			const weight = config.get("weight")? config.get("weight"): 70;
			// interval in minutes
			const interval =  config.get("interval")?  config.get("interval"): 30*60000;

			// Calculate water intake (e.g., 35ml per kg)
			const waterAmount = weight * 35;

			// if remminder is already running
			// no need to start a new process (it will lead to memory leak!)
			if (context.globalState.get("reminderActive")) {
				vscode.window.showInformationMessage(
					"Water reminder is already running!"
				);
				return;
			}

			//water drinking reminder interval
			intervalId = setInterval(() => {
				// updating status bar based on user's response to drinking
				vscode.window
					.showInformationMessage(
						"Stop coding! It's time to drink some water💧.\nDid you drink water?",
						{ modal: true }, // Makes it modal to get the user's attention
						"Yes",
						"No"
					)
					.then((selection) => {
						if (selection === "Yes") {
							updateStatusBar(true); // User drank water
						} else if (selection === "No") {
							updateStatusBar(false); // User didn't drink water
						}
					});
			}, interval);

			// activating the reminder global state
			context.globalState.update("reminderActive", true);
			// notification for reminder counting start
			vscode.window.showInformationMessage(
				`⏰ You will be notified every ${interval/60000} minutes!`
			);
			vscode.window.showInformationMessage(
				`You should drink about ${waterAmount} ml of water per day!`
			);
		}
	);

	// stop reminder commande
	const stopDisposable = vscode.commands.registerCommand(
		"watermycode.stopWaterReminder",
		() => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
				context.globalState.update("reminderActive", false);
				// reset status bar
				const { text, tooltip } = getHydrationMsg(hydrationTypes.hydration, 0);
				statusBarItem.text = text;
				statusBarItem.tooltip = tooltip;
				// notification for reminder counting stoped
				vscode.window.showInformationMessage(
					"Water reminder has been stopped 🛑"
				);
			} else {
				// if trying to stop non-existing reminder
				vscode.window.showInformationMessage(
					"No active water reminder to stop ❗️"
				);
			}
		}
	);

	// triggered after clicking on the status bar
	const showHydrationStatus = vscode.commands.registerCommand(
		"watermycode.showHydrationStatus",
		() => {
			vscode.window.showInformationMessage(
				"Keep drinking water to stay hydrated!"
			);
		}
	);

	// Register the command to open the settings
	const openSettings = vscode.commands.registerCommand(
		"watermycode.openSettings",
		() => {
			// Open the settings editor and filter to your extension's settings
			vscode.commands.executeCommand(
				"workbench.action.openSettings",
				"watermycode"
			);
		}
	);

	context.subscriptions.push(
		startDisposable,
		stopDisposable,
		showHydrationStatus,
		openSettings
	);
}

// Update the status bar based on user's input
function updateStatusBar(drankWater) {
	if (drankWater) {
		// make sure the hydration level
		// don't go above level 3
		if (hydrationLevel < 3) {
            // Increase hydration level
			hydrationLevel++;
			// Update to show hydrated
			const { text, tooltip } = getHydrationMsg(hydrationTypes.hydration, hydrationLevel);
			statusBarItem.text = text;
			statusBarItem.tooltip = tooltip;
        }
	} else {
		// make sure the dehydration level
		// don't go bellow level -4
		if (hydrationLevel > -4) {
            // Decrease hydration level
			hydrationLevel--;
			// Update to show hydrated
			const { text, tooltip } = getHydrationMsg(hydrationTypes.dehydration, hydrationLevel);
			statusBarItem.text = text;
			statusBarItem.tooltip = tooltip;
        }
	}
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
