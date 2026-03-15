import { Page, Locator } from "@playwright/test";

export class AnalyzerPage {
  // Tabs
  readonly textTab: Locator;
  readonly imageTab: Locator;
  readonly urlTab: Locator;

  // Inputs
  readonly textarea: Locator;
  readonly urlInput: Locator;
  readonly fileDropzone: Locator;

  // Buttons
  readonly analyzeButton: Locator;
  readonly clearButton: Locator;
  readonly analyzeAnotherButton: Locator;
  readonly copyReportButton: Locator;

  // Result
  readonly loadingSpinner: Locator;
  readonly resultCard: Locator;
  readonly riskBadge: Locator;
  readonly verdictText: Locator;
  readonly evidenceSection: Locator;

  // Feedback
  readonly feedbackWidget: Locator;
  readonly feedbackSubmit: Locator;
  readonly feedbackSuccess: Locator;

  // Misc
  readonly charCounter: Locator;

  constructor(public page: Page) {
    // Tabs
    this.textTab = page.getByTestId("tab-text");
    this.imageTab = page.getByTestId("tab-image");
    this.urlTab = page.getByTestId("tab-url");

    // Inputs
    this.textarea = page.getByTestId("text-input");
    this.urlInput = page.getByTestId("url-input");
    this.fileDropzone = page.getByTestId("file-dropzone");

    // Buttons
    this.analyzeButton = page.getByTestId("analyze-button");
    this.clearButton = page.getByTestId("clear-button");
    this.analyzeAnotherButton = page.getByTestId("analyze-another-button");
    this.copyReportButton = page.getByTestId("copy-report-button");

    // Result
    this.loadingSpinner = page.getByTestId("loading-state");
    this.resultCard = page.getByTestId("analysis-result");
    this.riskBadge = page.getByTestId("risk-badge");
    this.verdictText = page.getByTestId("verdict-text");
    this.evidenceSection = page.getByTestId("evidence-section");

    // Feedback
    this.feedbackWidget = page.getByTestId("feedback-widget");
    this.feedbackSubmit = page.getByTestId("feedback-submit");
    this.feedbackSuccess = page.getByTestId("feedback-success");

    // Misc
    this.charCounter = page.getByTestId("char-counter");
  }

  feedbackStar(n: number): Locator {
    return this.page.getByTestId(`feedback-star-${n}`);
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
    await this.urlInput.pressSequentially(url, { delay: 10 });
    await this.urlInput.press("Enter");
    await this.resultCard.waitFor({ timeout: 30000 });
  }
}
