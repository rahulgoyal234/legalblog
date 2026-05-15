# Security Specification for Rahul Goyal's Blog

## 1. Data Invariants
- Only users with `role == 'admin'` can create, update, or delete posts.
- Public can read published posts.
- Admin can read all posts (including drafts).
- Users can only read their own private profiles, but admins can read all.
- All IDs must match '^[a-zA-Z0-9_\-]+$'.

## 2. The "Dirty Dozen" Payloads
1. Create post as unauthenticated user. (Denied)
2. Create post as authenticated non-admin user. (Denied)
3. Update post `authorId` to someone else's UID. (Denied)
4. Update post `status` to 'published' as non-admin. (Denied)
5. Delete a post as non-admin. (Denied)
6. List drafts as public user. (Denied)
7. Create a user with `role: 'admin'` as a new user. (Denied)
8. Update `createdAt` timestamp. (Denied)
9. Inject 2MB string into post `title`. (Denied)
10. Query for posts without a `status == 'published'` filter as public. (Denied)
11. Update another user's profile. (Denied)
12. Read `users` collection as unauthenticated. (Denied)

## 3. Test Runner (Draft)
The `firestore.rules.test.ts` would verify these scenarios using the Firebase Emulator.
