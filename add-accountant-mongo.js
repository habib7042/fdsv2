// Script to add accountant to MongoDB
const accountantData = {
  name: 'Accountant',
  mobileNumber: '01893669792',
  pin: '7042'
};

console.log('Accountant Data to be added:');
console.log(JSON.stringify(accountantData, null, 2));

console.log('\nTo add this accountant to MongoDB, use one of the following methods:');

console.log('\n1. Using curl:');
console.log(`curl -X POST https://fdsv2.vercel.app/api/accountant-mongo/create \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(accountantData)}'`);

console.log('\n2. Using JavaScript in browser console:');
console.log(`fetch('https://fdsv2.vercel.app/api/accountant-mongo/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(accountantData)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`);

console.log('\n3. After adding the accountant, you can login with:');
console.log(`Mobile: ${accountantData.mobileNumber}`);
console.log(`PIN: ${accountantData.pin}`);