const form = document.querySelector("#plannerForm");
const sampleBtn = document.querySelector("#sampleBtn");
const resetBtn = document.querySelector("#resetBtn");
const exportBtn = document.querySelector("#exportBtn");
const toast = document.querySelector("#toast");

const fields = {
  businessBrief: document.querySelector("#businessBrief"),
  objective: document.querySelector("#objective"),
  product: document.querySelector("#product"),
  audience: document.querySelector("#audience"),
  segment: document.querySelector("#segment"),
  offer: document.querySelector("#offer"),
  budget: document.querySelector("#budget"),
  painPoint: document.querySelector("#painPoint"),
  promise: document.querySelector("#promise")
};

const outputs = {
  snapshotObjective: document.querySelector("#snapshotObjective"),
  snapshotAngles: document.querySelector("#snapshotAngles"),
  snapshotVariants: document.querySelector("#snapshotVariants"),
  kpiObjective: document.querySelector("#kpiObjective"),
  kpiAudience: document.querySelector("#kpiAudience"),
  kpiBudget: document.querySelector("#kpiBudget"),
  kpiWindow: document.querySelector("#kpiWindow"),
  audiencePlanner: document.querySelector("#audiencePlanner"),
  angleGrid: document.querySelector("#angleGrid"),
  hookList: document.querySelector("#hookList"),
  ctaList: document.querySelector("#ctaList"),
  primaryTextList: document.querySelector("#primaryTextList"),
  headlineList: document.querySelector("#headlineList"),
  matrixBody: document.querySelector("#matrixBody"),
  budgetPlan: document.querySelector("#budgetPlan"),
  winningChecklist: document.querySelector("#winningChecklist")
};

const defaults = {
  businessBrief: "A business wants to turn a clear offer into a structured Meta Ads creative test.",
  objective: "Leads",
  product: "the product or service",
  audience: "the target audience",
  segment: "Cold prospecting",
  offer: "a simple next step",
  budget: "",
  painPoint: "the problem they want solved",
  promise: "a clearer and more useful outcome"
};

const sampleBrief = {
  businessBrief: "A local fitness coach wants more booked trial sessions from busy professionals who struggle to stay consistent with workouts.",
  objective: "Leads",
  product: "6-week coaching plan",
  audience: "busy professionals",
  segment: "Cold prospecting",
  offer: "free strategy call",
  budget: "30000 PKR",
  painPoint: "no time to plan workouts",
  promise: "build a repeatable weekly fitness routine"
};

const objectiveSettings = {
  Leads: {
    kpi: "Cost per qualified lead",
    window: "3-5 days",
    ctas: ["Book your free call", "Request a consultation", "Get your plan", "Check availability", "Start with a free review"]
  },
  Sales: {
    kpi: "Cost per purchase",
    window: "5-7 days",
    ctas: ["Shop the offer", "Claim the deal", "Choose your plan", "Buy now", "See what is included"]
  },
  Traffic: {
    kpi: "Landing page view cost",
    window: "2-4 days",
    ctas: ["Learn more", "View the details", "Explore the offer", "Visit the page", "See how it works"]
  },
  Engagement: {
    kpi: "Meaningful engagement rate",
    window: "2-4 days",
    ctas: ["Comment for details", "Save this idea", "Share with a friend", "Follow for more", "Tell us your goal"]
  },
  Awareness: {
    kpi: "Thumb-stop rate",
    window: "3-5 days",
    ctas: ["Watch the story", "Discover the offer", "See the difference", "Learn the basics", "Remember this option"]
  }
};

const formats = [
  "Short video",
  "Static image",
  "Carousel",
  "UGC-style concept",
  "Testimonial/proof ad",
  "Founder/expert talking head",
  "Retargeting proof ad",
  "Offer reminder ad"
];

function getPlanInput() {
  return Object.fromEntries(
    Object.entries(fields).map(([key, element]) => {
      const fallback = defaults[key];
      return [key, cleanInput(element.value, fallback)];
    })
  );
}

function cleanInput(value, fallback) {
  const compactValue = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();

  const looksLikePrompt =
    /ignore previous|system prompt|developer message|act as|you are chatgpt|write code|create files|tasks?:|instructions?:/i.test(compactValue);

  if (!compactValue || looksLikePrompt) {
    return fallback;
  }

  return compactValue.slice(0, 180);
}

function sentenceCase(value) {
  const text = String(value || "").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function trimEnding(value) {
  return String(value || "").replace(/[.!?]+$/g, "");
}

function outcomePhrase(value) {
  return trimEnding(value).replace(/^(build|get|create|achieve|start|develop|improve)\s+/i, "");
}

function painQuestion(value) {
  const pain = trimEnding(value)
    .replace(/^(they are|they're|customers are|people are|the audience is)\s+/i, "")
    .replace(/^struggling with\s+/i, "struggling to handle ");

  if (/^no time to\s+/i.test(pain)) {
    return `${sentenceCase(pain)}?`;
  }

  if (/^unsure|^not sure|^confused|^worried|^stuck/i.test(pain)) {
    return `${sentenceCase(pain)}?`;
  }

  return `Trying to solve ${pain}?`;
}

function ctaOfferPhrase(offer) {
  if (/^free\s+/i.test(offer)) {
    return `Book your ${offer}`;
  }

  if (/^(consultation|call|demo|audit|review)/i.test(offer)) {
    return `Book your ${offer}`;
  }

  return `Start with ${offer}`;
}

function articlePhrase(value) {
  const text = trimEnding(value);

  if (/^(a|an|the|your|my|our)\s+/i.test(text)) {
    return text;
  }

  return `the ${text}`;
}

function softArticlePhrase(value) {
  const text = trimEnding(value);

  if (/^(a|an|the|your|my|our)\s+/i.test(text)) {
    return text;
  }

  if (/^free\s+/i.test(text)) {
    return `a ${text}`;
  }

  return text;
}

function requestOfferPhrase(offer) {
  if (/^free\s+/i.test(offer)) {
    return `Request your ${offer}`;
  }

  return `Request ${offer}`;
}

function createPlan(input) {
  const settings = objectiveSettings[input.objective] || objectiveSettings.Leads;
  const briefContext = trimEnding(input.businessBrief);
  const product = trimEnding(input.product);
  const audience = trimEnding(input.audience);
  const offer = trimEnding(input.offer);
  const painPoint = trimEnding(input.painPoint);
  const promise = trimEnding(input.promise);
  const budget = parseBudget(input.budget);

  const angles = createAngles({ briefContext, product, audience, offer, painPoint, promise });
  const hooks = createHooks({ product, audience, offer, painPoint, promise });
  const primaryText = createPrimaryText({ product, audience, offer, painPoint, promise });
  const headlines = createHeadlines({ product, audience, offer, painPoint, promise });
  const ctas = createCtas(settings.ctas, { offer, product, objective: input.objective });
  const audienceSegments = createAudienceSegments({ briefContext, product, audience, offer, painPoint, promise, segment: input.segment });
  const matrix = createMatrix({ audience, segment: input.segment, angles, hooks, settings });
  const budgetPlan = createBudgetPlan({ budget, audience, offer, product, settings });
  const checklist = createChecklist({ audience, offer, painPoint, promise, settings });

  return {
    input,
    settings,
    angles,
    hooks,
    primaryText,
    headlines,
    ctas,
    audienceSegments,
    matrix,
    budget,
    budgetPlan,
    checklist
  };
}

function createAngles(context) {
  const { briefContext, product, audience, offer, painPoint, promise } = context;
  return [
    {
      name: "Pain-aware",
      detail: `Speak directly to ${audience} who are dealing with ${painPoint}. Connect the brief to ${product} as a practical way to start solving it.`
    },
    {
      name: "Outcome-led",
      detail: `Lead with the desired result: ${promise}. Show how ${offer} helps the audience see the path before making a bigger commitment.`
    },
    {
      name: "Offer-focused",
      detail: `Make ${offer} the main reason to act now, using simple copy that explains what ${audience} get and why it matters.`
    },
    {
      name: "Trust proof",
      detail: `Use proof, process clarity, or expert guidance to make ${product} feel credible for the situation in the brief: ${briefContext}.`
    },
    {
      name: "Objection handling",
      detail: `Answer the likely hesitation behind ${painPoint}: time, cost, uncertainty, or trust. Keep the message calm and specific.`
    },
    {
      name: "Before/after transformation",
      detail: `Show the shift from ${painPoint} to ${promise}, using a clear visual or story that ${audience} can recognize quickly.`
    },
    {
      name: "Social proof",
      detail: `Frame ${product} around people like ${audience}: what they tried, what changed, and why ${offer} was a safe first step.`
    },
    {
      name: "Urgency or limited availability",
      detail: `Add a real timing reason to use ${offer}, such as limited call slots, a launch window, or a seasonal need. Avoid fake scarcity.`
    }
  ];
}

function createHooks(context) {
  const { product, audience, offer, painPoint, promise } = context;
  const outcome = outcomePhrase(promise);
  return [
    `${painQuestion(painPoint)} Start with a clearer plan.`,
    `${sentenceCase(audience)} need a plan that fits real life.`,
    `Make ${outcome} easier to start this week.`,
    `Stop guessing your next step with ${articlePhrase(product)}.`,
    `${sentenceCase(softArticlePhrase(offer))} can be the first step.`,
    `A simpler way for ${audience} to move past ${painPoint}.`,
    `You do not need a perfect plan to make progress.`,
    `See what changes when ${articlePhrase(product)} is built around ${audience}.`,
    `Turn ${painPoint} into a plan you can actually follow.`,
    `Use ${softArticlePhrase(offer)} to choose your next move.`,
    `${sentenceCase(outcome)} starts with one practical step.`,
    `For ${audience} who want progress without the guesswork.`
  ];
}

function createPrimaryText(context) {
  const { product, audience, offer, painPoint, promise } = context;
  return [
    `${sentenceCase(audience)} often know the goal, but ${painPoint} makes it hard to stay consistent. ${sentenceCase(product)} helps you move toward ${promise} with a clearer plan. Start with ${offer}.`,
    `If ${painPoint} is getting in the way, use ${offer} to map the next step before you commit. ${sentenceCase(product)} is built for ${audience} who want ${promise}.`,
    `${sentenceCase(product)} gives ${audience} a more practical way to work toward ${promise}. No overcomplication, just a focused plan around the problem that matters: ${painPoint}.`,
    `Your next step should feel clear. With ${softArticlePhrase(offer)}, ${audience} can see whether ${product} is the right fit for solving ${painPoint} and moving toward ${promise}.`,
    `${sentenceCase(audience)} deserve a next step that feels useful, not overwhelming. Start with ${softArticlePhrase(offer)} and see how ${product} can help you move from ${painPoint} toward ${promise}.`
  ];
}

function createHeadlines(context) {
  const { product, audience, offer, painPoint, promise } = context;
  const outcome = outcomePhrase(promise);
  return [
    `${sentenceCase(offer)}`,
    `${sentenceCase(product)} for ${audience}`,
    `A simpler path to ${outcome}`,
    `Move past ${painPoint}`,
    `Built for ${audience}`,
    `Start with a clearer plan`,
    `Make ${outcome} easier`
  ];
}

function createCtas(baseCtas, context) {
  const { offer, product, objective } = context;
  const contextual = [
    ctaOfferPhrase(offer),
    `See if ${articlePhrase(product)} fits`,
    objective === "Leads" ? requestOfferPhrase(offer) : `View ${offer}`,
    "Get the next step",
    "Learn what to do next"
  ];

  return [...new Set([...contextual, ...baseCtas])].slice(0, 7);
}

function createAudienceSegments(context) {
  const { briefContext, product, audience, offer, painPoint, promise, segment } = context;
  return [
    {
      name: segment,
      detail: `Primary test group from the brief: ${briefContext}. Test pain-aware and outcome-led messages for ${audience} around ${painPoint} and ${promise}.`
    },
    {
      name: "Warm retargeting",
      detail: `Retarget site visitors, engagers, and video viewers with proof that ${product} is credible, then bring them back to ${offer}.`
    },
    {
      name: "Lookalike or interest validation",
      detail: `Validate the strongest angle with a second audience that resembles ${audience}, keeping the same offer and KPI for a cleaner read.`
    }
  ];
}

function createMatrix(context) {
  const { segment, angles, hooks, settings } = context;
  const audiences = [
    segment,
    "Broad cold audience",
    "Interest or behavior stack",
    "Lookalike validation",
    "Warm engagers",
    "Website visitors",
    "Video viewers",
    "High-intent retargeting"
  ];

  const rules = [
    `Keep if hook retention and ${settings.kpi.toLowerCase()} are stronger than the other cold tests after ${settings.window}.`,
    "Keep if it earns qualified comments, saves, clicks, or leads without confusing the offer.",
    "Keep if each card earns useful clicks and the final CTA card does not drop attention sharply.",
    "Keep if the concept works outside the first audience and the cost stays within a realistic learning range.",
    "Keep if proof improves lead or purchase quality compared with cold creative tests.",
    "Keep if viewers understand the offer and move to the next step at a better rate.",
    "Keep if warm viewers respond to proof, FAQs, or credibility signals.",
    "Scale carefully if the winner repeats its result in a fresh audience or format."
  ];

  return formats.map((format, index) => ({
    test: `T${index + 1}`,
    audience: audiences[index],
    angle: angles[index % angles.length].name,
    hook: hooks[index % hooks.length],
    format,
    kpi: settings.kpi,
    rule: rules[index]
  }));
}

function createBudgetPlan(context) {
  const { budget, audience, offer, product, settings } = context;
  const split = budget
    ? {
        stage1: formatMoney(budget, 0.7),
        stage2: formatMoney(budget, 0.2),
        stage3: formatMoney(budget, 0.1)
      }
    : {
        stage1: "70% of test budget",
        stage2: "20% of test budget",
        stage3: "10% of test budget"
      };

  return [
    {
      name: `Stage 1: Cold creative tests - ${split.stage1}`,
      detail: `Test 4-6 cold concepts for ${audience}. Prioritize pain-aware, outcome-led, offer-focused, and before/after formats. Watch ${settings.kpi.toLowerCase()} and early hook strength.`
    },
    {
      name: `Stage 2: Retargeting/proof tests - ${split.stage2}`,
      detail: `Use testimonial, FAQ, process, or expert proof ads for people who engaged with ${product}. Keep ${offer} clear and remove hesitation.`
    },
    {
      name: `Stage 3: Winning concept validation - ${split.stage3}`,
      detail: `Rebuild the best concept in a second format or audience. Validate that the result is repeatable before increasing spend.`
    }
  ];
}

function createChecklist(context) {
  const { audience, offer, painPoint, promise, settings } = context;
  return [
    `The ad clearly names ${audience} and the pain point: ${painPoint}.`,
    "The first 3 seconds or first line create a strong reason to stop scrolling.",
    `There is one clear offer: ${offer}.`,
    "There is one clear CTA, not multiple competing actions.",
    `The message includes proof, process clarity, or a credibility signal for ${promise}.`,
    `The result can be judged with a measurable KPI: ${settings.kpi}.`,
    "The concept can be adapted into at least 2 more formats without losing the core idea."
  ];
}

function parseBudget(value) {
  const text = String(value || "").trim();
  if (!text) {
    return null;
  }

  const match = text.match(/(?:[$€£]|PKR|USD|AED|SAR|INR|Rs\.?)?\s*([\d,]+(?:\.\d+)?)/i);
  if (!match) {
    return null;
  }

  const amount = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const symbolMatch = text.match(/[$€£]|PKR|USD|AED|SAR|INR|Rs\.?/i);
  const symbol = symbolMatch ? symbolMatch[0].toUpperCase() : "";
  return { amount, symbol };
}

function formatMoney(budget, ratio) {
  const value = Math.round(budget.amount * ratio);
  const formatted = value.toLocaleString("en-US");

  if (!budget.symbol) {
    return formatted;
  }

  if (/[$€£]/.test(budget.symbol)) {
    return `${budget.symbol}${formatted}`;
  }

  return `${formatted} ${budget.symbol}`;
}

function renderList(target, items) {
  target.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderCards(target, items, className) {
  target.innerHTML = items.map((item) => `
    <article class="${className}">
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `).join("");
}

function renderPlan(plan) {
  outputs.snapshotObjective.textContent = plan.input.objective;
  outputs.snapshotAngles.textContent = String(plan.angles.length);
  outputs.snapshotVariants.textContent = String(plan.primaryText.length + plan.headlines.length + plan.hooks.length);
  outputs.kpiObjective.textContent = plan.input.objective;
  outputs.kpiAudience.textContent = plan.input.segment;
  outputs.kpiBudget.textContent = plan.budget ? `70 / 20 / 10 from ${formatMoney(plan.budget, 1)}` : "70 / 20 / 10";
  outputs.kpiWindow.textContent = plan.settings.window;

  renderCards(outputs.audiencePlanner, plan.audienceSegments, "audience-card");
  renderCards(outputs.angleGrid, plan.angles, "angle-card");
  renderList(outputs.hookList, plan.hooks);

  outputs.ctaList.innerHTML = plan.ctas.map((cta) => `<span class="chip">${escapeHtml(cta)}</span>`).join("");
  outputs.primaryTextList.innerHTML = plan.primaryText.map((copy, index) => `
    <article class="copy-card">
      <strong>Primary text ${index + 1}</strong>
      <p>${escapeHtml(copy)}</p>
    </article>
  `).join("");
  outputs.headlineList.innerHTML = plan.headlines.map((headline, index) => `
    <article class="copy-card">
      <strong>Headline ${index + 1}</strong>
      <p>${escapeHtml(headline)}</p>
    </article>
  `).join("");

  outputs.matrixBody.innerHTML = plan.matrix.map((row) => `
    <tr>
      <td>${escapeHtml(row.test)}</td>
      <td>${escapeHtml(row.audience)}</td>
      <td>${escapeHtml(row.angle)}</td>
      <td>${escapeHtml(row.hook)}</td>
      <td>${escapeHtml(row.format)}</td>
      <td>${escapeHtml(row.kpi)}</td>
      <td>${escapeHtml(row.rule)}</td>
    </tr>
  `).join("");

  outputs.budgetPlan.innerHTML = plan.budgetPlan.map((step) => `
    <div class="budget-step">
      <strong>${escapeHtml(step.name)}</strong>
      <p>${escapeHtml(step.detail)}</p>
    </div>
  `).join("");

  renderList(outputs.winningChecklist, plan.checklist);
}

function exportPlan(plan) {
  const lines = [
    "Meta Ads Creative Testing Planner",
    "Portfolio project by Fazil Waseem",
    "",
    "Note: This is a local creative planning dashboard. It is not connected to Meta Ads or any external platform.",
    "",
    `Business brief: ${plan.input.businessBrief}`,
    `Objective: ${plan.input.objective}`,
    `Audience: ${plan.input.audience}`,
    `Segment: ${plan.input.segment}`,
    `Product/service: ${plan.input.product}`,
    `Offer: ${plan.input.offer}`,
    `Test budget: ${plan.input.budget || "Not provided"}`,
    `Pain point: ${plan.input.painPoint}`,
    `Promise/outcome: ${plan.input.promise}`,
    "",
    "Creative angles:",
    ...plan.angles.map((angle) => `- ${angle.name}: ${angle.detail}`),
    "",
    "Hooks:",
    ...plan.hooks.map((hook) => `- ${hook}`),
    "",
    "Primary text variations:",
    ...plan.primaryText.map((copy, index) => `${index + 1}. ${copy}`),
    "",
    "Headline variations:",
    ...plan.headlines.map((headline, index) => `${index + 1}. ${headline}`),
    "",
    "CTA suggestions:",
    ...plan.ctas.map((cta) => `- ${cta}`),
    "",
    "Creative testing matrix:",
    ...plan.matrix.map((row) => `- ${row.test}: ${row.audience} | ${row.angle} | ${row.hook} | ${row.format} | ${row.kpi} | ${row.rule}`),
    "",
    "Budget testing plan:",
    ...plan.budgetPlan.map((step) => `- ${step.name}: ${step.detail}`),
    "",
    "Winning ad checklist:",
    ...plan.checklist.map((item) => `- ${item}`)
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "meta-ads-creative-test-plan.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Creative test plan exported.");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function applyValues(values) {
  Object.entries(values).forEach(([key, value]) => {
    if (fields[key]) {
      fields[key].value = value;
    }
  });
}

function updatePlan() {
  const plan = createPlan(getPlanInput());
  renderPlan(plan);
  return plan;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updatePlan();
  showToast("Creative testing plan generated.");
});

sampleBtn.addEventListener("click", () => {
  applyValues(sampleBrief);
  updatePlan();
  showToast("Sample brief loaded.");
});

resetBtn.addEventListener("click", () => {
  form.reset();
  updatePlan();
  showToast("Planner reset.");
});

exportBtn.addEventListener("click", () => {
  exportPlan(updatePlan());
});

Object.values(fields).forEach((field) => {
  field.addEventListener("change", updatePlan);
});

updatePlan();
