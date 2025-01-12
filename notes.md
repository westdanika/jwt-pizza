# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.tsx           | none              | none         |
| Register new user<br/>(t@jwt.com, pw: test)         | register.tsx       | [POST] /api/auth  | INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)\nINSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)             |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx          | [PUT] /api/auth   | SELECT * FROM user WHERE email=?\nSELECT * FROM userRole WHERE userId=?             |
| Order pizza                                         | menu.tsx, payment.tsx | [GET] /api/order/menu\n[POST] /api/order | SELECT * FROM menu\nINSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())\nINSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?) |
| Verify pizza                                        | delivery.tsx       | [POST] https://pizza-factory.cs329.click/api/order/verify | none        |
| View profile page                                   |                    |                   |              |
| View franchise<br/>(as diner)                       |                    |                   |              |
| Logout                                              | logout.tsx         | [DELETE] /api/auth |              |
| View About page                                     |                    |                   |              |
| View History page                                   |                    |                   |              |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |                    |                   |              |
| View franchise<br/>(as franchisee)                  |                    |                   |              |
| Create a store                                      |                    |                   |              |
| Close a store                                       |                    |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
