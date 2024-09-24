// The module 'vscode' contains the VS Code extensibility API
const playSound = require("./helpers/playSound");

// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let intervalId;
let statusBarItem;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// creating a status bar item on the right
	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.text = "Stay Hydrated 💧";
	statusBarItem.tooltip = "Click to track todays hydration status";
	statusBarItem.command = "watermycode.showHydrationStatus";
	statusBarItem.show();

	// start reminder commande
	const startDisposable = vscode.commands.registerCommand(
		"watermycode.startWaterReminder",
		function () {
			// Fetch user settings
			const config =
				vscode.workspace.getConfiguration("hydrationReminder");
			const weight = config.get("weight");
			const sound = config.get("sound");
			const interval = config.get("interval") * 60000; // Convert from minutes to milliseconds

			// Calculate water intake (e.g., 35ml per kg)
			const waterAmount = weight * 35;

			vscode.window.showInformationMessage(
				`You should drink about ${waterAmount} ml of water per day!`
			);

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
				// playing sound in case user didn't pay attention to notification
				// playSound(sound);
				// updating status bar based on user's response to drinking
				vscode.window
					.showInformationMessage(
						`Stop coding! It's time to drink some water...💧. \nDid you drink water?`,
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
			}, 5000/*interval*/);

			// activating the reminder global state
			context.globalState.update("reminderActive", true);
			// notification for reminder counting start
			vscode.window.showInformationMessage(`Water Reminder started ⏰\nYou will be notified every ${config.get("interval")}minutes!`);
		}
	);

	// stop reminder commande
	let stopDisposable = vscode.commands.registerCommand(
		"watermycode.stopWaterReminder",
		() => {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
				context.globalState.update("reminderActive", false);
				statusBarItem.text = "Stay Hydrated 💧"; // Reset status bar
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
	let showHydrationStatus = vscode.commands.registerCommand(
		"watermycode.showHydrationStatus",
		() => {
			vscode.window.showInformationMessage(
				"Keep drinking water to stay hydrated!"
			);
		}
	);

	// Register the command to open the settings
	let openSettings = vscode.commands.registerCommand(
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
		statusBarItem.text = "💧 Hydrated ✅"; // Update to show hydrated
		statusBarItem.tooltip = "Amazing! Let's go back to coding now!";
	} else {
		statusBarItem.text = "💧 Stay Hydrated ❗"; // Update to remind the user
		statusBarItem.tooltip = "You missed drinking water!";
	}
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
