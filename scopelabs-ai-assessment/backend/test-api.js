import fetch from 'node-fetch';

async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/diagnosis/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test', email: 'test@email.com' })
        });
        const text = await res.text();
        console.log('Response:', res.status, text);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}
test();
