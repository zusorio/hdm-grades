import { DateTime } from "luxon";
import App from "@/components/GradeInfo.vue";

export interface Grade {
  id: number;
  degree: string;
  name: string;
  degree_part: "base" | "main";
  type: "mandatory" | "elective" | "imported_elective" | "additional";
  semester: string;
  grade: number | null;
  passed: "passed" | "failed" | "signed_up";
  ects: number;
  sws: number;
  notice:
    | "unexcused_resignation"
    | "excused_resignation"
    | "final_not_passed"
    | "passed";
  attempt: number;
  date: string;
}

const transformers = {
  id: (v: string) => parseInt(v),
  degree: (v: string) => v,
  name: (v: string) => v,
  type: (v: string) => {
    if (v === "P") return "mandatory";
    if (v === "W") return "elective";
    if (v === "WA") return "imported_elective";
    if (v === "Z") return "additional";
  },
  semester: (v: string) => v,
  grade: (v: string) => (!!v ? parseFloat(v.replace(",", ".")) : null),
  passed: (v: string) => {
    if (v === "bestanden") return "passed";
    if (v === "nicht bestanden") return "failed";
    if (v === "angemeldet") return "signed_up";
  },
  ects: (v: string) => parseInt(v),
  sws: (v: string) => parseInt(v),
  notice: (v: string) => {
    if (v === "U") return "unexcused_resignation";
    if (v === "O") return "excused_resignation";
    if (v === "EN") return "final_not_passed";
    if (v === "BE") return "passed";
  },
  attempt: (v: string) => parseInt(v),
  date: (v: string) => DateTime.fromFormat(v, "dd.MM.yyyy").toISODate(),
};

function extractGrades(table: HTMLTableElement): Grade[] {
  const tableRows = table.querySelectorAll("tr");
  if (!tableRows) return [];

  const grades: Grade[] = [];
  let currentHeader = "";

  for (const row of tableRows) {
    const header = row.querySelector("th[class='tabelleheader'][colspan='12']");
    const cells = row.querySelectorAll("td.tabelle1");
    if (header) {
      currentHeader = header.textContent?.trim() ?? "";
    } else if (cells && cells.length === 12) {
      const values = Array.from(cells).map((cell) => cell.textContent?.trim());
      const grade = Object.fromEntries(
        Object.entries(transformers).map(([key, transformer]) => [
          key,
          transformer(values.shift() ?? ""),
        ]),
      );
      grade.degree_part = currentHeader === "Grundstudium" ? "base" : "main";
      grades.push(grade as unknown as Grade);
    }
  }
  return grades;
}

export default defineContentScript({
  matches: ["*://vw-online.hdm-stuttgart.de/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const heading = document.querySelector(
      "h1[title='Sie sind hier: Notenspiegel']",
    );
    if (!heading) return;
    const gradeTable = document.querySelector("table[width='100%']");
    const grades = extractGrades(gradeTable as HTMLTableElement);

    const ui = await createShadowRootUi(ctx, {
      name: "example-ui",
      position: "inline",
      append: "after",
      anchor: gradeTable,
      onMount(container) {
        const app = createApp(App, { grades });
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app!.unmount();
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
