const data = {
  destinationName: "Hyderabad",
  lat: 17.3850,
  lng: 78.4867,
  country: "India",
  state: "Telangana"
};

fetch('http://localhost:3000/api/destinations/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'db818cd1-0428-4e89-be2a-bc9e5c46e379'
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.error(err));
