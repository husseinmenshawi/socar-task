# socar-task

This will serve as the backend API service

Postman API docs: https://documenter.getpostman.com/view/6753651/Tz5v2awa#85fbcb4c-ebba-4c2f-84d2-70ec84dc6e05

Public link to API: https://www.getpostman.com/collections/a45fde4914136b22c71b


## Setup

Standard, `npm install` and `npm start` will get the party poppin'.

## MSSM Db setup

Create db name with `socar-task-db`
Create a user with username as `testuser` and password as `123456`

## System Config

The following is the prepopulated data that will be inserted into your mssql db upon starting the server:

"CarStatuses" table:
1. Available
2. Booked

"Roles" table:
1. Admin
2. User

"Users" table:
1. Hussein admin - menshawi98@gmail.com - Admin
2. User One - userone@test.com - User
3. User Tow - usertwo@test.com - User



### Development

1. Launch Program - DEVL - PORT 3000
    1. Default development run configurations.
