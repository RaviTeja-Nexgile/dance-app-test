# Requirements: Dance Studio Pro

## Requirement 1: Sign in and sign up

**User Story:** As a User, I want to sign up and sign in with my own account, so that my tutorials, recordings, progress and achievements stay public, and so that I can share my own dance steps with other dancers. If I want privacy, I can set my content to private.

_Source: R1, E1, F3_

### Acceptance Criteria

1. WHEN a person opens the app at `/` THE SYSTEM SHALL show the sign-in page.
2. WHEN a person without an account enters a name, an email and a password and submits THE SYSTEM SHALL create their User profile and sign them in.
3. WHEN a person enters an email and password that match an existing account THE SYSTEM SHALL sign them in.
4. IF a person enters an email and password that do not match any account THEN THE SYSTEM SHALL show the message "Incorrect email or password".
5. WHEN a User signs in THE SYSTEM SHALL open their home screen, which lists the dance tutorials.
6. WHEN a User signs out THE SYSTEM SHALL return them to the sign-in page and stop showing their recordings and progress.
7. WHILE a User is signed in THE SYSTEM SHALL keep them signed in when they reopen the app.

## Requirement 2: Browse tutorials by category

**User Story:** As a User, I want to browse dance tutorials by category and level, so that I can find a dance to learn at my own level.

_Source: G1, E2, F1_

### Acceptance Criteria

1. WHEN a signed-in User opens their home screen THE SYSTEM SHALL list the dance tutorials.
2. WHEN a User selects a category THE SYSTEM SHALL show only the tutorials in that category.
3. THE SYSTEM SHALL offer the categories Hip-Hop, Bollywood, Classical, Contemporary and Freestyle.
4. WHEN a User selects a level THE SYSTEM SHALL show only the tutorials at that level.
5. THE SYSTEM SHALL offer the levels Beginner, Intermediate and Advanced.
6. WHEN a User searches for text THE SYSTEM SHALL show only the tutorials whose title contains that text.
7. EACH tutorial in the list SHALL show its title, category and level.

## Requirement 3: Watch a tutorial

**User Story:** As a User, I want to watch a tutorial video with step-by-step instructions and slow-motion playback, so that I can learn each move before I practice it.

_Source: G1, W1, E2_

### Acceptance Criteria

1. WHEN a User opens a tutorial THE SYSTEM SHALL play its tutorial video.
2. WHEN a User opens a tutorial THE SYSTEM SHALL show its step-by-step instructions.
3. WHEN a User turns on slow-motion playback THE SYSTEM SHALL play the video at half speed.
4. WHEN a User turns slow-motion playback off THE SYSTEM SHALL play the video at normal speed.
5. WHEN a User pauses the video THE SYSTEM SHALL stop it at the current position.
6. WHEN a User resumes the video THE SYSTEM SHALL continue from the position where it was paused.
7. THE SYSTEM SHALL show the tutorial's title, category and level on its page.

## Requirement 4: Practice session

**User Story:** As a User, I want to record myself practicing with my camera and play my recording back side-by-side with the tutorial, so that I can compare my moves to the tutorial and improve.

_Source: W1, E3, F3_

### Acceptance Criteria

1. WHEN a User starts a practice session on a tutorial THE SYSTEM SHALL ask for permission to use the camera.
2. WHEN a User starts recording THE SYSTEM SHALL record video from their camera.
3. WHEN a User stops recording THE SYSTEM SHALL save the recording to their account.
4. WHEN a User plays back a recording THE SYSTEM SHALL show it side-by-side with the tutorial video.
5. WHEN a User plays back a recording THE SYSTEM SHALL play the recording and the tutorial video at the same time.
6. WHEN a User marks a tutorial as practiced THE SYSTEM SHALL record the tutorial as completed for that User.
7. IF a User denies camera permission THEN THE SYSTEM SHALL show the message "Camera access is needed to record your practice".
8. THE SYSTEM SHALL keep a User's practice recordings private to that User.

## Requirement 5: User profile

**User Story:** As a User, I want a profile with my name, level, favorite tutorials and a practice schedule I set myself, so that I can manage my own learning.

_Source: E1, F5_

### Acceptance Criteria

1. WHEN a User opens their profile THE SYSTEM SHALL show their name and level.
2. WHEN a User changes their level THE SYSTEM SHALL save the new level.
3. WHEN a User marks a tutorial as a favorite THE SYSTEM SHALL add it to their favorite tutorials.
4. WHEN a User removes a tutorial from favorites THE SYSTEM SHALL remove it from their favorite tutorials.
5. WHEN a User adds a practice session to their schedule THE SYSTEM SHALL save it with a date and time.
6. WHEN a User removes a practice session from their schedule THE SYSTEM SHALL delete it.
7. THE SYSTEM SHALL show a User's favorite tutorials and practice schedule on their profile.

## Requirement 6: Progress tracking

**User Story:** As a User, I want to see my completed tutorials and my practice hours, so that I know how far I have come.

_Source: F4, M2, E1_

### Acceptance Criteria

1. WHEN a User opens their progress THE SYSTEM SHALL show the number of tutorials they have completed.
2. WHEN a User opens their progress THE SYSTEM SHALL show their total practice hours.
3. WHEN a User completes a tutorial THE SYSTEM SHALL add it to their completed tutorials.
4. WHEN a User finishes a practice session THE SYSTEM SHALL add the session's length to their practice hours.

## Requirement 7: Achievements

**User Story:** As a User, I want to earn achievements automatically as I progress, so that I feel rewarded for practicing.

_Source: BR1, E4_

### Acceptance Criteria

1. WHEN a User completes 10 tutorials THE SYSTEM SHALL award them the "10 Tutorials" achievement.
2. WHEN a User earns an achievement THE SYSTEM SHALL show it on their profile.
3. THE SYSTEM SHALL award achievements automatically based on a User's progress.
4. THE SYSTEM SHALL NOT let any person award an achievement to a User by hand.

## Later releases

- M1: 10,000 registered users, 2,000 active monthly dancers and 500+ tutorials within the first year (a launch target, not a release-1 feature).

## Assumptions

- A tutorial is completed when a User watches it and records a practice session for it (per Q6).
- The app keeps data between runs in a database, since Users, tutorials, recordings, progress and achievements must persist.
