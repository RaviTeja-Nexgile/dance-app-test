# Requirements brief — Dance Studio Pro
## Profile
A dance practice app where users learn dance through tutorial videos, record themselves, compare side-by-side, and track progress. · web app · dance education · size: business · depth: standard · personalData, publicUsers, files
- **Has a user interface?** Yes (Users interact with videos, recordings, and progress through a responsive interface on mobile and desktop.)
- **Runs locally?** Yes (The app serves pages to a browser, so Greenfield can start it locally.)
## The app
A dance practice app where users learn dance through tutorial videos, record themselves, compare side-by-side, and track progress.
## Goals and success
- G1 Help users learn dance from beginner to advanced levels through tutorials and practice. (description)
- M1 Within the first year: 10,000 registered users, 2,000 active monthly dancers, 500+ dance tutorials, users complete lessons and practice regularly. (10,000 registered users, 2,000 monthly active, 500+ tutorials) (Q5)
- M2 Users complete lessons and practice regularly. (Users complete lessons and practice regularly) (Q5)
## Roles
- R1 User (description)
## Workflows
### W1 Practice session (release 1) — actors: R1 User; trigger: User selects a tutorial to practice; outcome: User improves their dance skill and progress is recorded (description)
1. User opens a tutorial video
2. User watches the step-by-step instructions
3. User records themselves practicing with the camera
4. User plays back their recording side-by-side with the tutorial
5. User marks the tutorial as practiced
## Records
- E1 User profile. fields: name, level, favorite tutorials, practice schedule, progress, achievements; owner: User (description, Q2, Q3)
- E2 Tutorial video. fields: title, category, level, steps, video file (description)
- E3 Practice recording. fields: user, tutorial, video file, date; owner: User (description)
- E4 Achievement. fields: name, criteria, user, earnedAt (description, Q4)
## Rules
- BR1 Achievements are earned automatically based on progress.. Applies: A user completes 10 tutorials and earns the '10 Tutorials' achievement automatically.. Does not apply: An instructor cannot manually award an achievement to a user. (Q4)
## Decisions
- **Stack:** The stack the design part of the spec recommends for this app (decided by Greenfield) (Q8)
- **Deploy target:** No deploy for now (decided by Greenfield) (Q9)
## Other facts
- F1 Dance categories are Hip-Hop, Bollywood, Classical, Contemporary, and Freestyle. [entities] (description)
- F2 The app must have a responsive UI for mobile and desktop. [devices] (description)
- F3 Practice videos stay private; there is no social feed for sharing them. [scope] (Q1)
- F4 Progress tracking records both completed tutorials and practice hours. [entities] (Q2)
- F5 Practice schedules are set by the user themselves. [workflows] (Q3)
## The interview
- Q1 [scope · owner] Should the app include a social feed where users share their practice videos? → No, practice stays private
- Q2 [entities · owner] Should progress tracking be based on completed tutorials, practice hours, or both? → Both
- Q3 [workflows · owner] Should practice schedules be set by the user or suggested by the app? → User sets their own
- Q4 [rules · owner] Should achievements be earned automatically or awarded by an instructor? → Automatic
- Q5 [success · owner] A year after launch, what number would show the app worked? → Within the first year, I want to reach 10,000 registered users, have at least 2,000 active monthly dancers, and provide 500+ dance tutorials. I want users to complete lessons, practice regularly, improve their dancing skills, and enjoy learning different dance styles through the app.
- Q6 [entities · admin] What exactly should count as a completed tutorial? → Watching and recording
- Q7 [current · admin] How do you or your users practice dance today, before this app exists? → Decide for me
## Decided by Greenfield (Enough, decide the rest)
- Q8 Which languages and frameworks should the app use? → Decide for me (settled: The stack the design part of the spec recommends for this app)
- Q9 Where should the live app run? → Decide for me (settled: No deploy for now)
