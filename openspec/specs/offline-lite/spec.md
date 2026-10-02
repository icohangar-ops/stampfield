# Offline Lite

The field app works without an account. Pro is a local flag.

## Requirements

### Requirement: Offline field book
The system SHALL cache the app shell in production with a service worker and keep captures available from IndexedDB.

#### Scenario: Production visit
- GIVEN a production build
- WHEN the app has been opened online
- THEN later offline navigations to cached field routes still render

### Requirement: One-time unlock mock
The system SHALL store a Pro flag locally that removes project and export limits, priced in the UI at $14.99 once.

#### Scenario: Unlock and revert
- WHEN the user unlocks Pro and later returns the device to Lite
- THEN limits follow the flag and no payment is collected
