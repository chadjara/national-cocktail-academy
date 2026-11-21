# Product spec

A free, offline, installable bartending academy for the phone. It takes a beginner to job-ready
through a structured program and keeps working bartenders sharp. It has four pillars:

1. **Curriculum.** Program › Course › Module › Lesson. Lesson types: reading, illustrated
   technique, interactive drill, quiz.
2. **Library.** About 100 classic and modern-classic specs, plus spirits, techniques, glassware and
   ice. Includes My Bar.
3. **Practice engine.**
   - FSRS spaced repetition for specs.
   - Speed Round ticket rail.
   - Pour trainer: free-pour count rhythm, plus an optional guided "pour water at home, then log
     the jigger reading" mode.
   - Bar math: pour cost, batching, dilution, par levels.
4. **Assessment and certification.**
   - Randomized written exams from a question bank.
   - Build simulations.
   - A required Responsible Service module with branching guest scenarios.
   - A Service Sim capstone.
   - A completion certificate PDF.

**The program has 8 courses:**

1. Foundations: station, tools, glassware, ice, hygiene
2. Spirits & Products
3. Technique: measure, shake, stir, build, muddle, layer, strain, dilution
4. The Classics by Family: sour, highball, old fashioned, martini/manhattan, fizz/collins,
   julep/smash, tiki, flip, spritz
5. Service & Speed: tickets, build order, rounds, well setup, guest craft
6. Bar Math & Business
7. Responsible Service (required)
8. Capstone

**Configurable settings** live in `src/config/app.config.ts`, validated with Zod:

- Academy name and brand
- Age-gate mode: `confirm-age` (21+) or `professional-training-framing`
- Exam pass mark (default 80%)
- Exam retake cooldown
- Default units

**Unit convention:** bartender standard 1 oz = 30 ml. Specs are stored in ml and displayed as oz
fractions (22.5 ml → ¾ oz). Dashes, barspoons, "top" and "rinse" are non-volumetric units.

---

## MVP user stories (student is the only role)

**Onboarding**

- I confirm my age or accept the professional-training framing.
- I set my name, which appears on my certificate.
- I choose oz or ml.
- I'm prompted to install the app to my home screen.

**Curriculum**

- I see where I am in the program and the next lesson.
- I can resume a lesson where I left off.
- Each lesson marks complete when I finish its required parts.
- Locked courses explain what unlocks them.

**Library**

- I can search specs by name or ingredient.
- I can filter by spirit, family, difficulty and technique.
- I can toggle between oz and ml.
- I can see method, glass, ice, garnish, history, variations and linked technique lessons.
- I can favorite specs.

**My Bar**

- I mark the bottles I have, and see what I can make and what one more bottle would unlock.

**Recall**

- I get a daily review queue of the specs I've learned, scheduled by FSRS.
- I rebuild each spec from memory and grade myself, or the app grades my built answer.

**Speed Round**

- Tickets arrive on a rail. I build each drink: ingredients, amounts, glass, ice, method, garnish.
- I'm scored on accuracy, speed and build order.
- I see my personal bests.

**Pour and math**

- I practice free-pour counts against a target.
- I solve pour-cost, batching and dilution problems with worked solutions.

**Exams**

- Each course ends in a randomized exam.
- I see my score, a breakdown by topic and what to review.
- I can retake after a cooldown.

**Responsible Service**

- I work through ID-check, intoxication-cue, refusal and liability scenarios.
- I must pass before I can be certified.

**Capstone**

- The Service Sim is a timed shift that mixes tickets with guest scenarios.
- Passing it, together with all course exams and Responsible Service, unlocks my certificate.

**Certificate**

- I download or share a PDF showing my name, program, date, certificate ID and content version.

**Progress (self-coaching dashboard)**

- I see my streak, review load, weakest specs and topics, and readiness for the exam.

**Data**

- I can back up my progress to a file and restore it on another device.
- I can reset my data.
- The app works fully offline after the first load.

---
