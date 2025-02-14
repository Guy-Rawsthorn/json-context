import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
// import { ILauncher } from '@jupyterlab/launcher';
import { ICommandPalette } from '@jupyterlab/apputils';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { JsonWidget } from './widget';
import { reactIcon } from '@jupyterlab/ui-components';
import { NotebookActions } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
import { requestAPI } from "./handler";

/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/json-context:plugin',
  description: 'A minimal JupyterLab extension opening a main area widget.',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    const { commands } = app;

    NotebookActions.executionScheduled.connect((_, args) => {
      let cell: Cell;
      // let notebook: Notebook;
      let data;

      // notebook = args["notebook"];
      cell = args["cell"];

      requestAPI<any>('json')
        .then(response => {
          console.log(response);
          data = response
        })
        .catch(reason => {
          console.error(
            `The jupyterlab_json_context server extension appears to be missing.\n${reason}`
          );
        });
      console.log(cell.model.executedCode)

      const cell_context = {
        "cellContent": cell.model,
        "globalContext": data
      }

      console.log(cell_context)
    });

    // JSON Post command

    const commandPostJsonContext = "json-context:open";
    commands.addCommand(commandPostJsonContext, {
      caption: 'Open JSON Context React Widget',
      label: 'Execute json-context-widget:open',
      icon: args => (args['isPalette'] ? null : reactIcon),
      execute: () => {
        console.log("extension activated")
        const content = new JsonWidget();
        const widget = new MainAreaWidget<JsonWidget>({ content });
        widget.title.label = 'JSON Context'
        app.shell.add(widget, 'main')
      }
    });

    palette.addItem({ command: commandPostJsonContext, category: 'Custom Commands' });

    // JSON Fetch command
    const commandGetJsonContext = 'json-context:get-context';
    commands.addCommand(commandGetJsonContext, {
      label: 'Execute json-context:get-context Command',
      caption: 'Execute json-context:get-context Command',
      execute: (args: any) => {
        console.log("palette id command ran")
        // requestAPI<any>('json')
        // .then(data => {
        //   console.log(data);
        // })
        // .catch(reason => {
        //   console.error(
        //     `The jupyterlab_json_context server extension appears to be missing.\n${reason}`
        //   );
        // });
      }
    });
    palette.addItem({ command: commandGetJsonContext, category: 'Custom Commands' });

    }
  }

export default extension;
