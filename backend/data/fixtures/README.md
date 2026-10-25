# TeamUp local fixtures

The generator creates seven local JSON files for users, students, rooms, room updates, applications, invitations, and notifications. Each contains at most 30 records. Relationships use email and room keys so the loader can map them to MongoDB IDs. Generated JSON files are ignored by Git and can be removed after loading; removing them does not remove records from MongoDB.

The `sanju@mail.com` account is linked to a hosted room, a pending application, a pending invitation, a room update, and notifications. Most fixture accounts participate in rooms; remaining accounts have profiles and notifications without being team members. Character fixture accounts use a lowercase first-name `@mail.com` address; the primary account keeps `sanju@mail.com`. All accounts share the same password supplied to the generator. User records store a bcrypt hash, not the plaintext password.

For local development, generate the user password hashes with:

```powershell
$env:TEAMUP_FIXTURE_PASSWORD = 'your chosen shared local password'
npm run fixtures:generate
Remove-Item Env:TEAMUP_FIXTURE_PASSWORD
```

The plaintext password is used only to generate bcrypt hashes and is not stored in the JSON files.

Load the records only into a development MongoDB database after reviewing the target configured by `MONGO_URI`:

```powershell
$env:ALLOW_FIXTURE_SEED = 'true'
npm run fixtures:seed
Remove-Item Env:ALLOW_FIXTURE_SEED
```

The loader is disabled when `NODE_ENV=production`, updates the `sanju@mail.com` password hash to the shared fixture password, and does not delete untagged documents. Fixture documents use deterministic IDs so cleanup can target only those records.

To remove only fixture records using those deterministic IDs, first verify `MONGO_URI` points to the intended development database, then run:

```powershell
$env:ALLOW_FIXTURE_CLEANUP = 'true'
npm run fixtures:clean
Remove-Item Env:ALLOW_FIXTURE_CLEANUP
```

Cleanup preserves `sanju@mail.com` and untagged records. It does not restore that account's previous password hash. These shared credentials are for local development only.
