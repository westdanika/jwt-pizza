# Incident: 2025-04-04 15-55-00

## Summary

Between the hour of 15:55 and 16:05 on 2025-04-04, 2 users encountered 500 status code errors when ordering pizzas. The event was triggered by a chaos testing endpoint call. The chaos testing endpoint call (to PUT /api/vendor/:vendorToken) modified the vendor that fulfills pizza orders so that the chaos field was changed to some value other than 'false'.

This chaos testing endpoint call caused all pizza orders to fail with a status code of 500. The event was detected by Grafana Metrics and Logging. The team started working on the event by investigating the cause of the 500 status code and checking various metrics and log events. This high priority incident affected 10% of users.

## Detection

This incident was detected within two minutes when the alert of more than 0 500 status code error log events was triggered and the JWT Pizza DevOps team was paged through Grafana OnCall.

Next, the team investigated other metrics like request latency and the rate of error log events, as well as the log messages from that time period. Although no other alerts were triggered, the pizza failure rate and the rate of error log events increased slightly, as opposed to its stable rate before the incident began. There was an alert on those metrics, but it didn't trigger because the alert threshold was too high. We could potentially reduce that alert threshold, but need to consider if it would result in too many false positives.

## Impact

For 10 minutes between 15:55 MST and 16:05 MST on 2025-04-04, our users experienced this incident. This incident affected 2 users (10% of jwt pizza users), who experienced an issue where ordering pizzas failed and returned with 500 status code errors. No support tickets were submitted before the incident was resolved.

## Timeline

All times are in MST.

- _15:55_ - Chaos was triggered
- _15:57_ - JWT Pizza DevOps team was notified
- _16:00_ - JWT Pizza DevOps team determined the cause of the 500 failure for pizza orders. Determined to wait an additional 5 minutes to test if other metric alerts would eventually fire or if their thresholds need to be lowered.
- _16:05_ - JWT Pizza DevOps team navigated to the Pizza Factory Failure Reporting URL and the Chaos was stopped
- _16:10_ - JWT Pizza DevOps team completed their observation of the systems to confirm incident was resolved. Pizza orders no longer failed

## Response

After receiving an OnCall alert at 15:57 MST, the JWT Pizza DevOps team responded and determined the cause of the issue by 16:00 MST. The team then monitored the other alert metrics to determine if they were alerting as they were meant to, before navigating to the pizza factory failure reporting URL to report the issue at 16:05. The team finally observed the system for another 5 minutes to determine the incident was completely resolved.

## Root cause

The root cause of the incident was a triggering of chaos testing, likely the result of a call to the factory endpoint PUT /api/vendor/:vendorToken which resulted in an update to the pizza factory vendor settings to turn on chaos testing.

## Resolution

By following the instructions in the log messages from the incident, the team used the url "https://cs329.cs.byu.edu/api/report?apiKey=00d35d617a464948af17ec35ab725e9f&fixCode=4c08a8d92eaf42ff8d8495f99bd24533" to report the pizza creation error to the pizza factory vendor. After reporting the error, the incident was resolved. No more pizza failures were reported, the log events and other metrics returned to typical values, and no more reponses with 500 status codes were encountered. The team monitored the pizza ordering services for an additional 5 minutes to ensure that the incident was fully resolved and the system had recovered.
