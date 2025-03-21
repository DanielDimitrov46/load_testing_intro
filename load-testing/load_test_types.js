import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    scenarios: {
        smoke_test: {
            executor: 'constant-vus',
            vus: 5,
            duration: '1m',
        },
        average_load_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '10m', target: 50 },
                { duration: '20m', target: 50 },
                { duration: '10m', target: 0 },
            ],
        },
        stress_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '5m', target: 100 },
                { duration: '15m', target: 200 },
                { duration: '5m', target: 0 },
            ],
        },
        spike_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '10s', target: 200 },
                { duration: '1m', target: 200 },
                { duration: '10s', target: 0 },
            ],
        },
        breakpoint_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '10m', target: 50 },
                { duration: '10m', target: 100 },
                { duration: '10m', target: 200 },
                { duration: '10m', target: 400 },
            ],
        },
        soak_test: {
            executor: 'constant-vus',
            vus: 50,
            duration: '4h',
        },
    },
};

export default function () {
    let res = http.get('https://test.k6.io');
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
    sleep(1);
}
