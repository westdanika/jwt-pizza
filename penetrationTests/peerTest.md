# Penetration Testing Report
By Danika West and Matt Stutzman

## Self Attack
### Attack 1: Danika West
| Item | Result |
| ---- | ------ |
| Date | April 10, 2025 |
| Target | pizza-service.westdanika.com |
| Classification | Injection |
| Severity | 2 | 
| Description | SQL injection updated only the admin user to the specified email and password, escalating the hacker's credentials authorization to admin level. Also attempted to chain SQL queries to delete the database tables, but mysql prevents chained queries in that manner. The attack also has the capability to change any specified user's email and password as desired. |
| Corrections | Parameterize user inputs for update user query. |

### Attack 2: Matt Stutzman

| Item | Result |
| ---- | ------ |
| Date | April 11, 2025 |
| Target | pizza-service.mattstutzmancs329.click |
| Classification  | Injection |
| Severity | 1 |
| Description | SQL injection updated all users credentials to be the same email and password. Application still usable, new registrants would be unaffected, but no existing users can login and authorization was escalated to admin level. Also attempted to chain SQL queries to delete the menu, but mysql prevents chained SQL queries. |
| Images | ![Successfully Hacked User Table](/penetrationTests/successfully%20hacked.png) |
| Corrections | Parameterize user inputs for update user query. |

## Peer Attack
### Peer Attack 1: Danika West
| Item | Result |
| ---- | ------ |
| Date | April 11, 2025 |
| Target | pizza-service.mattstutzmancs329.click |
| Classification | Injection |
| Severity | 2 (if successful) |
| Description | Attempted to do SQL injection on the update user endpoint to escalate authorization to admin level. However, SQL queries had been parameterized making the attack unsuccesful. Also attempted to login using default admin, franchisee, and diner credentials, and to gain access to the API key but was unsuccessful. |
| Corrections | None |

### Peer Attack 2: Matt Stutzman
| Item | Result |
| ---- | ------ |
| Date | April 11, 2025 |
| Target | pizza-service.westdanika.com |
| Classification | Injection | 
| Severity | 1 (if successful) |
| Description | Attempted to do SQL injection to update all existing user credentials to parameters passed in. However, it was unsuccessful. Query had been parameterized resulting in failure. Also used JWT.io to try and brute force the jwt secret, and tried using the sequencer to see if there was anything to exploit in the authtokens. |
| Corrections | None |


## Combined Summary of Learnings
 - Penetration testing is hard. For SQL injection you need the query to be just right or it will error or not do what you want, and could notify the developers.
 - Software tools try hard to fix any common exploits. For example, mysql doesn't allow stacked/chained queries to protect against undesired SQL injection attacks. There are also a lot of libraries and functions designed to make sanitizing and parameterizing SQL queries easier.
 - Using tools to automate is helpful, because doing brute force attacks or other attacks in the terminal or browser directly is a pain to input and to read the output from. 
 - It's important to test your software first before putting it out publicly for anyone to potentially attack. Be security minded and think about potential exploits before.
 - When doing penetration testing, do it in a sandboxed dev environment so you can easily repair or rollback any damage.
 - You should check logs and monitor the system for bad actors, and if possible, verify users with admin authority periodically to ensure a hacker doesn't go undetected for too long.