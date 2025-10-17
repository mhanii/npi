from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000")

    # Wait for the canvas to be visible
    canvas = page.locator("canvas")
    expect(canvas).to_be_visible()

    # Give the scene a moment to render
    page.wait_for_timeout(2000)

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)