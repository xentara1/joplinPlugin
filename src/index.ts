import joplin from 'api';
import {updateTodos} from "./todoOverview/taskState";
import {MenuItemLocation} from "../api/types";
import {createOverview} from "./todoOverview/overviewFactory";

joplin.plugins.register({
	onStart: async function() {
		console.log("HELLO")
		await joplin.workspace.onNoteChange(() => {
			updateTodos()
		});
		await joplin.commands.register({
			name: "UpdateTaskBlocks",
			label: "Update Task Block",
			execute: async () => {
				await createOverview()
			},
		});
		await joplin.views.menuItems.create(
			"UpdateTaskBlocks",
			"UpdateTaskBlocks",
			MenuItemLocation.Tools
		);

		//Add Timer to update in background
	},
});
