<script setup lang="ts">
import "@/assets/tailwind.css";
import { Grade } from "@/entrypoints/grades.content";

const props = defineProps<{ grades: Grade[] }>();

const ectsSum = computed(() => {
  return props.grades.reduce((acc, grade) => acc + grade.ects, 0);
});

const semesters = computed(() => {
  return Array.from(new Set(props.grades.map((grade) => grade.semester)));
});

const weightedBaseAverage = computed(() => {
  const baseEctsSum = props.grades
    .filter((grade) => grade.grade !== null && grade.degree_part === "base")
    .reduce((acc, grade) => acc + grade.ects, 0);

  return (
    props.grades
      .filter((grade) => grade.grade !== null && grade.degree_part === "base")
      .reduce((acc, grade) => acc + grade.grade * grade.ects, 0) / baseEctsSum
  );
});

const weightedMainAverage = computed(() => {
  const advancedEctsSum = props.grades
    .filter((grade) => grade.grade !== null && grade.degree_part === "main")
    .reduce((acc, grade) => acc + grade.ects, 0);

  return (
    props.grades
      .filter((grade) => grade.grade !== null && grade.degree_part === "main")
      .reduce((acc, grade) => acc + grade.grade * grade.ects, 0) /
    advancedEctsSum
  );
});

const semestersWorkload = computed(() => {
  return semesters.value.map((semester) => {
    const ects = props.grades
      .filter((grade) => grade.semester === semester)
      .reduce((acc, grade) => acc + grade.ects, 0);
    const gradedEcts = props.grades
      .filter((grade) => grade.semester === semester && grade.grade !== null)
      .reduce((acc, grade) => acc + grade.ects, 0);
    return {
      semester,
      ects,
      sws: props.grades
        .filter((grade) => grade.semester === semester)
        .reduce((acc, grade) => acc + grade.sws, 0),
      weightedAverage:
        props.grades
          .filter(
            (grade) => grade.semester === semester && grade.grade !== null,
          )
          .reduce((acc, grade) => acc + grade.grade * grade.ects, 0) /
        gradedEcts,
      hasPending: props.grades.some(
        (grade) => grade.semester === semester && grade.passed === "signed_up",
      ),
    };
  });
});

const manualBaseGrade = ref<number>(
  parseFloat(weightedBaseAverage.value.toFixed(3)),
);
const manualMainGrade = ref<number>(
  parseFloat(weightedMainAverage.value.toFixed(3)),
);
const manualThesisGrade = ref<number>(1.0);
const finalGrade = computed(() => {
  return (
    manualMainGrade.value * 0.7 +
    manualBaseGrade.value * 0.15 +
    manualThesisGrade.value * 0.15
  );
});
</script>

<template>
  <div class="p-2 space-y-2">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div class="p-2 bg-white">
        <div class="font-bold text-xl">
          {{ ectsSum }}
        </div>
        <div>∑ ECTS</div>
      </div>
      <div class="p-2 bg-white">
        <div class="font-bold text-xl">
          {{ ectsSum / semesters.length }}
        </div>
        <div>Ø ECTS / Semester</div>
      </div>
      <div class="p-2 bg-white">
        <div class="font-bold text-xl">
          {{ weightedBaseAverage.toFixed(3) }}
        </div>
        <div>Ø Note Grundstudium</div>
      </div>
      <div class="p-2 bg-white">
        <div class="font-bold text-xl">
          {{ weightedMainAverage.toFixed(3) }}
        </div>
        <div>Ø Note Hauptstudium</div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div
        class="p-2 bg-white rounded-sm"
        v-for="semester in semestersWorkload"
        :key="semester.semester"
      >
        <h2 class="font-medium">
          {{ semester.semester }}
          {{ semester.hasPending ? "(nicht abgeschlossen)" : "" }}
        </h2>
        <div class="grid grid-cols-3">
          <div>
            <div class="font-bold text-xl">
              {{ semester.ects }}
            </div>
            <div>ECTS</div>
          </div>
          <div>
            <div class="font-bold text-xl">
              {{ semester.sws }}
            </div>
            <div>SWS</div>
          </div>
          <div>
            <div class="font-bold text-xl">
              {{
                semester.weightedAverage > 0
                  ? semester.weightedAverage.toFixed(3)
                  : "-"
              }}
            </div>
            <div>Ø Note</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="font-medium text-lg">Abschlussnotenrechner</h2>
      <div class="space-y-2">
        <label class="block">
          <span class="font-medium">Grundstudium: </span>
          <input
            class="px-1 rounded-sm"
            type="number"
            min="1.000"
            max="5.000"
            step="0.100"
            pattern="[0-9]*"
            inputmode="numeric"
            v-model="manualBaseGrade"
          />
        </label>
        <label class="block">
          <span class="font-medium">Hauptstudium: </span>
          <input
            class="px-1 rounded-sm"
            type="number"
            min="1.000"
            max="5.000"
            step="0.100"
            pattern="[0-9]*"
            inputmode="numeric"
            v-model="manualMainGrade"
          />
        </label>
        <label class="block">
          <span class="font-medium">Thesis: </span>
          <input
            class="px-1 rounded-sm"
            type="number"
            min="1.000"
            max="5.000"
            step="0.100"
            pattern="[0-9]*"
            inputmode="numeric"
            v-model="manualThesisGrade"
          />
        </label>
        <div class="font-bold text-xl">
          {{ finalGrade.toFixed(3) }}
        </div>
      </div>
    </div>

    <div class="text-sm">
      <span class="font-bold">
        ALLE ANGABE OHNE GEWÄHR. KEINE GARANTIE AUF RICHTIGKEIT. ZUM ÜBERPRÜFEN
        IMMER DIE REGELN AUS DER PRÜFUNGSORDNUNG VERWENDEN.
      </span>
      Entwickelt von <a class="underline" href="https://zusor.io">Zusor</a>.
    </div>
  </div>
</template>
