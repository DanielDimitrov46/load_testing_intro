import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        ramping_vus: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "10s", target: 10 }, // Увеличава до 10 VUs за 10 секунди
                { duration: "20s", target: 20 }, // Увеличава до 20 VUs за 20 секунди
                { duration: "10s", target: 0 },  // Намалява до 0 VUs за 10 секунди
            ],
        },
        constant_load: {
            executor: "constant-vus",
            vus: 5,
            duration: "30s", // 5 потребители за 30 секунди
            startTime: "5s", // Започва 5 секунди след стартирането на първия сценарий
        },
    },
};

export default function () {
    const url = 'http://localhost:8080/capitalize';
    const payload = JSON.stringify({
        name: 'test',
        email: 'test@example.com',
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    let res = http.post(url, payload, params);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'response contains capitalized name': (r) => JSON.parse(r.body).name === 'TEST',
        'response contains capitalized email': (r) => JSON.parse(r.body).email === 'TEST@EXAMPLE.COM',
    });

    sleep(1);
}
