# Architecture decision records

Short records of decisions that are expensive to reverse. Each one says what we decided, why, and
what it costs us. Add a new record instead of rewriting an accepted one; mark the old one
**Superseded**.

| #                                            | Decision                                                 | Status                |
| -------------------------------------------- | -------------------------------------------------------- | --------------------- |
| [0001](0001-local-first-static-pwa.md)       | Local-first static PWA, no backend                       | Amended by 0009, 0010 |
| [0002](0002-vite-react-router.md)            | Vite + React Router 7 instead of Next.js                 | Accepted              |
| [0003](0003-indexeddb-with-dexie.md)         | IndexedDB via Dexie, with versioned migrations           | Accepted              |
| [0004](0004-content-as-typed-files.md)       | Curriculum and specs as typed files, validated at build  | Accepted              |
| [0005](0005-fsrs-spaced-repetition.md)       | FSRS for spaced repetition                               | Accepted              |
| [0006](0006-unverifiable-certificates.md)    | Certificates are completion certificates, not verifiable | Accepted              |
| [0007](0007-strict-csp.md)                   | Strict Content Security Policy from build-time hashes    | Accepted              |
| [0008](0008-dependency-majors.md)            | Pin proven major versions; upgrade deliberately          | Accepted              |
| [0009](0009-native-ios-capacitor.md)         | Native iOS app via Capacitor, built and signed in CI     | Accepted              |
| [0010](0010-app-only-distribution.md)        | App-only distribution: no public website                 | Accepted              |
| [0011](0011-curriculum-from-library-data.md) | Courses authored; drills generated from Library specs    | Accepted              |
