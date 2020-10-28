# Changelog

All notable changes to the API routes or the Database Schema will be documented in this file.

## PoochFriendly API [v1.3.0] - 2020-10-28

- Refactor sql into schema, procedures, triggers and sampleData.
- Add trigger for checking advertise availability.
- Add trigger for checking make bid.
- Add trigger for checking choose bid (i.e. based on avg rating whether can take care of up to 5 or up to 2 pets).

## PoochFriendly API [v1.2.0] - 2020-10-27

- Add route to soft delete pets. Must be logged in as pet owner to use this route.
- Add route to soft delete pet categories. Must be logged in as admin to use this route.
- Add route to soft delete advertised availabilities. Must be logged in as caretaker to use this route.
- Add route to delete bids. Must be logged in as pet owner to use this route.
- Standardise json response for all routes: {msg, error, isSuccess, result}.
- Remove status 400 to allow for more verbose error msg.
- Update all GET routes to check for is_deleted, no filtering is applied (i.e. it will just select \*)

## PoochFriendly API [v1.1.0] - 2020-10-26

- Add POST /bid/submit-rating-review route to add rating and review for a transaction.
- Add DELETE /user/ route to soft delete users (Must be logged in as Admin to use this route).
- Make bid and choose bid to first check whether caretaker is actually available for period: [bidStartPeriod, bidEndPeriod] before making changes (can be potential trigger)
- Update comments to include WHO calls the route.

## PoochFriendly API [v1.0.0] - 2020-10-18

- Basic routes based on ER diagram and Project Spec (left DELETE routes and APPLYING FOR LEAVES routes).
- Update DB Schema based on Prof's comments.
