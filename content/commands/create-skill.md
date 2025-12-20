---
description: Create a new Agent Skill with proper structure, templates, and best practices
arguments:
  - name: name
    description: Name for the new skill (optional - will prompt if not provided)
    required: false
---

Use the skill-creator skill to help the user create a new Agent Skill.

Follow the skill-creator skill instructions in @skills/skill-creator/SKILL.md exactly.

Key steps:
1. Gather requirements (what, when, resources needed)
2. Determine location (project, personal, or agent-kit content)
3. Create directory structure
4. Write SKILL.md using the template
5. Add any needed assets/references/scripts
6. Provide testing instructions

Use the templates from:
- @skills/skill-creator/assets/skill-template.md - For SKILL.md structure
- @skills/skill-creator/references/best-practices.md - For writing guidance
- @skills/skill-creator/references/examples.md - For inspiration

If a skill name was provided, use it. Otherwise, ask the user what skill they want to create.
