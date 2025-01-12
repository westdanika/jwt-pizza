# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.tsx           | none              | none         |
| Register new user<br/>(t@jwt.com, pw: test)         | register.tsx       | [POST] /api/auth  | INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)\nINSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx          | [PUT] /api/auth   | SELECT * FROM user WHERE email=?\nSELECT * FROM userRole WHERE userId=? |
| Order pizza                                         | menu.tsx, payment.tsx | [GET] /api/order/menu\n[POST] /api/order | SELECT * FROM menu\nINSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())\nINSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?) |
| Verify pizza                                        | delivery.tsx       | [POST] https://pizza-factory.cs329.click/api/order/verify | none |
| View profile page                                   | dinerDashboard.tsx | [GET] /api/order  | SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage}\nSELECT id, menuId, description, price FROM orderItem WHERE orderId=? |
| View franchise<br/>(as diner)                       | franchiseDashboard.tsx | [GET] /api/franchise/:userId | SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?\nSELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')}) |
| Logout                                              | logout.tsx         | [DELETE] /api/auth | DELETE FROM auth WHERE token=? |
| View About page                                     | about.tsx          | none              | none         |
| View History page                                   | history.tsx        | none              | none         |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) | login.tsx          | [PUT] /api/auth   | SELECT * FROM user WHERE email=?\nSELECT * FROM userRole WHERE userId=? |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.tsx | [GET] /api/franchise/:userId | SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?\nSELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')}) |
| Create a store                                      | createStore.tsx    | [POST] /api/franchise/:franchiseId/store | SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'\nSELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id\nINSERT INTO store (franchiseId, name) VALUES (?, ?) |
| Close a store                                       | closeStore.tsx     | [DELETE] /api/franchise/:franchiseId/store/:storeId | INSERT INTO store (franchiseId, name) VALUES (?, ?)\nDELETE FROM store WHERE franchiseId=? AND id=?             |
| Login as admin<br/>(a@jwt.com, pw: admin)           | login.tsx          | [PUT] /api/auth   | SELECT * FROM user WHERE email=?\nSELECT * FROM userRole WHERE userId=? |
| View Admin page                                     | adminDashboard.tsx | [GET] /api/franchise | SELECT id, name FROM franchise\nSELECT id, name FROM store WHERE franchiseId=? |
| Create a franchise for t@jwt.com                    | createFranchise.tsx | [POST] /api/franchise | SELECT id, name FROM user WHERE email=?\nINSERT INTO franchise (name) VALUES (?)\nINSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?) |
| Close the franchise for t@jwt.com                   | closeFranchise.tsx | [DELETE] /api/franchise/:franchiseId | DELETE FROM store WHERE franchiseId=?\nDELETE FROM userRole WHERE objectId=?\nDELETE FROM franchise WHERE id=? |
