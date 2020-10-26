# Changelog

All notable changes to the API routes or the Database Schema will be documented in this file.

## PoochFriendly API [v1.1.0] - 2020-10-26

- Add POST /bid/submit-rating-review route to add rating and review for a transaction.
- Add DELETE /user/ route to delete users (Must be logged in as Admin to use this route).
- Make bid and choose bid to first check whether caretaker is actually available for period: [bidStartPeriod, bidEndPeriod] before making changes (can be potential trigger)
- Update comments to include WHO calls the route.

## PoochFriendly API [v1.0.0] - 2020-10-18

- Basic routes based on ER diagram and Project Spec (left DELETE routes and APPLYING FOR LEAVES routes)
- Update DB Schema based on Prof's comments
