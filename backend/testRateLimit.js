const { checkLoginLockout, recordFailedLogin, resetFailedLogin } = require('./middleware/rateLimiter');

// Mock req and res objects
const createMockReq = (ip, email) => ({
    headers: { 'x-forwarded-for': ip },
    socket: { remoteAddress: ip },
    body: { email }
});

const createMockRes = () => {
    const res = {
        statusCode: 200,
        headers: {},
        jsonBody: null,
        setHeader(key, val) {
            this.headers[key] = val;
        },
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.jsonBody = data;
            return this;
        }
    };
    return res;
};

console.log("=== RUNNING FAILED LOGIN RATE LIMITER TESTS ===");

const testIp = '192.168.1.100';
const testEmail = 'admin@example.com';

// Test 1-4: Failed attempts increment counter
for (let i = 1; i <= 4; i++) {
    const req = createMockReq(testIp, testEmail);
    const res = createMockRes();
    
    // Check lockout
    let locked = false;
    checkLoginLockout(req, res, () => { locked = false; });
    if (res.statusCode === 429) {
        console.error(`FAILED: Attempt ${i} was locked out prematurely!`);
        process.exit(1);
    }

    // Record failure
    recordFailedLogin(req, res);
    console.log(`Attempt ${i}: Status = ${res.statusCode}, Message = "${res.jsonBody.message}"`);

    if (res.statusCode !== 401) {
        console.error(`FAILED: Expected 401 status for attempt ${i}`);
        process.exit(1);
    }
}

// Test 5: 5th failed attempt triggers 5-minute lockout (429 status)
const req5 = createMockReq(testIp, testEmail);
const res5 = createMockRes();
recordFailedLogin(req5, res5);
console.log(`Attempt 5: Status = ${res5.statusCode}, Message = "${res5.jsonBody.message}"`);

if (res5.statusCode !== 429) {
    console.error(`FAILED: Expected 429 status for 5th failed attempt!`);
    process.exit(1);
}

// Test 6: Subsequent request blocked by checkLoginLockout middleware
const req6 = createMockReq(testIp, testEmail);
const res6 = createMockRes();
checkLoginLockout(req6, res6, () => {});
console.log(`Attempt 6 (Lockout Middleware): Status = ${res6.statusCode}, Message = "${res6.jsonBody.message}"`);

if (res6.statusCode !== 429 || res6.headers['Retry-After'] !== 300) {
    console.error(`FAILED: Expected 429 lockout status with 300s Retry-After!`);
    process.exit(1);
}

// Test 7: Reset login for another user/IP
const reqSuccess = createMockReq(testIp, testEmail);
resetFailedLogin(reqSuccess);

const reqPostReset = createMockReq(testIp, testEmail);
const resPostReset = createMockRes();
let passedAfterReset = false;
checkLoginLockout(reqPostReset, resPostReset, () => { passedAfterReset = true; });

if (passedAfterReset && resPostReset.statusCode === 200) {
    console.log("Success Reset Test: Lockout cleared successfully after valid reset!");
} else {
    console.error("FAILED: Lockout was not cleared after reset!");
    process.exit(1);
}

console.log("\nALL RATE LIMITER TESTS PASSED SUCCESSFULLY! ✅");
