import { test, expect } from "playwright-test-coverage";

test.beforeEach(async ({ page }) => {
  // Clear local storage and cookies
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.context().clearCookies();
});

test("home page", async ({ page }) => {
  await page.goto("/");

  expect(await page.title()).toBe("JWT Pizza");
});

test("purchase with login", async ({ page }) => {
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight"
      },
      { id: 2, title: "Pepperoni", image: "pizza2.png", price: 0.0042, description: "Spicy treat" }
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        stores: [
          { id: 4, name: "Lehi" },
          { id: 5, name: "Springville" },
          { id: 6, name: "American Fork" }
        ]
      },
      { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
      { id: 4, name: "topSpot", stores: [] }
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "d@jwt.com", password: "a" };
    const loginRes = {
      user: { id: 3, name: "Kai Chen", email: "d@jwt.com", roles: [{ role: "diner" }] },
      token: "abcdef"
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/order", async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: "Veggie", price: 0.0038 },
        { menuId: 2, description: "Pepperoni", price: 0.0042 }
      ],
      storeId: "4",
      franchiseId: 2
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 }
        ],
        storeId: "4",
        franchiseId: 2,
        id: 23
      },
      jwt: "eyJpYXQ"
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto("/");

  // Go to order page
  await page.getByRole("button", { name: "Order now" }).click();

  // Create order
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();

  // Login
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  // Pay
  await expect(page.getByRole("main")).toContainText("Send me those 2 pizzas right now!");
  await expect(page.locator("tbody")).toContainText("Veggie");
  await expect(page.locator("tbody")).toContainText("Pepperoni");
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await page.getByRole("button", { name: "Pay now" }).click();

  // Check balance
  await expect(page.getByText("0.008")).toBeVisible();
});

test("register user", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const registerReq = { email: "test@test.com", password: "test" };
    const registerRes = {
      user: { id: 3, name: "test", email: "test@test.com", roles: [{ role: "diner" }] },
      token: "abcdef"
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

  // Go to registration page
  await page.goto("/");
  await page.getByRole("link", { name: "Register" }).click();

  // Register a user
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("textbox", { name: "Full name" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("test");
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("test@test.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("test");
  await page.getByRole("button", { name: "Register" }).click();

  // Verify Registration and Login
  await expect(page.locator("#navbar-dark")).toContainText("Logout");
  await page.getByRole("link", { name: "t", exact: true }).click();
  await expect(page.getByRole("main")).toContainText("test");
  await expect(page.getByRole("main")).toContainText("test@test.com");
  await expect(page.getByRole("main")).toContainText("diner");
});

test("visit about page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
});

test("visit history page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("main")).toContainText("Mama Rucci, my my");
});

test("visit franchise page", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Global").getByRole("link", { name: "Franchise" }).click();
  await expect(page.getByRole("main")).toContainText("So you want a piece of the pie?");
});

test("get orders", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "d@jwt.com", password: "a" };
    const loginRes = {
      user: { id: 3, name: "Kai Chen", email: "d@jwt.com", roles: [{ role: "diner" }] },
      token: "abcdef"
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/order", async (route) => {
    const orderRes = {
      dinerId: 3,
      orders: [
        {
          items: [
            { id: 1, menuId: 1, description: "Veggie", price: 0.0038 },
            { id: 2, menuId: 2, description: "Pepperoni", price: 0.0042 }
          ],
          storeId: "4",
          franchiseId: 2,
          id: 23,
          date: "2024-06-05T05:14:40.000Z"
        }
      ],
      page: 1
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: orderRes });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();

  // Login
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("link", { name: "kc" }).click();
  await expect(page.locator("tbody")).toContainText("23");
  await expect(page.locator("tbody")).toContainText("0.008 ₿");
});

test("add and delete franchise", async ({ page }) => {});
