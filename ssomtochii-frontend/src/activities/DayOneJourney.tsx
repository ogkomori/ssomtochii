import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Play, Sprout } from "lucide-react";
import { useState } from "react";
import { DAY_ONE_CONTENT, type DayOnePlantChoice } from "@/lib/day-one";
import { Botanicals } from "@/components/Botanicals";

type Step = "introduction" | "video" | "quiz" | "plant" | "completion";
const STEPS: Step[] = ["introduction", "video", "quiz", "plant", "completion"];
/** A reusable activity, assignable to any day from lib/days.ts. */
export function DayOneJourney({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>("introduction");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [plantChoice, setPlantChoice] = useState<DayOnePlantChoice | null>(null);
  const currentStep = STEPS.indexOf(step);
  const next = () => setStep(STEPS[currentStep + 1] ?? "award");

  return <main className="page-shell day-one-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
    <header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{currentStep + 1} / {STEPS.length}</span></header>
    <section className="paper-card day-one-card my-6 flex flex-1 flex-col p-6 sm:p-8" aria-live="polite">
      {step === "introduction" && <Introduction />}{step === "video" && <Video />}{step === "quiz" && <Quiz selected={selectedAnswer} onSelect={setSelectedAnswer} />}{step === "plant" && <Plant choice={plantChoice} onChoose={setPlantChoice} />}{step === "completion" && <Completion />}
      {step !== "completion" ? <div className="mt-auto flex justify-end pt-8"><button type="button" className="next-button" onClick={next} disabled={step === "quiz" && selectedAnswer === null}>Next <ArrowRight className="h-4 w-4" /></button></div> : <div className="mt-auto flex justify-end pt-8"><button type="button" className="next-button" onClick={onComplete}>Get today’s letter <ArrowRight className="h-4 w-4" /></button></div>}
    </section>
  </div></main>;
}

function Introduction() { const { introduction } = DAY_ONE_CONTENT; return <div className="day-one-copy"><p className="day-one-eyebrow">{introduction.eyebrow}</p><h1 className="font-script text-5xl leading-none sm:text-6xl">{introduction.title}</h1><p>{introduction.body}</p><div className="day-one-doodle"><Sprout aria-hidden className="h-12 w-12" /><span>Your first surprise is ready.</span></div></div>; }
function Video() { const { video } = DAY_ONE_CONTENT; return <div className="day-one-copy"><p className="day-one-eyebrow">A NOTE FOR YOU</p><h1 className="font-script text-5xl leading-none">Press play when you’re ready.</h1>{video.src ? <video className="day-one-video" controls playsInline poster={video.poster || undefined}><source src={video.src} /></video> : <div className="video-placeholder"><Play className="h-9 w-9" fill="currentColor" /><p>Introduction video goes here</p><span>Set <code>video.src</code> in <code>src/lib/day-one.ts</code></span></div>}<p>{video.caption}</p></div>; }
function Quiz({ selected, onSelect }: { selected: number | null; onSelect: (answer: number) => void }) { const { quiz } = DAY_ONE_CONTENT; const feedback = selected === null ? null : selected === quiz.correctAnswer ? quiz.correctFeedback : quiz.incorrectFeedback; return <div className="day-one-copy"><p className="day-one-eyebrow">ONE SMALL QUESTION</p><h1 className="font-script text-5xl leading-none">{quiz.question}</h1><div className="quiz-options">{quiz.answers.map((answer, index) => <button type="button" key={answer} className={`quiz-option ${selected === index ? "is-selected" : ""}`} onClick={() => onSelect(index)}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div>{feedback && <p className={`quiz-feedback ${selected === quiz.correctAnswer ? "is-correct" : ""}`}>{feedback}</p>}</div>; }
function Plant({ choice, onChoose }: { choice: DayOnePlantChoice | null; onChoose: (choice: DayOnePlantChoice) => void }) { const { plant } = DAY_ONE_CONTENT; return <div className="day-one-copy"><p className="day-one-eyebrow">YOUR LITTLE GARDEN</p><h1 className="font-script text-5xl leading-none">{plant.title}</h1><p>{plant.body}</p><div className={`plant-stage ${choice ? "is-growing" : ""}`}><span className="plant-sprout">{choice ? "🌱" : "·"}</span><span className="plant-pot">▰</span></div><div className="plant-choices">{plant.choices.map((item) => <button type="button" key={item.label} className={`plant-choice ${choice?.label === item.label ? "is-selected" : ""}`} onClick={() => onChoose(item)}><span>{item.emoji}</span>{item.label}</button>)}</div>{choice && <p className="quiz-feedback is-correct">{choice.response}</p>}</div>; }
function Completion() { const { completion } = DAY_ONE_CONTENT; return <div className="day-one-copy items-center text-center"><div className="completion-mark"><Check className="h-8 w-8" /></div><p className="day-one-eyebrow">YOU DID IT</p><h1 className="font-script text-5xl leading-none">{completion.title}</h1><p>{completion.body}</p></div>; }
