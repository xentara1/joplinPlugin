import joplin from 'api';
import {updateTodos} from "./todoOverview/taskState";
import {MenuItemLocation} from "../api/types";
import {createOverview} from "./todoOverview/overviewFactory";
import {
	createNewMeeting,
	createNewPerson,
	createNewProject,
	createNewZettle, createTask,
	createUpdate
} from "./todoOverview/createTemplate";

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
		await joplin.commands.register({
			name: "createNewProject",
			label: "createNewProject",
			execute: async () => {
				await createNewProject()
			},
		});
		await joplin.commands.register({
			name: "createNewPerson",
			label: "createNewPerson",
			execute: async () => {
				await createNewPerson()
			},
		});
		await joplin.commands.register({
			name: "createNewMeeting",
			label: "createNewMeeting",
			execute: async () => {
				await createNewMeeting()
			},
		});
		await joplin.commands.register({
			name: "createNewZettle",
			label: "createNewZettle",
			execute: async () => {
				await createNewZettle()
			},
		});
		await joplin.commands.register({
			name: "createUpdate",
			label: "createUpdate",
			execute: async () => {
				await createUpdate()
			},
		});
		await joplin.commands.register({
			name: "createTask",
			label: "createTask",
			execute: async () => {
				await createTask()
			},
		});
		await joplin.views.menuItems.create(
			"UpdateTaskBlocks",
			"UpdateTaskBlocks",
			MenuItemLocation.Tools,
			{accelerator: "Alt+Ctrl+Shift+U"}
		);
		await joplin.views.menus.create("templates", "Templates", [
			{
				commandName: "createNewProject",
				accelerator: "Alt+Shift+P"
			},
			{
				commandName: "createNewPerson",
				accelerator: "Alt+Shift+O"
			},
			{
				commandName: "createNewMeeting",
				accelerator: "Alt+Shift+M"
			}
			,
			{
				commandName: "createNewZettle",
				accelerator: "Alt+Shift+Z"
			},
			{
				commandName: "createTask",
				accelerator: "Alt+Shift+t"
			},
			{
				commandName: "createUpdate",
				accelerator: "Alt+Shift+u"
			}
			]);

		//Add Timer to update in background
	},
});
