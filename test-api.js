// Test script to verify API endpoints
const testAPI = async () => {
    try {
        console.log('🧪 Testing API endpoints...\n');

        // Test 1: Health check
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await fetch('http://localhost:5000/health');
        const healthData = await healthResponse.json();
        console.log('   Health:', healthData.success ? '✅' : '❌', healthData.message);

        // Test 2: Login
        console.log('\n2️⃣ Testing login...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'varun',
                password: 'varun123'
            })
        });
        const loginData = await loginResponse.json();
        
        if (loginData.success) {
            console.log('   Login: ✅ Success');
            console.log('   Token:', loginData.data.token ? '✅ Present' : '❌ Missing');
            
            // Test 3: Get users with token
            console.log('\n3️⃣ Testing users endpoint...');
            const usersResponse = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${loginData.data.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const usersData = await usersResponse.json();
            
            if (usersData.success) {
                console.log('   Users: ✅ Success');
                console.log('   User count:', usersData.data.length);
                console.log('   Sample users:');
                usersData.data.slice(0, 3).forEach(user => {
                    console.log(`     - ${user.username} (${user.email}) - ${user.roleName || user.role}`);
                });
            } else {
                console.log('   Users: ❌ Failed -', usersData.message);
            }

            // Test 4: Get user stats
            console.log('\n4️⃣ Testing user stats...');
            const statsResponse = await fetch('http://localhost:5000/api/users/stats', {
                headers: {
                    'Authorization': `Bearer ${loginData.data.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const statsData = await statsResponse.json();
            
            if (statsData.success) {
                console.log('   Stats: ✅ Success');
                console.log('   Total users:', statsData.data.total);
                console.log('   Verified:', statsData.data.verified);
                console.log('   Admins:', statsData.data.admins);
            } else {
                console.log('   Stats: ❌ Failed -', statsData.message);
            }

        } else {
            console.log('   Login: ❌ Failed -', loginData.message);
        }

        console.log('\n🎯 Test Summary:');
        console.log('   If all tests pass, the User Management page should work correctly.');
        console.log('   Make sure to login first in the frontend before accessing User Management.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure backend server is running on port 5000');
        console.log('   2. Make sure MongoDB is running');
        console.log('   3. Run seed scripts if no users exist');
    }
};

// Run the test
testAPI();
