# Export

Client-side PDF and CSV for one project.

## Requirements

### Requirement: Download a report
The system SHALL build a PDF and a CSV in the browser from the project's captures.

#### Scenario: PDF contents
- GIVEN a project with stamped photos
- WHEN the user exports a PDF
- THEN the file includes the project title, a schematic coordinate plot when coordinates exist, and each photo with GPS, time, and note

#### Scenario: CSV contents
- WHEN the user exports a CSV
- THEN each row includes capture id, project, ISO time, latitude, longitude, accuracy, GPS source, and note

#### Scenario: Lite export cap
- GIVEN the Lite export count is exhausted and Pro is locked
- WHEN the user exports
- THEN the file is not counted as a new export and the unlock is offered
