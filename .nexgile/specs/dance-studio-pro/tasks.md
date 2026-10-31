# Tasks: Dance Studio Pro

- [x] 1. Project setup
  - _Requirements: 1.1, 1.7_
  - _Files: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs, prisma/schema.prisma, .env.example, .gitignore, README.md, src/app/layout.tsx, src/app/globals.css, src/app/api/health/route.ts, src/lib/db.ts, src/lib/auth.ts, prisma/seed.ts, e2e/.gitkeep, src/lib/**/*.test.ts_
  - _Verify: npm test_
  - _Verify: npx prisma generate_
  - _Verify: npx prisma migrate dev --name init --skip-seed_
  - _Verify: npm run build_
  - _Issue: #1_

- [ ] 2. Sign in and sign up screen
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - _Depends: 1_
  - _Files: src/app/page.tsx, src/app/signin/page.tsx, src/app/signup/page.tsx, src/app/api/auth/signin/route.ts, src/app/api/auth/signup/route.ts, src/app/api/auth/signout/route.ts, src/app/auth.module.css, src/app/api/auth/**.test.ts_
  - _Verify: npm test -- auth_
  - _Issue: #2_

- [ ] 3. Home screen with tutorial browsing
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - _Depends: 1_
  - _Files: src/app/home/page.tsx, src/app/api/tutorials/route.ts, src/app/home.module.css, src/app/api/tutorials/**.test.ts_
  - _Verify: npm test -- tutorials_
  - _Issue: #3_

- [ ] 4. Tutorial screen with video and slow motion
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - _Depends: 1_
  - _Files: src/app/tutorial/[id]/page.tsx, src/app/api/tutorials/[id]/route.ts, src/app/tutorial.module.css, src/app/api/tutorials/[id]/**.test.ts_
  - _Verify: npm test -- tutorial_
  - _Issue: #4_

- [ ] 5. Practice session screen with recording and side-by-side playback
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
  - _Depends: 1, 4_
  - _Files: src/app/practice/[id]/page.tsx, src/app/api/recordings/route.ts, src/app/api/recordings/[id]/route.ts, src/app/api/tutorials/[id]/complete/route.ts, src/app/practice.module.css, src/app/api/recordings/**.test.ts_
  - _Verify: npm test -- recordings_
  - _Issue: #6_

- [ ] 6. Profile screen with favorites and practice schedule
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - _Depends: 1_
  - _Files: src/app/profile/page.tsx, src/app/api/profile/route.ts, src/app/api/favorites/[id]/route.ts, src/app/api/schedule/[id]/route.ts, src/app/profile.module.css, src/app/api/profile/**.test.ts_
  - _Verify: npm test -- profile_
  - _Issue: #5_

- [ ] 7. Progress screen
  - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - _Depends: 1, 5_
  - _Files: src/app/progress/page.tsx, src/app/api/progress/route.ts, src/app/progress.module.css, src/app/api/progress/**.test.ts_
  - _Verify: npm test -- progress_
  - _Issue: #8_

- [ ] 8. Achievements on the profile
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - _Depends: 1, 6_
  - _Files: src/app/api/achievements/route.ts, src/app/profile/achievements.tsx, src/app/achievements.module.css, src/app/api/achievements/**.test.ts_
  - _Verify: npm test -- achievements_
  - _Issue: #7_
