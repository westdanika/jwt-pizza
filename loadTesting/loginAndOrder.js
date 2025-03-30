import { sleep, check, group, fail } from "k6";
import http from "k6/http";

// See https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/

export default function main() {
  let response = http.get("https://quickpizza.grafana.com");
  sleep(1);
}
import jsonpath from "https://jslib.k6.io/jsonpath/1.0.2/index.js";

export const options = {
  cloud: {
    distribution: { "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 } },
    apm: []
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 5, duration: "30s" },
        { target: 15, duration: "1m" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "30s" }
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1"
    }
  }
};

export function scenario_1() {
  let response;

  const vars = {};

  group("page_4 - https://jwtpizza.westdanika.com/", function () {
    // Login Diner
    response = http.put(
      "https://pizza-service.westdanika.com/api/auth",
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "content-type": "application/json",
          origin: "https://jwtpizza.westdanika.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        }
      }
    );
    if (
      !check(response, { "status equals 200": (response) => response.status.toString() === "200" })
    ) {
      console.log(response.body);
      fail("Login was *not* 200");
    }

    vars["token"] = jsonpath.query(response.json(), "$.token")[0];

    sleep(4.6);

    // Get Menu
    response = http.get("https://pizza-service.westdanika.com/api/order/menu", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        origin: "https://jwtpizza.westdanika.com",
        priority: "u=1, i",
        "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      }
    });

    // Get Franchise/Store Options
    response = http.get("https://pizza-service.westdanika.com/api/franchise", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        origin: "https://jwtpizza.westdanika.com",
        priority: "u=1, i",
        "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      }
    });
    sleep(13.6);

    // Order Pizzas
    response = http.post(
      "https://pizza-service.westdanika.com/api/order",
      '{"items":[{"menuId":3,"description":"Margarita","price":0.0042}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          authorization: `Bearer ${vars["token"]}`,
          "content-type": "application/json",
          origin: "https://jwtpizza.westdanika.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        }
      }
    );
    sleep(1.7);

    if (
      !check(response, { "status equals 200": (response) => response.status.toString() === "200" })
    ) {
      console.log(response.body);
      fail("Order purchase was *not* 200");
    }

    vars["pizzajwt"] = jsonpath.query(response.json(), "$.jwt")[0];

    // Verify JWT
    response = http.post(
      "https://pizza-factory.cs329.click/api/order/verify",
      JSON.stringify({ jwt: vars["pizzajwt"] }),
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          authorization: `Bearer ${vars["token"]}`,
          "content-type": "application/json",
          origin: "https://jwtpizza.westdanika.com",
          priority: "u=1, i",
          "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "sec-fetch-storage-access": "active"
        }
      }
    );
    sleep(1);

    // Logout User
    response = http.del("https://pizza-service.westdanika.com/api/auth", null, {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        authorization: `Bearer ${vars["token"]}`,
        "content-type": "application/json",
        origin: "https://jwtpizza.westdanika.com",
        priority: "u=1, i",
        "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      }
    });
  });
}
