# Capture

Stamp a photo with coordinates, an ISO timestamp, and a short note.

## Requirements

### Requirement: Stamp overlay
The system SHALL preview a stamp with latitude and longitude, an ISO timestamp, the GPS source, and the note before the photo is saved.

#### Scenario: Device GPS
- GIVEN the browser returns a geolocation fix
- WHEN a photo is previewed
- THEN the overlay shows those coordinates and Device GPS

#### Scenario: Manual coordinates
- GIVEN the user enables manual coordinates
- WHEN latitude or longitude is outside the valid range
- THEN save stays blocked and the range is explained

#### Scenario: Keyword folder suggestion
- GIVEN a note that contains field keywords
- WHEN the note is long enough to match
- THEN a folder suggestion is shown from the on-device word list
