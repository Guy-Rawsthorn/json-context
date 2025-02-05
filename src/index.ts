import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { JsonWidget } from './widget';
import { reactIcon } from '@jupyterlab/ui-components';

/**
 * Activate the widgets example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/json-context:plugin',
  description: 'A minimal JupyterLab extension opening a main area widget.',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    const { commands } = app;

    const command = "json-input-widget:open";
    commands.addCommand(command, {
      caption: 'Create a new React Widget',
      label: 'React Widget',
      icon: args => (args['isPalette'] ? null : reactIcon),
      execute: () => {
        console.log("extension activated")
        const content = new JsonWidget();
        const widget = new MainAreaWidget<JsonWidget>({ content });
        widget.title.label = 'React Widget'
        app.shell.add(widget, 'main')
      }
    });

    if (launcher) {
      launcher.add({
        command: command,
        category: 'Extensions',
        rank: 1,
      });
    }
  }
}

export default extension;
