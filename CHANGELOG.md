# Changelog

## [0.1.0](https://github.com/dbirks/slack-emoji-typer/compare/v0.0.1...v0.1.0) (2025-08-06)


### Features

* add basic support for symbol emojis (@\!?#) ([47fec8b](https://github.com/dbirks/slack-emoji-typer/commit/47fec8bfa156303a720b9ebb64d5f94fefd95b45))
* add CI workflow for PRs with format, lint, and build checks ([f993269](https://github.com/dbirks/slack-emoji-typer/commit/f993269bbd37751aaf3b72ddc9bbde9946e5f1fb))
* add cookie-based authentication for Slack token extraction ([c1172b4](https://github.com/dbirks/slack-emoji-typer/commit/c1172b40165fade0ca6f794b25e6e08cd046c61e))
* add detailed logging for authentication debugging ([9f617bc](https://github.com/dbirks/slack-emoji-typer/commit/9f617bc2442772dcaabc3234765156a77d711a99))
* add easy number shortcuts for symbol emojis ([b93f99b](https://github.com/dbirks/slack-emoji-typer/commit/b93f99b947b87cd3ed17d004428463c6f3d0ac48))
* add rounded border style and document Ink references ([2c0ba69](https://github.com/dbirks/slack-emoji-typer/commit/2c0ba696f2326391c09dacf2280e213bdcda34d6))
* add username resolution for Slack message mentions ([38969d4](https://github.com/dbirks/slack-emoji-typer/commit/38969d4f78abda5bf718ed24e837edebb49040f7))
* auto-extract workspace URL from Slack message URLs ([5e2f54e](https://github.com/dbirks/slack-emoji-typer/commit/5e2f54e3345c012b43abdedab39f743a5d860607))
* clean up UI with bold letters and better color ([cdbab2c](https://github.com/dbirks/slack-emoji-typer/commit/cdbab2c1533f5e22420dbd8141fba47bf0df40d1))
* display existing alphabet emoji reactions on startup ([6647990](https://github.com/dbirks/slack-emoji-typer/commit/66479900f0a9886cbc4029fa6058acdfee7e6f3e))
* dynamic input box border color based on mode ([d2671b5](https://github.com/dbirks/slack-emoji-typer/commit/d2671b564deedbfda2cfe01a17b252a030cf04d2))
* elegant pending state for backspace removal ([8b4440e](https://github.com/dbirks/slack-emoji-typer/commit/8b4440edfdafb8086ed4bbcb513b3e991728cbc4))
* elegant pending state UI for letter additions ([737c5d5](https://github.com/dbirks/slack-emoji-typer/commit/737c5d53c97270f7ebd89fedcc23354efed36436))
* enable automatic UI redraw on terminal resize ([f8c8fbc](https://github.com/dbirks/slack-emoji-typer/commit/f8c8fbc1335f7f604a8be98d37523602b5e60761))
* enable inline rendering and remove Enter key exit ([9ef6827](https://github.com/dbirks/slack-emoji-typer/commit/9ef6827c73cf590f935d1da32e4606b1b9f62ba6))
* enable inline rendering mode instead of full screen ([19425f8](https://github.com/dbirks/slack-emoji-typer/commit/19425f89e6c8a1c56298d7c5f4846a5ed278fbfe))
* improve message display UI formatting ([6e5b8a6](https://github.com/dbirks/slack-emoji-typer/commit/6e5b8a64efb6d1f36d17fa693091aeedb5a4ae80))
* improve release-please configuration organization ([7c83d26](https://github.com/dbirks/slack-emoji-typer/commit/7c83d2612e8a401bc0c78e4bd341bd1e96e304c9))
* increase message display padding for better visual centering ([0758464](https://github.com/dbirks/slack-emoji-typer/commit/075846421112df3cc3d23eef4b30fa05067862b1))
* initial implementation of Slack emoji typer CLI ([d440aa3](https://github.com/dbirks/slack-emoji-typer/commit/d440aa36b12b411a92b323a880b4861c3f57f8a8))
* make input prompt symbol follow color mode ([a51c2e8](https://github.com/dbirks/slack-emoji-typer/commit/a51c2e82f8dcded4dfc35da89511694a5b52475b))
* redesign UI with input box style and Shift+Tab mode toggle ([18385e2](https://github.com/dbirks/slack-emoji-typer/commit/18385e24130250c44369ffc40a26fdce74629a38))


### Bug Fixes

* add --allow-sys permission for netrc-parser homedir access ([a0d5c1c](https://github.com/dbirks/slack-emoji-typer/commit/a0d5c1c99d8703deb8337872129494198841d632))
* add --allow-sys permission for netrc-parser homedir access ([b808353](https://github.com/dbirks/slack-emoji-typer/commit/b8083530737c6bf647ced409e5cb8fde616a0b55))
* add 2 spaces between username and timestamp ([3988756](https://github.com/dbirks/slack-emoji-typer/commit/3988756025b45241c6aec60ed20e6d764f78744f))
* add space after input prompt character ([4585d6b](https://github.com/dbirks/slack-emoji-typer/commit/4585d6b872381b4505cf4796b32e09548141b584))
* correct .netrc file format documentation ([55fb2f8](https://github.com/dbirks/slack-emoji-typer/commit/55fb2f835aa767017636aef412b6e3f8479f12cb))
* eliminate .netrc support due to module side effects ([6bade68](https://github.com/dbirks/slack-emoji-typer/commit/6bade689dfa587187eabeb25ff44ce770838c039))
* ensure we hit root workspace URL for token extraction ([a660f3c](https://github.com/dbirks/slack-emoji-typer/commit/a660f3c6342363d71de58566a2aac2c7ebb914b0))
* grant environment variable permissions for Ink terminal detection ([2a9d957](https://github.com/dbirks/slack-emoji-typer/commit/2a9d95773a74f6d507142cb4bcbf645968d868df))
* handle reaction counts for duplicate alphabet letters ([a725475](https://github.com/dbirks/slack-emoji-typer/commit/a725475b8f871de68242e54babd545040497a5e3))
* improve special character detection logic ([3bf695a](https://github.com/dbirks/slack-emoji-typer/commit/3bf695a339f95fffcab38417752adb72333d9dd9))
* prevent backspace from exiting on empty input box ([61a47b2](https://github.com/dbirks/slack-emoji-typer/commit/61a47b2e3f8bf539019f531b086ad9e231a952c1))
* prevent ci-info from requesting all CI environment variables ([400c6c8](https://github.com/dbirks/slack-emoji-typer/commit/400c6c8d821b2e58bc6118a86bad624c95b9bc34))
* prioritize real_name over display_name for user display ([c265ac3](https://github.com/dbirks/slack-emoji-typer/commit/c265ac3501f66708c7e928b0b087d79532196675))
* remove ink-use-stdout-dimensions to avoid file system access ([e2d892a](https://github.com/dbirks/slack-emoji-typer/commit/e2d892a6726cf347879ff613d12d4e072d34d78b))
* replace manual .netrc parsing with netrc-parser library ([22d2727](https://github.com/dbirks/slack-emoji-typer/commit/22d272796c390d410095466915a545752303a812))
* update all SLACK_TOKEN references to SLACK_API_COOKIE ([8e6e175](https://github.com/dbirks/slack-emoji-typer/commit/8e6e17577079754e174d698c99dc46a88c601dd1))
* use selective environment variable permissions instead of blanket access ([1b6c6b1](https://github.com/dbirks/slack-emoji-typer/commit/1b6c6b1459af96748f6fea71cd0839279a731c19))


### Documentation

* add critical development workflow notes to CLAUDE.md ([3cbccc3](https://github.com/dbirks/slack-emoji-typer/commit/3cbccc31f8a8ab7999fb2149333e1b66666b989c))
* comprehensive README overhaul with technology stack and development guide ([98b13c5](https://github.com/dbirks/slack-emoji-typer/commit/98b13c58cebfbc49a35e1ec4569a59c1e9bd8da3))
* document environment variable permissions in deno.json ([43876dc](https://github.com/dbirks/slack-emoji-typer/commit/43876dcb7c3df9646a3c2ac1fe0a778ac2f6789b))
* fix inaccuracies in CLAUDE.md ([ff7725d](https://github.com/dbirks/slack-emoji-typer/commit/ff7725dcf06c86ebb5c0e74ea89e8bd065532f06))
* fix README inaccuracies and improve structure ([1c542b6](https://github.com/dbirks/slack-emoji-typer/commit/1c542b61e7b176c875423f0de3d08b6880573268))
* remove reference to non-existent tests ([e93d7f6](https://github.com/dbirks/slack-emoji-typer/commit/e93d7f60d5df93ceee9a66d69b7cb2ed44f67418))


### Styles

* change input box border to thin rounded style ([6693d57](https://github.com/dbirks/slack-emoji-typer/commit/6693d572f3c96141a6fd1e6d9f2b33b618054bc8))
* change to bold border style for thicker input box ([2ade5ec](https://github.com/dbirks/slack-emoji-typer/commit/2ade5ec80fd505a431cc098a1c63485e6bf73e41))
* format README after removing prerequisite warning ([8cb25ad](https://github.com/dbirks/slack-emoji-typer/commit/8cb25ad2912ec68d78cc2caa995936e578cdec6d))
* format workflow files and help text ([313efbc](https://github.com/dbirks/slack-emoji-typer/commit/313efbc4c9f7e07d343b6573945918a6d134d1b9))
* format workflow files with proper newlines ([2777cad](https://github.com/dbirks/slack-emoji-typer/commit/2777cadb5e9515fff91882460f6291e8dde37545))
* improve message display typography ([90f5049](https://github.com/dbirks/slack-emoji-typer/commit/90f50492b49fd9835c92a589494935e36c22f652))
* make mode status text dimmed for subtle UI ([faafa33](https://github.com/dbirks/slack-emoji-typer/commit/faafa336651532c591cb61931dd74b785dc4a199))
* make Slack message border dimmed gray ([14ef093](https://github.com/dbirks/slack-emoji-typer/commit/14ef0935449a9a628f9a272a65ea2cfd18f1c4be))
* match mode status color to emoji mode ([25d7224](https://github.com/dbirks/slack-emoji-typer/commit/25d72240f0df82de7d294c5bb08a3e8cefb08bd1))
* remove outer parentheses from help text ([0260c23](https://github.com/dbirks/slack-emoji-typer/commit/0260c233d1d5aec7b59182452643a3e6f5b69eb0))


### Code Refactoring

* clean up debugging code and verbose logging ([aa5e514](https://github.com/dbirks/slack-emoji-typer/commit/aa5e5144eeadfd5190214c49d4054053d6a5efeb))
* migrate from package.json to native Deno configuration ([2b3ff73](https://github.com/dbirks/slack-emoji-typer/commit/2b3ff734808b1a967df6cf26beb72e9ce092d890))
* reorganize codebase into src/ folder structure ([28108fc](https://github.com/dbirks/slack-emoji-typer/commit/28108fcee1acd5bb85413b69797a8976679afc5a))
* simplify to cookie-only authentication ([92cf883](https://github.com/dbirks/slack-emoji-typer/commit/92cf883bb5ab897f88cf31c9f2306b4aab8c9e39))
* split React UI into focused, reusable components ([43934a3](https://github.com/dbirks/slack-emoji-typer/commit/43934a3c8b864e5875f59d38f9278159d182860d))
* use static import instead of dynamic import for netrc-parser ([829e67f](https://github.com/dbirks/slack-emoji-typer/commit/829e67f37de6fb83cd4f1839c9b3baa9f9aeffc5))


### Tests

* trigger release-please workflow ([9299d6c](https://github.com/dbirks/slack-emoji-typer/commit/9299d6c0304a24cb78627b425ebe251e183d1efc))


### Continuous Integration

* add auto-format workflow for pull requests ([e11b83a](https://github.com/dbirks/slack-emoji-typer/commit/e11b83ac13d7495923ac3d799a641dd860f28c2a))
* add continue-on-error to format workflow quality checks ([c56e78f](https://github.com/dbirks/slack-emoji-typer/commit/c56e78f5cf56ca2f199c38364efb173e02610cf8))
* fix GitHub Actions workflows and resolve lint issues ([10411d1](https://github.com/dbirks/slack-emoji-typer/commit/10411d111179a24a8682bd1fb6229502716457d5))
* improve release workflow and remove third-party dependencies ([25fded4](https://github.com/dbirks/slack-emoji-typer/commit/25fded4f7d35c1b2728b7b371d085275c4d484e8))
* reorganize workflows for better separation of concerns ([7000d64](https://github.com/dbirks/slack-emoji-typer/commit/7000d64f1ae03c02eb44ddbffbe17f77ac0e20f8))
