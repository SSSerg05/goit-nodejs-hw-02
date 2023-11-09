//**  responce - Ok 200-299
200 - Ok
201 - Create
204 - No Content

//** responce error Redirection 300-399
301 - address remove all time
302 - address remove some time

//** responce Error Query 400-499
400 - Bad Request / error in body query
401 - Unauthorized
403 - Forbidden
404 - Not Found (address or obj with this id)
409 - Conflict

//** Error server 500-599
500 - Server error


//** CRUD-operations:
GET/products - get all products
POST/products - add one product
GET/products/1/ - return product with id === 1 
DELETE/products/2 - delete product with id === 2