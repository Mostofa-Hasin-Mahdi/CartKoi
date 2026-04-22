CartKoi is a multi-tenant e-commerce platform for food cart businesses in bangladesh
food carts in bangladesh tend to move from places to places and dont have a proper platform like food panda for restaurants 
cartkoi will provide a platform for food carts to showcase their menu, location, and operating hours 
it wont incorpate a delivery system since food carts already foodpanda for that, carkoi will just be about a platform for food cart owners to showcase their carts, items and get reviews from customers 
customers will go to the foodcarts in person 

here's what im thinking about the database of the cartkoi

this will be a web app first and foremost, the backend will be on supabase 
im thinking of creating a serverless architecture for this project 

here's what the application will do 

when the someone goes to the website, they will see a list of food carts but they have to select their area in maps so show the food carts available in their nearmost area
customers will be able to leave anonymous reviews (no account creation needed)
for food cart owners it becomes interesting,
they will have to go to the website/owner site of cartkoi and create an account, they will have to provide their cart details, menu, location, operating hours, etc
they will also have to provide their foodpanda link so that customers can order from there
they will also have to provide their social media links so that customers can follow them

each cart owner can have multiple carts in multiple locations 
think of each cart as an organization 
owner will be able to create employees that will only work within the food cart they been created in
the employees will able to set the prices, edit, delete and upload new items and update their prices as well, 
the employees can also select whether an item is out of stock or not, which will be updated on that specific food item
they will also be able to change the location and operating hours of each day since this is a food cart not a permanent restaurant

