#Purpose
Return book data via site

##Data Model
Book fields
-id:string
-author: string
-title: string
-publicationDate:string

# End points
GET\books
return all books
response status: 200 on success

GET\books\:id
returns specific book
response status: 200 on success
No match: 404

## all data stored in Mongodb collection-books
API returns JSON
