import { Page, Locator } from "@playwright/test";

export class AnalyzerPage {
  readonly textTab: Locator;
  readonly imageTab: Locator;
  readonly urlTab: Locator;
  readonly textarea: Locator;
  readonly urlInput: Locator;
  readonly analyzeButton: Locator;
  readonly clearButton: Locator;
  readonly loadingSpinner: Locator;
  readonly resultCard: Locator;
  readonly riskBadge: Locator;
  readonly verdictText: Locator;
  readonly evidenceSection: Locator;
  readonly feedbackWidget: Locator;
  readonly charCounter: Locator;

  constructor(public page: Page) {
    this.textTab = page.getByRole("tab", { name: /text/i });
    this.imageTab = page.getByRole("tab", { name: /screenshot/i });
    this.urlTab = page.getByRole("tab", { name: /url/i });
    this.textarea = page.getByRole("textbox");
    this.urlInput = page.getByPlaceholder(/https/i);
    this.analyzeButton = page.getByRole("button", { name: /analyze/i });
    this.clearButton = page.getByRole("button", { name: /clear/i });
    this.loadingSpinner = page.getByTestId("loading-state");
    this.resultCard = page.getByTestId("analysis-result");
    this.riskBadge = page.getByTestId("risk-badge");
    this.verdictText = page.getByTestId("verdict-text");
    this.evidenceSection = page.getByTestId("evidence-section");
    this.feedbackWidget = page.getByTestId("feedback-widget");
    this.charCounter = page.getByTestId("char-counter");
  }

  async goto() {
    await this.page.goto("/analyze");
  }

  async analyzeText(text: string) {
    await this.textTab.click();
    await this.textarea.fill(text);
    await this.analyzeButton.click();
    await this.resultCard.waitFor({ timeout: 30000 });
  }

  async analyzeURL(url: string) {
    await this.urlTab.click();
    await this.urlInput.fill(url);
    await this.analyzeButton.click();
    await this.resultCard.waitFor({ timeout: 30000 });
  }
}
