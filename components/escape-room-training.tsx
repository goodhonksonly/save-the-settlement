"use client"

import { useState } from "react"
import { Door } from "@/components/door"
import { AlertCircle, Check, X, Phone, Eye, Calendar, Clock, Award, RefreshCw, ArrowRight, AlertTriangle, DollarSign, Ban } from "lucide-react"

type Screen =
  | "intro"
  | "question"
  | "escaped"
  | "breached"
  | "prevention"
  | "prevention-results"
  | "communication"
  | "communication-results"
  | "complete"

const questions = [
  {
    title: "Identify the Risk",
    situation: "The borrower made their first payment. They've now missed two payments. The account is approaching 60 days past due.",
    question: "What is the critical risk?",
    answers: [
      "The borrower may need to catch up on missed payments",
      "The agreement may breach if the account exceeds 60 days past due",
      "The payment schedule will need to be recalculated",
    ],
    correctIndex: 1,
    feedback: "Correct. Once the account exceeds 60 days past due, the agreement becomes null and void.",
  },
  {
    title: "What Happens Next?",
    situation: "The account reaches 65 days past due.",
    question: "What happens to the settlement agreement?",
    answers: [
      "The account is considered breached and the agreement is void",
      "The agreement terms are adjusted to account for the delay",
      "The agreement is suspended pending further review",
    ],
    correctIndex: 0,
    feedback: "Correct. Once breached, the agreement is void and cannot be renegotiated. The account will fully charge off.",
  },
  {
    title: "Final Consequence",
    situation: "The agreement has been breached.",
    question: "What is the borrower's only remaining option?",
    answers: [
      "Request a new settlement agreement",
      "Set up a modified payment arrangement",
      "Pay the full charge-off balance",
    ],
    correctIndex: 2,
    feedback: "Correct. The account charges off, and the full balance becomes due.",
  },
]

const preventionOptions = [
  { text: "Assume the borrower knows the rules and will catch up", icon: Clock, correct: false },
  { text: "Ensure breach and void warning emails are enabled", icon: Eye, correct: true },
  { text: "Extend the payment deadline without documentation", icon: Calendar, correct: false },
  { text: "Make sure the borrower knows the consequences of missed payments", icon: Phone, correct: true },
]

const preventionFeedback = [
  "This passive approach often leads to breaches. Borrowers may not fully understand the consequences until it's too late.",
  "Yes! Automated warning emails alert borrowers before they reach the 60 days past due threshold.",
  "Informal extensions without proper documentation can create confusion and do not prevent the account from accruing days past due.",
  "Absolutely! When borrowers understand that missing payments can void their settlement, they are more likely to prioritize staying current.",
]

const communicationOptions = [
  {
    label: "Option A",
    text: "\"You might want to make your payment soon to avoid any potential issues with your settlement.\"",
    correct: false,
  },
  {
    label: "Option B",
    text: "<span style=\"font-weight:normal\">\"I need to inform you that if your account exceeds 60 days past due, your settlement agreement will become null and void. At that point, the full charge-off balance will be due, and the settlement cannot be reinstated. Let's discuss how to prevent this.\"</span>",
    correct: true,
  },
  {
    label: "Option C",
    text: "\"Don&apos;t worry too much about being a little late. We can always work something out if the settlement falls through.\"",
    correct: false,
  },
]

export function EscapeRoomTraining() {
  const [screen, setScreen] = useState<Screen>("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [preventionSelections, setPreventionSelections] = useState<Set<number>>(new Set())
  const [communicationSelected, setCommunicationSelected] = useState<number | null>(null)

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    const correct = selectedAnswer === questions[currentQuestion].correctIndex
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < 2) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setScreen("escaped")
    }
  }

  const handleRetry = () => {
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const resetAll = () => {
    setScreen("intro")
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setIsCorrect(false)
    setPreventionSelections(new Set())
    setCommunicationSelected(null)
  }

  const togglePreventionSelection = (index: number) => {
    const newSelections = new Set(preventionSelections)
    if (newSelections.has(index)) {
      newSelections.delete(index)
    } else {
      newSelections.add(index)
    }
    setPreventionSelections(newSelections)
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10 lg:px-7 lg:py-[42px]"
      style={{
        background: `
          radial-gradient(720px 420px at 70% 30%, rgba(70,38,13,.25), transparent 60%),
          radial-gradient(520px 380px at 34% 53%, rgba(255,255,255,.07), transparent 58%),
          linear-gradient(180deg, #0b0e12, #050607 85%)
        `,
      }}
    >
      {screen === "intro" && (
        <IntroScreen onStart={() => setScreen("question")} />
      )}

      {screen === "question" && (
        <QuestionScreen
          question={questions[currentQuestion]}
          questionIndex={currentQuestion}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          onSubmit={handleSubmitAnswer}
          onNext={handleNextQuestion}
          onRetry={handleRetry}
          onReset={resetAll}
        />
      )}

      {screen === "escaped" && (
        <EscapedScreen onContinue={() => setScreen("breached")} />
      )}

      {screen === "breached" && (
        <BreachedScreen
          onLearnMore={() => setScreen("prevention")}
          onRestart={resetAll}
        />
      )}

      {screen === "prevention" && (
        <PreventionScreen
          selections={preventionSelections}
          onToggle={togglePreventionSelection}
          onCheck={() => setScreen("prevention-results")}
        />
      )}

      {screen === "prevention-results" && (
        <PreventionResultsScreen
          selections={preventionSelections}
          onContinue={() => setScreen("communication")}
        />
      )}

      {screen === "communication" && (
        <CommunicationScreen
          selected={communicationSelected}
          setSelected={setCommunicationSelected}
          onSubmit={() => setScreen("communication-results")}
        />
      )}

      {screen === "communication-results" && (
        <CommunicationResultsScreen
          selected={communicationSelected}
          onContinue={() => setScreen("complete")}
        />
      )}

      {screen === "complete" && <CompleteScreen onRestart={resetAll} />}
    </main>
  )
}

function ScreenLayout({
  door,
  children,
}: {
  door: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="w-full max-w-[1050px] min-h-[620px] grid grid-cols-1 lg:grid-cols-[390px_1fr] gap-3 lg:gap-[46px] items-center">
      {door}
      {children}
    </section>
  )
}

function Panel({
  children,
  className = "",
  wide = false,
  center = false,
}: {
  children: React.ReactNode
  className?: string
  wide?: boolean
  center?: boolean
}) {
  return (
    <div
      className={`w-full ${wide ? "max-w-[760px] mx-auto" : "max-w-[560px]"} ${center ? "text-center" : ""} rounded-[20px] p-[30px] ${className}`}
      style={{
        border: "1px solid rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, rgba(18,24,31,.82), rgba(6,8,11,.9))",
        boxShadow: "0 24px 90px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.04)",
      }}
    >
      {children}
    </div>
  )
}

function Eyebrow({
  children,
  variant = "orange",
}: {
  children: React.ReactNode
  variant?: "orange" | "green" | "red"
}) {
  const colors = {
    orange: "text-[#ff7a16] bg-[rgba(255,122,22,.08)] border-current",
    green: "text-[#20f07f] bg-[rgba(32,240,127,.09)] border-current",
    red: "text-[#ff334b] bg-[rgba(255,51,75,.09)] border-current",
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-extrabold ${colors[variant]}`}
    >
      {children}
    </span>
  )
}

function InfoBox({
  children,
  label,
  variant = "default",
}: {
  children: React.ReactNode
  label: string
  variant?: "default" | "orange"
}) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] gap-3 rounded-[14px] p-[17px] my-4 ${
        variant === "orange"
          ? "border-[rgba(255,122,22,.78)]"
          : "border-border"
      }`}
      style={{
        background: "rgba(13,18,23,.78)",
        border: variant === "orange" ? "1px solid rgba(255,122,22,.78)" : "1px solid var(--border)",
        boxShadow: variant === "orange" ? "0 0 0 1px rgba(255,122,22,.14)" : undefined,
      }}
    >
      <div className="w-[30px] h-[30px] rounded-full grid place-items-center bg-[rgba(255,215,71,.14)] text-[#ffd747] font-black">
        !
      </div>
      <div>
        <div className={`text-xs uppercase tracking-[.08em] font-black mb-1 ${variant === "orange" ? "text-[#fd9f2b]" : "text-[#ffd747]"}`}>
          {label}
        </div>
        {children}
      </div>
    </div>
  )
}

function Button({
  children,
  onClick,
  variant = "orange",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "orange" | "green" | "ghost"
  disabled?: boolean
  className?: string
}) {
  const styles = {
    orange: {
      background: "linear-gradient(#ff8625, #ff6510)",
      color: "#271003",
      boxShadow: "0 0 22px rgba(255,122,22,.25)",
    },
    green: {
      background: "linear-gradient(#29f489, #12d76c)",
      color: "#031a0d",
      boxShadow: "0 0 24px rgba(32,240,127,.24)",
    },
    ghost: {
      background: "transparent",
      color: "#eee",
      border: "1px solid #56606b",
      boxShadow: "none",
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`appearance-none border-0 rounded-[10px] px-6 py-[13px] font-extrabold cursor-pointer transition-transform duration-150 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}

function AnswerOption({
  letter,
  children,
  selected,
  correct,
  wrong,
  onClick,
  disabled,
}: {
  letter: string
  children: React.ReactNode
  selected?: boolean
  correct?: boolean
  wrong?: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  let borderColor = "rgba(255,255,255,.08)"
  let bgColor = "rgba(8,12,16,.72)"
  let extraStyles = {}

  if (correct) {
    borderColor = "var(--primary)"
    bgColor = "rgba(17,57,36,.75)"
    extraStyles = { boxShadow: "0 0 0 1px var(--primary), 0 0 20px rgba(32,240,127,.08)" }
  } else if (wrong) {
    borderColor = "var(--destructive)"
    bgColor = "rgba(50,16,24,.85)"
    extraStyles = { boxShadow: "0 0 0 1px var(--destructive)" }
  } else if (selected) {
    borderColor = "var(--primary)"
    bgColor = "rgba(17,57,36,.75)"
    extraStyles = { boxShadow: "0 0 0 1px var(--primary), 0 0 20px rgba(32,240,127,.08)" }
  }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`grid grid-cols-[34px_1fr_22px] gap-[13px] items-center rounded-[14px] p-4 cursor-pointer transition-all duration-150 text-[#f4eedf] ${disabled ? "cursor-default" : "hover:border-[#44505d]"}`}
      style={{ border: `1px solid ${borderColor}`, background: bgColor, ...extraStyles }}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-[#2a2d30] grid place-items-center text-[13px] font-black">
        {letter}
      </div>
      <div>{children}</div>
      <div className="text-center">
        {correct && <Check className="w-4 h-4 text-primary" />}
        {wrong && <X className="w-4 h-4 text-destructive" />}
        {selected && !correct && !wrong && <Check className="w-4 h-4 text-primary" />}
      </div>
    </div>
  )
}

function Feedback({ correct, children }: { correct: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl p-[13px_16px] my-3 font-bold text-sm ${
        correct
          ? "border-primary bg-[rgba(15,57,36,.78)] text-[#a8ffcb]"
          : "border-destructive bg-[rgba(50,16,24,.78)] text-[#ffc0c7]"
      }`}
      style={{ border: `1px solid ${correct ? "var(--primary)" : "var(--destructive)"}` }}
    >
      <div className="flex items-start gap-2">
        {correct ? <Check className="w-4 h-4 mt-0.5 shrink-0" /> : <X className="w-4 h-4 mt-0.5 shrink-0" />}
        <span>{children}</span>
      </div>
    </div>
  )
}

// Screen Components

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <ScreenLayout door={<Door unlockedCount={0} />}>
      <Panel>
        <h1 className="text-[38px] lg:text-[46px] leading-[1.04] tracking-[-1.6px] my-[18px] text-foreground font-bold">
          Save the Settlement
        </h1>
        <InfoBox label="Mission Briefing">
          <p className="text-foreground">
            {"You're locked in. Behind this door is knowledge that could save a borrower's settlement agreement. But to escape, you must prove you understand the "}
            <b className="text-[#ffd747]">60 days past due rule</b>
            {". One wrong move and the settlement is "}
            <b className="text-destructive">at risk</b>.
          </p>
        </InfoBox>
        <InfoBox label="Your Objective" variant="orange">
          <p className="text-foreground">
            Answer three questions correctly to unlock each padlock. Once all locks are open, the door will swing free and you will escape with the knowledge to prevent settlement breaches.
          </p>
        </InfoBox>
        <div className="flex items-center gap-2 my-[18px]">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="w-[30px] h-[30px] border border-[#4a545f] rounded-md grid place-items-center bg-[#111820] font-extrabold text-[#d8d2c8]"
            >
              {num}
            </div>
          ))}
          <span className="text-[13px] text-muted-foreground">3 locks to unlock</span>
        </div>
        <Button onClick={onStart}>Begin Mission</Button>
      </Panel>
    </ScreenLayout>
  )
}

function QuestionScreen({
  question,
  questionIndex,
  selectedAnswer,
  setSelectedAnswer,
  showFeedback,
  isCorrect,
  onSubmit,
  onNext,
  onRetry,
  onReset,
}: {
  question: (typeof questions)[0]
  questionIndex: number
  selectedAnswer: number | null
  setSelectedAnswer: (i: number) => void
  showFeedback: boolean
  isCorrect: boolean
  onSubmit: () => void
  onNext: () => void
  onRetry: () => void
  onReset: () => void
}) {
  return (
    <ScreenLayout door={<Door unlockedCount={questionIndex} />}>
      <Panel>
        <div className="text-center">
          <Eyebrow variant="orange">Lock {questionIndex + 1} of 3</Eyebrow>
          <h2 className="text-[30px] leading-[1.08] my-3 text-center text-foreground font-bold">{question.title}</h2>
        </div>
        <InfoBox label="Current Situation">
          <p className="font-bold text-foreground" dangerouslySetInnerHTML={{ __html: question.situation }} />
        </InfoBox>
        <h3 className="text-[19px] my-[14px] text-center text-foreground font-semibold">{question.question}</h3>
        <div className="grid gap-3">
          {question.answers.map((answer, i) => (
            <AnswerOption
              key={i}
              letter={String.fromCharCode(65 + i)}
              selected={selectedAnswer === i && !showFeedback}
              correct={showFeedback && isCorrect && selectedAnswer === i}
              wrong={showFeedback && !isCorrect && selectedAnswer === i}
              onClick={() => !showFeedback && setSelectedAnswer(i)}
              disabled={showFeedback}
            >
              {answer}
            </AnswerOption>
          ))}
        </div>
        {showFeedback && (
          <Feedback correct={isCorrect}>
            {isCorrect ? question.feedback : "Not quite. Review the 60 days past due rule and try again."}
          </Feedback>
        )}
        <div className="text-center mt-[18px]">
          {!showFeedback ? (
            <Button onClick={onSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : isCorrect ? (
            <Button variant="green" onClick={onNext}>
              Unlock & Continue
            </Button>
          ) : (
            <Button onClick={onRetry}>Try Again</Button>
          )}
        </div>
        <div className="text-center mt-[11px]">
          <Button variant="ghost" onClick={onReset} className="text-[13px] py-[7px] px-3">
            Reset Activity
          </Button>
        </div>
      </Panel>
    </ScreenLayout>
  )
}

function EscapedScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <ScreenLayout door={<Door key="escaped-door" unlockedCount={3} isOpen={true} />}>
      <Panel>
        <Eyebrow variant="green">
          <Check className="w-4 h-4" /> All Locks Unlocked
        </Eyebrow>
        <h1 className="text-[38px] lg:text-[46px] leading-[1.04] tracking-[-1.6px] my-[18px] text-foreground font-bold">
          You Escaped!
        </h1>
        <p className="leading-[1.48] text-foreground">
          {"The door swings open. You've proven your understanding of the 60 days past due rule by unlocking all three padlocks. But knowledge alone isn't enough\u2014now let's see what happens when prevention fails and a settlement breaches."}
        </p>
        <div className="mt-6">
          <Button variant="green" onClick={onContinue}>
            Continue <ArrowRight className="inline w-4 h-4 ml-1" />
          </Button>
        </div>
      </Panel>
    </ScreenLayout>
  )
}

function BreachedScreen({ onLearnMore, onRestart }: { onLearnMore: () => void; onRestart: () => void }) {
  return (
    <Panel wide center>
      <div className="text-[82px] leading-none text-destructive mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(255,51,75,.28))" }}>
        <X className="w-20 h-20 mx-auto p-4 rounded-full bg-destructive text-white" />
      </div>
      <Eyebrow variant="red">Alert</Eyebrow>
      <h1 className="text-[38px] lg:text-[46px] leading-[1.04] tracking-[-1.6px] my-[18px] text-destructive font-bold">
        Settlement Breached
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] mt-6">
        <DangerCard icon={<AlertTriangle className="w-6 h-6" />} title="Account Charged Off">
          Immediate charge-off due to breach.
        </DangerCard>
        <DangerCard icon={<DollarSign className="w-6 h-6" />} title="Full Balance Due">
          Entire charge-off balance is now owed.
        </DangerCard>
        <DangerCard icon={<Ban className="w-6 h-6" />} title="No Renegotiation">
          Cannot be reinstated or renegotiated.
        </DangerCard>
      </div>
      <div
        className="rounded-[14px] p-[18px] my-[22px] text-left"
        style={{ border: "1px solid var(--border)", background: "rgba(14,18,22,.78)" }}
      >
        <p className="flex items-start gap-2 text-[#ffd747] font-bold mb-2">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> Key Takeaway
        </p>
        <p className="text-foreground">
          Once the account exceeds <b className="text-[#ffd747]">60 days past due</b>, the settlement agreement becomes{" "}
          <b className="text-destructive">null and void</b>. This outcome is irreversible.
        </p>
      </div>
      <p className="text-foreground mb-4">What could you have done earlier to prevent this?</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="green" onClick={onLearnMore}>
          <RefreshCw className="inline w-4 h-4 mr-2" /> Learn to Prevent This
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Restart Training
        </Button>
      </div>
    </Panel>
  )
}

function DangerCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] p-[18px_14px] text-center"
      style={{ border: "1px solid rgba(255,51,75,.42)", background: "rgba(50,16,24,.2)" }}
    >
      <div className="w-[42px] h-[42px] rounded-full grid place-items-center bg-[rgba(255,51,75,.2)] text-destructive mx-auto mb-[10px]">
        {icon}
      </div>
      <b className="text-foreground">{title}</b>
      <p className="text-muted-foreground text-sm mt-1">{children}</p>
    </div>
  )
}

function PreventionScreen({
  selections,
  onToggle,
  onCheck,
}: {
  selections: Set<number>
  onToggle: (i: number) => void
  onCheck: () => void
}) {
  return (
    <Panel wide>
      <div className="text-center">
        <Eyebrow variant="green">
          <ArrowRight className="w-4 h-4" /> Prevention Challenge
        </Eyebrow>
        <h2 className="text-[30px] leading-[1.08] my-3 text-foreground font-bold">
          What could you have done earlier to prevent this?
        </h2>
        <p className="text-foreground">Select all the actions that would help prevent a settlement breach.</p>
      </div>
      <div className="grid gap-3 mt-6">
        {preventionOptions.map((opt, i) => {
          const Icon = opt.icon
          return (
            <div
              key={i}
              onClick={() => onToggle(i)}
              className={`grid grid-cols-[44px_1fr_24px] gap-[13px] items-center rounded-[14px] p-[14px_16px] cursor-pointer transition-all ${
                selections.has(i)
                  ? "border-primary bg-[rgba(17,57,36,.75)]"
                  : "border-[rgba(255,255,255,.08)] bg-[rgba(8,12,16,.72)] hover:border-[#44505d]"
              }`}
              style={{ border: selections.has(i) ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,.08)" }}
            >
              <div className="w-[42px] h-[42px] rounded-xl bg-[#393b35] grid place-items-center text-foreground">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-foreground">{opt.text}</div>
              <div>{selections.has(i) && <Check className="w-5 h-5 text-primary" />}</div>
            </div>
          )
        })}
      </div>
      <div className="text-center mt-6">
        <Button variant="green" onClick={onCheck}>
          Check Answers
        </Button>
      </div>
    </Panel>
  )
}

function PreventionResultsScreen({ selections, onContinue }: { selections: Set<number>; onContinue: () => void }) {
  return (
    <Panel wide>
      <div className="grid gap-3">
        {preventionOptions.map((opt, i) => {
          const Icon = opt.icon
          const isCorrect = opt.correct
          return (
            <div key={i}>
              <div
                className={`grid grid-cols-[44px_1fr_24px] gap-[13px] items-center rounded-[14px] p-[14px_16px] ${
                  isCorrect
                    ? "border-primary bg-[rgba(17,57,36,.75)]"
                    : "border-destructive bg-[rgba(50,16,24,.85)]"
                }`}
                style={{ border: `1px solid ${isCorrect ? "var(--primary)" : "var(--destructive)"}` }}
              >
                <div
                  className={`w-[42px] h-[42px] rounded-xl grid place-items-center ${
                    isCorrect ? "bg-[rgba(32,240,127,.18)] text-primary" : "bg-[rgba(255,51,75,.18)] text-destructive"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-foreground">{opt.text}</div>
                <div>
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </div>
              <Feedback correct={isCorrect}>
                <span dangerouslySetInnerHTML={{ __html: preventionFeedback[i] }} />
              </Feedback>
            </div>
          )
        })}
      </div>
      <div
        className="rounded-[14px] p-[18px] my-[22px] text-left"
        style={{ border: "1px solid var(--border)", background: "rgba(14,18,22,.78)" }}
      >
        <p className="text-foreground mb-2">
          Remember: proactive monitoring and early follow-up are key to preventing breaches. Never wait passively for the borrower to reach out.
        </p>
        <p className="text-foreground">
          <b className="text-[#ffd747]">Remember:</b> Breach and void warning emails are automatically sent to borrowers to help prevent settlements from breaching. When borrowers call in, reinforcing these consequences can help them prioritize their payments.
        </p>
      </div>
      <div className="text-center">
        <Button variant="green" onClick={onContinue}>
          Continue <ArrowRight className="inline w-4 h-4 ml-1" />
        </Button>
      </div>
    </Panel>
  )
}

function CommunicationScreen({
  selected,
  setSelected,
  onSubmit,
}: {
  selected: number | null
  setSelected: (i: number) => void
  onSubmit: () => void
}) {
  return (
    <Panel wide>
      <div className="text-center">
        <Eyebrow variant="green">
          <Phone className="w-4 h-4" /> Communication Challenge
        </Eyebrow>
        <h2 className="text-[30px] leading-[1.08] my-3 text-foreground font-bold">
          How would you explain this risk to the borrower?
        </h2>
        <p className="text-foreground">Choose the best explanation to communicate the 60 days past due rule and its consequences.</p>
      </div>
      <div className="grid gap-3 mt-6">
        {communicationOptions.map((opt, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            className={`rounded-[14px] p-4 cursor-pointer transition-all ${
              selected === i
                ? "border-primary bg-[rgba(17,57,36,.75)]"
                : "border-[rgba(255,255,255,.08)] bg-[rgba(8,12,16,.72)] hover:border-[#44505d]"
            }`}
            style={{ border: selected === i ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,.08)" }}
          >
            <div className="text-xs text-muted-foreground mb-2 px-2 py-1 bg-secondary inline-block rounded">{opt.label}</div>
            <p className="text-foreground" dangerouslySetInnerHTML={{ __html: opt.text }} />
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Button variant="green" onClick={onSubmit} disabled={selected === null}>
          Submit Answer
        </Button>
      </div>
    </Panel>
  )
}

function CommunicationResultsScreen({ selected, onContinue }: { selected: number | null; onContinue: () => void }) {
  const isCorrect = selected === 1

  return (
    <Panel wide>
      <div className="text-center mb-4">
        <h2 className="text-[30px] leading-[1.08] my-3 text-foreground font-bold">
          How would you explain this risk to the borrower?
        </h2>
        <p className="text-foreground">Choose the best explanation to communicate the 60 days past due rule and its consequences.</p>
      </div>
      <div className="grid gap-3">
        {communicationOptions.map((opt, i) => {
          const wasSelected = selected === i
          const optCorrect = opt.correct
          return (
            <div
              key={i}
              className={`rounded-[14px] p-4 ${
                wasSelected
                  ? optCorrect
                    ? "border-primary bg-[rgba(17,57,36,.75)]"
                    : "border-destructive bg-[rgba(50,16,24,.85)]"
                  : "border-[rgba(255,255,255,.08)] bg-[rgba(8,12,16,.72)]"
              }`}
              style={{
                border: wasSelected
                  ? `1px solid ${optCorrect ? "var(--primary)" : "var(--destructive)"}`
                  : "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div className="flex justify-between items-start">
                <div className="text-xs text-muted-foreground mb-2 px-2 py-1 bg-secondary inline-block rounded">{opt.label}</div>
                {wasSelected && (
                  optCorrect ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-destructive" />
                )}
              </div>
              <p className="text-foreground" dangerouslySetInnerHTML={{ __html: opt.text }} />
            </div>
          )
        })}
      </div>
      <Feedback correct={isCorrect}>
        {isCorrect
          ? "Excellent! This clearly explains the 60 days past due rule, the consequences, and opens a dialogue for prevention."
          : "Not quite. The best response should state the threshold, consequence, financial impact, and irreversibility."}
      </Feedback>
      {isCorrect && (
        <div
          className="rounded-[14px] p-[18px] mt-5"
          style={{ border: "1px solid rgba(32,240,127,.55)", background: "rgba(10,22,16,.72)" }}
        >
          <p className="font-bold text-primary flex items-center gap-2 mb-2">
            <Check className="w-5 h-5" /> Best Practice Script
          </p>
          <p className="text-foreground mb-2">When communicating the 60 days past due rule, always include:</p>
          <ol className="list-decimal list-inside text-foreground space-y-1">
            <li>The specific threshold (60 days past due)</li>
            <li>The consequence (agreement becomes null and void)</li>
            <li>The financial impact (full charge-off balance due)</li>
            <li>The irreversibility (cannot be reinstated)</li>
          </ol>
        </div>
      )}
      <div className="text-center mt-6">
        <Button variant="green" onClick={onContinue}>
          Continue <ArrowRight className="inline w-4 h-4 ml-1" />
        </Button>
      </div>
    </Panel>
  )
}

function CompleteScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <Panel wide center>
      <div
        className="text-[76px] leading-none text-primary mb-4"
        style={{ filter: "drop-shadow(0 0 18px rgba(32,240,127,.28))" }}
      >
        <Award className="w-20 h-20 mx-auto" />
      </div>
      <Eyebrow variant="green">Training Complete</Eyebrow>
      <h1 className="text-[38px] lg:text-[46px] leading-[1.04] tracking-[-1.6px] my-[18px] text-foreground font-bold">
        Mission Accomplished
      </h1>
      <p className="text-foreground max-w-md mx-auto">
        You now understand how to recognize and prevent settlement breaches by applying the 60 days past due rule.
      </p>
      <div
        className="rounded-[18px] p-6 my-6 text-left"
        style={{ border: "1px solid var(--border)", background: "#10161c" }}
      >
        <h3 className="text-foreground font-bold mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-primary" /> Key Learnings
        </h3>
        <div className="space-y-4">
          <LearningRow icon="60" title="The 60 Days Past Due Rule">
            Once an account exceeds 60 days past due, the settlement agreement becomes null and void.
          </LearningRow>
          <LearningRow icon={<Eye className="w-4 h-4" />} title="Monitor Proactively">
            Track days past due closely to catch warning signs before the threshold.
          </LearningRow>
          <LearningRow icon={<Phone className="w-4 h-4" />} title="Follow Up Early">
            {"Contact borrowers after missed payments—don't wait for them to reach out."}
          </LearningRow>
          <LearningRow icon={<AlertCircle className="w-4 h-4" />} title="Communicate Clearly">
            Explain the rule, consequences, and irreversibility when discussing risk with borrowers.
          </LearningRow>
        </div>
      </div>
      <div
        className="rounded-2xl p-[18px] text-center"
        style={{ border: "1px solid rgba(32,240,127,.65)", background: "linear-gradient(180deg, rgba(32,240,127,.18), rgba(32,240,127,.09))" }}
      >
        <span className="text-muted-foreground">Your completion code:</span>
        <strong className="block text-primary text-[30px] tracking-[.16em] mt-1">SETTLEMENT60</strong>
        <span className="text-muted-foreground text-sm">Enter this code to confirm you completed the activity.</span>
      </div>
      <div className="mt-6">
        <Button variant="ghost" onClick={onRestart}>
          <RefreshCw className="inline w-4 h-4 mr-2" /> Restart Training
        </Button>
      </div>
    </Panel>
  )
}

function LearningRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[42px_1fr] gap-[14px]">
      <div className="w-[36px] h-[36px] rounded-full bg-[rgba(32,240,127,.18)] text-primary grid place-items-center font-black text-sm">
        {icon}
      </div>
      <div>
        <b className="text-foreground">{title}</b>
        <br />
        <span className="text-muted-foreground">{children}</span>
      </div>
    </div>
  )
}
