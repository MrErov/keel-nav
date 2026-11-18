# Keel Nav for DeepSeek Harness

A read-only Cordis plugin that adds a **⚓ Keel Nav** dashboard to DeepSeek Harness. It scans the active workspace for `.meta-skills/` and `specs/`, lists `.spec.md` files with their `status:` metadata, and sends predefined prompts for Keel Nav phases 0, 1a, 1b, 2, 3, and 4 to the active chat.

The plugin never writes, edits, or deletes project files. Phase 0 and Phase 1a do not require a spec; the other phases require an explicitly selected spec. The interface supports English and Spanish.

## Requirements

- DeepSeek Harness with **Creator mode** and Plugin Manager available.
- A local Keel Nav repository containing this plugin at `harnesses/deepseek-harness/`.
- Approval for Plugin Manager operations when Harness requests it.

No additional package dependencies or manual build step are required.

## Install with Creator mode

1. Clone or download the Keel Nav repository and note its absolute local path. Confirm that `harnesses/deepseek-harness/` contains `package.json`, `cordis.patch.yml`, `index.js`, and `client.js`.

2. In DeepSeek Harness, start a **new task** and choose **Creator mode** in the agent preset/mode selector.

3. Send the following instruction, replacing the placeholder with the absolute path to the plugin directory:

   > Install and enable the local Cordis bundle at `<ABSOLUTE_PATH_TO_KEEL_NAV>/harnesses/deepseek-harness` in the current profile. Use `plugin_manager` with `action: install_bundle`, install no additional dependencies, and verify that the result is `application: applied` and that the `keel-nav` sidebar and main slots are active.

   On Windows, use a native absolute path such as `C:\src\keel-nav\harnesses\deepseek-harness`. On macOS or Linux, use a path such as `/home/user/src/keel-nav/harnesses/deepseek-harness`.

4. Review and approve the Plugin Manager installation when Harness asks for approval. Creator mode performs the installation; **do not edit the profile manifest manually and do not run `pnpm` in the profile directory**.

5. Confirm the installation result:
   - `application: applied`: the plugin was activated without a Harness restart.
   - `application: restart-required`: restart DeepSeek Harness to load the bundle.

6. Open **⚓ Keel Nav** in the left sidebar. Use **Refresh** to rescan the workspace, select a spec when a phase requires one, and click a phase action to send its prompt to the active chat.

## Privacy and safety

The Host half registers no services, commands, or mutations. The Client uses only the existing read-only `workspaceFiles.list/read` APIs for Keel Nav discovery and `session.prompt` for phase actions. Styles use Harness theme tokens, and the only Client module import is React.
