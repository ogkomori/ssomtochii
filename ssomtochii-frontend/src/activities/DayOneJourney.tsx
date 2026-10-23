import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Play } from "lucide-react";
import { useState } from "react";
import { DAY_ONE_CONTENT } from "@/lib/activities/day-one";
import { Botanicals } from "@/components/Botanicals";
import { StoryPlayer } from "@/components/StoryPlayer";
import { DAY_ONE_STORY } from "@/lib/stories/day-one-story";

type Step = "introduction" | "story" | "quiz" | "completion";
const STEPS: Step[] = ["introduction", "story", "quiz", "completion"];
/** Day 1's intro, video, story, quiz, and completion flow. */
export function DayOneJourney({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>("introduction");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const currentStep = STEPS.indexOf(step);
  const next = () => setStep(STEPS[currentStep + 1] ?? "completion");

  return <main className="page-shell day-one-shell"><Botanicals /><div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-md flex-col">
    <header className="flex items-center justify-between pt-2"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> All days</Link><span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{currentStep + 1} / {STEPS.length}</span></header>
    <section className="paper-card day-one-card my-6 flex flex-1 flex-col p-6 sm:p-8" aria-live="polite">
      {step === "introduction" && <><Introduction /><Video /></>}{step === "story" && <StoryPlayer story={DAY_ONE_STORY} exitLabel="Back" onExit={() => setStep("introduction")} onComplete={() => setStep("quiz")} continueLabel="Continue Day 1 ♡" />}{step === "quiz" && <Quiz selected={selectedAnswer} onSelect={setSelectedAnswer} />}{step === "completion" && <Completion />}
      {step === "story" ? null : step !== "completion" ? <div className="mt-auto flex justify-end pt-8"><button type="button" className="next-button" onClick={next} disabled={step === "quiz" && selectedAnswer === null}>{step === "introduction" ? DAY_ONE_CONTENT.introduction.buttonLabel : "Next"} <ArrowRight className="h-4 w-4" /></button></div> : <div className="mt-auto flex justify-end pt-8"><button type="button" className="next-button" onClick={onComplete}>Get today’s compliment <ArrowRight className="h-4 w-4" /></button></div>}
    </section>
  </div></main>;
}

function Introduction() { const { introduction } = DAY_ONE_CONTENT; return <div className="day-one-copy text-center"><p className="day-one-eyebrow">{introduction.eyebrow}</p><h1 className="font-script text-5xl leading-none sm:text-6xl">{introduction.title}</h1>{introduction.body.trim() && <p>{introduction.body}</p>}</div>; }
function Video() { const { video } = DAY_ONE_CONTENT; return <div className="day-one-copy"><p className="day-one-eyebrow">A NOTE FOR YOU</p><h1 className="font-script text-5xl leading-none">Press play when you’re ready.</h1>{video.src ? <video className="day-one-video" controls playsInline poster={video.poster || undefined}><source src={video.src} /></video> : <div className="video-placeholder"><Play className="h-9 w-9" fill="currentColor" /><p>Introduction video goes here</p><span>Set <code>video.src</code> in <code>src/lib/day-one.ts</code></span></div>}<p>{video.caption}</p></div>; }
function Quiz({ selected, onSelect }: { selected: number | null; onSelect: (answer: number) => void }) { const { quiz } = DAY_ONE_CONTENT; const feedback = selected === null ? null : selected === quiz.correctAnswer ? quiz.correctFeedback : quiz.incorrectFeedback; return <div className="day-one-copy"><p className="day-one-eyebrow">ONE SMALL QUESTION</p><h1 className="font-script text-5xl leading-none">{quiz.question}</h1><div className="quiz-options">{quiz.answers.map((answer, index) => <button type="button" key={answer} className={`quiz-option ${selected === index ? "is-selected" : ""}`} onClick={() => onSelect(index)}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div>{feedback && <p className={`quiz-feedback ${selected === quiz.correctAnswer ? "is-correct" : ""}`}>{feedback}</p>}</div>; }
function Completion() { const { completion } = DAY_ONE_CONTENT; return <div className="day-one-copy items-center text-center"><div className="completion-mark"><Check className="h-8 w-8" /></div><p className="day-one-eyebrow">YOU DID IT</p><h1 className="font-script text-5xl leading-none">{completion.title}</h1><p>{completion.body}</p></div>; }
