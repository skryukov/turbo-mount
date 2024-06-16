# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

## [0.3.1] - 2024-06-16

### Added

- Add `registerComponents` helper for ESBuild. ([@skryukov])

### Fixed

- Fix entrypoint issue in the install generator. ([@skryukov])

## [0.3.0] - 2024-05-31

### Added

- Installation script. ([@skryukov])

### Changed

- [BREAKING] New API without controller inheritance. ([@skryukov])
  To migrate to the new API:
  - Replace `new TurboMountReact()` (or any other framework specific constructor) with `new TurboMount()`
  - Replace `turboMount.register(...)` with `registerComponent(turboMount, ...)`
  - Replace `turbo_mount_react_component` (or any other framework specific helper) with `turbo_mount`
  - Also see the new API for plugins and custom controllers in the README.

## [0.2.3] - 2024-05-12

### Added

- Add a mount target to the base controller. ([@skryukov])
- Add `registerComponents` helper for vite. ([@skryukov])
- Allow to omit the `application` property in the constructor. ([@skryukov])
  `TurboMount` will try to find the application in the `window.Stimulus` and will initialize new one if not found.

## [0.2.2] - 2024-05-09

### Fixed

- Export plugins. ([@skryukov])

## [0.2.0] - 2024-05-09

### Added

- New API with plugins. ([@skryukov])

## [0.1.0] - 2024-05-07

### Added

- Initial implementation. ([@skryukov])

[@skryukov]: https://github.com/skryukov

[Unreleased]: https://github.com/skryukov/turbo-mount/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/skryukov/turbo-mount/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/skryukov/turbo-mount/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/skryukov/turbo-mount/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/skryukov/turbo-mount/compare/v0.2.0...v0.2.2
[0.2.0]: https://github.com/skryukov/turbo-mount/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/skryukov/turbo-mount/commits/v0.1.0

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html
