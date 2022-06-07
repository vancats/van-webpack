fetch('/api/user1').then(res => res.json()).then(res => {
  console.log(res)
})

fetch('/api/user2').then(res => res.json()).then(res => {
  console.log(res)
})

fetch('/api/after').then(res => res.json()).then(res => {
  console.log(res)
})
