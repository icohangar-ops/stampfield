# Projects

Local folders for field photos. Sample folders ship with the app and do not count toward the Lite quota.

## Requirements

### Requirement: Persist projects on device
The system SHALL store projects in IndexedDB and list them without an account.

#### Scenario: First launch
- GIVEN a browser with empty StampField storage
- WHEN the field app opens
- THEN Riverside Wetland Survey and Oak Street Facade Check exist as sample projects

#### Scenario: Create, rename, and delete
- GIVEN Lite has a free project slot
- WHEN the user creates, renames, or deletes a project
- THEN the change is saved locally and deleting a project removes its photos

#### Scenario: Lite project cap
- GIVEN two user-created projects and Pro locked
- WHEN the user creates another project
- THEN the app explains the cap and offers the local Pro unlock
