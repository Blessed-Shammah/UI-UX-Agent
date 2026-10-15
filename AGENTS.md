# Repository Guidelines

## Project Structure & Module Organization

This workspace is currently a project scaffold: no application source, tests, assets, or package manifests are present. Establish the directory layout alongside the first implementation, and update this guide when the structure becomes concrete.

Use clear, purpose-based directories where appropriate, such as `src/` for application code, `tests/` for automated tests, and `assets/` for static resources. Keep related modules together and avoid introducing empty directories solely to match this suggested layout.

## Build, Test, and Development Commands

No build system, dependency manager, or development commands are configured yet. Do not assume commands such as `npm test` or `make build` are available.

When adding tooling, document the exact installation, local development, build, lint, and test commands in `README.md`. Commit the relevant manifests and lockfiles so contributors can reproduce the environment.

## Coding Style & Naming Conventions

Follow the conventions of the language and framework selected for the project. Use consistent indentation within each file, descriptive names, and small modules with clear responsibilities.

Add formatter and linter configuration with the initial source code. Prefer automated formatting over manual style rules, and avoid unrelated formatting changes in functional patches.

## Testing Guidelines

No testing framework or coverage threshold is configured. Introduce tests with meaningful behavior changes and bug fixes, using the chosen framework's standard discovery and naming conventions. Document how to run the full suite and individual tests before making them required checks.

## Commit & Pull Request Guidelines

Git history is unavailable in this workspace, so existing commit conventions cannot be verified. Use concise, imperative commit subjects, such as `Add initial application setup`.

Pull requests should explain the change, its purpose, and how it was validated. Link relevant issues and include screenshots for visible interface changes. Explicitly identify checks that could not be run.

## Security & Configuration

Never commit credentials, tokens, or local environment files. Provide configuration examples with placeholders, and document required environment variables when configuration is introduced.
