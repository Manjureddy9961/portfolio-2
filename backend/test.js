fetch('http://localhost:3000/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'test', email: 'test@example.com', subject: 'test', message: 'test' })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
