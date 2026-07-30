# Privacy Policy for Atlas Discord Bot

**Last Updated:** July 30, 2026

Your privacy is extremely important to us. This Privacy Policy outlines how **Atlas Discord Bot** ("the Bot") handles data and protects your privacy when you interact with it on Discord.

---

### 1. Information We Collect & Process

The Bot is designed with a **privacy-first architecture**. We collect the absolute minimum data required for its core functionality:

#### Transient Data (Not Saved):
- **Command Interactions**: When you run slash commands like `/atlas docs` or `/atlas doctor`, the input options (e.g. search query) are processed transiently in memory to generate your response embed. They are **never** stored in a database or written to disk.
- **Server Events**: When a user joins the server, the Bot temporarily receives the user's Discord ID and username to generate a welcome embed in the designated welcome channel.

#### What We DO NOT Collect:
- ❌ We **do not** read, log, store, or sell user chat messages or private messages.
- ❌ We **do not** collect personal real names, email addresses, IP addresses, or payment details.
- ❌ We **do not** track user activity outside of explicit `/atlas` slash command executions.

---

### 2. How We Use Data
Collected transient data is used solely to:
- Respond to slash command requests (`/atlas info`, `/atlas docs`, `/atlas doctor`, `/atlas release`).
- Send welcome announcements for new members joining the server.

---

### 3. Data Storage & Retention
- **Zero Persistent User Database**: The Bot does not operate a database of user profiles, message logs, or behavioral analytics.
- **Memory Retention**: All command interaction objects are garbage-collected immediately after replying.

---

### 4. Third-Party Services
The Bot interacts with the following official APIs:
- **Discord API**: For receiving event payloads and sending message embeds. (Subject to [Discord's Privacy Policy](https://discord.com/privacy)).
- **GitHub API**: For retrieving public release metadata and documentation pages. (Subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)).

---

### 5. Security & Credentials
- All API tokens and credentials are encrypted and stored in secure environment variables (`.env`) on the hosting server.
- Credentials are never committed to open-source public repositories.

---

### 6. User Rights & Data Removal
Because the Bot does not persistently store user data, there is no personal data footprint to delete. If you wish to remove the Bot from a server, server administrators can kick or ban the Bot at any time.

---

### 7. Updates & Contact
We may update this Privacy Policy periodically. For questions regarding privacy:
- **GitHub Repository:** [https://github.com/Eren-Jaeger-DEV/Atlas-Bot](https://github.com/Eren-Jaeger-DEV/Atlas-Bot)
